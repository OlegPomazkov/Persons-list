import Vue from 'vue'
import Router from 'vue-router'
import MasterComp from './pages/Master.vue'
import DetailComp from './pages/Detail.vue'
import DialogComponent from './components/DialogComponent.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'master',
      component: MasterComp,
      children: [
        { 
          name: 'dialog',
          path: 'person/:id', 
          component: DialogComponent,
        },
      ]
    },
    {
      path: '/detail',
      name: 'detail',
      component: DetailComp
    },
  ]
})
