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
        <!-- 제목 + 관리자명 -->
        <div class="row">
          <el-form-item label="제목" prop="title">
            <el-input
                v-model="form.title"
                placeholder="공지 제목을 입력하세요"
                clearable
            />
          </el-form-item>

          <el-form-item label="작성 관리자" prop="admin">
            <el-input
                v-model="form.admin"
                placeholder="작성자 이름"
                clearable
            />
          </el-form-item>
        </div>

        <!-- 활성 여부 -->
        <div class="row">
          <el-form-item label="활성 여부" prop="active">
            <el-select v-model="form.active" placeholder="선택">
              <el-option label="활성화" value="Y" />
              <el-option label="비활성화" value="N" />
            </el-select>
          </el-form-item>
        </div>

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
import { ElMessage } from "element-plus";
import BaseToast from "@/components/base/toast/BaseToast.vue";

const router = useRouter();
const toastRef = ref(null);

/* 폼 데이터 */
const form = ref({
  title: "",
  admin: "",
  content: "",
  active: "Y"
});

/* 유효성 검사 */
const rules = {
  title: [
    { required: true, message: "제목을 입력하세요.", trigger: "blur" }
  ],
  admin: [
    { required: true, message: "관리자명을 입력하세요.", trigger: "blur" }
  ],
  content: [
    { required: true, message: "내용을 입력하세요.", trigger: "blur" }
  ]
};

const formRef = ref(null);

/* 제출 */
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;

    toastRef.value.showToast("공지사항이 등록되었습니다!");

    setTimeout(() => {
      router.push("/admin/notices");
    }, 800);
  });
};

/* 뒤로가기 */
const goBack = () => {
  router.push("/admin/notices");
};
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

/* 헤더 */
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

/* 행 스타일 */
.row {
  display: flex;
  gap: 20px;
}

/* 버튼 정렬 */
.btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>
