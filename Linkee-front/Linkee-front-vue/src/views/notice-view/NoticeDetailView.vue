<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { fetchNoticeDetail } from "@/api/noticeApi";

const route = useRoute();
const router = useRouter();

const noticeId = Number(route.params.id);

// API로 받아온 공지 상세 데이터
const notice = ref({
  title: "",
  writer: "",
  date: "",
  viewCount: 0,
  content: ""
});

// 날짜 포맷
const formatDate = (date) => {
  return date ? date.replace("T", " ").slice(0, 10) : "-";
};

// 상세 데이터 로드
const loadNoticeDetail = async () => {
  try {
    const data = await fetchNoticeDetail(noticeId);

    notice.value = {
      title: data.noticeTitle,
      writer: data.adminName ?? "관리자",
      date: formatDate(data.createdAt),
      viewCount: data.noticeViews,
      content: data.noticeContent
    };

  } catch (e) {
    console.error(e);
    alert("공지 상세 조회 실패");
    router.push("/notice");
  }
};

onMounted(loadNoticeDetail);
</script>

<template>
  <div class="detail-page">
    <!--제목 + 뒤로가기 -->
    <div class="title-wrapper">
      <button class="back-btn" @click="router.push('/notice')">←</button>
      <div class="title">📢 공지사항</div>
    </div>

    <!-- 내용 박스 -->
    <div class="detail-box">

      <!-- 제목 -->
      <h3 class="detail-title">{{ notice.title }}</h3>

      <!-- 작성자·등록일·조회수 -->
      <div class="info-row">
        <span>작성자 : {{ notice.writer }}</span>
        <span>등록일 : {{ notice.date }}</span>
        <span class="view">조회수 : {{ notice.viewCount }}</span>
      </div>

      <hr class="divider" />

      <!-- 본문 -->
      <pre class="content">{{ notice.content }}</pre>

      <!-- 목록 버튼 -->
      <div class="btn-area">
        <button class="list-btn" @click="router.push('/notice')">목록으로</button>
      </div>

    </div>
  </div>
</template>


<style scoped>
/*전체 레이아웃*/
.detail-page {
  width: 90%;
  padding: 30px 50px;
  margin: 0 auto;
}

/*제목 + 뒤로가기*/
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 17px;
  padding-left: 10px;
}
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 148, 246, 0.2);
  cursor: pointer;
  font-size: 20px;
  color: #0094f6;
  transition: 0.2s;
}
.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 148, 246, 0.3);
}

.title {
  font-size: 22px;
  font-weight: 700;
}

/* 본문 박스 */
.detail-box {
  margin-top: 40px;
  width: 90%;
  background: white;
  padding: 30px 40px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 148, 246, 0.15);
}

/* 제목 */
.detail-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
}

/* 작성자·등록일·조회수 */
.info-row {
  display: flex;
  gap: 30px;
  font-size: 14px;
  color: #444;
}

.view {
  margin-left: auto;
}

/* 구분선 */
.divider {
  margin: 20px 0;
  border: none;
  height: 1px;
  background: #e5e5e5;
}

/* 본문 텍스트 */
.content {
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 14px;
  color: #333;
}

/* 목록 버튼 */
.btn-area {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.list-btn {
  background: linear-gradient(90deg, #0094f6, #4fc3fc);
  border: none;
  padding: 10px 26px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.list-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 148, 246, 0.3);
}
</style>