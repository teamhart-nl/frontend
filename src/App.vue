<template>
  <div id="app">
    <Navbar></Navbar>
    <div id="content" class="p-shadow-1">
      <Suspense>
        <router-view/>
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  name: 'App',
  components: {Navbar},
});
</script>

<style scoped>

</style>
