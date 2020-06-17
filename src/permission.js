import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import {asyncRoutes, constantRoutes} from '@/router'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register','/trace']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  let userid = localStorage.getItem('userid');
  if (userid) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!store.getters.user) {
        // 判断当前用户是否已拉取完user_info信息
        const user = await store.dispatch('getInfo');
        const accessRoutes = await store.dispatch('generateRoutes', user);
        // const accessRoutes = asyncRoutes;

        router.addRoutes(accessRoutes);

        next({ ...to, replace: true })
      } else {
        // if(to.matched.some(res => res.meta.requireAuth)){
        //   if(store.getters.user.userType!=0&&store.getters.user.enterpriseId<=0){
        //     Message({
        //       message: '您还没有企业，请创建企业',
        //       type: 'error',
        //       duration: 5 * 1000,
        //       showClose: true,
        //     })
        //     next({
        //       path: '/enterpriseInfo/index',
        //       query: {redirect: to.fullPath}
        //     })
        //   }else{
        //     next()
        //   }
        // }else{
          next()
        // }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
