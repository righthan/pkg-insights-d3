<script setup lang="ts">
import { onMounted } from "vue";
import * as d3 from "d3";
import d3tip from "d3-tip";
import { ref, watch } from "vue";
import { getDepGraph, getNodeDetail } from "@/api";
import PkgDetail from "./components/PkgDetail.vue";
import { ElMessage } from "element-plus";
import ProjectDetail from "./components/ProjectDetail.vue";

interface Node {
  name: string;
  coount: number;
}
interface Link {
  source: string;
  target: string;
}

interface GraphData {
  entryPackageName: string;
  entryVersion: string;
  nodes: Array<Node>;
  links: Array<Link>;
}

interface NodeDetail {
  entryPackageName: string;
  entryVersion: string;
  // depth: number;
  isCircle: boolean;
  isMulPackage: boolean;
  mulPackageList: [];
}

interface ProjectDetail {
  entryPackageName: string;
  entryVersion: string;
  depth: number;
  isCircle: boolean;
  isMulPackage: boolean;
  nodeCount: number;
}
const searchKeyWords = ref<string>("");
const showName = ref(true);
const showArrow = ref(true);
const loading = ref(true)

const nodeDetail = ref<NodeDetail>({
  entryPackageName: "",
  entryVersion: "",
  isCircle: false,
  isMulPackage: false,
  mulPackageList: [],
});

const projectDetail = ref<ProjectDetail>({
  entryPackageName: "",
  entryVersion: "",
  depth: 0,
  isCircle: false,
  isMulPackage: false,
  nodeCount: 0,
});
const dependenciesList = ref<Array<{ value: unknown }>>([]);
// 获取依赖图的数据
let data: GraphData = {
  entryPackageName: "",
  entryVersion: "",
  nodes: [],
  links: [],
};

let graph: any;
onMounted(async () => {
  getDepGraph("default", 10).then((resp: any) => {
    // 自动补全列表
    dependenciesList.value = resp.nodes.map((node: Node) => {
      return { value: node.name };
    });
    data = { ...resp };
    // 获取项目详情
    projectDetail.value = { ...resp };
    console.log(projectDetail.value);

    graph = render(data);
    loading.value = false
  });
});

// 初始化依赖图页面
function render(data: GraphData) {
  const svg = d3.select("svg");
  const container = svg.append("g");
  const width = svg.attr("width");
  const height = svg.attr("height");
  container.attr("viewBox", `0 0 ${width} ${height}`);
  // const nodes = Array.from(
  //   data.nodes.map((name: string) => {
  //     return { name };
  //   })
  // );
  const nodes = data.nodes;
  const links = data.links;

  const color = d3
    .scaleSequential(d3.interpolateRainbow)
    .domain([0, nodes.length - 1]);

  const simulation = d3.forceSimulation(nodes);

  simulation
    .force(
      "link",
      d3.forceLink(links).id((d: { name: string }) => d.name)
    )
    .force("charge", d3.forceManyBody().strength(50))
    .force("manyBody", d3.forceManyBody().strength(-600))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const tipStyle = `display: inline-block;background-color: white;padding: 5px 10px;border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 14px;`;
  const tip = d3tip()
    .attr("class", "d3-tip")
    .html(
      (event: Event, d: any) => `<span style="${tipStyle}">${d.name}</span>`
    );

  // tip提示
  svg.call(tip);

  const link = container
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", "gray")
    .attr("marker-end", "url(#triangle-gray)");

  const node = container
    .append("g")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  // 节点点击
  const handleClickNode = (event: Event) => {
    const sourceName = d3.select(event.currentTarget)["_groups"][0][0][
      "__data__"
    ].name;
    // 因为选择器中不能出现 & . 需要处理
    const _name = "#" + sourceName.replace(/[^a-zA-Z0-9]/g, "");
    const circle = d3.select(_name);
    const r = circle.attr("r");
    circle
      .transition()
      .duration(100)
      .attr("r", 4)
      .transition()
      .duration(100)
      .attr("r", r);
    // 获取节点信息
    getNodeDetail(sourceName).then((resp: any) => {
      nodeDetail.value = { ...resp };
    });
    hightlightLinks(sourceName);
  };

  // 高亮从某一节点出发的边
  function hightlightLinks(sourceName: string) {
    const linksArray = link["_groups"][0];
    for (let i = 0; i < linksArray.length; i++) {
      // 恢复边的颜色
      linksArray[i].setAttribute("stroke", "gray");
      linksArray[i].setAttribute("marker-end", "url(#triangle-gray)");
      if (linksArray[i]["__data__"]["source"]["name"] === sourceName) {
        linksArray[i].setAttribute("stroke", "red");
        linksArray[i].setAttribute("marker-end", "url(#triangle-red)");
      }
    }
  }
  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", (d: any) => 6 + (d.count % 10))
    .attr("fill", (d: any) => color(Math.random() * 100))
    // 防止id中出现特殊字符导致无法使用选择器
    .attr("id", (d: any) => d.name.replace(/[^a-zA-Z0-9]/g, ""))
    .on("click", handleClickNode)
    .on("contextmenu", (e: Event) => {
      e.preventDefault();
      container
        .append("polygon ")
        .attr("points", "65,5 100,35 85,75 35,75 20,35")
        .attr("fill", "red");
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  // 节点标签名字展示
  node
    .append("text")
    .attr("x", (d: { name: string }) => -d.name.length * 3)
    .attr("y", 15)
    .text((d: { name: string }) => d.name)
    .attr("font-size", 10)
    .clone(true)
    .lower()
    .attr("fill", "none");
  // 缩放
  let zoom = d3
    .zoom()
    .scaleExtent([0.5, 10]) // 鼠标缩放的距离, 范围
    .on("zoom", (e: any) => {
      container.attr("transform", e.transform);
    });
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(1));

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr(
      "transform",
      (d: { x: any; y: any }) => `translate(${d.x},${d.y})`
    );
  });

  function linkArc(d: any) {
    // const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    //   return `
    //   M${d.source.x},${d.source.y}
    //   A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    // `;
    return `
    M${d.source.x},${d.source.y}
     ${d.target.x},${d.target.y}
  `;
  }
  function drag(simulation: any) {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.05).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  function getNodePositionByName(nodeName: string) {
    // 因为选择器中不能出现 & . 需要处理
    const name = "#" + nodeName.replace(/[^a-zA-Z0-9]/g, "");
    const selectResult = d3.select(name)["_groups"][0];
    if (selectResult.length > 0) {
      const node = selectResult[0]["__data__"];
      // 获取节点x, y坐标
      const { x, y } = node;
      return { x, y };
    }
  }
  function scaleAndCenterNode(packageName: string, x: number, y: number) {
    // 因为选择器中不能出现 & . 需要处理
    const name = "#" + packageName.replace(/[^a-zA-Z0-9]/g, "");
    const circle = svg.select(name);
    const r = circle.attr("r");
    circle
      .transition()
      .duration(500)
      .attr("r", 30)
      .transition()
      .duration(500)
      .attr("r", r);
  }

  return {
    simulation,
    hightlightLinks,
    getNodePositionByName,
    scaleAndCenterNode,
  };
}

function search(packageName: string) {
  if (!(packageName.length > 0)) return;
  if (!dependenciesList.value.find((obj) => obj.value === packageName)) {
    ElMessage({
      message: "查询的依赖不存在该项目, 或检查版本是否正确",
      type: "error",
      offset: 50,
    });
    return;
  }
  graph.hightlightLinks(packageName);
    // 节点坐标
    const { x, y } = graph.getNodePositionByName(packageName);
    graph.scaleAndCenterNode(packageName, x, y);
    // 获取节点信息
    getNodeDetail(packageName).then((resp: any) => {
      nodeDetail.value = { ...resp };
      console.log(nodeDetail.value);
      
    });
}

// 自动补全
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? dependenciesList.value.filter(createFilter(queryString))
    : dependenciesList.value;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (item: any) => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item: { value: string }) => {
  search(item.value);
};

// 控制是否显示标签名字
watch(showName, (newValue, oldValue) => {
  d3.selectAll("text").attr(
    "display",
    `${newValue === true ? "inherit" : "none"}`
  );
});

// 控制是否显示连线箭头
watch(showArrow, (newValue, oldValue) => {
  d3.selectAll("path").attr(
    "marker-end",
    `${newValue === true ? "url(#triangle-gray)" : "none"}`
  );
  d3.selectAll("marker");
});
</script>

<template>
  <el-container>
    <el-header>
      <h2>Pkg Insights</h2>
    </el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <div class="search-box">
              <el-autocomplete
                v-model="searchKeyWords"
                :fetch-suggestions="querySearch"
                clearable
                style="width: 100%"
                placeholder="Please Input"
                @select="handleSelect"
              />
              <el-button type="primary" @click="search(searchKeyWords)"
                >查找</el-button
              >
            </div>
          </el-col>
          <el-col :span="8">
            <div class="switch-box">
              <div class="switch">
                <span>展示名字</span><el-switch v-model="showName" />
              </div>
              <div class="switch">
                <span>展示箭头</span><el-switch v-model="showArrow" />
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="container" v-loading="loading">
          <svg id="mainsvg" class="svg" width="1200" height="620">
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
          <div class="detail-box">
            <ProjectDetail :data="projectDetail" />
            <PkgDetail
              v-if="nodeDetail.entryPackageName"
              :data="nodeDetail"
              @refresh="search"
            />
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.search-box {
  display: flex;
  gap: 1em;
  margin: 1em;
}
.switch-box {
  margin: 1em;
  display: flex;
}
.switch > span {
  display: inline-block;
  margin: 0 0.5em;
}

.el-main{
  padding-top: 0;
}
.container {
  display: flex;
  gap: 1em;
}
.svg {
  float: left;
  position: relative;
  transform: translate(10, 10);
  border: 1px solid #eee;
}

.detail-box {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
