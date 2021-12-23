import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyAqKApdPZcrWG9NkAwY9pqZcfZJqLlnOhA",
  authDomain: "vue-project-620be.firebaseapp.com",
  databaseURL: "https://vue-project-620be.firebaseio.com",
  projectId: "vue-project-620be",
  storageBucket: "vue-project-620be.appspot.com",
  messagingSenderId: "22292482933",
  appId: "1:22292482933:web:eed795d61a963c5a44a13c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
