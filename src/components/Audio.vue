<template>
  <h1>Audio!</h1>
  <Panel header="Send audio file">
    <p>Select and upload a file you want to send to the microcontroller and select a language that it is spoken in.</p>
    <input
        type="file"
        ref="fileInput"
        @change="onFileSelected($event)"/><br>
    <AutoComplete v-model="selectedLanguage1" :dropdown="true" :suggestions="filteredLanguages.value"
                  placeholder="Select language" @complete="searchLanguage($event)"
                  field="language" style="margin-bottom: 10px; margin-top: 10px"/>
    <br>
    <Button @click="sendFile()" style="margin-right: 10px">Send File to Microcontroller</Button>
  </Panel>
  <Panel header="Record Audio">
    <p>In this panel, you can record some audio, select the language which you spoke and then send that for processing towards the microcontroller. Be aware, the compression on the audio is quite severe, so quality is not very good.</p>
    <Button @click="startRecord()" type="button" id="button_record" class="p-button" style="margin-right: 10px">Record</Button>
    <Button @click="stopRecord()" type="button" id="button_stop" class="p-button-danger" style="margin-right: 10px">Stop Recording</Button>
    <Button id="play-btn" class="p-button" disabled>play</Button><br>

    <AutoComplete v-model="selectedLanguage2" :dropdown="true" :suggestions="filteredLanguages.value"
                  placeholder="Select language" @complete="searchLanguage($event)"
                  field="language" style="margin-bottom: 10px; margin-top: 10px"/> <br>

    <Button @click="sendRecording()" id="send-btn" class="p-button" disabled>Send Audio!</Button>

  </Panel>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import APIWrapper from "@/backend.api";

export default defineComponent({
  name: 'Audio',

  setup: async () => {
    let uploadedFile: any = undefined; // Stores the uploaded file
    const selectedLanguage1 = ref(); // Stores the selected language for file upload
    const selectedLanguage2 = ref(); // Stores the selected language for recording
    let recorder: any; // Stores the MediaRecorder object
    let mime: any; // Stores the mime type of the recording
    let audio: any = undefined; // Stores the audio of the recording

    // Set supported languages.
    const languages = ref([
      {language: "Dutch", short: "nl"},
      {language: "English", short: "en"},
      {language: "French", short: 'fr'},
      {language: "German", short: 'de'},
      {language: "Russian", short: 'ru'}
    ]);

    let filteredLanguages = ref(languages.value) // Stores the filtered languages upon searching among languages.

    /**
     * Function for sending the uploaded file to the microcontroller.
     */
    function sendFile() {
      // Check if language is selected
      if (selectedLanguage1.value === undefined) {
        alert("Please select the spoken language");
        return
      }

      // Check if file is uploaded
      if (uploadedFile === undefined) {
        alert("Please upload an audio file");
        return
      }

      // Send file to the microcontroller
      APIWrapper.sendAudioFile(uploadedFile, {
        source_language: selectedLanguage1.value.short,
        target_language: "en",
        type: "audio/flac"
      })
    }

    /**
     * Function for sending the recorded audio to the microcontroller.
     */
    function sendRecording() {
      // Check if language is selected.
      if (selectedLanguage2.value === undefined) {
        return alert("Please select the spoken language");
      }

      // Check if audio is recorded.
      if (audio === undefined) {
        return alert("Record some audio first!")
      }

      // Send audio to microcontroller
      APIWrapper.sendAudioFile(audio,
          {source_language: selectedLanguage2.value.short, target_language: "en", type: mime});
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
        return w.language.toLowerCase().includes(event.query.toLowerCase()) ? w : null
      }).filter(w => !!w)) as any;
    }

    /**
     * Function for starting a recording from the browser.
     */
    function startRecord() {
      navigator.mediaDevices.getUserMedia({audio: true})
          .then(recordStream).catch(console.error);
    }

    /**
     * Function for recording audio via the browser.
     * @param stream    MediaStream of the recording.
     */
    function recordStream(stream: any) {
      // List for storing data
      const items: any[] = [];

      // Check which mimetypes is supported.
      // @ts-ignore
      mime = ['audio/webm', 'audio/ogg'].filter(MediaRecorder.isTypeSupported)[0];

      // Initializing the recorder using the mimetype.
      // @ts-ignore
      recorder = new MediaRecorder(stream, {mimeType: mime});

      // Empty the collection when starting recording.
      recorder.addEventListener('start', () => {
        items.length = 0;
      });

      // If there is data available, store it.
      // @ts-ignore
      recorder.ondataavailable = (e) => {
        items.push(e.data);
      };

      // On stop, stop recording and finalize recorded data.
      recorder.onstop = () => {
        stream.getTracks().forEach((s: any) => s.stop());
        finalize(items)
      }

      // @ts-ignore
      recorder.start();
    }

    /**
     * Function for stopping the recording.
     */
    function stopRecord() {
      // @ts-ignore
      recorder.stop();
    }

    /**
     * Finalizes the recorded data.
     * @param chunks    Recorded data chunks.
     */
    function finalize(chunks: any) {
      // Store the audio as a blob using the mimetype
      audio = new Blob(chunks, {type: mime})

      // Initialize audio playback.
      playMedia(audio);
    }

    /**
     * Creates playback functionality based on recorded data.
     * @param blob    Recorded data.
     */
    function playMedia(blob: Blob) {
      // Initialize AudioContext.
      const ctx = new AudioContext();
      const fileReader = new FileReader();
      // @ts-ignore
      fileReader.onload = () => ctx.decodeAudioData(fileReader.result)
          .then(buf => {
            const playbtn = document.getElementById("play-btn");
            // @ts-ignore
            playbtn.onclick = () => {
              const source = ctx.createBufferSource();
              source.buffer = buf;
              source.connect(ctx.destination);
              source.start(0);
            };
            // @ts-ignore
            playbtn.disabled = false;

            const send_btn = document.getElementById("send-btn")
            // @ts-ignore
            send_btn.disabled = false;
          });
      fileReader.readAsArrayBuffer(blob);
    }

    return {
      selectedLanguage1,
      selectedLanguage2,
      filteredLanguages,
      languages,

      sendFile,
      onFileSelected,
      searchLanguage,

      startRecord,
      stopRecord,
      sendRecording,
    }
  }

})
</script>

<style scoped>

</style>
