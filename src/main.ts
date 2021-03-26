import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from "primevue/button";

import './assets/layout/md-dark-indigo.css'
import './assets/layout/md-light-indigo.css'

import './assets/layout/dark-mode.css'
import './assets/layout/light-mode.css'

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import TabMenu from "primevue/tabmenu";
import {router} from "@/router/router";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import Panel from "primevue/panel";
import Fieldset from "primevue/fieldset";
import InputText from 'primevue/inputtext';
import AutoComplete from "primevue/autocomplete";

import './assets/layout/reset.css';
import './assets/layout/style.css';

const app = createApp(App);

app.use(PrimeVue, {ripple: true});
app.use(router);

app.component('Button', Button);
app.component('TabMenu', TabMenu);
app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('Panel', Panel);
app.component('Fieldset', Fieldset);
app.component('AutoComplete', AutoComplete);
app.component('InputText', InputText);

app.mount('#app')
