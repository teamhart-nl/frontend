<template>
  <div id="root" class="container">

    <tabs>
      <tab name="Services" :selected="true">
        <h1>What we do</h1>
      </tab>
      <tab name="Pricing">
        <h1>How much we do it for</h1>
      </tab>
      <tab name="About Us">
        <h1>Why we do it</h1>
      </tab>
    </tabs>

  </div>
</template>

<script>
export default {
name: "tabs"
}
</script>

<style scoped>

</style>
