import * as d3 from "d3";
import d3tip from "d3-tip";
import type { GraphData, RenderConfig } from "@/types";
import store from "@/store";

export const drag = (simulation: any) => {
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
};

export const zoomed = (container: any) => {
  return d3
    .zoom()
    .scaleExtent([0.1, 10]) // 鼠标缩放的距离, 范围
    .on("zoom", (e: any) => {
      container.attr("transform", e.transform);
    });
};

export const removeAll = () => {
  d3.selectAll("g").remove();
};

// 初始化依赖图页面
export const render = (data: GraphData, config: RenderConfig) => {
  const { elementId, width, height, isShowArrow } = config;
  const svg = d3.select(`#${elementId}`);
  const container = svg.append("g");
  container.attr("viewBox", `0 0 ${width} ${height}`);
  const nodes = data.nodes;
  const links = data.links;

  const color = d3.scaleSequential(d3.interpolateRainbow).domain([0, 100]);
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
    // 因为选择器中不能出现 & . 需要处理, 添加 #, 因为在d3.select中使用id选择器
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
    // 获取节点信息, 如果为本地json文件, 则不更新信息(不请求)
    if (!store.state.isLocalFile) {
      store.commit("updatePkgFocused", sourceName);
    }
    hightlightLinks(sourceName);
  };
  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", (d: any) => 5.5 + (d.count % 7))
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

  // 高亮从某一节点出发的边
  function hightlightLinks(sourceName: string) {
    const linksArray = link["_groups"][0];
    for (let i = 0; i < linksArray.length; i++) {
      // 恢复边的颜色
      linksArray[i].setAttribute("stroke", "gray");
      if (isShowArrow.value) {
        linksArray[i].setAttribute("marker-end", "url(#triangle-gray)");
      }
      if (linksArray[i]["__data__"]["source"]["name"] === sourceName) {
        linksArray[i].setAttribute("stroke", "red");
        if (isShowArrow.value) {
          linksArray[i].setAttribute("marker-end", "url(#triangle-red)");
        }
      }
    }
  }

  // 渲染循环依赖的边, targetLinks:[['a','b'],['b','a],...]
  function hightlightCircleLinks(targetLinks: Array<string[]>) {
    const linksArray = link["_groups"][0];
    for (let i = 0; i < linksArray.length; i++) {
      // 恢复边的颜色
      linksArray[i].setAttribute("stroke", "gray");
      if (isShowArrow.value) {
        linksArray[i].setAttribute("marker-end", "url(#triangle-gray)");
      }
      const sourceAndTarget =
        linksArray[i]["__data__"]["source"]["name"] +
        linksArray[i]["__data__"]["target"]["name"];
      if (targetLinks.includes(sourceAndTarget)) {
        linksArray[i].setAttribute("stroke", "red");
        if (isShowArrow.value) {
          linksArray[i].setAttribute("marker-end", "url(#triangle-red)");
        }
      }
    }
  }

  // 定时缩放根项目节点
  const rootName = data.entryPackageName + "&" + data.entryVersion;
  const rootPoint = d3.select("#" + rootName.replace(/[^a-zA-Z0-9]/g, ""));
  rootPoint.attr("fill", "red");
  setInterval(() => {
    rootPoint
      .transition()
      .duration(500)
      .attr("r", 20)
      .transition()
      .duration(500)
      .attr("r", 10);
  }, 1500);
  // 缩放
  svg.call(zoomed(container));

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr(
      "transform",
      (d: { x: any; y: any }) => `translate(${d.x},${d.y})`
    );
  });

  function linkArc(d: any) {
    return `
    M${d.source.x},${d.source.y}
     ${d.target.x},${d.target.y}
  `;
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
    // 找不到节点返回中心点
    return { x: width / 2, y: height / 2 };
  }

  // 保存之前的对象和半径
  let previousTaget: any = null;
  let previousRadius: number = 0;
  function scaleAndCenterNode(packageName: string, isToCenter: boolean) {
    const { x, y } = getNodePositionByName(packageName);
    // 判断是否是根项目节点, 是则只定位到中心点, 不执行放缩, 不然会和根项目节点定时放缩产生问题
    const isRootPoint = packageName === rootName;
    // 在动画开始之前, 直接重置上一个对象的状态, 防止多次点击造成大小异常
    if (previousTaget !== null && !isRootPoint) {
      previousTaget.interrupt();
      previousTaget.attr("r", previousRadius);
    }
    // 因为选择器中不能出现 & . 需要处理
    const name = "#" + packageName.replace(/[^a-zA-Z0-9]/g, "");
    const circle = svg.select(name);
    const r = circle.attr("r");
    previousTaget = circle;
    previousRadius = r;
    if (isToCenter) {
      // 定位中心点
      container
        .transition()
        .duration(1000)
        .attr(
          "transform",
          `translate(${width / 2 - x}, ${height / 2 - y}) scale(1)`
        );

      // 将新的tramsfrom变换存储到__zoom, 解决定位后zoom事件仍使用旧的变换, 导致跳跃,突变等异常现象
      svg.node().__zoom.k = 1;
      svg.node().__zoom.x = width / 2 - x;
      svg.node().__zoom.y = height / 2 - y;
    }
    // 放大中心点(如果是根项目, 则不放大, 否则会和根项目节点定时放缩产生问题)
    if (isRootPoint) return;
    circle
      .transition()
      .duration(500)
      .attr("r", 30)
      .transition()
      .duration(500)
      .attr("r", r);
  }

  return {
    scaleAndCenterNode,
    hightlightCircleLinks,
    hightlightLinks,
  };
};
