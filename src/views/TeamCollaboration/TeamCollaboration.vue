<script setup lang="ts">
import { ChatDotRound, Clock, Connection, DocumentChecked, Promotion } from '@element-plus/icons-vue'

const members = [
  { name: '林清', role: '产品负责人', avatar: '林', status: '在线', load: 78 },
  { name: '陈一', role: '前端工程师', avatar: '陈', status: '专注', load: 64 },
  { name: '周然', role: '后端工程师', avatar: '周', status: '在线', load: 71 },
  { name: '许言', role: '交互设计师', avatar: '许', status: '会议中', load: 52 },
]

const activities = [
  { user: '陈一', action: '将任务 T-1018 移动到进行中', time: '10:30' },
  { user: '许言', action: '评论了协作消息提醒样式', time: '09:42' },
  { user: '林清', action: '更新了本周里程碑目标', time: '昨天 18:20' },
  { user: '周然', action: '完成了权限矩阵接口评审', time: '昨天 16:05' },
]

const channels = [
  { name: '产品研发周会', unread: 3, type: '项目' },
  { name: '交互走查', unread: 1, type: '设计' },
  { name: '上线风险同步', unread: 0, type: '发布' },
]
</script>

<template>
  <section class="page">
    <div class="hero-row">
      <div>
        <p class="section-label">团队协作</p>
        <h2>成员状态、讨论频道与实时动态</h2>
        <span>展示团队负载、协作消息、会议纪要和项目动态聚合。</span>
      </div>
      <el-button type="primary" :icon="Promotion">发起同步</el-button>
    </div>

    <div class="collab-layout">
      <section class="panel team-panel">
        <header>
          <h3>团队成员</h3>
          <el-tag effect="plain">4 人在线</el-tag>
        </header>
        <div class="member-list">
          <article v-for="member in members" :key="member.name" class="member-row">
            <el-avatar :size="42">{{ member.avatar }}</el-avatar>
            <div class="member-main">
              <strong>{{ member.name }}</strong>
              <span>{{ member.role }}</span>
              <el-progress :percentage="member.load" :stroke-width="7" :show-text="false" />
            </div>
            <el-tag size="small" :type="member.status === '会议中' ? 'warning' : 'success'">
              {{ member.status }}
            </el-tag>
          </article>
        </div>
      </section>

      <section class="panel focus-panel">
        <header>
          <h3>今日重点</h3>
          <el-icon><DocumentChecked /></el-icon>
        </header>
        <div class="focus-grid">
          <div>
            <strong>12</strong>
            <span>待确认事项</span>
          </div>
          <div>
            <strong>5</strong>
            <span>风险提醒</span>
          </div>
          <div>
            <strong>86%</strong>
            <span>目标完成度</span>
          </div>
        </div>
        <el-timeline>
          <el-timeline-item timestamp="11:00" type="primary">任务流转交互走查</el-timeline-item>
          <el-timeline-item timestamp="14:30" type="warning">上线前风险复盘</el-timeline-item>
          <el-timeline-item timestamp="17:00" type="success">本周交付范围确认</el-timeline-item>
        </el-timeline>
      </section>

      <section class="panel channel-panel">
        <header>
          <h3>协作频道</h3>
          <el-icon><ChatDotRound /></el-icon>
        </header>
        <div v-for="channel in channels" :key="channel.name" class="channel-row">
          <div>
            <strong>{{ channel.name }}</strong>
            <span>{{ channel.type }}</span>
          </div>
          <el-badge :value="channel.unread" :hidden="channel.unread === 0">
            <el-button size="small">进入</el-button>
          </el-badge>
        </div>
      </section>

      <section class="panel activity-panel">
        <header>
          <h3>实时动态</h3>
          <el-icon><Connection /></el-icon>
        </header>
        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.action" class="activity-row">
            <Clock />
            <div>
              <strong>{{ activity.user }}</strong>
              <span>{{ activity.action }}</span>
            </div>
            <em>{{ activity.time }}</em>
          </div>
        </div>
      </section>
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
  margin-bottom: 22px;

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

.collab-layout {
  display: grid;
  grid-template-columns: minmax(320px, 1.2fr) minmax(280px, 0.8fr);
  gap: 16px;
}

.panel {
  border: 1px solid #e4ebf5;
  border-radius: 8px;
  background: #fff;
  padding: 18px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  h3 {
    margin: 0;
    color: #172033;
    font-size: 17px;
    font-weight: 800;
  }
}

.member-list,
.activity-list {
  display: grid;
  gap: 12px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.member-main {
  flex: 1;
  min-width: 0;

  strong,
  span {
    display: block;
  }

  strong {
    color: #172033;
    font-weight: 800;
  }

  span {
    margin-bottom: 8px;
    color: #64748b;
    font-size: 13px;
  }
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;

  div {
    padding: 14px 12px;
    border-radius: 8px;
    background: #f1f5fb;
  }

  strong,
  span {
    display: block;
  }

  strong {
    color: #172033;
    font-size: 24px;
    font-weight: 800;
  }

  span {
    color: #64748b;
    font-size: 12px;
  }
}

.channel-row,
.activity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #edf2f7;

  &:last-child {
    border-bottom: 0;
  }

  strong,
  span {
    display: block;
  }

  strong {
    color: #172033;
    font-weight: 800;
  }

  span {
    color: #64748b;
    font-size: 13px;
  }
}

.activity-row {
  justify-content: flex-start;

  svg {
    width: 18px;
    height: 18px;
    color: #2563eb;
    flex-shrink: 0;
  }

  div {
    flex: 1;
  }

  em {
    color: #94a3b8;
    font-style: normal;
    font-size: 12px;
  }
}

@media (max-width: 960px) {
  .collab-layout {
    grid-template-columns: 1fr;
  }
}
</style>
