<template>
  <div id="app">
    <Navbar></Navbar>
    <div id="content" class="p-shadow-1">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import APIWrapper from "./api";
import {defineComponent, ref} from 'vue';
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  name: 'App',
  components: {Navbar},
  setup() {
    const greeting = 'Welcome, VUE!';
    const flaskGreeting = '';
    let counter = ref(0);

    const count = (howMuch: number) => {
      counter.value += howMuch;
    }

    return {
      greeting,
      flaskGreeting,
      counter,
      count
    }
  },
  async data() {
    const data = await APIWrapper.getWelcomeMessage();
    this.flaskGreeting = data.greeting;
  }
});
</script>

<style scoped>

</style>
