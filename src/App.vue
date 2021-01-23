<template>
  <div id="app">
    <p>{{ greeting }}</p>
    <p>{{ flaskGreeting }}</p>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      greeting: 'Hello, Vue!',
      flaskGreeting: ''
    }
  },
  created: async function(){
    const gResponse = await fetch("http://localhost:5000/vue-test");
    const gObject = await gResponse.json();
    this.flaskGreeting = gObject.greeting;
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
