// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import App from './App';

import {routes} from './routes';
import {store} from './store/store';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../static/main.scss';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({routes});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
