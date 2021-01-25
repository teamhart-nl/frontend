<template>
  <div id="app">
    <p>{{ greeting }}</p>
    <p>{{ flaskGreeting }}</p>
  </div>
</template>

<script>
import Api from './api';

export default {
  data: function(){
    return {
      greeting: 'Hello, Vue!',
      flaskGreeting: ''
    }
  },
  created: async function(){
    const data = await Api.getWelcomeMessage();
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
