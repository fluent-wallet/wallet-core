<script setup>
import { computed } from 'vue';

const props = defineProps({
  lang: {
    type: String,
    default: 'en'
  },
  modelValue: {
    type: String,
    default: 'React'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
});
</script>

<template>
  <div class="selector">
    <span>{{ lang === 'zh' ? '选择你的前端框架：' : 'Pick your frontend framework:' }}</span>
    <select v-model="selected">
      <option value="React">React</option>
      <option value="Vue3">Vue3</option>
      <option value="Svelte">Svelte</option>
    </select>
  </div>
</template>

<style module>
.selector {
  margin: 1rem 0;
}

select {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: #606266;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
}

select:hover {
  border-color: #c0c4cc;
}

select:focus {
  border-color: #409eff;
}
</style>