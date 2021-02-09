<template class="temp">
  <h1>Phonemes!</h1>
  <Panel header="Send a chosen phoneme" style="margin-bottom: 10px">
    <p>To just try out how a single phoneme feels, and play it on the prototype, you can select a phoneme in the
      dropdown menu and send it to the arduino by clicking the button.</p>

    <Dropdown v-model="dropdownPhoneme" :options="phonemes" optionLabel="name" placeholder="Phoneme" :filter="true" style="margin-right: 10px"/>
    <Button @click="sendDropdownPhoneme()" style="padding: 1.2rem">Send phoneme!</Button>
  </Panel>

  <Panel header="Training">
    <p>Select which phonemes you want to train on!</p>
    <div v-for="item in phonemes" v-bind:key="item.name" class="p-field-checkbox" style="display: inline-block; margin-right: 20px">
      <Checkbox :id="'checkbox_' + item.name" name="item.nam3" :value="item.name" v-model="selectedTrainPhonemes"/>
      <label :for="item">{{ item.name }}</label>

    </div>
    <br>
    <Panel header="Send random" style="margin-bottom: 10px">
    <Button @click="sendRandomPhoneme()" style="padding: 1.2rem">Send random phoneme!</Button>
    </Panel>
    <Panel header="Forced identification">
      <p>By clicking the button, a phoneme will be send to the arduino, and you will get to see three buttons, and have to choose which one you felt.</p>
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
  </Panel>
</template>

<script lang="ts">
import {createApp, defineComponent, ref} from "vue";
import APIWrapper from "@/backend.api";
import Button from "primevue/button";

function getRandom(arr: [any], n: number): any {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default defineComponent({
  name: 'Phonemes',
  extends: {Button},

  setup: async () => {

    const phonemeData = (await APIWrapper.getPhonemes()).phonemes;
    const selectedTrainPhonemes = ref([]);
    const dropdownPhoneme = ref();
    const rows = ref(0);

    function sendDropdownPhoneme() {
      if (dropdownPhoneme.value !== undefined) {
        const json = {'phonemes': [dropdownPhoneme.value.name]}
        APIWrapper.sendPhonemeMicrocontroller(json);
      } else {
        alert("Please select a phoneme to send");
      }
    }

    function sendRandomPhoneme() {
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
      } else {
        const randomPhoneme = selectedTrainPhonemes.value[Math.floor(Math.random() * selectedTrainPhonemes.value.length)]
        const json = {'phonemes': [randomPhoneme]};
        APIWrapper.sendPhonemeMicrocontroller(json);
      }
    }

    function sendForcedIdentification() {
      const buttonDiv = document.getElementById("forcedIdentificationButtons")
      if (buttonDiv === null) {return}

      // reset div
      buttonDiv.innerHTML = '';

      // check if some phonemes are selected
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
        return
      }

      // get a set of random phonemes from the selected phonemes
      const randomPhonemes = getRandom(selectedTrainPhonemes.value as any, Math.min(3, selectedTrainPhonemes.value.length));
      const playedPhoneme: string = getRandom(randomPhonemes, 1)[0];

      APIWrapper.sendPhonemeMicrocontroller({'phonemes': [playedPhoneme]});

      rows.value++;
      const pTable = document.getElementById("phoneme-table");
      if (pTable === null) {return}
      const row = document.createElement("tr");
      row.insertCell()
      row.innerHTML = "<td>"+ rows.value + "</td><td>" + playedPhoneme + "</td><td id='pTableRow_" + rows.value + "'></td>";
      pTable.appendChild(row);


      const textDiv = document.createElement('div');
      textDiv.innerHTML = '<p>Which phoneme was just played?</p>';
      buttonDiv.appendChild(textDiv);

      randomPhonemes.forEach((phoneme: string) => {
        const div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.marginRight = "10px";

        buttonDiv.appendChild(div);
        createApp(Button, {label: phoneme, id: "fid_" + phoneme}).mount(div);

        const btn = document.getElementById("fid_" + phoneme);
        const guessesCell = document.getElementById("pTableRow_" + rows.value);
        if (btn === null || guessesCell === null) {return}
        btn.addEventListener("click", function () {
          const bgColor = btn.style.background;
          if (phoneme === playedPhoneme) {
            btn.style.background = "green";
            guessesCell.innerHTML += "<span style='background: green'>" + phoneme + "</span>";
          } else {
            btn.style.background = "red";
            guessesCell.innerHTML += "<span style='background: red'>" + phoneme + "</span>";
          }
          setTimeout(() => {
            btn.style.background = bgColor
          }, 1000);
        });

      })
    }

    // eslint-disable-next-line no-unused-labels
    const phonemes: {name: string}[] = [];
    phonemeData.forEach((pho: string) => {
      phonemes.push({name: pho})
    })

    return {
      phonemes,
      selectedTrainPhonemes,
      dropdownPhoneme,
      rows,

      sendDropdownPhoneme,
      sendRandomPhoneme,
      sendForcedIdentification
    }
  }
})
</script>

<style scoped>

</style>
