import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";


const routes = [
// {} 라우터 설정
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
