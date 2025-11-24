<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

//전달받은 공지 아이디
const noticeId = Number(route.params.id);
//전달받은 query
const notice = {
  id: noticeId,
  title: route.query.title || "제목 없음",
  writer: route.query.writer || "관리자",
  date: route.query.date || "-",
  viewCount: route.query.viewCount || 0,
  content:
      `안녕하세요, Linkee 운영팀입니다.
       해당 공지의 내용은 서버에서 받아오도록 변경될 예정입니다.`.trim()
};
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