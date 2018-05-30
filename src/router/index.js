import Vue from 'vue'
import Router from 'vue-router'


// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import Login from '@/views/login/index'
import Page404 from '@/views/404'
import Dashboard from '@/views/dashboard/index'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: Login, hidden: true},
  {path: '/404', component: Page404, hidden: true},

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: false,
    children: [{
      path: 'dashboard',
      component: Dashboard,
      name: 'dashboard',
      meta: {title: '首页', icon: 'example', noCache: true}
    }]
  }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})


import TableView from '@/views/table/index'
import TreeView from '@/views/tree/index'

//import AuthClient from '@/views/sys/auth/client'
//使用了 vue-routerd 的[Lazy Loading Routes
//vue官网写法：{ path: '/', component: () => import('./components/Home.vue') },
//commonJS写法：  { path: '/item/:id', component: resolve => require(['./components/Item.vue'],resolve) }
export const asyncRouterMap = [
  {
    path: '/sys/auth',
    component: Layout,
    name: 'auth',
    meta: {title: '认证中心', icon: 'example'},
    children: [
      {path: 'client', name: 'Client', component: resolve => require(['@/views/sys/auth/client'],resolve), meta: {title: '客户端', icon: 'table', roles: ['admin']}},
      {path: 'client', name: 'Client1', component: resolve => require(['@/views/sys/auth/client'],resolve), meta: {title: '客户端授权', icon: 'tree', roles: ['admin']}}
    ]
  },
  {
    path: '/form',
    component: Layout,
    name: 'Example2',
    meta: {title: '用户中心', icon: 'example'},
    children: [
      // {
      //   path: 'index',
      //   name: 'Form',
      //   component: FormView,
      //   meta: {title: 'Form', icon: 'form'}
      // }
      {path: 'table', name: 'Table', component: resolve => require(['@/views/sys/auth/client'],resolve), meta: {title: '社会化接入', icon: 'table'}},
      {path: 'tree', name: 'Tree', component: TreeView, meta: {title: '用户管理', icon: 'tree', roles: ['admin']}},
      {path: 'tree', name: 'Tree', component: TreeView, meta: {title: '注册信息表', icon: 'tree', roles: ['admin']}},
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example3',
    meta: {title: '权限中心', icon: 'example'},
    children: [
      {path: 'table', name: 'Table', component: TableView, meta: {title: '角色管理', icon: 'table'}},
      {path: 'tree', name: 'Tree', component: TreeView, meta: {title: '权限管理', icon: 'tree', roles: ['admin']}},
      {path: 'tree', name: 'Tree', component: TreeView, meta: {title: '授权管理', icon: 'tree', roles: ['admin']}},
      {path: 'tree', name: 'Tree', component: TreeView, meta: {title: '资源管理', icon: 'tree', roles: ['admin']}},
    ]
  },

  {path: '*', redirect: '/404', hidden: true}
]
