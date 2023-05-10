import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"


import App from './App.vue'
import router from './router'

const app = createApp(App)
import VueAxios from 'vue-axios'
import axios from 'axios'

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios as any)
app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')
