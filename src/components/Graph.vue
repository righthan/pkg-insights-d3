<template>
  <div class="svg-box">
    <div class="svg-tools-box">
      <el-button @click="toggleFullscreen" title="全屏">全屏</el-button>
      <el-button @click="downloadSvg" title="下载">下载</el-button>
    </div>
    <div ref="mainSvgRef">
      <svg id="mainSvg" class="svg" width="75vw" height="78vh">
        <defs>
          <marker
            id="triangle-gray"
            viewBox="0 0 10 20"
            refX="17"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="10"
            markerHeight="20"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="gray" />
          </marker>
          <marker
            id="triangle-red"
            viewBox="0 0 10 20"
            refX="17"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="10"
            markerHeight="20"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
          </marker>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type Ref } from "vue";
import screenfull from "screenfull";
import html2canvas from "html2canvas";
import * as d3 from "d3";
import { useStore } from "@/store";
import { render } from "@/utils/graphEvents";
import type { GraphData } from "@/types";

const props = defineProps<{
  data: GraphData;
}>();
const store = useStore();

const isLocalFile = computed(() => store.state.isLocalFile);

const mainSvgRef = ref();
let width = 0;
let height = 0;
onMounted(() => {
  width = parseInt(window.getComputedStyle(mainSvgRef.value).width);
  height = parseInt(window.getComputedStyle(mainSvgRef.value).height);
});

watch(
  () => props.data,
  (newValue, oldValue) => {
    const graph = render(props.data, {
      elementId: "mainSvg",
      width,
      height,
      isShowName,
      isShowArrow,
      isToCenter,
      isLocalFile,
    });
    store.commit("setGraph", graph);
  }
);

// 控制图片展示样式
const isShowName = computed(() => store.state.isShowName);
const isShowArrow = computed(() => store.state.isShowArrow);
const isToCenter = computed(() => store.state.isToCenter);
// 是否展示节点标签
watch(isShowName, (newValue, oldValue) => {
  d3.selectAll("text").attr(
    "display",
    `${newValue === true ? "inherit" : "none"}`
  );
});
// 控制是否显示连线箭头
watch(isShowArrow, (newValue, oldValue) => {
  d3.selectAll("path").attr(
    "marker-end",
    `${newValue === true ? "url(#triangle-gray)" : "none"}`
  );
});

const toggleFullscreen = () => {
  const ele: any = document.getElementById("mainSvg"); //指定全屏区域元素
  if (screenfull.isEnabled) {
    screenfull.request(ele);
  }
};

const downloadSvg = () => {
  html2canvas(mainSvgRef.value).then((canvas: any) => {
    // 将画布转换为图像的URL
    var imageURL = canvas.toprops.dataURL("image/png");

    // 创建一个下载链接并模拟点击操作
    var link = document.createElement("a");
    link.href = imageURL;

    link.download = `${props.data.entryPackageName}Graph.png`;
    link.click();
  });
};
</script>

<style scoped>
.svg-box {
  position: relative;
}
.svg {
  position: relative;
  transform: translate(10, 10);
  border: 1px solid #eee;
  background-color: white;
  min-width: 1200px;
  min-height: 600px;
}
.svg-tools-box {
  position: absolute;
  top: 1em;
  right: 1em;
  z-index: 2;
  display: flex;
  gap: 0.1em;
}
</style>
