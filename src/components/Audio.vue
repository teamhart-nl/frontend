<template>
  <h1>Audio!</h1>
  <Panel header="Send audio file">
    <p>Select and upload a file you want to send to the microcontroller and select a language that it is spoken in.</p>
    <input
        type="file"
        ref="fileInput"
        @change="onFileSelected($event)"/><br>
    <AutoComplete v-model="selectedLanguage" :dropdown="true" :suggestions="filteredLanguages.value"
                  placeholder="Select language" @complete="searchLanguage($event)"
                  field="language" style="margin-bottom: 10px; margin-top: 10px"/>
    <br>
    <Button @click="sendFile()" style="margin-right: 10px">Send File to Microcontroller</Button>
  </Panel>
  <Panel header="Record Audio">
    <Button @click="startRecord()" type="button" id="button_record" class="p-button">Record</Button>
    <Button @click="stopRecord()" type="button" id="button_stop" class="p-button-danger">Stop Recording</Button>
    <Button id="play-btn" class="p-button" disabled>play</Button>
  </Panel>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import APIWrapper from "@/backend.api";
import {audioBufferToMp3} from "@/helpers/audio.converter.helper";
// const FileType = require('file-type');

export default defineComponent({
  name: 'Audio',

  setup: async () => {
    let uploadedFile: any = undefined;
    const selectedLanguage = ref();
    let recorder: any;

    const languages = ref([
      {language: "Dutch", short: "nl"},
      {language: "English", short: "en"},
      {language: "French", short: 'fr'},
      {language: "German", short: 'de'},
      {language: "French", short: 'fr'},
      {language: "Russian", short: 'ru'}
    ]);

    let filteredLanguages = ref(languages.value)

    function sendFile() {
      if (selectedLanguage.value === undefined) {
        alert("Please select the spoken language");
        return
      }

      if (uploadedFile === undefined) {
        alert("Please upload an audio file");
        return
      }

      APIWrapper.sendAudioFile(uploadedFile, {
        source_language: selectedLanguage.value.short,
        target_language: "en"
      })
    }

    function sendRecording(recording: any) {
      APIWrapper.sendAudioFile(recording, {source_language: "en", target_language: "en"});
    }

    /**
     * On change event for the file upload button
     */
    function onFileSelected(event: any) {
      uploadedFile = event.target.files[0]
      console.log(uploadedFile);
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

    function startRecord() {
      navigator.mediaDevices.getUserMedia({audio: true})
          .then(recordStream).catch(console.error);
    }

    function recordStream(stream: any) {
      // List for storing data
      const items: any[] = [];

      // @ts-ignore
      const mime = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'].filter(MediaRecorder.isTypeSupported)[0];

      // @ts-ignore
      recorder = new MediaRecorder(stream, {mimeType: mime});

      recorder.addEventListener('start', () => {
        // Empty the collection when starting recording.
        items.length = 0;
      });

      // @ts-ignore
      recorder.ondataavailable = (e) => {
        items.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((s: any) => s.stop());
        finalize(items)
      }

      // @ts-ignore
      recorder.start();
    }

    function stopRecord() {
      // @ts-ignore
      recorder.stop();
    }

    function finalize(chunks: any) {
      const blob = new Blob(chunks)
      playMedia(blob);
    }

    function playMedia(blob: Blob) {
      const ctx = new AudioContext();
      const fileReader = new FileReader();
      // @ts-ignore
      fileReader.onload = () => ctx.decodeAudioData(fileReader.result)
          .then(buf => {

            // const mp3 = audioBufferToMp3(buf);
            // sendRecording(mp3);

            const btn = document.getElementById("play-btn");
            // @ts-ignore
            btn.onclick = () => {
              const source = ctx.createBufferSource();
              source.buffer = buf;
              source.connect(ctx.destination);
              source.start(0);
            };
            // @ts-ignore
            btn.disabled = false;
          });
      fileReader.readAsArrayBuffer(blob);
    }

    return {
      selectedLanguage,
      filteredLanguages,
      languages,

      sendFile,
      onFileSelected,
      searchLanguage,

      startRecord,
      stopRecord,
    }
  }

})
</script>

<style scoped>

</style>
