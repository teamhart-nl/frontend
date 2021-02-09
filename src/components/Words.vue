<template>
  <h1>Words!</h1>

  <!-- Panel for sending a specific word -->
  <Panel header="Send a chosen word">
    <p>To just try out how a single word feels, type it and send it to the arduino! If the word is in the 'standard
      words database' then you can find it using autocomplete.</p>
    <AutoComplete v-model="selectedWord" :dropdown="true" :suggestions="filteredWords.value"
                  @complete="searchWord($event)"
                  field="name" style="margin-right: 10px"/>
    <Button @click="sendACWord()" style="padding: 1.1rem">Send word!</Button>
    <Button @click="addWord()" style="padding: 1.1rem; margin-left: 10px; margin-right: 10px">Add word to list!</Button>
    <Button @click="removeWord()" style="padding: 1.1rem">Remove word from list!</Button>
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

    function searchWord(event) {
      filteredWords.value = ref(words.value.map((w) => {
        return w.name.includes(event.query) ? w : null
      }).filter(w => !!w));
    }

    function sendACWord() {
      if (typeof selectedWord.value !== "string") {
        alert("word from list");
      } else {
        alert("word not from list");
      }
    }

    function addWord() {
      if (selectedWord.value === undefined) {
        alert("Please type a word first before inserting!");
      } else {
        alert("'" + selectedWord.value + "' was added to the list");
        words.value.push({name: selectedWord.value});
        selectedWord.value = "";
      }
    }

    function removeWord() {
      if (selectedWord.value === undefined) {
        alert("Please type a word first before removing!");
      } else {
        const index = words.value.findIndex(o => {return (o.name === selectedWord.value.name) || o.name === selectedWord.value});
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
