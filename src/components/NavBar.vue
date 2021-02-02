<template>

</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  setup() {
    const items = [
      {label: 'Home', icon: 'pi-pi-fw pi-home', to: '/home'}
    ];

    return {items}
  }
})
</script>

<style scoped>

</style>
