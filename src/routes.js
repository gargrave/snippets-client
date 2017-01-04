import {localUrls} from './appData/urls';

import LoginPage from './components/account/containers/LoginPage.vue';
import SnippetCreatePage from './components/snippets/containers/SnippetCreatePage.vue';
import SnippetDetailPage from './components/snippets/containers/SnippetDetailPage.vue';
import SnippetsListPage from './components/snippets/containers/SnippetsListPage.vue';


export const routes = [
  {path: '/', redirect: {name: 'snippets-list'}},

  /*=============================================
   = Auth routes
   =============================================*/
  {
    path: localUrls.login,
    component: LoginPage,
    name: 'login'
  },

  /*=============================================
   = Snippets routes
   =============================================*/
  {
    path: localUrls.snippetsList,
    component: SnippetsListPage,
    name: 'snippets-list'
  },
  {
    path: localUrls.snippetsFilteredList,
    component: SnippetsListPage,
    name: 'snippets-filtered-list'
  },
  {
    path: localUrls.snippetCreate,
    component: SnippetCreatePage,
    name: 'snippet-create'
  },
  {
    path: localUrls.snippetDetail,
    component: SnippetDetailPage,
    name: 'snippet-detail'
  },

  // catch-all redirect to home page
  {path: '*', redirect: {name: 'snippets-list'}},
];
