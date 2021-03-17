<template>
  <h1>Audio!</h1>

  <Panel header="Upload your file!"> 
    <Button @click="onPickFile">Upload profile picture</Button>
    <input
      type="file"
      ref="fileInput"
      @change="onFilePicked($event)"/>
  </Panel>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import APIWrapper from "@/backend.api";

export default defineComponent({
  name: 'Audio',

  setup()  {
    function onFilePicked(event: any) {
        const files = event.target.files
        let filename = files[0].name
        console.log(filename)
        console.log(files[0])
        APIWrapper.sendAudioFile(files[0])
      }

      return {
        onFilePicked
      }
  }

})
</script>

<style scoped>

</style>
