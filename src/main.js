import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { VueCsvImportPlugin } from 'vue-csv-import';
import print from 'vue3-print-nb';

createApp(App).use(VueCsvImportPlugin).use(print).mount('#app');
