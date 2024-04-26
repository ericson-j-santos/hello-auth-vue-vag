import { createRouter, createWebNHashHistory } from "vue-router";
import { usuarioStore } from "@/store/usuarioStore";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },
  {
    path: "/consulta",
    component: () => import("@/layouts/default/DefaultLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/views/Consulta.vue"),
      },
      {
        path: "/retencao/:cpf",
        component: () => import("@/views/demanda/Retencao.vue"),
      },
      {
        path: "/prospeccao/:nsu",
        component: () => import("@/views/demanda/Prospeccao.vue"),
      },
      {
        path: "prospeccao",
        component: () => import("@/views/Prospeccao.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/consulta/test",
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const usuario = usuarioStore();
  const usuarioLogado = usuario.token;
  if (to.path != "/" && usuarioLogado == "") {
    next("/");
  } else {
    next();
  }
});

export default router;
