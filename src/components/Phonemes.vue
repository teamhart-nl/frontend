<template class="temp">
  <h1>Phonemes!</h1>

  <!-- Panel for sending a specific phoneme -->
  <Panel header="Send a chosen phoneme">
    <p>To just try out how a single phoneme feels, and play it on the prototype, you can select a phoneme in the
      dropdown menu and send it to the arduino by clicking the button.</p>

    <Dropdown v-model="dropdownPhoneme" :options="phonemes" optionLabel="name" placeholder="Phoneme" :filter="true"
              style="margin-right: 10px"/>
    <Button @click="sendDropdownPhoneme()" style="padding: 1.2rem">Send phoneme!</Button>
  </Panel>

  <!-- Main panel for training -->
  <Panel header="Training">
    <p>Select which phonemes you want to train on!</p>
    <div v-for="item in phonemes" v-bind:key="item.name" class="p-field-checkbox"
         style="display: inline-block; margin-right: 20px">
      <Checkbox :id="'checkbox_' + item.name" name="item.nam3" :value="item.name" v-model="selectedTrainPhonemes"/>
      <label :for="item">{{ item.name }}</label>

    </div>
    <br>

    <!-- Subpanel for forced identification -->
    <Panel header="Forced identification">
      <p>By clicking the button, a phoneme will be send to the arduino, and you will get to see three buttons, and have
        to choose which one you felt.</p>
      <Button @click="sendForcedIdentification()" style="padding: 1.2rem">Forced identification!</Button>
      <div id="forcedIdentificationButtons"></div>
      <Fieldset legend="Answers (history)" :toggleable="true" :collapsed="true">
        <table id="phoneme-table">
          <tr>
            <th>Round</th>
            <th>Correct answer</th>
            <th>Guessed answers</th>
          </tr>
        </table>
      </Fieldset>
    </Panel>

    <!-- Subpanel for sending random phoneme -->
    <Panel header="Send random">
      <Button @click="sendRandomPhoneme()" style="padding: 1.2rem">Send random phoneme!</Button>
      <Fieldset legend="Answers (history)" :toggleable="true" :collapsed="true">
        <table id="random-phoneme-table">
          <tr>
            <th>Round</th>
            <th>Correct answer</th>
          </tr>
        </table>
      </Fieldset>
    </Panel>

  </Panel>
</template>

<script lang="ts">
import {createApp, defineComponent, ref} from "vue";
import APIWrapper from "@/backend.api";
import Button from "primevue/button";
import {getRandom} from "@/helpers/array.helper";

export default defineComponent({
  name: 'Phonemes',
  extends: {Button},

  setup: async () => {

    // Get phoneme data from the backend
    const phonemeData = (await APIWrapper.getPhonemes()).phonemes;

    // Initialize variables used throughout component
    const selectedTrainPhonemes = ref([]);
    const dropdownPhoneme = ref();
    const fiRows = ref(0);
    const raRows = ref(0);

    /**
     * Function for sending a phoneme from the dropdown menu
     */
    function sendDropdownPhoneme() {
      // Check if something was selected
      if (dropdownPhoneme.value !== undefined) {
        // Create json and send to backend
        const json = {'phonemes': [dropdownPhoneme.value.name]}
        APIWrapper.sendPhonemeMicrocontroller(json);
      } else {
        // If nothing selected, alert user
        alert("Please select a phoneme to send");
      }
    }

    /**
     * Function for sending random phoneme.
     */
    function sendRandomPhoneme() {
      // If no phonemes were selected, alert user
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
      } else {
        // Get random phoneme from selected phonemes and send it to the backend
        const randomPhoneme = selectedTrainPhonemes.value[Math.floor(Math.random() * selectedTrainPhonemes.value.length)]
        const json = {'phonemes': [randomPhoneme]};
        APIWrapper.sendPhonemeMicrocontroller(json);

        // Add answer to the table
        const pTable = document.getElementById("random-phoneme-table");
        if (pTable === null) {return;}

        const row = document.createElement("tr");
        raRows.value++;
        row.insertCell()
        row.innerHTML = "<td>" + raRows.value + "</td><td>" + randomPhoneme + "</td>";
        pTable.appendChild(row);
      }
    }

    /**
     * Function for executing forced identification behavior.
     */
    function sendForcedIdentification() {
      // Get div from page for placing buttons
      const buttonDiv = document.getElementById("forcedIdentificationButtons")
      if (buttonDiv === null) {
        return;
      }

      // empty button div
      buttonDiv.innerHTML = '';

      // check if some phonemes are selected
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
        return;
      }

      // get a set of random phonemes from the selected phonemes
      const randomPhonemes = getRandom(selectedTrainPhonemes.value as any, Math.min(3, selectedTrainPhonemes.value.length));
      const playedPhoneme: string = getRandom(randomPhonemes, 1)[0];

      // Send selected phoneme to backend
      APIWrapper.sendPhonemeMicrocontroller({'phonemes': [playedPhoneme]});

      // Increase the number of forced identification rounds.
      fiRows.value++;

      // Get the answer table
      const pTable = document.getElementById("phoneme-table");
      if (pTable === null) {
        return
      }

      // Create new row element for table
      const row = document.createElement("tr");
      row.innerHTML = "<td>" + fiRows.value + "</td><td>" + playedPhoneme + "</td><td id='pTableRow_" + fiRows.value + "'></td>";
      pTable.appendChild(row);

      // Add explanation div
      const textDiv = document.createElement('div');
      textDiv.innerHTML = '<p>Which phoneme was just played?</p>';
      buttonDiv.appendChild(textDiv);

      // For each of the phonemes selected, create buttons and assign listeners to it.
      randomPhonemes.forEach((phoneme: string) => {
        // Create div for button
        const div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.marginRight = "10px";

        // Add div for button to the button div
        buttonDiv.appendChild(div);
        createApp(Button, {label: phoneme, id: "fid_" + phoneme}).mount(div);

        // Get the button from the page
        const btn = document.getElementById("fid_" + phoneme);

        // Get the table cell for guesses from the page
        const guessesCell = document.getElementById("pTableRow_" + fiRows.value);
        if (btn === null || guessesCell === null) {
          return
        }

        // Add button event listener
        btn.addEventListener("click", () => {
          const bgColor = btn.style.background;
          if (phoneme === playedPhoneme) {
            btn.style.background = "green";
            guessesCell.innerHTML += "<span style='background: green; margin-right: 3px; padding: 2px'>" + phoneme + "</span>";
          } else {
            btn.style.background = "red";
            guessesCell.innerHTML += "<span style='background: red; margin-right: 3px; padding: 2px'>" + phoneme + "</span>";
          }
          setTimeout(() => {
            btn.style.background = bgColor
          }, 1000);
        });
      })
    }

    // Format gotten phonemes from backend.
    const phonemes: { name: string }[] = [];
    phonemeData.forEach((pho: string) => {
      phonemes.push({name: pho})
    })

    // Return all variables
    return {
      phonemes,
      selectedTrainPhonemes,
      dropdownPhoneme,
      fiRows,
      raRows,

      sendDropdownPhoneme,
      sendRandomPhoneme,
      sendForcedIdentification
    }
  }
})
</script>

<style scoped>

</style>
