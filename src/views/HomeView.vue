<script setup lang="ts">
import {
  ArrowRight,
  DataAnalysis,
  DocumentChecked,
  Files,
  Grid,
  Operation,
  Plus,
  TrendCharts,
  User,
  Warning,
} from '@element-plus/icons-vue'

const overviewCards = [
  { label: '今日待办', value: '5', description: '待处理任务', icon: DocumentChecked },
  { label: '进行中', value: '2', description: '正在推进', icon: Files },
  { label: '本周交付率', value: '86%', description: '较上周提升 12%', icon: TrendCharts },
  { label: '风险提醒', value: '3', description: '需要关注', icon: Warning },
]

const quickLinks = [
  {
    title: '任务看板',
    description: '查看任务流转与 WIP 控制',
    path: '/task-board',
    icon: Grid,
  },
  {
    title: '团队协作',
    description: '查看成员状态与协作动态',
    path: '/team-collaboration',
    icon: User,
  },
  {
    title: '数据看板',
    description: '查看交付趋势与效率分析',
    path: '/data-board',
    icon: DataAnalysis,
  },
  {
    title: '数据操作',
    description: '管理任务数据与基础配置',
    path: '/data-operation',
    icon: Operation,
  },
]

const focusTasks = [
  {
    title: '开发拖拽排序与跨列移动交互',
    priority: '高优先级',
    priorityClass: 'high',
    owner: '陈一',
    progress: 68,
  },
  {
    title: '设计项目空间成员权限矩阵',
    priority: '中优先级',
    priorityClass: 'medium',
    owner: '周然',
    progress: 42,
  },
  {
    title: '整理移动端任务卡片展示字段',
    priority: '低优先级',
    priorityClass: 'low',
    owner: '高宁',
    progress: 30,
  },
]

const teamActivities = [
  '陈一 将任务移动到进行中',
  '许言 评论了协作消息提醒样式',
  '林清 更新了本周里程碑目标',
  '周然 完成了权限矩阵接口评审',
]
</script>

<template>
  <section class="home-page">
    <section class="welcome-card">
      <div>
        <h2>上午好，林清</h2>
        <p>这里是你的团队协作概览，今天有 3 个重点任务需要关注。</p>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" :icon="Plus">新建任务</el-button>
        <el-button :icon="Files">查看周报</el-button>
      </div>
    </section>

    <section class="overview-grid">
      <article v-for="item in overviewCards" :key="item.label" class="overview-card">
        <div class="card-icon">
          <component :is="item.icon" />
        </div>
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <p>{{ item.description }}</p>
      </article>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <h3>快捷入口</h3>
      </div>
      <div class="quick-grid">
        <router-link v-for="item in quickLinks" :key="item.path" class="quick-card" :to="item.path">
          <div class="quick-icon">
            <component :is="item.icon" />
          </div>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
          <ArrowRight class="quick-arrow" />
        </router-link>
      </div>
    </section>

    <section class="bottom-grid">
      <article class="panel focus-panel">
        <header>
          <h3>今日重点任务</h3>
        </header>
        <div class="task-list">
          <div v-for="task in focusTasks" :key="task.title" class="focus-task">
            <div class="task-top">
              <strong>{{ task.title }}</strong>
              <span>{{ task.progress }}%</span>
            </div>
            <div class="task-meta">
              <el-tag size="small" effect="light" :class="`priority-${task.priorityClass}`">
                {{ task.priority }}
              </el-tag>
              <span>{{ task.owner }}</span>
            </div>
            <el-progress :percentage="task.progress" :stroke-width="7" :show-text="false" />
          </div>
        </div>
      </article>

      <article class="panel activity-panel">
        <header>
          <h3>团队动态</h3>
        </header>
        <div class="activity-list">
          <div v-for="activity in teamActivities" :key="activity" class="activity-item">
            <span></span>
            <p>{{ activity }}</p>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped lang="scss">
.home-page {
  min-height: calc(100vh - 76px);
  padding: 24px 28px 32px;
  background: var(--color-page-bg);
  color: var(--color-text);
}

.welcome-card,
.overview-card,
.quick-card,
.panel {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: var(--color-card-shadow);
}

.home-page .panel {
  border-color: var(--color-border) !important;
  background: var(--color-surface) !important;
  box-shadow: var(--color-card-shadow) !important;
}

.welcome-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 26px 28px;
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-soft) 100%);

  h2 {
    margin: 0;
    color: var(--color-heading);
    font-size: 28px;
    line-height: 1.2;
    font-weight: 850;
  }

  p {
    margin: 8px 0 0;
    color: var(--color-text-muted);
    font-size: 15px;
  }
}

.welcome-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 18px 0 22px;
}

.overview-card {
  min-height: 148px;
  padding: 18px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: var(--color-primary-muted);
    box-shadow: var(--color-card-shadow-hover);
    transform: translateY(-3px);
  }

  span,
  strong,
  p {
    display: block;
  }

  span {
    margin-top: 14px;
    color: var(--color-text-muted);
    font-size: 13px;
  }

  strong {
    margin-top: 4px;
    color: var(--color-heading);
    font-size: 30px;
    line-height: 1.1;
    font-weight: 850;
  }

  p {
    margin: 6px 0 0;
    color: var(--color-text-muted);
    font-size: 13px;
  }
}

.card-icon,
.quick-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--color-primary-soft);
  color: var(--color-primary);

  svg {
    width: 22px;
    height: 22px;
  }
}

.section-block {
  margin-bottom: 22px;
}

.section-heading,
.panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  h3 {
    margin: 0;
    color: var(--color-heading);
    font-size: 18px;
    font-weight: 850;
  }
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.quick-card {
  min-width: 0;
  min-height: 118px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 18px;
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: var(--color-primary-muted);
    box-shadow: var(--color-card-shadow-hover);
    transform: translateY(-3px);
  }

  strong {
    display: block;
    color: var(--color-heading);
    font-size: 16px;
    font-weight: 850;
  }

  p {
    margin: 5px 0 0;
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 1.5;
  }
}

.quick-arrow {
  width: 18px;
  height: 18px;
  color: var(--color-text-subtle);
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
  gap: 16px;
}

.panel {
  padding: 20px;
}

.task-list,
.activity-list {
  display: grid;
  gap: 14px;
}

.focus-task {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
}

.task-top,
.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.task-top {
  strong {
    color: var(--color-heading);
    font-size: 15px;
    font-weight: 850;
  }

  span {
    color: var(--color-primary);
    font-size: 13px;
    font-weight: 800;
  }
}

.task-meta {
  justify-content: flex-start;
  margin: 8px 0 10px;
  color: var(--color-text-muted);
  font-size: 13px;
}

:deep(.priority-high) {
  --el-tag-bg-color: #fef2f2;
  --el-tag-border-color: #fecaca;
  --el-tag-text-color: #dc2626;
}

:deep(.priority-medium) {
  --el-tag-bg-color: #fffbeb;
  --el-tag-border-color: #fde68a;
  --el-tag-text-color: #b45309;
}

:deep(.priority-low) {
  --el-tag-bg-color: #f1f5f9;
  --el-tag-border-color: #cbd5e1;
  --el-tag-text-color: #475569;
}

.activity-item {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 2px 0;

  > span {
    width: 8px;
    height: 8px;
    margin-top: 8px;
    border-radius: 999px;
    background: var(--color-primary);
    box-shadow: 0 0 0 4px var(--color-primary-soft);
  }

  p {
    margin: 0;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (max-width: 1180px) {
  .overview-grid,
  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .home-page {
    padding: 18px 14px 24px;
  }

  .welcome-card {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px 18px;
  }

  .welcome-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .overview-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }

  .quick-card {
    min-height: 104px;
  }
}
</style>
