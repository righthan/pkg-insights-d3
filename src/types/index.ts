import type { ComputedRef } from "vue";

export interface Node {
  name: string;
  coount: number;
}
export interface Link {
  source: string;
  target: string;
}

export interface GraphData {
  entryPackageName: string;
  entryVersion: string;
  nodes: Array<Node>;
  links: Array<Link>;
}

export interface PkgDetails {
  entryPackageName: string;
  entryVersion: string;
  isCircle: boolean;
  isMulPackage: boolean;
  mulPackageList: [];
}

export interface ProjectDetails {
  entryPackageName: string;
  entryVersion: string;
  depth: number;
  isCircle: boolean;
  isMulPackage: boolean;
  nodeCount: number;
  circleDepList: [string[]];
  mulPackageList: [string[]];
}

export interface Graph {
  scaleAndCenterNode: Function;
  hightlightCircleLinks: Function;
}

export interface RenderConfig {
  elementId: string;
  width: number;
  height: number;
  isShowName: ComputedRef<boolean>;
  isShowArrow: ComputedRef<boolean>;
  isToCenter: ComputedRef<boolean>;
  isLocalFile: ComputedRef<boolean>;
}
