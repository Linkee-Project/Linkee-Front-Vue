import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/home-view/HomeView.vue";
import ChatGameListView from "@/views/chat-view/ChatGameListView.vue";
import ChatGameRoom from "@/views/chat-view/ChatGameRoom.vue";
import LoginView from "@/views/login-view/LoginView.vue";
import SignUpView from "@/views/signup-view/SignUpView.vue";
import ProblemListView from '@/views/problem-view/ProblemListView.vue';
import ProblemDetailView from "@/views/problem-view/ProblemDetailView.vue";


const routes = [
// {} 라우터 설정

    /*{
        path: '/',
        redirect: '/login'
    },*/
    {
        path: '/',
        name: 'Home',
        component: HomeView
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
        path: '/game/:roomId',
        name: 'ChatGameRoom',
        component: ChatGameRoom,
        meta: { hideLayout: true }

    },
    {
        path: "/login",
        name: 'Login',
        component: LoginView
    },
    {
        path: "/signUp",
        name: 'SignUp',
        component: SignUpView
    },
    {
        path: '/problem',
        name: 'ProblemList',
        component: ProblemListView,
        meta: { hideSidebar: true },    //사이드바 숨김
    },
    {
        path: '/problem/detail',       // 임시로 detail로 적용, 이후 :id 로 바꿀 예정.
        name: 'ProblemDetail',
        component: ProblemDetailView,
        meta: { hideSidebar: true },    //사이드바 숨김
    }



];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
