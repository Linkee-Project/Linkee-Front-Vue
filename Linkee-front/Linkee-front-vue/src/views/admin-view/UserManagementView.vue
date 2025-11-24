<template>
  <div class="user-management-container">
    <h2 class="page-title">회원관리</h2>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
        <tr>
          <th>회원번호</th>
          <th>이메일</th>
          <th>닉네임</th>
          <th>가입일시</th>
          <th>수정일시</th>
          <th>역할</th>
          <th>활성화여부</th>
          <th>변경</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="n in 10" :key="n">
          <td>{{ n }}</td>
          <td>user0{{ n }}@gmail.com</td>
          <td>유저{{ n }}번임</td>
          <td>2025/11/10</td>
          <td>2025/11/10</td>
          <td>USER</td>
          <td>Y</td>
          <td><button class="change-btn">변경</button></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button v-for="p in 5" :key="p">{{ p }}</button>
    </div>
  </div>
</template>

<style scoped>
.user-management-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.user-table th {
  background: #f0f7ff;
  padding: 12px;
  font-weight: 600;
}

.user-table td {
  background: #fff;
  padding: 14px;
  text-align: center;
  border-radius: 12px;
}

.change-btn {
  padding: 6px 12px;
  border: none;
  background: #e4e4e4;
  border-radius: 12px;
}
.pagination {
  margin-top: 25px;
  text-align: center;
}
.pagination button {
  margin: 0 5px;
  border: none;
  padding: 6px 10px;
  border-radius: 50%;
}
</style>
