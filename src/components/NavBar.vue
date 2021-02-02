<template>
  <TabMenu :model="items" />
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  setup() {
    const items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', to: '/'},
      {label: 'Documentation', icon: 'pi pi-fw pi-file', to: '/test'}
    ];

    return {items}
  }
})
</script>

<style scoped>

</style>
