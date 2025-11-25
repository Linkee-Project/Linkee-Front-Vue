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
            <label>관리자</label>
            <p>{{ report.admin }}</p>
          </div>

          <div class="form-group small">
            <label>신고 유형</label>
            <p>{{ report.type }}</p>
          </div>
        </div>

        <!-- 신고 내용 -->
        <div v-if="!report.process" class="form-group">
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
        <div v-if="!report.process" class="form-group">
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
        <button v-if="!report.process" class="btn-save" @click="saveProcess">
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
import {fetchReportDetail, submitReportProcess} from "@/api/reportApi.js";

const route = useRoute();
const router = useRouter();
const toastRef = ref(null);

//신고유형 매핑
const typeLabelMap = {
  C: "채팅",
  B: "게시글",
  R: "문의",
  U: "유저",
  G: "게임"
};


/* 신고 상세 데이터 */
const report = ref({
  id: null,
  title: "",
  reporter: "",
  target: "",
  type: "",
  content: "",
  process: "",  // 처리내용
  status: ""
});

//입력폼
const processForm = ref({
  process: "",
});

//데이터 로드
onMounted(async () => {
  const id = route.params.id;

  try {
    const data = await fetchReportDetail(id);

    report.value = {
      id,
      title: data.reportTitle,
      reporter:  data.reporterNickname ?? `ID: ${data.reporterId}`,
      target: data.reportedNickname ?? `ID: ${data.reportedId}`,
      admin: data.adminNickname ?? (data.adminId ? `ID: ${data.adminId}` : "-"),
      type: typeLabelMap[data.reportType] ?? data.reportType,
      content: data.reportContent,
      process: data.reportAction,
      status: data.reportStatus
    };

    // 기존 처리 완료된 경우 -> 입력창 비활성화
    if (report.value.process) {
      processForm.value.process = report.value.process;
    }

  } catch (e) {
    console.error(e);
    toastRef.value.showToast("신고 상세 조회 실패 ⚠️");
    router.push("/admin/reports");
  }
});

/* 처리 저장 */
const saveProcess = async () => {
  if (!processForm.value.process.trim()) {
    toastRef.value.showToast("처리 내용을 입력해주세요. ⚠️");
    return;
  }

  try {
    await submitReportProcess(report.value.id, processForm.value.process);

    toastRef.value.showToast("신고가 처리되었습니다! 🎉");

    // 화면 갱신
    report.value.process = processForm.value.process;
    report.value.status = "Y"; // 처리완료로 상태 변경

    // 입력창 비활성화 또는 제거 원한다면 여기도 가능
    // processForm.value.process = "";

  } catch (e) {
    console.error(e);
    toastRef.value.showToast("신고 처리 저장 실패 ⚠️");
  }
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
