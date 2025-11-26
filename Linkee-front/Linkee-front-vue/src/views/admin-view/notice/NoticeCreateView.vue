<template>
  <div class="wrapper">
    <div class="card">

      <!-- 상단 헤더 -->
      <div class="header">
        <h2>📢 공지 등록하기</h2>
        <el-button size="small" @click="goBack">뒤로가기</el-button>
      </div>

      <!-- 폼 시작 -->
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="form"
      >
        <!-- 제목 -->
        <el-form-item label="제목" prop="title">
          <el-input
              v-model="form.title"
              placeholder="공지 제목을 입력하세요"
              clearable
          />
        </el-form-item>

        <!-- 내용 -->
        <el-form-item label="내용" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="공지 내용을 입력하세요"
          />
        </el-form-item>

        <!-- 버튼 -->
        <div class="btn-box">
          <el-button type="primary" @click="submitForm">등록하기</el-button>
        </div>
      </el-form>

      <BaseToast ref="toastRef" />

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseToast from "@/components/base/toast/BaseToast.vue";
import { createNotice } from "@/api/noticeApi";

const router = useRouter();
const toastRef = ref(null);

const form = ref({
  title: "",
  content: ""
});

/* 유효성 검사 */
const rules = {
  title: [{ required: true, message: "제목을 입력하세요.", trigger: "blur" }],
  content: [{ required: true, message: "내용을 입력하세요.", trigger: "blur" }]
};

const formRef = ref(null);

/* 제출 */
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    // DTO에 맞게 변환
    const payload = {
      noticeTitle: form.value.title,
      noticeContent: form.value.content
    };

    try {
      await createNotice(payload);

      toastRef.value.showToast("공지사항이 등록되었습니다!");

      setTimeout(() => router.push("/admin/notices"), 800);
    } catch (e) {
      console.error(e);
      toastRef.value.showToast("등록 실패 ⚠️");
    }
  });
};

/* 뒤로가기 */
const goBack = () => router.push("/admin/notices");
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding: 20px;
}

.card {
  background: #ffffff;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>
