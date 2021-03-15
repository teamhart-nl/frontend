<template>
  <div style="width: min(800px, 100%)">
    <h1>How to get started</h1>
    <p>In the tab for phonemes, you can do everything related to phonemes! This includes viewing all the phonemes that
      are used, just training single phonemes, but also taking a test. In the tab 'Words', you can do similar stuff as
      in the phonemes tab, but then with words. In the 'Audio' tab, you can upload an audio file for processing.</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Documentation',
  created() {
    document.title = "HART Prototype - Documentation"
  }
})
</script>

<style scoped>

</style>
