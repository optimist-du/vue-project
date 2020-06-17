import Vue from 'vue'
import Router from 'vue-router'
import { getInfo } from "@/api/login";
import { Notification, MessageBox, Message } from 'element-ui'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  
]

export const asyncRoutes = [
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true}
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    meta: { title: '账号安全', icon: 'lock' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/accountManage/index'),
        name: '账号安全',
        meta: { title: '账号安全', icon: 'lock' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: "系统管理",
    meta: { title: '系统管理', icon: 'password' , permission: "system"},
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: '用户管理',
        meta: { title: '用户管理', icon: 'user',permission:"system:user"}
      },
      {
        path: 'dict',
        component: () => import('@/views/dict/index'),
        name: '系统字典',
        meta: { title: '系统字典', icon: 'dict' ,permission:"system:dict"}
      },
      {
        path: 'resource',
        component: () => import('@/views/resource/index'),
        name: '资源管理',
        meta: { title: '资源管理', icon: 'tree-table' ,permission:"system:resource"}
      },
      {
        path: 'systemRole',
        component: () => import('@/views/system/systemRole'),
        name: '角色管理',
        meta: { title: '角色管理', icon: 'role' ,permission:"system:role"}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
 const router = new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export default router;
