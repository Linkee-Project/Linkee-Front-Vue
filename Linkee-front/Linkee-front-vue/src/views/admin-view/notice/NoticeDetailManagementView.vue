<template>
  <div class="detail-wrapper">
    <div class="detail-container">

      <!-- 헤더 -->
      <div class="detail-header">
        <h2>공지 상세보기</h2>
        <div class="header-buttons">
          <button class="btn-edit" @click="editMode = !editMode">
            {{ editMode ? "수정 취소" : "수정" }}
          </button>
          <button class="btn-back" @click="goBack">뒤로가기</button>
        </div>
      </div>

      <!-- 내용 카드 -->
      <div class="detail-card">

        <!-- 한 줄(제목, 등록일시, 수정일시) -->
        <div class="row-group">
          <div class="form-group small">
            <label>제목</label>
            <input
                v-if="editMode"
                v-model="notice.title"
                class="input-box"
            />
            <p v-else>{{ notice.title }}</p>
          </div>
        </div>

        <!-- 관리자 / 조회수 -->
        <div class="row-group">
          <div class="form-group small">
            <label>작성 관리자</label>
            <p>{{ notice.admin }}</p>
          </div>

          <div class="form-group small">
            <label>등록일시</label>
            <p>{{ notice.reg }}</p>
          </div>

          <div class="form-group small">
            <label>수정일시</label>
            <p>{{ notice.mod }}</p>
          </div>

          <div class="form-group small">
            <label>조회수</label>
            <p>{{ notice.views }}</p>
          </div>
        </div>

        <!-- 내용 -->
        <div class="form-group">
          <label>내용</label>

          <textarea
              v-if="editMode"
              v-model="notice.content"
              class="textarea-box"
          />

          <p v-else class="content-box">
            {{ notice.content }}
          </p>
        </div>

        <!-- 저장 버튼 -->
        <button v-if="editMode" class="btn-save" @click="saveEdit">
          수정 저장
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
import { fetchNoticeDetail } from "@/api/noticeApi";

const route = useRoute();
const router = useRouter();
const toastRef = ref(null);

/* 수정 모드 */
const editMode = ref(false);

/* 상세 정보 */
const notice = ref({
  id: null,
  title: "",
  admin: "",
  reg: "",
  mod: "",
  views: 0,
  content: "",
});

//공지사항 상세조회 API호출
const loadDetail = async () => {
  try {
    const id = route.params.id;

    const res = await fetchNoticeDetail(id);

    notice.value = {
      id,
      title: res.noticeTitle,
      content: res.noticeContent,
      views: res.noticeViews,
      reg: res.createdAt,
      admin: res.adminName,
      mod: res.updatedAt ?? "-",
    };
  }catch (e) {
    console.error(e);
    toastRef.value.showToast("공지 상세 조회 실패");
  }
}

onMounted(() => {
  loadDetail();
});

const goBack = () => {
  router.push("/admin/notices");
};

const saveEdit = () => {
  editMode.value = false;
  toastRef.value.showToast("공지사항이 수정되었습니다!");
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

.header-buttons {
  display: flex;
  gap: 10px;
}

/* 한 줄 row */
.row-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group.small {
  flex: 1;
}

/* 버튼 */
.btn-edit,
.btn-back,
.btn-save {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-edit {
  background: #5ab0ff;
  color: white;
}
.btn-edit:hover {
  background: #429eee;
}

.btn-back {
  background: #ffffff;
  color: #5a5a5a;
  border: 1px solid #cdd4e0;
}
.btn-back:hover {
  background: #eaf4ff;
}

.btn-save {
  margin-top: 20px;
  background: #43cc6d;
  color: white;
}
.btn-save:hover {
  background: #34b55d;
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

.input-box,
.textarea-box {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cfd7e3;
  background: #f7faff;
  font-size: 15px;
}

.textarea-box {
  height: 140px;
  resize: none;
}

/* 📌 내용 스크롤 처리 */
.content-box {
  white-space: pre-line;
  background: #fafcff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eef2f7;
  max-height: 200px;     /* 최대 높이 */
  overflow-y: auto;      /* 스크롤 */
}
</style>
