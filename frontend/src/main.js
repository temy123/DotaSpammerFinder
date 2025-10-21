import './assets/main.css'
// import './assets/css/bootstrap_minty.min.css'
// import './assets/less/main.less'
// import './assets/less/main.less'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
