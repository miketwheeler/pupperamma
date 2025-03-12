/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (!localStorage.getItem('vuetify:dynamic-reload')) {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        } else {
            console.error('Dynamic import error, reloading page did not fix it', err)
        }
    } else {
        console.error(err)
    }
});

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
});

let isFirstRoute = true;

// programmically add auth requirements to the routes
routes.forEach(route => {
    if (route.path === '/' || route.path === '/favorites') {
        if (route.meta) route.meta.requiresAuth = true;
    }
});

// redirect to login if not authed
router.beforeEach(async (to, from, next) => {
    if (isFirstRoute) {
        isFirstRoute = false;

        const { useAppStore } = await import('../stores/app');
        const appStore = useAppStore();
        const isAuthenticated = appStore.isAuthExpired;

        if (!isAuthenticated && to.meta.requiresAuth) {
            next('/login');
        } else {
            next();
        }
    }
    else {
        next();
    }
});

export default router
