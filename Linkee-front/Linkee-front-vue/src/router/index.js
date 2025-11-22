import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/HomeView.vue";


const routes = [
// {} 라우터 설정

    {
        path: '/',           // 기본 경로
        name: 'Home',
        component: HomeView // App.vue에서 보여줄 초기 페이지
    },
    {
        path: '/component-test',   // 원하는 URL 경로
        name: 'ComponentTest',
        component: ComponentTest
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
