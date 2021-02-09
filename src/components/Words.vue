<template>
  <h1>Words!</h1>

  <!-- Panel for sending a specific word -->
  <Panel header="Send a chosen word">
    <p>To just try out how a single word feels, type it and send it to the arduino! If the word is in the 'standard
      words database' then you can find it using autocomplete.</p>
    <AutoComplete v-model="selectedWord" :dropdown="true" :suggestions="filteredWords.value" @complete="searchWord($event)"
                  field="name" style="margin-right: 10px"/>
    <Button @click="sendACWord()" style="padding: 1.1rem">Send word!</Button>
  </Panel>
</template>

<script>
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: 'Words',

  setup: async () => {
    const selectedWord = ref();
    const words = [
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
    ]
    let filteredWords = ref(words)

    function searchWord(event) {
      filteredWords.value = ref(words.map((w) => {
        return w.name.includes(event.query) ? w : null
      }).filter(w => !!w));
    }

    function sendACWord() {
      console.log(selectedWord.value);
      if (typeof selectedWord.value !== "string") {
        alert("word from list");
      } else {
        alert("word not from list");
      }
    }

    return {
      selectedWord,
      filteredWords,
      words,

      searchWord,
      sendACWord
    }
  }
})
</script>

<style scoped>

</style>
