import Home from './components/Home.vue';
import LoginPage from './components/account/containers/LoginPage.vue';
import SnippetsListPage from './components/snippets/containers/SnippetsListPage.vue';


export const routes = [
  {path: '/', component: Home, name: 'home'},
  {path: '/account/login', component: LoginPage, name: 'login'},
  {path: '/snippets', component: SnippetsListPage, name: 'snippets-list'},
];
