<script setup>
import { defineProps, defineEmits } from 'vue'; // Import defineEmits

const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['show-detail']); // Define 'show-detail' event

const handleClick = () => {
  emit('show-detail', props.history); // Emit event with history object
};
</script>

<template>
  <div class="list-row" @click="handleClick"> <!-- Add click handler -->
    <span class="row-item no">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
    <span class="row-item category">{{ history.category }}</span>
    <span class="row-item title">{{ history.title }}</span>
    <span class="row-item date">{{ history.date }}</span>
  </div>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #333;
}

.list-row:hover {
  background-color: #f9f9f9;
}

.row-item {
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-item.no {
  flex: 0.5;
}
.row-item.category {
  flex: 1.5;
  text-align: left;
  padding-left: 15px;
}
.row-item.title {
  flex: 3;
  text-align: left;
  padding-left: 15px;
}
.row-item.date {
  flex: 1.5;
}

/* 반응형 웹: 화면 너비가 768px 이하일 때 적용 */
@media (max-width: 768px) {
  .list-row {
    font-size: 14px;
    padding: 15px 5px;
  }
}
</style>
