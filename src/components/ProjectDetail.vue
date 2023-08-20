<template>
  <el-descriptions title="根项目详情" :column="1" border>
    <el-descriptions-item label="项目名称" min-width="150">
      {{ data.entryPackageName }}
    </el-descriptions-item>
    <el-descriptions-item label="版本">
      {{ data.entryVersion }}
    </el-descriptions-item>
    <el-descriptions-item label="分析依赖层数">
      {{ data.depth }}
    </el-descriptions-item>
    <el-descriptions-item label="分析节点数">
      {{ data.nodeCount }}
    </el-descriptions-item>
    <el-descriptions-item label="是否有循环依赖">
      <el-tag :type="data.isCircle ? 'danger' : 'info'">{{
        data.isCircle ? "是" : "否"
      }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="是否有多版本依赖">
      <el-tag :type="data.isMulPackage ? 'danger' : 'info'">{{
        data.isMulPackage ? "是" : "否"
      }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    entryPackageName: string;
    entryVersion: string;
    depth: number;
    isCircle: boolean;
    isMulPackage: boolean;
    nodeCount: number;
  };
}>();

const emit = defineEmits(["refresh"]);
</script>

<style scoped>
.links-box {
  display: flex;
  flex-direction: column;
}
</style>
