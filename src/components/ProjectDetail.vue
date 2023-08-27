<template>
  <el-descriptions title="根项目详情" :column="1" border>
    <el-descriptions-item label="项目名称" min-width="150">
      <!-- {{ data.entryPackageName }} -->
      <el-link type="primary" @click="handleClickLink(getRootProjectFullname())" :underline="false">{{
        data.entryPackageName
      }}</el-link>
    </el-descriptions-item>
    <el-descriptions-item label="版本">
      {{ data.entryVersion }}
    </el-descriptions-item>
    <el-descriptions-item label="分析依赖层数">
      <el-select
        v-model="data.depth"
        class="m-2"
        placeholder="Select"
        size="small"
        :disabled="isLocalFile"
        @change="changeSelect"
      >
        <el-option key="all" label="all" value="-1" />
        <el-option v-for="i in 20" :key="i" :label="i" :value="i" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="分析节点数">
      {{ data.nodeCount }}
    </el-descriptions-item>
    <el-descriptions-item label="是否有多版本依赖">
      <el-tag :type="data.isMulPackage ? 'danger' : 'info'">{{
        data.isMulPackage ? "是" : "否"
      }}</el-tag>
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
    <el-descriptions-item label="是否有循环依赖">
      <el-tag :type="data.isCircle ? 'danger' : 'info'">{{
        data.isCircle ? "是" : "否"
      }}</el-tag>
      <span class="desc-link" v-if="data.isCircle">
        &nbsp;
        <el-link
          type="success"
          @click="showCirleDep = !showCirleDep"
          :underline="false"
          >查看</el-link
        >
        &nbsp;&nbsp;&nbsp;
        <el-link
          type="success"
          @click="handleHightCirleLinks"
          :underline="false"
          >图像</el-link
        >
      </span>
    </el-descriptions-item>
  </el-descriptions>
  <div v-show="showMulPackage && data.mulPackageList.length > 0">
    <h4 class="desc-title">项目多版本依赖详情</h4>
    <el-scrollbar max-height="150px">
      <el-descriptions :column="1" border>
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
      </el-descriptions>
    </el-scrollbar>
  </div>
  <div v-show="showCirleDep && data.isMulPackage">
    <el-descriptions direction="vertical" :column="1" border>
      <el-descriptions-item label="循环依赖详情">
        <el-scrollbar max-height="150px">
          <div v-for="circle in data.circleDepList">
            <div class="links">
              <span>[</span>
              <el-link
                v-for="(node, index) in circle"
                type="primary"
                :class="index > 0 ? 'arrow' : ''"
                @click="handleClickLink(node.toString())"
                :underline="false"
                :key="node"
                >{{ node }}</el-link
              >
              <span>]</span>
            </div>
          </div>
        </el-scrollbar>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const showCirleDep = ref(false);
const showMulPackage = ref(false);

const props = defineProps<{
  data: {
    entryPackageName: string;
    entryVersion: string;
    depth: number;
    isCircle: boolean;
    isMulPackage: boolean;
    nodeCount: number;
    circleDepList: Array<string[]>;
    mulPackageList: Array<string[]>;
  };
  // 如果是分析本地文件, 禁用选择器
  isLocalFile: boolean;
}>();

const emit = defineEmits(["refresh", "hilightCirleLinks", "searchNode"]);

const changeSelect = (selectedDepth: number) => {
  emit("refresh", selectedDepth);
};

const handleHightCirleLinks = () => {
  emit("hilightCirleLinks");
};

function handleClickLink(item: string) {
  emit("searchNode", item);
}

// 单独处理获取根项目的全名(包名+版本号)(因为不能在编译时计算参数...)
const getRootProjectFullname = ()=>{
  return props.data.entryPackageName +'&' + props.data.entryVersion
}
</script>

<style scoped>
.desc-title {
  margin: 0.5em 0;
}
.links-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.arrow::before {
  content: "->";
  color: black;
}
</style>
