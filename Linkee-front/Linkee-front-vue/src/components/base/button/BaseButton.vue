<script setup>
import { computed } from "vue";

const props = defineProps({
  color: { type: String, default: 'white' }, // 'white' | 'gray' | 'orange' | 'emerald' | 'blue'
  size: { type: String, default: 'medium' }, // 'small' | 'medium' | 'large'
  label: { type: String, default: '' },
});

const colorClass = computed(() => {
  switch (props.color) {
    case 'white': return 'btn--white';
    case 'gray': return 'btn--gray';
    case 'orange': return 'btn--orange';
    case 'emerald': return 'btn--emerald';
    case 'blue': return 'btn--blue';
    default: return 'btn--blue';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'btn--small';
    case 'large': return 'btn--large';
    default: return 'btn--medium';
  }
});
</script>

<template>
  <button class="btn" :class="[colorClass, sizeClass]">
    <slot>{{ label }}</slot>
  </button>
</template>



<style scoped>
.btn {
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      filter 0.15s ease,
      background 0.15s ease,
      color 0.15s ease;
}
/*
   흰색 버튼
 */
.btn--white{
  background: white;
  color: black;
  box-shadow: 0 6px 14px rgba(0, 148, 246, 0.1);
}
.btn--white:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 6px 14px rgba(0, 148, 246, 0.3);
}

/*
   회색 버튼
 */
.btn--gray {
  background: linear-gradient(90deg, #e4e4e4, #dadada);
  color: black;
  box-shadow: 0 6px 14px rgba(128, 128, 128, 0.1);
}

.btn--gray:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 10px 30px rgba(128, 128, 128, 0.3);
}

/*
   블루 버튼
 */
.btn--blue {
  background: linear-gradient(90deg, #0094F6, #4FC3FC);
  color: white;
  box-shadow: 0 6px 14px rgba(0, 148, 246, 0.2); /* 기본 그림자 */
}

.btn--blue:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 10px 30px rgba(0, 148, 246, 0.4); /* hover 그림자 */
}



/*
   주황색 버튼
 */
.btn--orange {
  background: linear-gradient(90deg, #FF7B54, #FF977A);
  color: white;
  box-shadow: 0 6px 14px rgba(255, 151, 122, 0.2);
}

.btn--orange:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 10px 30px rgba(255, 151, 122, 0.4);
}

/*
   에메랄드 버튼
 */
.btn--emerald {
  background: linear-gradient(90deg, #00BCD4, #4DD0E1);
  color: white;
  box-shadow: 0 6px 14px rgb(77, 208, 225 ,0.2);
}

.btn--emerald:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 6px 14px rgb(77, 208, 225 ,0.4);
}



/*
   크기
 */
.btn--small {
  min-width: 60px;
  padding: 4px 10px;
  margin: 2px;
  font-size: 10px;
  border-radius: 15px;
}

.btn--medium {
  min-width: 200px;
  min-height: 30px;
  padding: 6px 16px;
  margin: 2px;
  font-size: 12px;
  border-radius: 20px;
}

.btn--large {
  min-width: 300px;
  min-height: 50px;
  padding: 10px 20px;
  margin: 2px;
  font-size: 14px;
  border-radius: 25px;
}
</style>
