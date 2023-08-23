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
    <el-descriptions-item label="是否有循环依赖">
        <el-tag :type="data.isCircle ? 'danger': 'info'">{{ data.isCircle?'是':'否' }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="依赖下是否多版本">
        <el-tag :type="data.isMulPackage ? 'danger': 'info'">{{ data.isMulPackage?'是':'否' }}</el-tag>
        <span v-if="data.isMulPackage">
        &nbsp;
        <el-link
          type="success"
          @click="showMulPackage = !showMulPackage"
          :underline="false"
          >查看</el-link
        >
      </span>
    </el-descriptions-item>
  </el-descriptions>
  <div v-show="showMulPackage && data.mulPackageList.length > 0">
    <el-descriptions title="项目下的多版本依赖详情" :column="1" border>
      <el-scrollbar max-height="150px">
        <el-descriptions-item
          v-for="packageArray in data.mulPackageList"
          :label="packageArray[0] != undefined && packageArray[0].split('&')[0]"
        >
          <div class="links-box">
            <el-link
              v-for="node in packageArray"
              type="primary"
              @click="handleClickLink(node)"
              :underline="false"
              :key="node"
              >{{ node.split("&")[1] }}</el-link
            >
          </div>
        </el-descriptions-item>
    </el-scrollbar>
    </el-descriptions>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
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
const showMulPackage = ref(false)
function handleClickLink(item:string){
    emit('refresh', item)
}
</script>

<style scoped>
.links-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
