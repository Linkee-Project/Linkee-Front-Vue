<template>
  <div class="detail-wrapper">
    <div class="detail-container">

      <!-- 헤더 -->
      <div class="detail-header">
        <h2>신고 상세보기</h2>

        <button class="btn-back" @click="goBack">
          뒤로가기
        </button>
      </div>

      <!-- 카드 -->
      <div class="detail-card">

        <!-- 제목 -->
        <div class="row-group">
          <div class="form-group small">
            <label>신고 제목</label>
            <p>{{ report.title }}</p>
          </div>
        </div>

        <!-- 신고자 / 신고대상 / 신고유형 -->
        <div class="row-group">
          <div class="form-group small">
            <label>신고자</label>
            <p>{{ report.reporter }}</p>
          </div>

          <div class="form-group small">
            <label>신고 대상</label>
            <p>{{ report.target }}</p>
          </div>

          <div class="form-group small">
            <label>신고 유형</label>
            <p>{{ report.type }}</p>
          </div>
        </div>

        <!-- 신고 내용 -->
        <div class="form-group">
          <label>신고 내용</label>
          <p class="content-box">
            {{ report.content }}
          </p>
        </div>

        <!-- 기존 처리내용 표시 -->
        <div v-if="report.process" class="form-group">
          <label>등록된 처리 내용</label>
          <p class="answer-box">
            {{ report.process }}
          </p>
        </div>

        <!-- 처리 내용 입력 -->
        <div class="form-group">
          <label>처리 내용 입력</label>

          <el-form :model="processForm" class="answer-form">
            <el-form-item prop="process">
              <el-input
                  type="textarea"
                  v-model="processForm.process"
                  :rows="6"
                  placeholder="신고 처리 내용을 입력해주세요."
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 처리완료 버튼 -->
        <button class="btn-save" @click="saveProcess">
          처리 완료
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

/* 신고 상세 데이터 */
const report = ref({
  id: null,
  title: "",
  reporter: "",
  target: "",
  type: "",
  content: "",
  process: "",  // 처리내용
});

/* 입력 폼 */
const processForm = ref({
  process: "",
});

/* 데이터 로딩 */
onMounted(() => {
  const id = route.params.id;

  // 실제 API라면 GET
  report.value = {
    id,
    title: `신고사항 ${id}번 제목`,
    reporter: "유저3번",
    target: "유저7번",
    type: "채팅",
    content: `
신고 내용이 이곳에 표시됩니다.
신고자가 작성한 신고 상세 내용이며,
스크롤이 가능하도록 처리되어 있습니다.
    `,
    process: "", // 처음엔 비어있음
  };
});

/* 처리 저장 */
const saveProcess = () => {
  if (!processForm.value.process.trim()) {
    toastRef.value.showToast("처리 내용을 입력해주세요.");
    return;
  }

  // 실제 API POST 처리
  report.value.process = processForm.value.process;

  toastRef.value.showToast("신고가 처리완료되었습니다!");

  // 입력창 초기화
  processForm.value.process = "";
};

/* 뒤로가기 */
const goBack = () => {
  router.push("/admin/reports");
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

/* 내용 박스 */
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

/* 처리내용 표시 */
.answer-box {
  background: #f0fff5;
  border-color: #d4f5da;
}

/* element textarea */
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
