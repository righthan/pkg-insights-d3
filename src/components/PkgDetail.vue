<template>
  <el-descriptions
    title="依赖详情"
    :column="1"
    border
  >
    <el-descriptions-item label="包名" min-width="150">
       {{ data.entryPackageName }}
    </el-descriptions-item>
    <el-descriptions-item label="版本">
      {{data.entryVersion}}
    </el-descriptions-item >
    <!-- <el-descriptions-item label="依赖层数">
      {{ data.depth }}
    </el-descriptions-item> -->
    <el-descriptions-item label="是否循环依赖">
        <el-tag :type="data.isCircle ? 'danger': 'info'">{{ data.isCircle?'是':'否' }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="是否多版本">
        <el-tag :type="data.isMulPackage ? 'danger': 'info'">{{ data.isMulPackage?'是':'否' }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="多版本查询">
       <div class="links-box">
        <el-link type="primary"  @click="handleClickLink(item)" :underline="false" v-for="(item, index) in data.mulPackageList" :key="index">{{ item }}</el-link>
       </div>
    </el-descriptions-item>
  </el-descriptions>
  
</template>

<script setup lang="ts">
defineProps<{
  data: {
    entryPackageName: string;
    entryVersion: string;
    isCircle: boolean;
    isMulPackage: boolean;
    mulPackageList: Array<string>
  };
}>();

const emit = defineEmits(['refresh'])
function handleClickLink(item:string){
    console.log('emit');
    
    emit('refresh', item)
}
</script>

<style scoped>
.links-box{
    display: flex;
    flex-direction: column;
}
</style>
