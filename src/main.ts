import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";

// 导入视图组件
import Home from "./views/Home.vue";
import Difficulty from "./views/Difficulty.vue";
import Game from "./views/Game.vue";
import Result from "./views/Result.vue";

// 创建路由配置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home },
    { path: "/difficulty", component: Difficulty },
    { path: "/game", component: Game },
    { path: "/result", component: Result },
  ],
});

// 创建状态管理实例
const pinia = createPinia();
const app = createApp(App);

// 挂载插件和应用
app.use(router);
app.use(pinia);
app.mount("#app");
