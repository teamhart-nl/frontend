<template>
  <div id="app">
    <p>{{ greeting }}</p>
    <p>{{ flaskGreeting }}</p>
    <p>{{ counter }}</p>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component';
import APIWrapper from "./api";

export default class API extends Vue {
  greeting = 'Hello, vue!';
  flaskGreeting = '';
  counter = 0;



  async data() {
    const data = await APIWrapper.getWelcomeMessage();
    this.flaskGreeting = data.greeting;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
