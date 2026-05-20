<script setup lang="ts">
import { Delete, Edit, Filter, Plus, Search, Upload } from '@element-plus/icons-vue'

const records = [
  { id: 'OP-001', name: '客户需求导入', type: 'Excel', owner: '林清', status: '成功', time: '2026-05-20 09:12' },
  { id: 'OP-002', name: '任务状态批量更新', type: 'API', owner: '周然', status: '成功', time: '2026-05-20 10:45' },
  { id: 'OP-003', name: '成员工时校验', type: '规则', owner: '许言', status: '待处理', time: '2026-05-20 11:20' },
  { id: 'OP-004', name: '风险项归档', type: '手动', owner: '陈一', status: '失败', time: '2026-05-19 18:03' },
]
</script>

<template>
  <section class="page">
    <div class="hero-row">
      <div>
        <p class="section-label">数据操作</p>
        <h2>导入、筛选、批处理与操作审计</h2>
        <span>适合演示表单、表格、筛选栏、批量操作和状态反馈。</span>
      </div>
      <el-button type="primary" :icon="Upload">导入数据</el-button>
    </div>

    <section class="panel toolbar-panel">
      <el-input placeholder="搜索任务、负责人或操作编号" :prefix-icon="Search" />
      <el-select model-value="all" placeholder="操作类型">
        <el-option label="全部类型" value="all" />
        <el-option label="Excel" value="excel" />
        <el-option label="API" value="api" />
      </el-select>
      <el-button :icon="Filter">筛选</el-button>
      <el-button :icon="Plus" type="primary">新增规则</el-button>
    </section>

    <div class="operation-grid">
      <section class="panel form-panel">
        <header>
          <h3>批量更新任务</h3>
          <el-tag effect="plain">演示表单</el-tag>
        </header>
        <el-form label-position="top">
          <el-form-item label="目标状态">
            <el-segmented
              model-value="doing"
              :options="[
                { label: '待办', value: 'todo' },
                { label: '进行中', value: 'doing' },
                { label: '已完成', value: 'done' },
              ]"
            />
          </el-form-item>
          <el-form-item label="负责人">
            <el-select model-value="林清">
              <el-option label="林清" value="林清" />
              <el-option label="陈一" value="陈一" />
              <el-option label="周然" value="周然" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" model-value="批量同步客户验收前置任务状态。" />
          </el-form-item>
          <el-button type="primary">提交更新</el-button>
        </el-form>
      </section>

      <section class="panel table-panel">
        <header>
          <h3>操作记录</h3>
          <div class="header-actions">
            <el-button size="small" :icon="Edit">编辑</el-button>
            <el-button size="small" :icon="Delete">删除</el-button>
          </div>
        </header>
        <el-table :data="records" stripe>
          <el-table-column type="selection" width="44" />
          <el-table-column prop="id" label="编号" width="95" />
          <el-table-column prop="name" label="名称" min-width="160" />
          <el-table-column prop="type" label="类型" width="90" />
          <el-table-column prop="owner" label="负责人" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="row.status === '成功' ? 'success' : row.status === '失败' ? 'danger' : 'warning'"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间" min-width="160" />
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
.toolbar-panel,
.panel header,
.header-actions {
  display: flex;
  align-items: center;
}

.hero-row {
  justify-content: space-between;
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

.panel {
  border: 1px solid #e4ebf5;
  border-radius: 8px;
  background: #fff;
  padding: 18px;

  header {
    justify-content: space-between;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0;
    color: #172033;
    font-size: 17px;
    font-weight: 800;
  }
}

.toolbar-panel {
  gap: 10px;
  margin-bottom: 16px;

  .el-input {
    max-width: 360px;
  }

  .el-select {
    width: 160px;
  }
}

.operation-grid {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 16px;
}

.header-actions {
  gap: 8px;
}

@media (max-width: 1080px) {
  .toolbar-panel {
    flex-wrap: wrap;
  }

  .operation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
