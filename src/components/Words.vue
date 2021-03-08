<template>
  <h1>Words!</h1>

  <!-- Panel for sending a specific word -->
  <Panel header="Configure list of words, and send specific word">
    <p>In this panel you can configure the list by adding (or removing) word to (from) the preprogrammed list of words.
      Additionally, you can send any word you want to the microcontroller.</p>
    <AutoComplete v-model="selectedWord" :dropdown="true" :suggestions="filteredWords.value"
                  @complete="searchWord($event)"
                  field="name" style="margin-right: 10px"/>
    <Button @click="addWord()" style="padding: 1.1rem; margin-right: 10px">Add word to list!</Button>
    <Button @click="removeWord()" style="padding: 1.1rem; margin-right: 10px">Remove word from list!</Button>
    <Button @click="sendACWord()" style="padding: 1.1rem">Send word!</Button>
  </Panel>
  <Panel header="Selection based training">
    <p>Select (using the autocomplete function), the words that you would like to train on. Only words from the list
      (which can be configured above) can be used for training.</p>
    <AutoComplete :multiple="true" v-model="selectedWords" :suggestions="filteredWords.value" :dropdown="true"
                  @complete="searchWord($event)" field="name" class="p-shadow-2" style="width: 100%; margin-bottom: 10px"/>

    <Panel header="Forced identification">
      <p>By clicking the button, a word will be send to the microcontroller. You will then get to see three buttons
        representing words, and you will have to choose which one you felt.</p>
      <Button @click="sendForcedIdentification()" style="padding: 1.2rem">Forced identification!</Button>
      <div id="forcedIdentificationButtons"></div>
      <Fieldset legend="Answers (history)" :toggleable="true" :collapsed="true">
        <table id="fi-answer-table">
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
import {getRandom} from "@/helpers/array.helper";
import Button from "primevue/button";
import APIWrapper from "@/backend.api";

export default defineComponent({
  name: 'Words',

  setup: async () => {
    const selectedWord = ref();
    const selectedWords = ref([]);
    const inputWord = ref();
    const fiRows = ref(0);
    const words = ref([
      // 2 phoneme words
      {name: "see"},
      {name: "me"},
      {name: "tea"},
      {name: "key"},
      {name: "he"},
      {name: "eat"},
      {name: "saw"},
      {name: "raw"},

      // 3 phoneme words
      {name: "meet"}, // (also) meat
      {name: "hurt"},
      {name: "heat"},
      {name: "seat"},
      {name: "rot"},
      {name: "hot"},
      {name: "hook"},
      {name: "seek"},
      {name: "took"},
      {name: "cook"},
      {name: "seem"},
      {name: "meme"},
      {name: "team"},
      {name: "sought"},

      // 4 phoneme words
      {name: "treat"},
      {name: "skirt"},
      {name: "cost"},
      {name: "straw"},
      {name: "heart"}, // (also) HART
      {name: "mask"}, // (also) mosque
      {name: "scar"},

      // 5 phoneme words
      {name: "smart"},

      // 6 phoneme words
      {name: "retard"},

    ]);
    let filteredWords = ref(words.value)

    /**
     * Function that filters the words list for all autocomplete input fields.
     * @param event   The event emitted from the input field upon updating.
     */
    function searchWord(event: any) {
      filteredWords.value = ref(words.value.map((w) => {
        return w.name.includes(event.query) ? w : null
      }).filter(w => !!w)) as any;
    }

    /**
     * Function for sending a word to the arduino.
     */
    function sendACWord() {
      if (selectedWord.value === undefined) {
        alert("Please insert a word to send");
        return
      }

      if (typeof selectedWord.value !== "string") {
        APIWrapper.sendWordsMicrocontroller({'words': [selectedWord.value.name]})
      } else {
        APIWrapper.sendWordsMicrocontroller({'words': [selectedWord.value]})
      }
    }

    function sendForcedIdentification() {
      // Check if words are selected. If no words are selected, alert user and return.
      if (selectedWords.value.length === 0) {
        alert("Please select words to train on");
        return;
      }

      // Get a set of random words from the selected words.
      const randomWords = (selectedWords.value as any).map((w: {name: string}) => {return w.name});
      const playedWord = getRandom(randomWords, 1)[0];

      // Play chosen word on the microcontroller
      APIWrapper.sendWordsMicrocontroller({'words': [playedWord]});

      // Increase the number of forced identification rounds
      fiRows.value++;

      // Get div from page for placing buttons
      const buttonDiv = document.getElementById("forcedIdentificationButtons")
      if (buttonDiv === null) {return;}

      // empty button div
      buttonDiv.innerHTML = '';

      // Add explanation div
      const textDiv = document.createElement('div');
      textDiv.innerHTML = '<p>Which word was just played?</p>';
      buttonDiv.appendChild(textDiv);

      // Get the answer table
      const pTable = document.getElementById("fi-answer-table");
      if (pTable === null) {return;}

      // Create new row element for table
      const row = document.createElement("tr");
      row.innerHTML = "<td>" + fiRows.value + "</td><td>" + playedWord
          + "</td><td id='fi-answer-table-row_" + fiRows.value + "'></td>";
      pTable.appendChild(row);

      // For each of the words selected, create buttons and assign listeners to it.
      randomWords.forEach((word: string) => {
        // Create div for button
        const div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.marginRight = "10px";

        // Add div for button to the page
        buttonDiv.appendChild(div);
        createApp(Button, {label: word, id: "fid_" + word}).mount(div);

        // Get the button from the page and the table cell for guesses.
        const btn = document.getElementById("fid_" + word);
        const guessesCell = document.getElementById("fi-answer-table-row_" + fiRows.value);
        if (btn === null || guessesCell === null) {return;}

        // Add button event listener
        btn.addEventListener("click", () => {
          const bgColor = btn.style.background;
          if (word === playedWord) {
            btn.style.background = "green";
            guessesCell.innerHTML += "<span style='background: green; margin-right: 3px; padding: 2px'>" + word + "</span>";
          } else {
            btn.style.background = "red";
            guessesCell.innerHTML += "<span style='background: red; margin-right: 3px; padding: 2px'>" + word + "</span>";
          }
          setTimeout(() => {
            btn.style.background = bgColor
          }, 1000);
        })
      })
    }

    /**
     * Function for adding a word to the list of words.
     */
    function addWord() {
      if (selectedWord.value === undefined) {
        // If nothing typed, alert user.
        alert("Please type a word first before inserting!");
      } else {
        // Add word to list
        alert("'" + selectedWord.value + "' was added to the list");
        words.value.push({name: selectedWord.value});
        selectedWord.value = "";
      }
    }

    /**
     * Function for removing a word from the list of words.
     */
    function removeWord() {
      if (selectedWord.value === undefined) {
        // If nothing typed, alert user
        alert("Please type a word first before removing!");
      } else {
        // Find word in list
        const index = words.value.findIndex(o => {
          return (o.name === selectedWord.value.name) || o.name === selectedWord.value
        });

        if (index === -1) {
          // If not found, alert user
          alert("Word not found in list, thus cannot be removed.");
        } else {
          // Remove word from list.
          alert("'" + words.value[index].name + "' was removed from the list");
          words.value.splice(index, 1);
          selectedWord.value = "";
        }
      }
    }

    return {
      selectedWord,
      selectedWords,
      inputWord,
      filteredWords,
      words,

      searchWord,
      sendACWord,
      sendForcedIdentification,
      addWord,
      removeWord,
    }
  }
})
</script>

<style scoped>

</style>
