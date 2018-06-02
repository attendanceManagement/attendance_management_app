import Vue from 'vue'
import Router from 'vue-router'
import * as Auth from '@/components/pages/Authentication'
// Pages
import Authentication from '@/components/pages/Authentication/Authentication'
import Home from '@/components/pages/Home'
import Summary from '@/components/pages/Summary'
import AdminView from '@/components/pages/AdminPage'
import Edit from '@/components/pages/Edit'
import Attendance from '@/components/pages/Attendance'
import Approvals from '@/components/pages/Approvals'
import Teams from '@/components/pages/Team'
import TeamInfo from '@/components/pages/TeamInfo'
import TeamApproval from '@/components/pages/TeamApproval'
import AdminApproval from '@/components/pages/AdminApproval'
import Leave from '@/components/pages/leave'
// Global components
import Header from '@/components/Header'
import Footer from '@/components/Footer'



// Register components
Vue.component('app-header', Header)
Vue.component('app-footer', Footer)
Vue.component('app-summary', Summary)
Vue.component('app-approval', Approvals)
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
        summary: Summary,
        footer:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/login',
      name: 'Authentication',
      component: Authentication
    },

  {
      path: '/attendance/:id/:emp_no',
      name: 'Attendance',
      components: {
        default: Attendance,
        header: Header,
        summary: Summary,
        footer:Footer
      },
      meta: {
        requiredAuth: true
      }
    },

    {
      path: '/summary',
      name: 'Summary',
      components: {
        default: Summary,
        header: Header,
        footer:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/adminView',
      name: 'AdminView',
      components: {
        default: AdminView,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/approvals',
      name: 'Apprvals',
      components: {
        default: AdminApproval,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },

     {
      path: '/teams',
      name: 'Teams',
      components: {
        default: Teams,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },

      {
      path: '/teamInfo/:teamId',
      name: 'TeamInfo',
      components: {
        default: TeamInfo,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
       {
      path: '/teamApproval',
      name: 'TeamApproval',
      components: {
        default: TeamApproval,        
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
       {
      path: '/teamApproval/:teamId',
      name: 'TeamApproval',
      components: {
        default: TeamApproval,        
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    
     {
      path: '/leave',
      name: 'Leave',
      components: {
        default: Leave,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    }

  ]
})

router.beforeEach((to, from, next) => {
  console.log(Auth.default.user)
  if (to.meta.requiredAuth) {
    if (Auth.default.user.authenticated) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
