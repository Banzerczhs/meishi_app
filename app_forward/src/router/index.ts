import Vue from "vue";
import VueRouter from 'vue-router'
import {store} from '@/store'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: '/',
    component: ()=>import('@/views/Access.vue'),
    children : [
      {
        path : 'login',
        name : 'login',
        component : ()=>import('@/components/useraccess/login.vue')
      },
      {
        path : 'register',
        name : 'register',
        component : ()=>import('@/components/useraccess/register.vue')
      }
    ]
  },
  {
    path : '/admin',
    component : ()=>import('@/views/Admin.vue'),
    children : [
      {
        path: '/',
        name: 'admin',
        component: ()=>import('@/views/Home.vue')
      },
      {
        path : 'category',
        name : 'category',
        component : ()=>import('@/views/Category.vue'),
        children : [
          {
            path : 'edit',
            name : 'edit_category',
            component : ()=>import('@/components/category/category_edit.vue')
          }
        ]
      },
      {
        path : 'recomment',
        name : 'recomment',
        component : ()=>import('@/views/Home.vue')
      },
      {
        path : 'product',
        name : 'product',
        component : ()=>import('@/views/Product.vue'),
        children : [
          {
            path : 'add',
            name : 'add_product',
            component : ()=>import('@/components/product/product_add.vue')
          },
          {
            path : 'edit',
            name : 'edit_product',
            component : ()=>import('@/components/product/product_edit.vue')
          }
        ]
      },
      {
        path : 'ingredient',
        name : 'ingredient',
        component : ()=>import('@/views/Home.vue')
      },
      {
        path : 'user',
        name : 'user',
        component : ()=>import('@/views/User.vue'),
        children : [
          {
            path : 'edit',
            name : 'edit_user',
            component : ()=>import('@/components/user/user_profile.vue')
          }
        ]
      },
      {
        path : 'comment',
        name : 'comment',
        component : ()=>import('@/views/Home.vue')
      },
      {
        path : 'favorite',
        name : 'favorite',
        component : ()=>import('@/views/Home.vue')
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to,from,next)=>{
  let data=window.localStorage.getItem('user');
  if(data&&data!='undefined'){
    if(to.matched[0].name=='/'){
      next('/admin');
    }
  }else{
    if(to.matched[0].path=='/admin'||to.name=='/'){
      next('/login');
    }
  }
  next();
});

router.afterEach((to, from)=>{
  if(to.matched[1]&&(<string>to.matched[1].path).includes('admin')){
    store.commit('changeRouter',to.matched[1].path);
  }
})

export default router
