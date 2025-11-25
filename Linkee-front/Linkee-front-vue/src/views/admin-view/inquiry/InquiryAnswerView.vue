<template>
  <div class="detail-wrapper">
    <div class="detail-container">

      <!-- 헤더 -->
      <div class="detail-header">
        <h2>문의 답변하기</h2>

        <button class="btn-back" @click="goBack">
          뒤로가기
        </button>
      </div>

      <!-- 카드 -->
      <div class="detail-card">

        <!-- 제목 -->
        <div class="row-group">
          <div class="form-group small">
            <label>제목</label>
            <p>{{ inquiry.title }}</p>
          </div>
        </div>

        <!-- 작성자 / 등록일시 / 담당 관리자 -->
        <div class="row-group">
          <div class="form-group small">
            <label>작성자</label>
            <p>{{ inquiry.user }}</p>
          </div>

          <div class="form-group small">
            <label>등록일시</label>
            <p>{{ inquiry.reg }}</p>
          </div>

          <div class="form-group small">
            <label>담당 관리자</label>
            <p>{{ inquiry.admin }}</p>
          </div>
        </div>

        <!-- 문의 내용 -->
        <div class="form-group">
          <label>문의 내용</label>
          <p class="content-box">
            {{ inquiry.content }}
          </p>
        </div>

        <!-- 기존 답변 표시 -->
        <div v-if="inquiry.answer" class="form-group">
          <label>등록된 답변</label>
          <p class="answer-box">
            {{ inquiry.answer }}
          </p>
        </div>

        <!-- 답변 입력 -->
        <div class="form-group">
          <label>답변 작성</label>

          <el-form :model="answerForm" class="answer-form">
            <el-form-item prop="answer">
              <el-input
                  type="textarea"
                  v-model="answerForm.answer"
                  :rows="6"
                  placeholder="문의에 대한 답변을 작성해주세요."
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 저장 버튼 -->
        <button class="btn-save" @click="saveAnswer">
          답변 등록
        </button>

      </div>

      <BaseToast ref="toastRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseToast from "@/components/base/toast/BaseToast.vue";

const route = useRoute();
const router = useRouter();
const toastRef = ref(null);

/* 문의 데이터 */
const inquiry = ref({
  id: null,
  title: "",
  user: "",
  reg: "",
  admin: "",
  content: "",
  answer: "",     // ★ 추가됨
});

/* 답변 */
const answerForm = ref({
  answer: "",
});

/* 데이터 로딩 */
onMounted(() => {
  const id = route.params.id;

  // 실제 API라면 GET
  inquiry.value = {
    id,
    title: `문의사항 ${id}번 제목`,
    user: "유저1번",
    admin: "관리자1번",
    reg: "2025/11/10",
    content: `
이 부분은 문의 내용입니다.
유저가 작성한 긴 내용이 들어가며
스크롤이 가능하도록 되어 있습니다.
    `,
    answer: "",  // 초기엔 답변 없음
  };
});

/* 답변 저장 */
const saveAnswer = () => {
  if (!answerForm.value.answer.trim()) {
    toastRef.value.showToast("답변 내용을 입력해주세요.");
    return;
  }

  // ★ 저장 (실제로는 API POST)
  inquiry.value.answer = answerForm.value.answer;

  toastRef.value.showToast("답변이 등록되었습니다!");

  // 등록 후 입력창 초기화
  answerForm.value.answer = "";

  /*// 약간의 지연 후 목록 이동
  setTimeout(() => {
    router.push("/admin/inquiries");
  }, 800);*/
};

/* 뒤로가기 */
const goBack = () => {
  router.push("/admin/inquiries");
};
</script>

<style scoped>
.detail-wrapper {
  width: 100%;
  padding: 20px;
}

.detail-container {
  background: #eef6ff;
  padding: 30px;
  border-radius: 14px;
  font-size: 12px;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h2 {
  font-size: 24px;
  font-weight: bold;
}

/* row */
.row-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group.small {
  flex: 1;
}

/* 카드 */
.detail-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-group label {
  font-weight: 600;
  color: #415066;
  display: block;
  margin-bottom: 8px;
}

/* 문의 내용 */
.content-box,
.answer-box {
  white-space: pre-line;
  background: #fafcff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eef2f7;
  max-height: 200px;
  overflow-y: auto;
}

/* 답변 박스 색 구분 */
.answer-box {
  background: #f0fff5;
  border-color: #d4f5da;
}

/* Element form input */
.answer-form .el-input__wrapper {
  background: #f7faff;
  border-radius: 10px;
}

.answer-form textarea {
  padding: 12px;
  font-size: 14px;
}

/* 버튼 */
.btn-back,
.btn-save {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-back {
  background: #ffffff;
  border: 1px solid #cdd4e0;
  color: #5a5a5a;
}
.btn-back:hover {
  background: #eaf4ff;
}

.btn-save {
  margin-top: 20px;
  background: #5ab0ff;
  color: white;
}
.btn-save:hover {
  background: #429eee;
}
</style>
