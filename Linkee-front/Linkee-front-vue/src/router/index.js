import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/home-view/HomeView.vue";
import ChatGameListView from "@/views/chat-view/ChatGameListView.vue";
import ChatGameRoom from "@/views/chat-view/ChatGameRoom.vue";
import LoginView from "@/views/login-view/LoginView.vue";
import SignUpView from "@/views/signup-view/SignUpView.vue";
import MyPageView from "@/views/mypage/MyPageView.vue";
import QuestionView from '../views/mypage/QuestionView.vue'
import ProfilePage from "@/components/layout/mypage/profile/ProfilePage.vue";
import InquiryView from '@/views/mypage/InquiryView.vue'
import BookmarkView from '@/views/mypage/BookmarkView.vue'


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
        path: "/signup",
        name: 'SignUp',
        component: SignUpView
    },
    },
    {
        path: '/mypage',
        name: 'MyPage',
        component: MyPageView,
        redirect: '/mypage/profile',
        children: [
            {
                path: 'profile',
                name: 'MyProfile',
                component: ProfilePage,
            },
            {
                path: 'questions',
                name: 'MyQuestions',
                component: QuestionView,
            },
            {
                path: 'inquiry', // 경로를 'inquiry'로 설정 (오타 수정됨)
                name: 'MyInquiry',
                component: InquiryView, // InquiryView 연결
            },
            // --- '나의 북마크 조회' 실제 경로 추가 ---
            {
                path: 'bookmark', // 경로를 'bookmark'로 설정
                name: 'MyBookmark',
                component: BookmarkView, // BookmarkView 연결
            },
            // --- 아래는 나중에 구현할 페이지들을 위한 임시 경로 (업데이트) ---
            {
                path: 'history',
                name: 'MyHistory',
                component: ProfilePage, // 임시로 ProfilePage 연결
            },
        ]
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
