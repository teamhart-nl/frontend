<template>
  <div id="app">
    <p>{{dict.greeting}}</p>
    <p>{{dict.flaskGreeting}}</p>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import APIWrapper from "./api";

export default class API extends Vue {
  private dict = {
    greeting: 'Hello, vue!',
    flaskGreeting: ''
  }

  async data() {
    const data = await APIWrapper.getWelcomeMessage();
    this.dict.flaskGreeting = data.greeting;
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
