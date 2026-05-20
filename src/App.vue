<script setup lang="ts">
import {
  Bell,
  DataAnalysis,
  Files,
  Grid,
  House,
  Moon,
  Operation,
  Sunny,
  SwitchButton,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const navItems = [
  { path: '/home', label: '工作台', icon: House },
  { path: '/task-board', label: '任务看板', icon: Grid },
  { path: '/team-collaboration', label: '团队协作', icon: User },
  { path: '/data-board', label: '数据看板', icon: TrendCharts },
  { path: '/data-operation', label: '数据操作', icon: Operation },
]

const route = useRoute()
const router = useRouter()
const theme = ref<'light' | 'dark'>('light')
const themeIcon = computed(() => (theme.value === 'dark' ? Sunny : Moon))
const themeLabel = computed(() => (theme.value === 'dark' ? '日间模式' : '夜间模式'))

function applyTheme(value: 'light' | 'dark') {
  const root = document.documentElement
  root.dataset.theme = value
  root.classList.toggle('dark', value === 'dark')
  localStorage.setItem('smart-task-theme', value)
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function logout() {
  router.push('/login')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('smart-task-theme')
  const preferredTheme =
    savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

  theme.value = preferredTheme
  applyTheme(preferredTheme)
})

watch(theme, applyTheme)
</script>

<template>
  <div v-if="route.path === '/login'" class="login-shell">
    <el-tooltip :content="themeLabel">
      <el-button class="login-theme-toggle" :icon="themeIcon" circle @click="toggleTheme" />
    </el-tooltip>
    <RouterView />
  </div>

  <div v-else class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">S</div>
        <div>
          <strong>SmartTask</strong>
          <span>企业协作驾驶舱</span>
        </div>
      </div>

      <el-menu
        :default-active="route.path"
        class="side-menu"
        router
        background-color="transparent"
        text-color="var(--color-sidebar-text)"
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
          <el-button :icon="themeIcon" @click="toggleTheme">{{ themeLabel }}</el-button>
          <el-button :icon="Files">周报</el-button>
          <el-button :icon="Bell" circle />
          <el-dropdown trigger="click" @command="logout">
            <button class="avatar-trigger" type="button">
              <el-avatar :size="36">林</el-avatar>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  background: var(--color-sidebar-bg);
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
    color: var(--color-sidebar-muted);
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
  background: var(--color-background);
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
}

.topbar {
  height: 76px;
  padding: 0 28px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;

  h1 {
    margin: 2px 0 0;
    color: var(--color-heading);
    font-size: 22px;
    line-height: 1.2;
    font-weight: 750;
  }
}

.eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-trigger {
  display: grid;
  place-items: center;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: var(--color-border);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  }
}

.login-shell {
  min-height: 100vh;
}

.login-theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 20;
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
