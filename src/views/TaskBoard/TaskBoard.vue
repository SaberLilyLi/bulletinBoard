<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Calendar, Check, Plus, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Column, Task, TaskPriority, TaskStatus } from '@/types/TaskType'

const priorityMeta: Record<TaskPriority, { label: string; type: 'danger' | 'warning' | 'info' }> = {
  high: { label: '高', type: 'danger' },
  medium: { label: '中', type: 'warning' },
  low: { label: '低', type: 'info' },
}

const statusMeta: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: '待办', color: '#3b82f6' },
  doing: { label: '进行中', color: '#f59e0b' },
  done: { label: '已完成', color: '#16a34a' },
}

const columns = reactive<Column[]>([
  {
    id: 'todo',
    title: '待办',
    wipLimit: 6,
    tasks: [
      {
        id: 'T-1024',
        title: '梳理企业客户任务流转规则',
        status: 'todo',
        priority: 'high',
        assignee: { name: '林清', avatar: '林' },
        createdAt: new Date('2026-05-18 09:30'),
        updatedAt: new Date('2026-05-19 15:10'),
        tags: ['需求', '工作流'],
        progress: 20,
        description: '覆盖新建、派发、验收三个关键节点。',
      },
      {
        id: 'T-1031',
        title: '设计项目空间成员权限矩阵',
        status: 'todo',
        priority: 'medium',
        assignee: { name: '周然', avatar: '周' },
        createdAt: new Date('2026-05-18 11:20'),
        updatedAt: new Date('2026-05-19 10:22'),
        tags: ['权限', '成员'],
        progress: 10,
        description: '按管理员、项目负责人、协作者拆分操作范围。',
      },
      {
        id: 'T-1042',
        title: '整理移动端任务卡片展示字段',
        status: 'todo',
        priority: 'low',
        assignee: { name: '高宁', avatar: '高' },
        createdAt: new Date('2026-05-19 14:35'),
        updatedAt: new Date('2026-05-19 17:02'),
        tags: ['移动端'],
        progress: 5,
        description: '保证小屏下标题、负责人、优先级不拥挤。',
      },
    ],
  },
  {
    id: 'doing',
    title: '进行中',
    wipLimit: 4,
    tasks: [
      {
        id: 'T-1018',
        title: '开发拖拽排序与跨列移动交互',
        status: 'doing',
        priority: 'high',
        assignee: { name: '陈一', avatar: '陈' },
        createdAt: new Date('2026-05-17 16:20'),
        updatedAt: new Date('2026-05-20 10:30'),
        tags: ['看板', '交互'],
        progress: 68,
        description: '拖动时高亮目标列，并在超出 WIP 时阻止移动。',
      },
      {
        id: 'T-1029',
        title: '接入实时协作消息提醒样式',
        status: 'doing',
        priority: 'medium',
        assignee: { name: '许言', avatar: '许' },
        createdAt: new Date('2026-05-18 13:00'),
        updatedAt: new Date('2026-05-20 09:05'),
        tags: ['通知', '协作'],
        progress: 46,
        description: '展示评论、提及、状态变更三类协作事件。',
      },
    ],
  },
  {
    id: 'done',
    title: '已完成',
    wipLimit: 8,
    tasks: [
      {
        id: 'T-1007',
        title: '建立研发任务优先级颜色规范',
        status: 'done',
        priority: 'medium',
        assignee: { name: '唐棠', avatar: '唐' },
        createdAt: new Date('2026-05-15 10:15'),
        updatedAt: new Date('2026-05-18 18:20'),
        tags: ['设计系统'],
        progress: 100,
        description: '高、中、低优先级均已沉淀为统一标签。',
      },
      {
        id: 'T-1009',
        title: '完成基础路由与后台布局',
        status: 'done',
        priority: 'high',
        assignee: { name: '林清', avatar: '林' },
        createdAt: new Date('2026-05-16 09:10'),
        updatedAt: new Date('2026-05-17 12:30'),
        tags: ['布局', '路由'],
        progress: 100,
        description: '侧边栏、顶部栏、内容区已经串联。',
      },
    ],
  },
])

const dialogVisible = ref(false)
const editingId = ref('')
const editingTitle = ref('')
const dragTaskId = ref('')
const dragFromStatus = ref<TaskStatus | ''>('')
const activeDropStatus = ref<TaskStatus | ''>('')

const newTask = reactive({
  title: '',
  priority: 'medium' as TaskPriority,
  assignee: '林清',
})

const allTasks = computed(() => columns.flatMap((column) => column.tasks))
const totalTasks = computed(() => allTasks.value.length)
const doneTasks = computed(() => columns.find((column) => column.id === 'done')?.tasks.length ?? 0)
const doingTasks = computed(() => columns.find((column) => column.id === 'doing')?.tasks.length ?? 0)
const deliveryRate = computed(() => Math.round((doneTasks.value / totalTasks.value) * 100))

function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

function findColumn(status: TaskStatus) {
  return columns.find((column) => column.id === status)
}

function startDrag(task: Task, status: TaskStatus) {
  dragTaskId.value = task.id
  dragFromStatus.value = status
}

function dropTask(targetStatus: TaskStatus) {
  if (!dragTaskId.value || !dragFromStatus.value) return

  const fromColumn = findColumn(dragFromStatus.value)
  const targetColumn = findColumn(targetStatus)
  if (!fromColumn || !targetColumn) return

  const taskIndex = fromColumn.tasks.findIndex((task) => task.id === dragTaskId.value)
  if (taskIndex < 0) return

  if (
    targetStatus !== dragFromStatus.value &&
    targetColumn.wipLimit &&
    targetColumn.tasks.length >= targetColumn.wipLimit
  ) {
    ElMessage.warning(`${targetColumn.title} 已达到 WIP 上限`)
    resetDrag()
    return
  }

  const [task] = fromColumn.tasks.splice(taskIndex, 1)
  if (!task) return
  task.status = targetStatus
  task.updatedAt = new Date()
  targetColumn.tasks.unshift(task)
  ElMessage.success(`已移动到${targetColumn.title}`)
  resetDrag()
}

function resetDrag() {
  dragTaskId.value = ''
  dragFromStatus.value = ''
  activeDropStatus.value = ''
}

function addTask() {
  if (!newTask.title.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }

  const todoColumn = findColumn('todo')
  if (!todoColumn) return

  const assigneeName = newTask.assignee
  todoColumn.tasks.unshift({
    id: `T-${Math.floor(1100 + Math.random() * 800)}`,
    title: newTask.title.trim(),
    status: 'todo',
    priority: newTask.priority,
    assignee: { name: assigneeName, avatar: assigneeName.slice(0, 1) },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['新建'],
    progress: 0,
    description: '演示数据：新建任务会进入待办列。',
  })

  newTask.title = ''
  newTask.priority = 'medium'
  newTask.assignee = '林清'
  dialogVisible.value = false
  ElMessage.success('任务已创建')
}

function startEdit(task: Task) {
  editingId.value = task.id
  editingTitle.value = task.title
}

function saveEdit(task: Task) {
  if (editingTitle.value.trim()) {
    task.title = editingTitle.value.trim()
    task.updatedAt = new Date()
  }
  editingId.value = ''
}
</script>

<template>
  <section class="page task-page">
    <div class="hero-row">
      <div>
        <p class="section-label">任务看板</p>
        <h2>跨团队任务流转与 WIP 控制</h2>
        <span>硬编码演示数据，覆盖任务创建、拖拽移动、优先级、负责人和进度展示。</span>
      </div>
      <el-button type="primary" :icon="Plus" @click="dialogVisible = true">新建任务</el-button>
    </div>

    <div class="metrics-grid">
      <div class="metric">
        <span>任务总数</span>
        <strong>{{ totalTasks }}</strong>
      </div>
      <div class="metric">
        <span>进行中</span>
        <strong>{{ doingTasks }}</strong>
      </div>
      <div class="metric">
        <span>交付率</span>
        <strong>{{ deliveryRate }}%</strong>
      </div>
      <div class="metric">
        <span>高优先级</span>
        <strong>{{ allTasks.filter((task) => task.priority === 'high').length }}</strong>
      </div>
    </div>

    <div class="board">
      <section
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        :class="{ 'is-active': activeDropStatus === column.id }"
        @dragover.prevent="activeDropStatus = column.id"
        @dragleave="activeDropStatus = ''"
        @drop="dropTask(column.id)"
      >
        <header class="column-header">
          <div>
            <span class="status-dot" :style="{ background: statusMeta[column.id].color }"></span>
            <strong>{{ column.title }}</strong>
            <em>{{ column.tasks.length }}</em>
          </div>
          <el-tooltip content="当前列最大任务数">
            <el-tag size="small" effect="plain">WIP {{ column.wipLimit }}</el-tag>
          </el-tooltip>
        </header>

        <div class="task-list">
          <article
            v-for="task in column.tasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="startDrag(task, column.id)"
            @dragend="resetDrag"
          >
            <div class="task-card-top">
              <el-tag :type="priorityMeta[task.priority].type" size="small" effect="light">
                {{ priorityMeta[task.priority].label }}优先级
              </el-tag>
              <el-tag size="small" effect="plain">{{ statusMeta[task.status].label }}</el-tag>
            </div>

            <el-input
              v-if="editingId === task.id"
              v-model="editingTitle"
              class="title-editor"
              size="small"
              autofocus
              @blur="saveEdit(task)"
              @keyup.enter="saveEdit(task)"
            />
            <h3 v-else @dblclick="startEdit(task)">{{ task.title }}</h3>

            <p>{{ task.description }}</p>

            <div class="tag-row">
              <el-tag v-for="tag in task.tags" :key="tag" size="small" round>{{ tag }}</el-tag>
            </div>

            <el-progress :percentage="task.progress" :stroke-width="8" :show-text="false" />

            <footer>
              <div class="assignee">
                <el-avatar :size="28">{{ task.assignee.avatar }}</el-avatar>
                <span>{{ task.assignee.name }}</span>
              </div>
              <span class="date"><Calendar />{{ formatDate(task.createdAt) }}</span>
            </footer>
          </article>
        </div>
      </section>
    </div>

    <el-dialog v-model="dialogVisible" title="新建任务" width="420px">
      <el-form label-position="top">
        <el-form-item label="任务标题">
          <el-input v-model="newTask.title" placeholder="例如：补充任务验收流程" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-segmented
            v-model="newTask.priority"
            :options="[
              { label: '高', value: 'high' },
              { label: '中', value: 'medium' },
              { label: '低', value: 'low' },
            ]"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="newTask.assignee">
            <el-option label="林清" value="林清" />
            <el-option label="陈一" value="陈一" />
            <el-option label="周然" value="周然" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :icon="Check" @click="addTask">创建</el-button>
      </template>
    </el-dialog>

    <div class="tip-line">
      <Warning />
      双击卡片标题可编辑；拖拽卡片到其他列可模拟状态流转。
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  padding: 24px 28px 32px;
}

.hero-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

  h2 {
    margin: 2px 0 6px;
    color: #172033;
    font-size: 28px;
    line-height: 1.18;
    font-weight: 800;
  }

  span {
    color: #64748b;
  }
}

.section-label {
  margin: 0;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 22px 0;
}

.metric {
  padding: 16px 18px;
  border: 1px solid #e4ebf5;
  border-radius: 8px;
  background: #fff;

  span,
  strong {
    display: block;
  }

  span {
    color: #64748b;
    font-size: 13px;
  }

  strong {
    margin-top: 6px;
    color: #172033;
    font-size: 26px;
    font-weight: 800;
  }
}

.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 16px;
  align-items: start;
}

.kanban-column {
  min-height: 610px;
  padding: 14px;
  border: 1px solid #e3eaf4;
  border-radius: 8px;
  background: #edf2f8;
  transition:
    border-color 0.16s ease,
    background 0.16s ease;

  &.is-active {
    border-color: #2563eb;
    background: #e8f1ff;
  }
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  strong {
    color: #172033;
    font-size: 16px;
    font-weight: 800;
  }

  em {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: #fff;
    color: #64748b;
    font-style: normal;
    font-size: 12px;
    font-weight: 700;
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.task-list {
  display: grid;
  gap: 12px;
}

.task-card {
  padding: 14px;
  border: 1px solid #e5edf6;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  h3 {
    margin: 12px 0 8px;
    color: #172033;
    font-size: 16px;
    line-height: 1.35;
    font-weight: 800;
  }

  p {
    min-height: 40px;
    margin: 0 0 12px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.55;
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    color: #64748b;
    font-size: 12px;
  }
}

.task-card-top,
.tag-row,
.assignee,
.date {
  display: flex;
  align-items: center;
}

.task-card-top {
  justify-content: space-between;
}

.tag-row {
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.assignee {
  gap: 7px;
  color: #334155;
  font-weight: 700;
}

.date {
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
}

.title-editor {
  margin: 10px 0;
}

.tip-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  color: #64748b;
  font-size: 13px;

  svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 1180px) {
  .board {
    overflow-x: auto;
    grid-template-columns: repeat(3, 320px);
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .page {
    padding: 18px 14px 24px;
  }

  .hero-row {
    flex-direction: column;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
