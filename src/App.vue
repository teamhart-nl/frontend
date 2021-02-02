<template>
  <div id="app">
    <Navbar></Navbar>
    <div id="content">
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: whitesmoke;
  height: 98vh;
}

#content {
  border: gainsboro 2px solid;
  border-radius: 10px;
  box-shadow: 2px 2px 2px ghostwhite;
  width: min(60%, 900px);
  height: 80vh;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px;
  overflow: scroll;
}
</style>
