import Vue from 'vue';
import VueRouter from 'vue-router';
import isAdmin from '@/helpers/isAdmin';

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login'),
        meta: {
            guest: true,
            layout: 'default'
        }
    },
    {
        path: '/recover-password',
        name: 'recoverPasswordSendMail',
        component: () => import('@/views/RecoverPasswordSendMail'),
        meta: {
            guest: true,
            layout: 'default'
        }
    },
    {
        path: '/recover-password/:hash',
        name: 'recoverPassword',
        component: () => import('@/views/RecoverPassword'),
        meta: {
            guest: true,
            layout: 'default'
        }
    },

    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home'),
        meta: {
            auth: true,
            layout: 'logged'
        }
    },
    {
        path: '/employees',
        name: 'employees',
        component: () => import('@/views/Employees'),
        meta: {
            auth: true,
            admin: true,
            layout: 'logged'
        }
    },
    {
        path: '/contracts',
        name: 'contracts',
        component: () => import('@/views/Contracts'),
        meta: {
            auth: true,
            layout: 'logged'
        }
    },
    {
        path: '/vacations',
        name: 'vacations',
        component: () => import('@/views/Vacations'),
        meta: {
            auth: true,
            layout: 'logged'
        }
    },
    { path: '*', redirect: '/home' }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
        if (!localStorage.user) {
            next({ name: 'login' });
        } else {
            if (to.matched.some(record => record.meta.admin)) {
                isAdmin() ? next() : next({ name: 'home' });
            }
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.user) {
            next({ name: 'home' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
