import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/HomeView.vue";
import ChatGameListView from "@/views/chat-view/ChatGameListView.vue";
import ProblemListView from '@/views/problem-view/ProblemListView.vue';


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
    {
        path: '/chat/game/rooms',
        name : 'ChatGameList',
        component: ChatGameListView
    },
    {
        path: '/problem',
        name: 'problem-list',
        component: ProblemListView,
        meta: { hideSidebar: true },    //사이드바 숨김
    }



];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
