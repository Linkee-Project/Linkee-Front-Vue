import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/authStore'; // Import useAuthStore


const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

// Load auth state from storage immediately after pinia is used
const authStore = useAuthStore();
authStore.loadFromStorage();

app.use(ElementPlus)
app.use(router);
app.mount('#app');