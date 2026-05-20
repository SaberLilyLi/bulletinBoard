<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Briefcase,
  Calendar,
  Check,
  Filter,
  Flag,
  PieChart,
  Plus,
  Search,
  VideoPlay,
  Warning,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import EmptyState from '@/components/EmptyState.vue'
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
        title: '整理客户验收问题清单',
        status: 'todo',
        priority: 'high',
        assignee: { name: '林清', avatar: '林' },
        createdAt: new Date('2026-05-21 09:20'),
        updatedAt: new Date('2026-05-21 10:05'),
        tags: ['验收', '客户反馈'],
        progress: 15,
        description: '汇总客户试用反馈，拆分为缺陷、优化和待确认事项。',
      },
      {
        id: 'T-1031',
        title: '补充任务详情字段校验规则',
        status: 'todo',
        priority: 'medium',
        assignee: { name: '周然', avatar: '周' },
        createdAt: new Date('2026-05-20 16:40'),
        updatedAt: new Date('2026-05-21 09:12'),
        tags: ['表单', '校验'],
        progress: 10,
        description: '限制空标题、无负责人、截止时间早于创建时间等异常输入。',
      },
      {
        id: 'T-1042',
        title: '确认移动端看板筛选交互',
        status: 'todo',
        priority: 'low',
        assignee: { name: '高宁', avatar: '高' },
        createdAt: new Date('2026-05-20 14:35'),
        updatedAt: new Date('2026-05-20 17:02'),
        tags: ['移动端', '筛选'],
        progress: 5,
        description: '对齐小屏筛选入口、状态切换和清空条件的交互细节。',
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
        title: '联调任务拖拽状态变更接口',
        status: 'doing',
        priority: 'high',
        assignee: { name: '陈一', avatar: '陈' },
        createdAt: new Date('2026-05-19 16:20'),
        updatedAt: new Date('2026-05-21 10:30'),
        tags: ['看板', '接口联调'],
        progress: 68,
        description: '将拖拽后的目标状态、排序位置和更新时间同步到后端。',
      },
      {
        id: 'T-1029',
        title: '完善团队动态消息订阅',
        status: 'doing',
        priority: 'medium',
        assignee: { name: '许言', avatar: '许' },
        createdAt: new Date('2026-05-20 13:00'),
        updatedAt: new Date('2026-05-21 09:05'),
        tags: ['消息', '协作'],
        progress: 52,
        description: '补齐评论、提及、状态变更三类事件的订阅和已读状态。',
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
        title: '完成工作台首页数据概览',
        status: 'done',
        priority: 'medium',
        assignee: { name: '唐棠', avatar: '唐' },
        createdAt: new Date('2026-05-18 10:15'),
        updatedAt: new Date('2026-05-20 18:20'),
        tags: ['工作台', '数据概览'],
        progress: 100,
        description: '上线欢迎区、快捷入口、重点任务和团队动态模块。',
      },
      {
        id: 'T-1009',
        title: '上线登录页与基础路由',
        status: 'done',
        priority: 'high',
        assignee: { name: '林清', avatar: '林' },
        createdAt: new Date('2026-05-17 09:10'),
        updatedAt: new Date('2026-05-19 12:30'),
        tags: ['登录', '路由'],
        progress: 100,
        description: '完成登录入口、退出返回登录页和后台主框架路由配置。',
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
const detailDrawerVisible = ref(false)
const selectedTask = ref<Task | null>(null)

const detailChecklist = [
  { label: '需求口径已确认', done: true },
  { label: '接口字段已对齐', done: true },
  { label: '异常场景已补充', done: false },
  { label: '验收用例已回归', done: false },
]

const detailActivities = [
  { user: '陈一', action: '同步了接口联调进度', time: '今天 10:24' },
  { user: '许言', action: '补充了消息订阅验收点', time: '今天 09:42' },
  { user: '林清', action: '更新了客户验收问题清单', time: '昨天 18:20' },
]

const newTask = reactive({
  title: '',
  priority: 'medium' as TaskPriority,
  assignee: '林清',
  status: 'todo' as TaskStatus,
})

const filters = reactive({
  keyword: '',
  priority: 'all',
  assignee: 'all',
  status: 'all',
})

const allTasks = computed(() => columns.flatMap((column) => column.tasks))
const totalTasks = computed(() => allTasks.value.length)
const doneTasks = computed(() => columns.find((column) => column.id === 'done')?.tasks.length ?? 0)
const doingTasks = computed(
  () => columns.find((column) => column.id === 'doing')?.tasks.length ?? 0,
)
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

function openCreateDialog(status: TaskStatus = 'todo') {
  newTask.status = status
  dialogVisible.value = true
}

function addTask() {
  if (!newTask.title.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }

  const targetColumn = findColumn(newTask.status)
  if (!targetColumn) return

  const assigneeName = newTask.assignee
  targetColumn.tasks.unshift({
    id: `T-${Math.floor(1100 + Math.random() * 800)}`,
    title: newTask.title.trim(),
    status: newTask.status,
    priority: newTask.priority,
    assignee: { name: assigneeName, avatar: assigneeName.slice(0, 1) },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['待拆分'],
    progress: 0,
    description: '请补充任务背景、验收标准和预计完成时间。',
  })

  newTask.title = ''
  newTask.priority = 'medium'
  newTask.assignee = '林清'
  newTask.status = 'todo'
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

function openTaskDetail(task: Task) {
  selectedTask.value = task
  detailDrawerVisible.value = true
}
</script>

<template>
  <section class="page task-page">
    <div class="hero-row">
      <div>
        <p class="section-label">任务看板</p>
        <h2>跨团队任务流转与 WIP 控制</h2>
        <span>跟踪本周研发任务进展，聚焦交付风险、负责人和关键状态流转。</span>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog()">新建任务</el-button>
    </div>

    <div class="metrics-grid">
      <div class="metric">
        <div class="metric-icon"><Briefcase /></div>
        <div>
          <span>任务总数</span>
          <strong>{{ totalTasks }}</strong>
        </div>
      </div>
      <div class="metric">
        <div class="metric-icon"><VideoPlay /></div>
        <div>
          <span>进行中</span>
          <strong>{{ doingTasks }}</strong>
        </div>
      </div>
      <div class="metric">
        <div class="metric-icon"><PieChart /></div>
        <div>
          <span>交付率</span>
          <strong>{{ deliveryRate }}%</strong>
        </div>
      </div>
      <div class="metric">
        <div class="metric-icon"><Flag /></div>
        <div>
          <span>高优先级</span>
          <strong>{{ allTasks.filter((task) => task.priority === 'high').length }}</strong>
        </div>
      </div>
    </div>

    <section class="filter-panel">
      <el-input
        v-model="filters.keyword"
        class="search-input"
        :prefix-icon="Search"
        placeholder="搜索任务标题、关键词..."
      />
      <div class="filter-group">
        <span>优先级</span>
        <el-select v-model="filters.priority">
          <el-option label="全部" value="all" />
          <el-option label="高优先级" value="high" />
          <el-option label="中优先级" value="medium" />
          <el-option label="低优先级" value="low" />
        </el-select>
      </div>
      <div class="filter-group">
        <span>负责人</span>
        <el-select v-model="filters.assignee">
          <el-option label="全部" value="all" />
          <el-option label="林清" value="林清" />
          <el-option label="陈一" value="陈一" />
          <el-option label="周然" value="周然" />
        </el-select>
      </div>
      <div class="filter-group">
        <span>状态</span>
        <el-select v-model="filters.status">
          <el-option label="全部" value="all" />
          <el-option label="待办" value="todo" />
          <el-option label="进行中" value="doing" />
          <el-option label="已完成" value="done" />
        </el-select>
      </div>
      <el-button :icon="Filter">清空筛选</el-button>
    </section>

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
          <EmptyState
            v-if="column.tasks.length === 0"
            :active="activeDropStatus === column.id"
            @create="openCreateDialog(column.id)"
          />
          <article
            v-else
            v-for="task in column.tasks"
            :key="task.id"
            class="task-card"
            :class="[`priority-${task.priority}`, { 'is-dragging': dragTaskId === task.id }]"
            draggable="true"
            @dblclick="openTaskDetail(task)"
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
            <h3 v-else>{{ task.title }}</h3>

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
        <el-form-item label="任务状态">
          <el-select v-model="newTask.status">
            <el-option
              v-for="column in columns"
              :key="column.id"
              :label="column.title"
              :value="column.id"
            />
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
      双击卡片标题可快速编辑；拖拽卡片到其他列可更新任务状态。
    </div>
    <el-drawer
      v-model="detailDrawerVisible"
      size="420px"
      class="task-detail-drawer"
      destroy-on-close
    >
      <template #header>
        <div class="drawer-title">
          <span>任务详情</span>
          <strong>{{ selectedTask?.id }}</strong>
        </div>
      </template>

      <div v-if="selectedTask" class="detail-body">
        <div class="detail-hero" :class="`priority-${selectedTask.priority}`">
          <el-tag :type="priorityMeta[selectedTask.priority].type" effect="light">
            {{ priorityMeta[selectedTask.priority].label }}优先级
          </el-tag>
          <h2>{{ selectedTask.title }}</h2>
          <p>{{ selectedTask.description }}</p>
        </div>

        <section class="detail-section">
          <h3>任务概览</h3>
          <div class="detail-grid">
            <div>
              <span>负责人</span>
              <strong>{{ selectedTask.assignee.name }}</strong>
            </div>
            <div>
              <span>状态</span>
              <strong>{{ statusMeta[selectedTask.status].label }}</strong>
            </div>
            <div>
              <span>创建时间</span>
              <strong>{{ formatDate(selectedTask.createdAt) }}</strong>
            </div>
            <div>
              <span>更新于</span>
              <strong>{{ formatDate(selectedTask.updatedAt) }}</strong>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <div class="section-heading">
            <h3>完成进度</h3>
            <strong>{{ selectedTask.progress }}%</strong>
          </div>
          <el-progress :percentage="selectedTask.progress" :stroke-width="10" />
        </section>

        <section class="detail-section">
          <h3>标签</h3>
          <div class="detail-tags">
            <el-tag v-for="tag in selectedTask.tags" :key="tag" round>{{ tag }}</el-tag>
            <el-tag type="info" round>本周迭代</el-tag>
            <el-tag type="success" round>本周重点</el-tag>
          </div>
        </section>

        <section class="detail-section">
          <h3>检查项</h3>
          <div class="check-list">
            <label v-for="item in detailChecklist" :key="item.label" class="check-item">
              <el-checkbox :model-value="item.done" disabled />
              <span :class="{ done: item.done }">{{ item.label }}</span>
            </label>
          </div>
        </section>

        <section class="detail-section">
          <h3>协作成员</h3>
          <div class="member-stack">
            <el-avatar>林</el-avatar>
            <el-avatar>陈</el-avatar>
            <el-avatar>周</el-avatar>
            <el-avatar>许</el-avatar>
            <span>4 人参与</span>
          </div>
        </section>

        <section class="detail-section risk-note">
          <strong>风险提示</strong>
          <p>当前任务仍需确认验收口径和联调时间，建议在今日站会同步依赖方进展。</p>
        </section>

        <section class="detail-section">
          <h3>最近动态</h3>
          <el-timeline>
            <el-timeline-item
              v-for="activity in detailActivities"
              :key="activity.action"
              :timestamp="activity.time"
              type="primary"
            >
              <strong>{{ activity.user }}</strong>
              <span>{{ activity.action }}</span>
            </el-timeline-item>
          </el-timeline>
        </section>
      </div>
    </el-drawer>
  </section>
</template>

<style scoped lang="scss">
.page {
  padding: 24px 28px 32px;
  background:
    radial-gradient(circle at 20% 0%, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #f4f7fb 44%, #f7faff 100%);
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
  gap: 16px;
  margin: 24px 0 16px;
}

.metric {
  min-height: 92px;
  padding: 18px 20px;
  border: 1px solid #e4ebf5;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: #d7e6fb;
    box-shadow: 0 16px 34px rgba(37, 99, 235, 0.1);
    transform: translateY(-2px);
  }

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

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #3b82f6;
  box-shadow: inset 0 0 0 1px #e0edff;

  svg {
    width: 26px;
    height: 26px;
  }
}

.filter-panel {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  padding: 18px 20px;
  border: 1px solid #e4ebf5;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 42px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #dbe5f0 inset;
  }
}

.search-input {
  max-width: 360px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;

  > span {
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }

  .el-select {
    flex: 1;
  }
}

.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 18px;
  align-items: start;
}

.kanban-column {
  min-height: 610px;
  padding: 16px;
  border: 1px solid #e2ebf6;
  border-radius: 8px;
  background: rgba(247, 250, 254, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78);
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;

  &.is-active {
    border-color: #2563eb;
    background: #e8f1ff;
    box-shadow:
      inset 0 0 0 1px rgba(37, 99, 235, 0.16),
      0 12px 30px rgba(37, 99, 235, 0.08);
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
  gap: 14px;
}

.task-card {
  position: relative;
  padding: 14px;
  border: 1px solid #e7eef7;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: grab;
  overflow: hidden;
  transform: translateY(0);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    transform 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    // background: #94a3b8;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0));
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease;
  }

  &:hover {
    border-color: #d5e3f4;
    box-shadow:
      0 22px 46px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(37, 99, 235, 0.05);
    transform: translateY(-4px);

    &::after {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
  }

  &.is-dragging {
    opacity: 0.58;
    border-color: #93c5fd;
    box-shadow:
      0 24px 52px rgba(37, 99, 235, 0.22),
      0 0 0 1px rgba(37, 99, 235, 0.2);
    transform: rotate(1deg) scale(0.985);
  }

  // &.priority-high::before {
  //   background: linear-gradient(180deg, #ef4444, #dc2626);
  // }

  // &.priority-medium::before {
  //   background: linear-gradient(180deg, #f59e0b, #d97706);
  // }

  // &.priority-low::before {
  //   background: linear-gradient(180deg, #94a3b8, #64748b);
  // }

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

:deep(.task-detail-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px 22px 16px;
    border-bottom: 1px solid #eef2f7;
  }

  .el-drawer__body {
    padding: 0;
    background: #f7faff;
  }
}

.drawer-title {
  display: grid;
  gap: 4px;

  span {
    color: #172033;
    font-size: 18px;
    font-weight: 800;
  }

  strong {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
  }
}

.detail-body {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.detail-hero,
.detail-section {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.detail-hero {
  position: relative;
  overflow: hidden;
  padding: 18px;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 5px;
    background: #94a3b8;
  }

  &.priority-high::before {
    background: #ef4444;
  }

  &.priority-medium::before {
    background: #f59e0b;
  }

  &.priority-low::before {
    background: #94a3b8;
  }

  h2 {
    margin: 12px 0 8px;
    color: #172033;
    font-size: 22px;
    line-height: 1.28;
    font-weight: 850;
  }

  p {
    margin: 0;
    color: #64748b;
    line-height: 1.65;
  }
}

.detail-section {
  padding: 16px;

  h3 {
    margin: 0 0 12px;
    color: #172033;
    font-size: 15px;
    font-weight: 800;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  div {
    padding: 12px;
    border-radius: 8px;
    background: #f4f7fb;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: #64748b;
    font-size: 12px;
  }

  strong {
    margin-top: 4px;
    color: #172033;
    font-size: 13px;
    font-weight: 800;
  }
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  h3 {
    margin: 0;
  }

  strong {
    color: #2563eb;
    font-weight: 900;
  }
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.check-list {
  display: grid;
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 14px;

  .done {
    color: #94a3b8;
    text-decoration: line-through;
  }
}

.member-stack {
  display: flex;
  align-items: center;

  .el-avatar {
    margin-right: -8px;
    box-shadow: 0 0 0 2px #fff;
  }

  span {
    margin-left: 18px;
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
  }
}

.risk-note {
  background: #fff7ed;

  strong {
    color: #c2410c;
    font-weight: 900;
  }

  p {
    margin: 6px 0 0;
    color: #9a3412;
    line-height: 1.55;
  }
}

:deep(.el-timeline) {
  padding-left: 2px;
}

:deep(.el-timeline-item__content) {
  strong {
    margin-right: 6px;
    color: #172033;
    font-weight: 800;
  }

  span {
    color: #64748b;
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

  .filter-panel {
    flex-wrap: wrap;
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
