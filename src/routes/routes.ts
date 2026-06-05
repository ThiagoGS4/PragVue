import { createRouter, createWebHistory } from "vue-router"

const routes = [
    { path: "/", name: "Login", component: () => import("../views/Login.vue") },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
    },
    /* {
        path: "/rooms",
        name: "Rooms",
        component: () => import("../views/Rooms.vue"),
        meta: { requiresAuth: true },
    }, */
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to) => {
    //const resp = await authService.checkAuth() pedir p samuel rota simples para fazer check de autenticação
/*     if (resp === "Not authenticated" && to.meta.requiresAuth) {
        return {
            name: "Login",
            query: { redirect: to.fullPath },
        }
        //router.push({name: 'Login'})
    } */
})
