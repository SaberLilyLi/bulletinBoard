<script setup lang="ts">
import { Tickets } from '@element-plus/icons-vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    buttonText?: string
    active?: boolean
  }>(),
  {
    title: '暂无任务',
    description: '当前阶段还没有任务，可新建任务或拖拽任务到这里',
    buttonText: '+ 新建任务',
    active: false,
  },
)

defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="empty-state" :class="{ 'is-active': active }">
    <div class="empty-icon">
      <Tickets />
    </div>
    <strong>{{ title }}</strong>
    <p>{{ active ? '松开鼠标，将任务移动到这里' : description }}</p>
    <el-button type="primary" @click="$emit('create')">{{ buttonText }}</el-button>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  min-height: 246px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  text-align: center;
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;

  &.is-active {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
  }

  strong {
    color: #172033;
    font-size: 16px;
    font-weight: 800;
  }

  p {
    max-width: 220px;
    margin: 0 0 6px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.55;
  }
}

.empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: #3b82f6;

  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
