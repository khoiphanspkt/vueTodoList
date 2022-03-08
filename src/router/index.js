/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
import todoList from '@/components/TodoList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'todoList',
      component: todoList
    }
  ]
})
