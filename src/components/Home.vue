<template>
  <p>{{home_message}}</p>
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
