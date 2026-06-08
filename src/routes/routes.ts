import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/authStore"
import { useCookies } from "vue3-cookies"

const { cookies } = useCookies()

const routes = [
  { path: "/", name: "Login", component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue") },
  { path: "/home", name: "Home", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
  { path: "/agendamentos", name: "Agendamentos", component: () => import("../views/Agendamentos.vue"), meta: { requiresAuth: true } },
    {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  const isPublic = to.name === "Login" || to.name === "Register"
  const hasRefreshToken = !!cookies.get("refreshToken")
  const hasAccessToken = !!cookies.get("accessToken")

  if (!authStore.isAuthenticated && (hasAccessToken || hasRefreshToken)) {
    try {
      await authStore.checkAuth()
    } catch {
      authStore.logout?.()
    }
  }

  if (authStore.isAuthenticated && isPublic) {
    return { name: "Home" }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "Login",
      query: { redirect: to.fullPath },
    }
  }

  return true
})