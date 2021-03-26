<template>
  <TabMenu :model="items" />
  <Button @click="darkThemeSwitch"></Button>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {ThemeChanger} from "@/helpers/darkmode.helper";

export default defineComponent({
  name: 'Navbar',
  setup() {
    const items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', to: '/'},
      {label: 'Documentation', icon: 'pi pi-fw pi-file', to: '/documentation'},
      {label: 'Phonemes', icon: 'pi pi-fw pi-comment', to: '/phonemes'},
      {label: 'Words', icon: 'pi pi-fw pi-comments', to: '/words'},
      {label: 'Audio', icon: 'pi pi-fw pi-play', to: '/audio'},
      {label: 'Settings', icon: 'pi pi-fw pi-cog', to: '/settings'}
    ];

    const themeChanger = new ThemeChanger();

    return {
      items,
      themeChanger
    }
  },
  methods: {
    darkThemeSwitch() {
      this.themeChanger.darkThemeSwitch();
    }
  },
})
</script>

<style scoped>

</style>
