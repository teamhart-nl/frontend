<template>
  <h1>Phonemes!</h1>
  <div v-for="item in phonemes" v-bind:key="item.name" class="p-field-checkbox">
        <Checkbox :id="'checkbox_' + item.name" name="item.nam3" :value="item.name" v-model="selectedPhonemes"/>
        <label :for="item">{{item.name}}</label>
  </div>

  <Dropdown v-model="dropdownPhoneme" :options="phonemes" optionLabel="name" placeholder="Phoneme" :filter="true"/>
  <Button @click="sendDropdownPhoneme()">Send phoneme!</Button>
<!--  <input type="checkbox" id="checkbox" v-model="checked">-->
<!--  <label for="checkbox">{{ checked }}</label>-->
</template>

<script>
import {defineComponent, ref} from "vue";
import APIWrapper from "@/backend.api";

export default defineComponent({
  name: 'Phonemes',

  async setup() {

    const phonemeData = (await APIWrapper.getPhonemes()).phonemes;
    const selectedPhonemes = ref([]);
    const dropdownPhoneme = ref();

    function sendDropdownPhoneme() {
      const json = {'phonemes': [dropdownPhoneme.value.name]}
      APIWrapper.sendPhonemeMicrocontroller(json);
    }

    // eslint-disable-next-line no-unused-labels
    const phonemes = []
    phonemeData.forEach((pho) => {
      phonemes.push({name: pho})
    })

    return {
      phonemes,
      selectedPhonemes,
      dropdownPhoneme,

      sendDropdownPhoneme,
    }
  }
})
</script>

<style>
.p-dropdown .p-inputtext {
  font-size: 2rem;
}

.p-component {
  font-size: 2rem;
}
</style>
