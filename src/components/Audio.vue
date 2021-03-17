<template>
  <h1>Audio!</h1>
  <Panel header="Send audio file"> 
  <p>Select and upload a file you want to send to the microcontroller and select a language that it is spoken in.</p>
    <Button @click="sendFile()" style="margin-right: 10px" >Send File to Microcontroller</Button>
    <input
      type="file"
      ref="fileInput"
      @change="onFileSelected($event)"/>
    <AutoComplete v-model="selectedLanguage" :dropdown="true" :suggestions="filteredLanguages.value"
              placeholder="Select language" @complete="searchLanguage($event)"
              field="language" style="margin-right: 10px"/>
  </Panel>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import APIWrapper from "@/backend.api";

export default defineComponent({
  name: 'Audio',

  setup: async () => {
    let uploadedFile = ref();
    const selectedLanguage = ref();

    const languages = ref([
      {language: "Dutch", short: "nl"},
      {language: "English", short: "en"},
      {language: "French", short: 'fr'},
      {language: "German", short: 'de'},
      {language: "French", short: 'fr'},
      {language: "Russian", short: 'ru'}
    ]);

    let filteredLanguages = ref(languages.value)

    function sendFile(){
        APIWrapper.sendAudioFile(uploadedFile, {
            source_language: selectedLanguage.value.short,
            target_language: "en"
        })
    }

    function onFileSelected(event: any) {
        uploadedFile = event.target.files[0]
    }

    /**
     * Function that filters the languages list for all autocomplete input fields.
     * @param event   The event emitted from the input field upon updating.
     */
    function searchLanguage(event: any) {
      filteredLanguages.value = ref(languages.value.map((w) => {
        return w.language.includes(event.query) ? w : null
      }).filter(w => !!w)) as any;
    }

      return {
        uploadedFile,
        selectedLanguage,
        filteredLanguages,
        languages,

        sendFile,
        onFileSelected,
        searchLanguage
      }
  }

})
</script>

<style scoped>

</style>
