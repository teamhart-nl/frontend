<template>
  <h1>Settings</h1>
  <Button @click="darkThemeSwitch">Switch Themes!</Button>

</template>

<script>
import {defineComponent} from "vue";
import {ThemeChanger} from "@/helpers/darkmode.helper";

export default defineComponent({
  name: "Settings",
  created() {
    document.title = "HART Prototype - Settings"
  },
  setup() {
    const themeChanger = new ThemeChanger();

    return {themeChanger}
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
