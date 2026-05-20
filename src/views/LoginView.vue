<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Check,
  Clock,
  DocumentChecked,
  InfoFilled,
  Lock,
  StarFilled,
  User,
  UserFilled,
  View,
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  account: 'demo@smarttask.cn',
  password: '123456',
  remember: true,
})

const stats = [
  { label: '本周交付', value: '128', icon: DocumentChecked },
  { label: '协作成员', value: '24', icon: UserFilled },
  { label: '准时率', value: '92%', icon: Clock },
]

const highlights = ['任务看板支持拖拽流转与 WIP 控制', '数据看板集成 ECharts 可视化图表', '任务详情抽屉展示完整协作上下文']

function submitLogin() {
  if (!form.account || !form.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    ElMessage.success('登录成功，正在进入工作台')
    router.push('/task-board')
  }, 900)
}
</script>

<template>
  <main class="login-page">
    <section class="brand-section">
      <div class="brand-row">
        <div class="brand-mark">S</div>
        <div>
          <strong>SmartTask</strong>
          <span>团队任务管理平台</span>
        </div>
      </div>

      <div class="brand-copy">
        <p>更高效的协作，更清晰的交付</p>
        <h1>让团队协作更高效，让每一个目标都落地。</h1>
        <span>SmartTask 帮助团队实现任务流转、协作跟踪与数据洞察，让管理更简单，决策更有据，成果更可见。</span>
      </div>

      <div class="stats-row">
        <div v-for="item in stats" :key="item.label">
          <component :is="item.icon" />
          <div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="highlight-panel">
        <div class="highlight-title">
          <span><StarFilled /></span>
          <strong>系统亮点</strong>
        </div>
        <ul>
          <li v-for="item in highlights" :key="item">
            <Check />
            <p>{{ item }}</p>
          </li>
        </ul>
      </div>

      <div class="product-visual" aria-hidden="true">
        <div class="visual-card visual-card-main">
          <span></span>
          <i></i>
        </div>
        <div class="visual-card visual-card-front">
          <em></em>
          <em></em>
          <em></em>
        </div>
        <div class="visual-card visual-card-side"></div>
      </div>
    </section>

    <section class="login-section">
      <div class="login-card">
        <div class="login-title">
          <p>欢迎回来</p>
          <h2>登录 SmartTask</h2>
          <span>使用演示账号即可进入系统</span>
        </div>

        <el-form label-position="top" @submit.prevent>
          <el-form-item label="账号">
            <el-input v-model="form.account" :prefix-icon="User" size="large" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              :prefix-icon="Lock"
              :suffix-icon="View"
              size="large"
              type="password"
              show-password
              @keyup.enter="submitLogin"
            />
          </el-form-item>
          <div class="login-options">
            <el-checkbox v-model="form.remember">记住登录状态</el-checkbox>
            <el-button link type="primary">忘记密码</el-button>
          </div>
          <el-button type="primary" size="large" class="login-button" :loading="loading" @click="submitLogin">
            登录演示系统
          </el-button>
        </el-form>

        <div class="quick-login">
          <InfoFilled />
          <div>
            <span>演示信息</span>
            <p>账号和密码已预填，点击登录即可进入任务看板。</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 55% 45%;
  background: #f6f9ff;
}

.brand-section {
  position: relative;
  min-height: 100vh;
  padding: 52px 68px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 54px;
  overflow: hidden;
  background:
    radial-gradient(circle at 58% 18%, rgba(37, 99, 235, 0.34), transparent 36%),
    radial-gradient(circle at 18% 48%, rgba(59, 130, 246, 0.16), transparent 32%),
    linear-gradient(135deg, #07172f 0%, #0b1f45 48%, #061326 100%);

  &::after {
    content: '';
    position: absolute;
    left: -120px;
    right: 0;
    bottom: -54px;
    height: 210px;
    border-radius: 50% 50% 0 0;
    border-top: 1px solid rgba(59, 130, 246, 0.22);
    box-shadow:
      0 -18px 0 -17px rgba(59, 130, 246, 0.2),
      0 -38px 0 -37px rgba(59, 130, 246, 0.16),
      0 -60px 0 -59px rgba(59, 130, 246, 0.12);
    pointer-events: none;
  }
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 22px;
    font-weight: 900;
  }

  span {
    margin-top: 2px;
    color: #aab8cf;
    font-size: 13px;
  }
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #3b82f6;
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.32);
  font-size: 24px;
  font-weight: 900;
}

.brand-copy {
  position: relative;
  z-index: 1;
  max-width: 680px;

  p {
    margin: 0 0 14px;
    color: #60a5fa;
    font-weight: 900;
  }

  h1 {
    margin: 0;
    max-width: 560px;
    font-size: 46px;
    line-height: 1.12;
    font-weight: 900;
    letter-spacing: 0;
  }

  span {
    display: block;
    margin-top: 18px;
    max-width: 590px;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1.7;
  }
}

.stats-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  max-width: 660px;

  div {
    min-height: 104px;
    padding: 20px 22px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.1),
      0 18px 36px rgba(0, 0, 0, 0.12);
  }

  > div {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  svg {
    width: 26px;
    height: 26px;
    color: #3b82f6;
    flex-shrink: 0;
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 31px;
    line-height: 1;
    font-weight: 900;
  }

  span {
    color: #b9c7dc;
    font-size: 13px;
  }
}

.highlight-panel {
  position: relative;
  z-index: 1;
  max-width: 455px;
  margin-top: 10px;
  padding: 24px 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.07);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 18px 44px rgba(0, 0, 0, 0.18);

  .highlight-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;

    span {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: #2563eb;
    }

    svg {
      width: 17px;
      height: 17px;
      color: #fff;
    }

    strong {
      font-size: 17px;
      font-weight: 900;
    }
  }

  ul {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #e2e8f0;
  }

  svg {
    width: 17px;
    height: 17px;
    color: #22c55e;
    flex-shrink: 0;
  }

  p {
    margin: 0;
  }
}

.product-visual {
  position: absolute;
  right: 56px;
  bottom: 72px;
  width: 310px;
  height: 220px;
  opacity: 0.42;
  pointer-events: none;
}

.visual-card {
  position: absolute;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(37, 99, 235, 0.22), rgba(15, 23, 42, 0.1));
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.42);
  transform: skewY(-23deg) rotate(-1deg);
}

.visual-card-main {
  width: 214px;
  height: 144px;
  right: 50px;
  bottom: 32px;

  span {
    position: absolute;
    left: 24px;
    top: 28px;
    width: 64px;
    height: 64px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.28);
  }

  i {
    position: absolute;
    left: 24px;
    right: 24px;
    top: 18px;
    height: 36px;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.5);
  }
}

.visual-card-front {
  width: 154px;
  height: 108px;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 24px 26px;

  em {
    width: 18px;
    border-radius: 5px 5px 0 0;
    background: #2563eb;

    &:nth-child(1) {
      height: 34px;
    }

    &:nth-child(2) {
      height: 52px;
    }

    &:nth-child(3) {
      height: 74px;
    }
  }
}

.visual-card-side {
  width: 168px;
  height: 96px;
  left: 0;
  bottom: 0;
}

.login-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 48px 48px 132px;
  overflow: hidden;
  background:
    radial-gradient(circle at 76% 15%, rgba(147, 197, 253, 0.3), transparent 23%),
    radial-gradient(circle at 85% 78%, rgba(96, 165, 250, 0.16), transparent 16%),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);

  &::before {
    content: '';
    position: absolute;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    left: 70px;
    top: 12%;
    background: rgba(96, 165, 250, 0.18);
    filter: blur(64px);
  }

  &::after {
    content: '';
    position: absolute;
    width: 260px;
    height: 260px;
    border-radius: 999px;
    right: -90px;
    bottom: 12%;
    background: rgba(59, 130, 246, 0.14);
    filter: blur(48px);
  }
}

.login-section::selection {
  background: #bfdbfe;
}

.login-section :deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #d7dee8 inset;
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(432px, 100%);
  padding: 42px 38px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);

  &::after {
    content: '';
    position: absolute;
    right: -150px;
    top: 52px;
    width: 150px;
    height: 150px;
    background-image: radial-gradient(#93c5fd 1px, transparent 1px);
    background-size: 14px 14px;
    opacity: 0.5;
  }
}

.login-title {
  margin-bottom: 30px;

  p {
    margin: 0 0 6px;
    color: #2563eb;
    font-weight: 800;
  }

  h2 {
    margin: 0;
    color: #172033;
    font-size: 28px;
    font-weight: 900;
  }

  span {
    color: #64748b;
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -2px 0 18px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-weight: 800;
}

.quick-login {
  display: flex;
  gap: 12px;
  margin-top: 34px;
  padding: 18px 20px;
  border-radius: 8px;
  background: #eff6ff;

  div {
    color: #334155;
  }

  svg {
    width: 28px;
    height: 28px;
    color: #2563eb;
    flex-shrink: 0;
  }

  span {
    display: block;
    margin-bottom: 4px;
    color: #2563eb;
    font-size: 14px;
    font-weight: 900;
  }

  p {
    margin: 0;
    line-height: 1.55;
  }
}

@media (max-width: 960px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .brand-section {
    min-height: auto;
    padding: 32px 24px;
    gap: 28px;
  }

  .brand-copy h1 {
    font-size: 34px;
  }

  .login-section {
    min-height: auto;
    padding: 40px 24px;
    justify-content: center;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .product-visual {
    display: none;
  }
}
</style>
