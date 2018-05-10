import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')
const AdminView = () => import('../views/AdminView.vue')
const ImageAllView = () => import('../views/ImageAllView.vue')
const AnnouncementAllView = () => import('../views/AnnouncementAllView.vue')
const SendAnnouncementView = () => import('../views/SendAnnouncementView.vue')
const QueryUserView = () => import('../views/QueryUserView.vue')
const MixPanelView = () => import('../views/MixPanelTest.vue')
const HangoutView = () => import('../views/Offline/Hangout.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/admin', component: AdminView },
      { path: '/images', component: ImageAllView },
      { path: '/announcements', component: AnnouncementAllView },
      { path: '/send-announcement', component: SendAnnouncementView },
      { path: '/query-user', component: QueryUserView },
      { path: '/mixpanel-test', component: MixPanelView },
      { path: '/top/:page(\\d+)?', component: createListView('top') },
      { path: '/new/:page(\\d+)?', component: createListView('new') },
      { path: '/show/:page(\\d+)?', component: createListView('show') },
      { path: '/ask/:page(\\d+)?', component: createListView('ask') },
      { path: '/job/:page(\\d+)?', component: createListView('job') },
      { path: '/item/:id(\\d+)', component: ItemView },
      { path: '/user/:id', component: UserView },
      { path: '/offline/hangout', component: HangoutView },
      { path: '/', redirect: '/images' }
    ]
  })
}
