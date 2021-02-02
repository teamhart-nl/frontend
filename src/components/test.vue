<template>
  <p>{{test_message}}</p>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'TestComponent',
  setup() {
    const test_message = "TEST MESSAGE";

    return {
      test_message
    }
  }
})
</script>

<style scoped>

</style>
