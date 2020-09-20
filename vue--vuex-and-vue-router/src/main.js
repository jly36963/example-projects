import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import store from './stores/index'

// components
import Landing from './components/index';
import About from './components/about';
import Home from './components/home';

// routes
const routes = [
  { path: '/', component: Landing },
  { path: '/home', component: Home },
  { path: '/about', component: About },
]

// use router (components will now have `this.$router` and `this.$route`)
// change routes -- this.$router.push('home')
// links -- <router-link to="/">Home</router-link>
// params -- this.$route.params
const routerHistory = createWebHistory()

// create router (with routes and options)
const router = new createRouter({
  history: routerHistory,
  routes
})

// create and mount app
createApp(App)
  .use(store)
  .use(router)
  .mount('#app'); // might need to wait before mounting (router.isReady().then(...))


