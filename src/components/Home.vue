<template>
  <div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;">
    <div style="width:400px;height:400px;">
      <img src="./../assets/HART-logo.png" height="400">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Home',
  setup() {
    const home_message = "Home Message!"

    return {
      home_message,
    }
  }
})
</script>

<style scoped>

</style>
