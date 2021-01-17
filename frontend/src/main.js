import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import DefaultLayout from './layouts/Default';
import LoggedLayout from './layouts/Logged';
import Notifications from 'vue-notification';
import SweetAlertIcons from 'vue-sweetalert-icons';

Vue.use(SweetAlertIcons);
Vue.use(Notifications);
Vue.component('default-layout', DefaultLayout);
Vue.component('logged-layout', LoggedLayout);

new Vue({
    router,
    vuetify,
    store,

    render: h => h(App)
}).$mount('#app');
