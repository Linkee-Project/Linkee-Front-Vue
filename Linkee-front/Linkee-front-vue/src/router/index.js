import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/home-view/HomeView.vue";
import ChatGameListView from "@/views/chat-view/ChatGameListView.vue";
import LoginView from "@/views/login-view/LoginView.vue";
import SignUpView from "@/views/signup-view/SignUpView.vue";


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
        path: "/login",
        name: 'Login',
        component: LoginView
    },
    {
        path: "/signUp",
        name: 'SignUp',
        component: SignUpView
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
