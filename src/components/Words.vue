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
    <AutoComplete :multiple="true" v-model="selectedWords" :suggestions="filteredWords.value"
                  @complete="searchWord($event)" field="name" style="width: 100%"/>
  </Panel>
</template>

<script>
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: 'Words',

  setup: async () => {
    const selectedWord = ref();
    const selectedWords = ref([]);
    const inputWord = ref();
    const words = ref([
      {name: "meat"},
      {name: "hurt"},
      {name: "see"},
      {name: "me"},
      {name: "he"},
      {name: "tea"},
      {name: "key"},
      {name: "heat"},
      {name: "seat"},
      {name: "skirt"},
      {name: "treat"},
      {name: "eat"},
      {name: "rot"},
      {name: "hot"},
      {name: "cost"},
      {name: "hook"},
      {name: "seek"},
      {name: "took"},
      {name: "cook"},
      {name: "saw"},
      {name: "straw"},
      {name: "heart"}, // HART
    ]);
    let filteredWords = ref(words.value)

    /**
     * Function that filters the words list for all autocomplete input fields.
     * @param event   The event emitted from the input field upon updating.
     */
    function searchWord(event) {
      filteredWords.value = ref(words.value.map((w) => {
        return w.name.includes(event.query) ? w : null
      }).filter(w => !!w));
    }

    /**
     * Function for sending a word to the arduino.
     */
    function sendACWord() {
      if (typeof selectedWord.value !== "string") {
        alert("word from list");
      } else {
        alert("word not from list");
      }
    }

    /**
     * Function for adding a word to the list of words.
     */
    function addWord() {
      if (selectedWord.value === undefined) {
        alert("Please type a word first before inserting!");
      } else {
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
        alert("Please type a word first before removing!");
      } else {
        const index = words.value.findIndex(o => {
          return (o.name === selectedWord.value.name) || o.name === selectedWord.value
        });
        if (index === -1) {
          alert("Word not found in list, thus cannot be removed.");
        } else {
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
      addWord,
      removeWord,
    }
  }
})
</script>

<style scoped>

</style>
