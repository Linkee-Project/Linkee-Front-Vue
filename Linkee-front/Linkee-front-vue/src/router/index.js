import { createRouter, createWebHistory } from 'vue-router'
import ComponentTest from "@/views/ComponentTest.vue";
import HomeView from "@/views/home-view/HomeView.vue";
import ChatGameListView from "@/views/chat-view/ChatGameListView.vue";
import ChatGameRoom from "@/views/chat-view/ChatGameRoom.vue";
import LoginView from "@/views/login-view/LoginView.vue";
import SignUpView from "@/views/signup-view/SignUpView.vue";
import ProblemListView from '@/views/problem-view/ProblemListView.vue';
import ProblemDetailView from "@/views/problem-view/ProblemDetailView.vue";
import ProblemCreateView from "@/views/problem-view/ProblemCreateView.vue";
import ProblemEditView from "@/views/problem-view/ProblemEditView.vue";

// 공지사항
import NoticeView from "@/views/notice-view/NoticeView.vue";
// NoticeDetail은 lazy-loading 사용 (사용할 때만 로드)
const NoticeDetailView = () => import('@/views/notice-view/NoticeDetailView.vue');

// 마이페이지 관련
import MyPageView from "@/views/mypage/MyPageView.vue";
import QuestionView from "@/views/mypage/QuestionView.vue";
import ProfilePage from "@/components/layout/mypage/profile/ProfilePage.vue";
import InquiryView from '@/views/mypage/InquiryView.vue';
import BookmarkView from '@/views/mypage/BookmarkView.vue';
import HistoryView from '@/views/mypage/HistoryView.vue';
import GradeView from '@/views/mypage/GradeView.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/component-test',
        name: 'ComponentTest',
        component: ComponentTest
    },
    {
        path: '/chat/game/rooms',
        name: 'ChatGameList',
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
    {
        path: '/problem',
        name: 'ProblemList',
        component: ProblemListView,
        meta: { hideSidebar: true },    //사이드바 숨김
    },
    {
        path: '/problem/:id',
        name: 'ProblemDetail',
        component: ProblemDetailView,
        meta: { hideSidebar: true },    //사이드바 숨김
    },
    {
        path: '/problem/create',
        name: 'ProblemCreate',
        component: ProblemCreateView,
        meta: { hideSidebar: true },    //사이드바 숨김
    },
    {
        path: '/problem/:id/edit',
        name: 'ProblemEdit',
        component: ProblemEditView,
        meta: { hideSidebar: true },    //사이드바 숨김
    },




    /* ------------------------------
       공지사항 라우트
    ------------------------------ */
    {
        path: '/notice',
        name: 'Notice',
        component: NoticeView
    },
    {
        path: '/notice/:id',
        name: 'NoticeDetail',
        component: NoticeDetailView // Lazy 로딩
    },

    /* ------------------------------
       마이페이지 라우트
    ------------------------------ */
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
                path: 'inquiry',
                name: 'MyInquiry',
                component: InquiryView,
            },
            {
                path: 'bookmark',
                name: 'MyBookmark',
                component: BookmarkView,
            },
            {
                path: 'history',
                name: 'MyHistory',
                component: HistoryView,
            },
            {
                path: 'grade',
                name: 'MyGrade',
                component: GradeView,
            },
        ]
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
