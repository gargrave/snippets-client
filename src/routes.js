import {localUrls} from './appData/urls';

import Home from './components/Home.vue';
import LoginPage from './components/account/containers/LoginPage.vue';
import SnippetCreatePage from './components/snippets/containers/SnippetCreatePage.vue';
import SnippetsListPage from './components/snippets/containers/SnippetsListPage.vue';


export const routes = [
  {path: '/', component: Home, name: 'home'},
  {path: localUrls.login, component: LoginPage, name: 'login'},
  {path: localUrls.snippetsList, component: SnippetsListPage, name: 'snippets-list'},
  {path: localUrls.snippetCreate, component: SnippetCreatePage, name: 'snippet-create'},
];
