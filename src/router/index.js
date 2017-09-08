import Vue from 'vue';
import Router from 'vue-router';
import MusicList from '../components/MusicList/MusicList';
import Find from '../components/Find/Find';
import One from '../components/One/One';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: MusicList,
    },
    {
      path: '/music-list',
      name: 'MusicList',
      component: MusicList,
    },
    {
      path: '/find',
      name: 'Find',
      component: Find,
    },
    {
      path: '/one',
      name: 'One',
      component: One,
    },
  ],
});
