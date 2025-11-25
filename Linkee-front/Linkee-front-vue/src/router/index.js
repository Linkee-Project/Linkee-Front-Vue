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
import MyPageView from "@/views/mypage-view/MyPageView.vue";
import QuestionView from "@/views/mypage-view/QuestionView.vue";
import ProfilePage from "@/components/mypage/profile/ProfilePage.vue";
import InquiryView from '@/views/mypage-view/InquiryView.vue';
import BookmarkView from '@/views/mypage-view/BookmarkView.vue';
import HistoryView from '@/views/mypage-view/HistoryView.vue';
import GradeView from '@/views/mypage-view/GradeView.vue';

// 관리자 페이지 관련
import UserManagementView from '@/views/admin-view/UserManagementView.vue';
import AdminHomeView from "@/views/admin-view/AdminHomeView.vue";
import AdminDashBoard from "@/views/admin-view/AdminDashBoard.vue";
import AdminLoginView from "@/views/login-view/AdminLoginView.vue";
import NoticeManagementView from "@/views/admin-view/notice/NoticeManagementView.vue";
import InquiryManagementView from "@/views/admin-view/inquiry/InquiryManagementView.vue";
import InquiryAnswerView from "@/views/admin-view/inquiry/InquiryAnswerView.vue";
import ReportManagementView from "@/views/admin-view/report/ReportManagementView.vue";
import ReportActionView from "@/views/admin-view/report/ReportActionView.vue";
import NoticeDetailManagementView from "@/views/admin-view/notice/NoticeDetailManagementView.vue";
import NoticeCreateView from "@/views/admin-view/notice/NoticeCreateView.vue";
import NotificationTemplateView from "@/views/admin-view/NotificationTemplateView.vue"
import ProblemManagementView from "@/views/admin-view/ProblemManagementView.vue";


const routes = [
    {
        path: "/",
        redirect: '/login'
    },
    {
        path: "/login",
        name: 'Login',
        component: LoginView
    },
    {
        path: "/admin/login",
        name: 'AdminLogin',
        component: AdminLoginView
    },
    {
        path: "/signup",
        name: 'SignUp',
        component: SignUpView
    },
    {
        path: '/home',
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
    /* ------------------------------
       문제게시판 라우트
    ------------------------------ */
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

    /* ------------------------------
       관리자 페이지 라우트
    ------------------------------ */
    {
        path: "/admin",
        component: AdminHomeView,
        children: [
            {
                path: "",
                name: "AdminDashboard",
                component: AdminDashBoard
            },
            {
                path: "users",
                name: "AdminUsers",
                component: UserManagementView
            },

            {
                path: "notices",
                name: "AdminNotices",
                component: NoticeManagementView
            },
            {
                path: "notices/:id",
                name: "AdminNoticeDetail",
                component: NoticeDetailManagementView
            },
            {
                path: "notices/create",
                name: "AdminNoticeCreate",
                component: NoticeCreateView
            },
            {
                path: "problems",
                name: "AdminProblems",
                component: ProblemManagementView
            },
            {
                path: "templates",
                name: "AdminTemplates",
                component: NotificationTemplateView
            },
            {
                path: "inquiries",
                name: "AdminInquiries",
                component: InquiryManagementView
            },
            {
                path: "inquiries/:id",
                name: "AdminInquiryAnswer",
                component: InquiryAnswerView
            },
            {
                path: "reports",
                name: "AdminReports",
                component: ReportManagementView
            },
            {
                path: "reports/:id",
                name: "AdminReportAction",
                component: ReportActionView
            }
        ]
    }


];


const router = createRouter({
    history: createWebHistory(),
    routes
});


// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem("token");
//
//     if (to.meta.requiresAuth && !token) {
//         return next("/login");        // 로그인 안 됨 → 로그인 페이지로
//     }
//
//     next();
// });

export default router;
