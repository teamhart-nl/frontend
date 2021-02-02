<template>
  <div id="app">
    <NavBar></NavBar>
    <p>{{ greeting }}</p>
    <p>{{ flaskGreeting }}</p>
    <p>{{ counter }}</p>
    <Button label="Count" @click.prevent="count(1)"/>
    <Button label="Count down" @click.prevent="count(-1)"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import APIWrapper from "./api";
import { defineComponent, ref } from 'vue';
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  name: 'App',
  components: {NavBar},
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
