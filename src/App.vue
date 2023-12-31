<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import { ElMessage } from "element-plus";
import { getDepGraph, getNodeDetail } from "@/api";
import Header from "./components/Header.vue";
import PkgDetail from "./components/PkgDetail.vue";
import ProjectDetail from "./components/ProjectDetail.vue";
import Graph from "./components/Graph.vue";
import { useStore } from "@/store";
import type { Node, GraphData, PkgDetails, ProjectDetails } from "@/types";

const store = useStore();
const loading = ref(true);

const isLocalFile = computed(() => store.state.isLocalFile);

const nodeDetail = ref<PkgDetails>({
  entryPackageName: "",
  entryVersion: "",
  isCircle: false,
  isMulPackage: false,
  mulPackageList: [],
});

const projectDetail = ref<ProjectDetails>({
  entryPackageName: "",
  entryVersion: "",
  depth: 0,
  isCircle: false,
  isMulPackage: false,
  nodeCount: 0,
  circleDepList: [[]],
  mulPackageList: [[]],
});
const dependenciesList = ref<Array<{ value: string }>>([]);
// 获取依赖图的数据
let data: GraphData = {
  entryPackageName: "",
  entryVersion: "",
  nodes: [],
  links: [],
};

onMounted(async () => {
  getDepGraph("default", 10).then((resp: any) => {
    if (store.state.graph !== null) {
      d3.select("g").remove();
    }
    // 自动补全列表
    dependenciesList.value = resp.nodes.map((node: Node) => {
      return { value: node.name };
    });
    data = { ...resp };
    // 获取项目详情
    projectDetail.value = { ...resp };
    loading.value = false;
  });
});

// 监听被关注的节点, 更新其信息
const pkgFocused = computed(() => store.state.pkgFocused);
watch(pkgFocused, (newValue, oldValue) => {
  getNodeDetail(pkgFocused.value).then((resp: any) => {
    nodeDetail.value = { ...resp };
  });
});
const handleGetNodeDetail = (packageName: string) => {
  search(packageName);
};

function search(packageName: string) {
  if (!(packageName.length > 0)) return;
  store.state.graph.hightlightLinks(packageName);
  store.state.graph.scaleAndCenterNode(packageName, store.state.isToCenter);
  // 是本地json文件就不发送请求获取节点信息
  if (!store.state.isLocalFile) {
    getNodeDetail(packageName).then((resp: any) => {
      nodeDetail.value = { ...resp };
    });
  }
}

// 修改图的渲染层数
const changeDepth = (depth: number) => {
  // 重置组件的内容
  reLoad();

  const pkg = data.entryPackageName + "&" + data.entryVersion;
  getDepGraph(pkg, depth).then((resp: any) => {
    // 自动补全列表
    dependenciesList.value = resp.nodes.map((node: Node) => {
      return { value: node.name };
    });
    data = { ...resp };
    // 获取项目详情
    projectDetail.value = { ...resp };
    // graph = render(data);
    loading.value = false;
  });
};

const handleViewCircleDep = async (index: number) => {
  // 渲染前需将循环依赖节点circleDepList:[['a','b','c','a'], ['a','b','d','a']]处理成边['ab'],'bc'...](需去重)
  const circleDepLinks: Array<string> = [];
  const map = new Map();
  // index为-1渲染全部循环依赖, 否则渲染指定循环依赖
  let circleDepList: Array<string[]> = [[]];
  if (index === -1) {
    circleDepList = projectDetail.value.circleDepList;
  } else if (index >= 0 && index <= projectDetail.value.circleDepList.length) {
    circleDepList = [projectDetail.value.circleDepList[index]];
  }
  circleDepList
    .map((circleArr) => {
      for (let i = 0; i < circleArr.length - 1; i++) {
        const node1 = circleArr[i];
        const node2 = circleArr[i + 1];
        const key = "" + node1 + node2;
        if (!map.has(key)) {
          map.set(key, true);
          circleDepLinks.push(key);
        }
      }
    })
    .flat(1);
  store.state.graph.hightlightCircleLinks(circleDepLinks);
  // 如果渲染特定依赖, 将其定位到图像中间
  if (index !== -1) {
    for (let i = 0; i < circleDepList[0].length - 1; i++) {
      setTimeout(() => {
        // 第二个参数表示只使用第一个点作为定位
        store.state.graph.scaleAndCenterNode(
          circleDepList[0][i],
          i > 0 ? false : true
        );
      }, 500 * i);
    }
  }
};

const renderFile = (uploadFile: any) => {
  store.commit("updateIsLoacalFileState", true);
  try {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        // 重置组件内容
        reLoad();
        const jsonData = JSON.parse(reader.result.toString());

        // 自动补全列表
        dependenciesList.value = jsonData.nodes.map((node: Node) => {
          return { value: node.name };
        });

        // 获取项目详情
        projectDetail.value = { ...jsonData };
        data = { ...jsonData };
        loading.value = false;
      }
    };
    reader.readAsText(uploadFile.raw);
  } catch (err) {
    console.log(err);
    ElMessage({
      message: "文件错误",
      type: "error",
      offset: 50,
    });
  }
};

// 重新加载时删除原数据, 取消依赖详情组件可见性
const reLoad = () => {
  d3.selectAll("g").remove();
  loading.value = true;
  // 重置svg的 __zoom防止重新导入数据时仍然在上一次的缩放数据中
  const svg = d3.select("#mainSvg");
  svg.node().__zoom.k = 1;
  svg.node().__zoom.x = 0;
  svg.node().__zoom.y = 0;
  // entryPackageName置空使组件不可见
  nodeDetail.value.entryPackageName = "";
};
</script>

<template>
  <el-container>
    <el-header>
      <Header
        :dependencies-list="dependenciesList"
        @search="search"
        @render-local-file="renderFile"
      />
    </el-header>
    <el-container class="outside-container">
      <el-main style="min-width: 1250px; min-height: 600px; padding-right: 0">
        <div class="container" v-loading="loading">
          <Graph :data="data" @get-node-detail="handleGetNodeDetail" />
        </div>
      </el-main>
      <el-aside width="20vw">
        <div class="detail-box" v-loading="loading">
          <ProjectDetail
            :data="projectDetail"
            :isLocalFile="isLocalFile"
            @refresh="changeDepth"
            @high-light-cirle-links="handleViewCircleDep"
            @search-node="search"
          />
          <!-- 本地文件缺乏具体节点数据, 所以不展示依赖详情, 根项目节点也不重复展示 -->
          <div
            v-show="
              nodeDetail.entryPackageName &&
              !isLocalFile &&
              nodeDetail.entryPackageName !== data.entryPackageName
            "
          >
            <PkgDetail :data="nodeDetail" @refresh="search" />
          </div>
        </div>
      </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>
.outside-container {
  margin-top: 3em;
}

.detail-box {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
