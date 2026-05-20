<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import {
  DataLine,
  Download,
  Histogram,
  Refresh,
  TrendCharts,
  WarningFilled,
} from '@element-plus/icons-vue'

echarts.use([
  BarChart,
  GaugeChart,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  RadarChart,
  RadarComponent,
  TooltipComponent,
  CanvasRenderer,
])

const trend = [
  { day: '周一', value: 42, tasks: 54, rate: '78%' },
  { day: '周二', value: 58, tasks: 72, rate: '81%' },
  { day: '周三', value: 46, tasks: 63, rate: '73%' },
  { day: '周四', value: 71, tasks: 88, rate: '84%' },
  { day: '周五', value: 84, tasks: 106, rate: '86%' },
  { day: '周六', value: 76, tasks: 94, rate: '82%' },
  { day: '周日', value: 92, tasks: 128, rate: '89%' },
]

const departments = [
  { name: '产品', value: 86, color: '#2563eb' },
  { name: '前端', value: 74, color: '#16a34a' },
  { name: '后端', value: 68, color: '#f59e0b' },
  { name: '测试', value: 57, color: '#ef4444' },
]

const risks = [
  { name: '接口联调延期', level: '高', owner: '周然', status: '处理中' },
  { name: '移动端适配范围扩大', level: '中', owner: '许言', status: '观察' },
  { name: '客户验收脚本缺失', level: '中', owner: '林清', status: '待确认' },
]

const activeBarIndex = ref<number | null>(null)
const maxTrend = computed(() => Math.max(...trend.map((item) => item.value)))

const radarRef = ref<HTMLDivElement>()
const donutRef = ref<HTMLDivElement>()
const comboRef = ref<HTMLDivElement>()
const gaugeRef = ref<HTMLDivElement>()
let charts: echarts.ECharts[] = []

function getThemeColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function initCharts() {
  if (!radarRef.value || !donutRef.value || !comboRef.value || !gaugeRef.value) return

  const radarChart = echarts.init(radarRef.value)
  const axisColor = getThemeColor('--chart-axis-color')
  const labelColor = getThemeColor('--chart-label-color')
  const lineColor = getThemeColor('--chart-line-color')
  const splitColor = getThemeColor('--chart-split-color')
  const areaColor1 = getThemeColor('--chart-area-1')
  const areaColor2 = getThemeColor('--chart-area-2')
  const gaugeTrackColor = getThemeColor('--chart-gauge-track')
  radarChart.setOption({
    color: ['#2563eb', '#f59e0b'],
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: axisColor },
    },
    radar: {
      radius: '64%',
      indicator: [
        { name: '交付效率', max: 100 },
        { name: '质量稳定', max: 100 },
        { name: '协作响应', max: 100 },
        { name: '风险控制', max: 100 },
        { name: '需求清晰', max: 100 },
      ],
      axisName: { color: labelColor, fontSize: 12 },
      splitLine: { lineStyle: { color: lineColor } },
      splitArea: { areaStyle: { color: [areaColor1, areaColor2] } },
      axisLine: { lineStyle: { color: lineColor } },
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [88, 76, 92, 70, 84], name: '本周' },
          { value: [72, 69, 78, 64, 73], name: '上周' },
        ],
        areaStyle: { opacity: 0.18 },
        symbolSize: 5,
      },
    ],
  })

  const donutChart = echarts.init(donutRef.value)
  donutChart.setOption({
    color: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444'],
    tooltip: { trigger: 'item', formatter: '{b}<br/>任务数：{c}<br/>占比：{d}%' },
    legend: {
      bottom: 0,
      textStyle: { color: axisColor },
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '72%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: { formatter: '{b}\n{d}%', color: labelColor },
        data: [
          { value: 38, name: '需求' },
          { value: 46, name: '研发' },
          { value: 24, name: '测试' },
          { value: 12, name: '风险' },
        ],
      },
    ],
  })

  const comboChart = echarts.init(comboRef.value)
  comboChart.setOption({
    color: ['#2563eb', '#16a34a'],
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: axisColor },
    },
    grid: { left: 36, right: 18, bottom: 28, top: 44 },
    xAxis: {
      type: 'category',
      data: trend.map((item) => item.day),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: lineColor } },
      axisLabel: { color: axisColor },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: splitColor } },
      axisLabel: { color: axisColor },
    },
    series: [
      {
        name: '完成任务',
        type: 'bar',
        data: trend.map((item) => item.tasks),
        barWidth: 22,
        itemStyle: { borderRadius: [7, 7, 0, 0] },
      },
      {
        name: '效率指数',
        type: 'line',
        smooth: true,
        data: trend.map((item) => item.value),
        symbolSize: 8,
        lineStyle: { width: 3 },
      },
    ],
  })

  const gaugeChart = echarts.init(gaugeRef.value)
  gaugeChart.setOption({
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        progress: {
          show: true,
          width: 14,
          itemStyle: { color: '#2563eb' },
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, gaugeTrackColor]],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: labelColor,
          fontSize: 30,
          fontWeight: 800,
          offsetCenter: [0, '8%'],
        },
        data: [{ value: 86 }],
      },
    ],
  })

  charts = [radarChart, donutChart, comboChart, gaugeChart]
}

function resizeCharts() {
  charts.forEach((chart) => chart.resize())
}

function refreshCharts() {
  charts.forEach((chart) => chart.dispose())
  charts = []
  initCharts()
}

const themeObserver = new MutationObserver(() => {
  refreshCharts()
})

onMounted(async () => {
  await nextTick()
  initCharts()
  window.addEventListener('resize', resizeCharts)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  themeObserver.disconnect()
  charts.forEach((chart) => chart.dispose())
  charts = []
})
</script>

<template>
  <section class="page">
    <div class="hero-row">
      <div>
        <p class="section-label">数据看板</p>
        <h2>交付趋势、团队负载与风险总览</h2>
        <span>把关键指标做成适合大屏演示的运营视图，支持悬浮查看具体数据。</span>
      </div>
      <div class="action-row">
        <el-button :icon="Refresh">刷新</el-button>
        <el-button type="primary" :icon="Download">导出</el-button>
      </div>
    </div>

    <div class="metric-grid">
      <article>
        <DataLine />
        <span>本周完成</span>
        <strong>128</strong>
        <em>+18.6%</em>
      </article>
      <article>
        <Histogram />
        <span>平均周期</span>
        <strong>2.8 天</strong>
        <em>-0.7 天</em>
      </article>
      <article>
        <WarningFilled />
        <span>阻塞任务</span>
        <strong>7</strong>
        <em class="warn">需关注</em>
      </article>
      <article>
        <TrendCharts />
        <span>成员饱和度</span>
        <strong>73%</strong>
        <em>健康</em>
      </article>
    </div>

    <div class="insight-strip">
      <div>
        <span>关键洞察</span>
        <strong>周五交付峰值最高，周三效率回落，建议提前调配测试资源。</strong>
      </div>
      <el-tag type="success" effect="plain">稳定增长</el-tag>
    </div>

    <div class="data-layout">
      <section class="panel trend-panel">
        <header>
          <h3>近 7 日交付趋势</h3>
          <span class="hint">鼠标悬浮柱体查看任务数、效率与日期</span>
        </header>
        <div class="interactive-bars">
          <div
            v-for="(item, index) in trend"
            :key="item.day"
            class="bar-item"
            :class="{ active: activeBarIndex === index }"
            @mouseenter="activeBarIndex = index"
            @mouseleave="activeBarIndex = null"
          >
            <div class="bar-tooltip">
              <strong>{{ item.tasks }} 个任务</strong>
              <span>效率指数 {{ item.value }}</span>
              <span>交付率 {{ item.rate }}</span>
            </div>
            <div class="bar-track">
              <span :style="{ height: `${(item.value / maxTrend) * 100}%` }"></span>
            </div>
            <em>{{ item.day }}</em>
          </div>
        </div>
      </section>

      <section class="panel chart-panel">
        <header>
          <h3>能力雷达</h3>
        </header>
        <div ref="radarRef" class="echart"></div>
      </section>

      <section class="panel chart-panel">
        <header>
          <h3>任务类型占比</h3>
        </header>
        <div ref="donutRef" class="echart"></div>
      </section>

      <section class="panel chart-panel combo-panel">
        <header>
          <h3>任务量与效率指数</h3>
        </header>
        <div ref="comboRef" class="echart wide"></div>
      </section>

      <section class="panel chart-panel">
        <header>
          <h3>交付健康度</h3>
        </header>
        <div ref="gaugeRef" class="echart"></div>
      </section>

      <section class="panel">
        <header>
          <h3>部门完成率</h3>
        </header>
        <div class="department-list">
          <div v-for="department in departments" :key="department.name">
            <div class="department-title">
              <strong>{{ department.name }}</strong>
              <span>{{ department.value }}%</span>
            </div>
            <el-progress
              :percentage="department.value"
              :stroke-width="9"
              :color="department.color"
              :show-text="false"
            />
          </div>
        </div>
      </section>

      <section class="panel risk-panel">
        <header>
          <h3>风险清单</h3>
          <el-tag type="warning" effect="plain">3 项</el-tag>
        </header>
        <el-table :data="risks" stripe>
          <el-table-column prop="name" label="风险项" min-width="180" />
          <el-table-column prop="level" label="级别" width="90" />
          <el-table-column prop="owner" label="负责人" width="100" />
          <el-table-column prop="status" label="状态" width="110" />
        </el-table>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  padding: 24px 28px 32px;
}

.hero-row,
.action-row,
.panel header,
.department-title,
.insight-strip {
  display: flex;
  align-items: center;
}

.hero-row {
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;

  h2 {
    margin: 2px 0 6px;
    color: var(--color-heading);
    font-size: 28px;
    line-height: 1.18;
    font-weight: 800;
  }

  span {
    color: var(--color-text-muted);
  }
}

.section-label {
  margin: 0;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
}

.action-row {
  gap: 10px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;

  article {
    padding: 18px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--color-card-shadow-hover);
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--color-primary);
  }

  span,
  strong,
  em {
    display: block;
  }

  span {
    margin-top: 12px;
    color: var(--color-text-muted);
    font-size: 13px;
  }

  strong {
    color: var(--color-heading);
    font-size: 28px;
    font-weight: 800;
  }

  em {
    color: #16a34a;
    font-style: normal;
    font-size: 12px;
  }

  .warn {
    color: #ef4444;
  }
}

.insight-strip {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 14px 18px;
  border: 1px solid var(--color-primary-muted);
  border-radius: 8px;
  background: linear-gradient(90deg, var(--color-primary-soft) 0%, var(--color-surface) 100%);

  span,
  strong {
    display: block;
  }

  span {
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 800;
  }

  strong {
    margin-top: 3px;
    color: var(--color-heading);
    font-weight: 800;
  }
}

.data-layout {
  display: grid;
  grid-template-columns: minmax(420px, 1.25fr) minmax(300px, 0.75fr);
  gap: 16px;
}

.panel {
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);

  header {
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0;
    color: var(--color-heading);
    font-size: 17px;
    font-weight: 800;
  }
}

.hint {
  color: var(--color-text-subtle);
  font-size: 12px;
}

.trend-panel,
.combo-panel,
.risk-panel {
  grid-column: span 2;
}

.interactive-bars {
  height: 330px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 18px;
  align-items: end;
  padding-top: 34px;
}

.bar-item {
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 9px;
  height: 100%;
  text-align: center;

  em {
    color: var(--color-text-muted);
    font-style: normal;
    font-size: 12px;
  }

  &.active {
    .bar-track {
      background: var(--color-primary-muted);
      box-shadow: inset 0 0 0 1px var(--color-primary);
    }

    .bar-track span {
      transform: scaleY(1.04);
      background: linear-gradient(180deg, #93c5fd 0%, var(--color-primary) 70%, #1d4ed8 100%);
      box-shadow: 0 14px 28px rgba(37, 99, 235, 0.32);
    }

    .bar-tooltip {
      opacity: 1;
      transform: translate(-50%, -8px);
      pointer-events: auto;
    }
  }
}

.bar-track {
  height: 100%;
  border-radius: 8px;
  background: var(--color-surface-muted);
  display: flex;
  align-items: end;
  overflow: hidden;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;

  span {
    width: 100%;
    min-height: 24px;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(180deg, #60a5fa, var(--color-primary));
    transform-origin: bottom;
    transition:
      height 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
    animation: grow-bar 0.72s ease both;
  }
}

.bar-tooltip {
  position: absolute;
  left: 50%;
  top: -22px;
  z-index: 2;
  min-width: 132px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--chart-tooltip-bg);
  color: #fff;
  text-align: left;
  box-shadow: var(--color-card-shadow-hover);
  opacity: 0;
  transform: translate(-50%, 0);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 12px;
    height: 12px;
    background: var(--chart-tooltip-bg);
    transform: translateX(-50%) rotate(45deg);
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 14px;
    font-weight: 800;
  }

  span {
    margin-top: 3px;
    color: var(--chart-tooltip-text);
    font-size: 12px;
  }
}

.chart-panel {
  min-height: 320px;
}

.echart {
  width: 100%;
  height: 280px;

  &.wide {
    height: 300px;
  }
}

.department-list {
  display: grid;
  gap: 18px;
}

.department-title {
  justify-content: space-between;
  margin-bottom: 8px;

  strong {
    color: var(--color-heading);
    font-weight: 800;
  }

  span {
    color: var(--color-text-muted);
    font-size: 13px;
  }
}

@keyframes grow-bar {
  from {
    transform: scaleY(0.12);
  }

  to {
    transform: scaleY(1);
  }
}

@media (max-width: 1120px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .data-layout {
    grid-template-columns: 1fr;
  }

  .trend-panel,
  .combo-panel,
  .risk-panel {
    grid-column: auto;
  }
}

@media (max-width: 720px) {
  .page {
    padding: 18px 14px 24px;
  }

  .hero-row,
  .insight-strip {
    align-items: flex-start;
    flex-direction: column;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .interactive-bars {
    overflow-x: auto;
    grid-template-columns: repeat(7, 84px);
  }
}
</style>
