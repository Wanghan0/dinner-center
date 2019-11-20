import Vue from 'vue';
import Router from 'vue-router';

import wrongUrl from '../components/common/404.vue'

import example_1 from '../components/pages/example/example_1.vue'
import example_2 from '../components/pages/example/example_2.vue'
import test from '../components/pages/example/test.vue'
import user from '../components/pages/user.vue'
import payRecords from '../components/pages/payRecords.vue'
import overtimeRecords from '../components/pages/overtimeRecords.vue'
import count from '../components/pages/count'
import countLog from '../components/pages/countLog'
import login from '../components/pages/login'

Vue.use(Router);

export default new Router({
    routes: [
      {
        path: '/example_1',
        name: 'example_1',
        component: example_1
      },
      {
        path: '/example_2',
        name: 'example_2',
        component: example_2
      },
      {
        path: '/wrongUrl',
        name: 'wrongUrl',
        component: wrongUrl
      },
      {
        path: '/test',
        name: 'test',
        component: test
      },
      {
        path: '/user',
        name: 'user',
        component: user
      },
      {
        path: '/payRecords',
        name: 'payRecords',
        component: payRecords
      },
      {
        path: '/overtimeRecords',
        name: 'overtimeRecords',
        component: overtimeRecords
      },
      {
        path: '/count',
        name: 'count',
        component: count
      },
      {
        path: '/countLog',
        name: 'countLog',
        component: countLog
      },
      {
        path: '/login',
        name: 'login',
        component: login
      },
      // {
      //   path:'*',
      //   redirect:'/wrongUrl',
      //   component: wrongUrl
      // }
    ]
});
