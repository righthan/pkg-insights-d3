export interface RootStateTypes {
  isLoading: boolean;
  isLocalFile: boolean;
  isShowName: boolean;
  isShowArrow: boolean;
  isToCenter: boolean;
  // 被关注的依赖节点名字(被查询或是点击), 用于在PkgDetail组件中查询更新数据
  pkgFocused: string;
  graph: any;
}
