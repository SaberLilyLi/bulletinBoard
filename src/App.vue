<script setup lang="ts">
import {
  Bell,
  DataAnalysis,
  Files,
  Grid,
  Operation,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'

const navItems = [
  { path: '/task-board', label: '任务看板', icon: Grid },
  { path: '/team-collaboration', label: '团队协作', icon: User },
  { path: '/data-board', label: '数据看板', icon: TrendCharts },
  { path: '/data-operation', label: '数据操作', icon: Operation },
]
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">S</div>
        <div>
          <strong>SmartTask</strong>
          <span>企业协作驾驶舱</span>
        </div>
      </div>

      <el-menu
        default-active="/task-board"
        class="side-menu"
        router
        background-color="transparent"
        text-color="#c9d4e5"
        active-text-color="#ffffff"
      >
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>

      <div class="side-summary">
        <DataAnalysis class="summary-icon" />
        <div>
          <strong>本周交付率 86%</strong>
          <span>较上周提升 12%</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <span class="eyebrow">实时协作空间</span>
          <h1>产品研发中心</h1>
        </div>
        <div class="top-actions">
          <el-button :icon="Files">周报</el-button>
          <el-button :icon="Bell" circle />
          <el-avatar :size="36">林</el-avatar>
        </div>
      </header>

      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}

.sidebar {
  width: 244px;
  background: #172033;
  color: #fff;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px 24px;

  strong,
  span {
    display: block;
  }

  strong {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  span {
    margin-top: 2px;
    color: #91a3bd;
    font-size: 12px;
  }
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #3b82f6;
  color: white;
  font-size: 22px;
  font-weight: 800;
}

.side-menu {
  border-right: none;

  :deep(.el-menu-item) {
    height: 44px;
    margin: 4px 0;
    border-radius: 8px;
  }

  :deep(.el-menu-item.is-active) {
    background: #2563eb;
  }
}

.side-summary {
  margin-top: auto;
  padding: 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #e5edff;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  strong,
  span {
    display: block;
  }

  strong {
    font-weight: 700;
    font-size: 13px;
  }

  span {
    margin-top: 4px;
    color: #aebbd0;
    font-size: 12px;
  }
}

.summary-icon {
  width: 22px;
  flex-shrink: 0;
}

.main-content {
  flex: 1 1 0%;
  min-width: 0;
  min-height: 0;
  height: 100vh;
  background: #f4f7fb;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
}

.topbar {
  height: 76px;
  padding: 0 28px;
  background: #fff;
  border-bottom: 1px solid #e6ecf3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;

  h1 {
    margin: 2px 0 0;
    color: #182235;
    font-size: 22px;
    line-height: 1.2;
    font-weight: 750;
  }
}

.eyebrow {
  color: #64748b;
  font-size: 12px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .sidebar {
    width: 72px;
    padding: 14px 8px;
  }

  .brand > div:last-child,
  .side-menu span,
  .side-summary {
    display: none;
  }

  .brand {
    justify-content: center;
    padding: 6px 0 18px;
  }

  .topbar {
    padding: 0 16px;
  }
}
</style>
