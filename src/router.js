import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/register',
      name: '註冊頁面',
      component: () =>
        import('@/components/Register') /* webpackChunkName: "about" */,
      meta: {
        title: '加入良匠會員'
      }
    },
    // {
    //   path: '/register/:recLineId',
    //   name: '有推薦人的註冊頁面',
    //   component: () =>
    //     import('@/components/Register') /* webpackChunkName: "about" */
    // },
    {
      path: '/history',
      name: '購買紀錄',
      component: () =>
        import('@/components/History') /* webpackChunkName: "about" */,
      meta: {
        title: '購買紀錄'
      }
    },
    {
      path: '/recpage',
      name: '推薦好友',
      component: () =>
        import('@/components/Recpage') /* webpackChunkName: "about" */,
      meta: {
        title: '推薦好友'
      }
    },
    {
      path: '/buy',
      name: '立即購買',
      component: () =>
        import('@/components/Buy') /* webpackChunkName: "about" */,
      meta: {
        title: '立即購買'
      }
    },
    {
      path: '/confirmmoneyin',
      name: '訂單審核',
      component: () =>
        import(
          '@/components/admin/ConfirmMoneyIn'
        ) /* webpackChunkName: "about" */,
      meta: {
        title: '訂單審核'
      }
    },
    {
      path: '/pm',
      name: '產品管理',
      component: () =>
        import(
          '@/components/admin/ProductManager'
        ) /* webpackChunkName: "about" */,
      meta: { title: '產品管理' }
    },
    {
      path: '/pm/upload',
      name: '產品上架',
      component: () =>
        import('@/components/admin/ProductManager/UploadProduct'),
      meta: { title: '產品上架' }
    },
    {
      path: '/isnotadmin',
      name: '權限不夠',
      component: () => import('./components/admin/CheckAdmin/IsNotAdmin'),
      meta: { title: '權限不夠' }
    },
    {
      path: '/tofactory',
      name: '工廠訂單',
      component: () => import('./components/admin/ToFactory'),
      meta: { title: '工廠訂單' }
    },
    {
      path: '/test',
      name: '測試',
      component: () => import('./components/admin/AdminList'),
      meta: { title: '管理員列表' }
    }
  ]
})
