<template class="temp">
  <h1>Phonemes!</h1>
  <Panel header="Send a chosen phoneme" style="margin-bottom: 10px">
    <p>To just try out how a single phoneme feels, and play it on the prototype, you can select a phoneme in the
      dropdown menu and send it to the arduino by clicking the button.</p>

    <Dropdown v-model="dropdownPhoneme" :options="phonemes" optionLabel="name" placeholder="Phoneme" :filter="true" style="margin-right: 10px"/>
    <Button @click="sendDropdownPhoneme()" style="padding: 1.2rem">Send phoneme!</Button>
  </Panel>

  <Panel header="Training">
    <p>Select which phonemes you want to train on!</p>
    <div v-for="item in phonemes" v-bind:key="item.name" class="p-field-checkbox" style="display: inline-block; margin-right: 20px">
      <Checkbox :id="'checkbox_' + item.name" name="item.nam3" :value="item.name" v-model="selectedTrainPhonemes"/>
      <label :for="item">{{ item.name }}</label>

    </div>
    <br>
    <Panel header="Send random" style="margin-bottom: 10px">
    <Button @click="sendRandomPhoneme()" style="padding: 1.2rem">Send random phoneme!</Button>
    </Panel>
    <Panel header="Forced identification">
      <p>By clicking the button, a phoneme will be send to the arduino, and you will get to see three buttons, and have to choose which one you felt.</p>
      <Button @click="sendForcedIdentification()" style="padding: 1.2rem">Forced identification!</Button>
      <div id="forcedIdentificationButtons"></div>
    </Panel>
  </Panel>
</template>

<script lang="ts">
import {createApp, defineComponent, ref} from "vue";
import APIWrapper from "@/backend.api";
import Button from "primevue/button";

function getRandom(arr: [any], n: number): any {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default defineComponent({
  name: 'Phonemes',
  extends: {Button},

  setup: async () => {

    const phonemeData = (await APIWrapper.getPhonemes()).phonemes;
    const selectedTrainPhonemes = ref([]);
    const dropdownPhoneme = ref();

    function sendDropdownPhoneme() {
      if (dropdownPhoneme.value !== undefined) {
        const json = {'phonemes': [dropdownPhoneme.value.name]}
        APIWrapper.sendPhonemeMicrocontroller(json);
      } else {
        alert("Please select a phoneme to send");
      }
    }

    function sendRandomPhoneme() {
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
      } else {
        const randomPhoneme = selectedTrainPhonemes.value[Math.floor(Math.random() * selectedTrainPhonemes.value.length)]
        const json = {'phonemes': [randomPhoneme]};
        APIWrapper.sendPhonemeMicrocontroller(json);
      }
    }

    function sendForcedIdentification() {
      const buttonDiv = document.getElementById("forcedIdentificationButtons")
      if (buttonDiv === null) {
        alert("No div for placing buttons, something went wrong!");
        return;
      }

      // reset div
      buttonDiv.innerHTML = '';

      // check if some phonemes are selected
      if (selectedTrainPhonemes.value.length === 0) {
        alert("Please select phonemes to train on");
        return
      }

      // get a set of random phonemes from the selected phonemes
      const randomPhonemes = getRandom(selectedTrainPhonemes.value as any, Math.min(3, selectedTrainPhonemes.value.length));
      // const playedPhoneme = getRandom(randomPhonemes, 1) // is a list

      // APIWrapper.sendPhonemeMicrocontroller({'phonemes': playedPhoneme});


      const textDiv = document.createElement('div');
      textDiv.innerHTML = '<p>Which phoneme was just played?</p>';
      buttonDiv.appendChild(textDiv);

      randomPhonemes.forEach((phoneme: string) => {
        const div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.marginRight = "10px";

        buttonDiv.appendChild(div);
        createApp(Button, {label: phoneme}).mount(div);

      })
    }

    // eslint-disable-next-line no-unused-labels
    const phonemes: {name: string}[] = [];
    phonemeData.forEach((pho: string) => {
      phonemes.push({name: pho})
    })

    return {
      phonemes,
      selectedTrainPhonemes,
      dropdownPhoneme,

      sendDropdownPhoneme,
      sendRandomPhoneme,
      sendForcedIdentification
    }
  }
})
</script>

<style scoped>

</style>
