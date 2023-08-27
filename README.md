# pkg-insights-d3

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## 项目难点

1. **节点定位到中心与图像平移缩放**
   将节点定位到中心需计算出点到图像中心的x, y方向上的距离，然后使用将距离设置到整个图像transform属性，而图像的平移缩放需使用到d3的自定义的zoom事件，需要将ZoomEvent中的transform属性直接赋值给图像的transform属性。但实际中开发中发现，在进行缩放平移之后，将查询的节点定位到图像中心，改变了平移缩放的数据，但是再次将图像平移缩放时，ZoomEvent并不依据设置中心时的新的transform数据，而是采用定位到图像中心之前旧的transform数据，这就导致图像突然回到之前的缩放状态和位置，产生严重的跳跃突变的感觉。
   **解决方法：**

   在反复查看d3-zoom的文档，甚至源代码之后，发现通过鼠标平移缩放改变的是ZoomEvent的transform属性，单独设置图像的transform属性不会改变ZoomEvent的transform属性，再次查看文档和源代码，鼠标事件平移缩放保存在图像的`__zoom`属性上，而ZoomEvent事件中的transform正是通过`__zoom`属性计算的，所以在将节点定位到中心时，手动更新 `__zoom`就能解决问题。

2. **提升图像的交互体验**

   为了使操作过程中图像有更好的交互效果，需要对依赖图中的节点图像进行改变填充颜色和图像半径大小，对边进行颜色高亮的操作，因此需要频繁查找和操作svg图像中的节点，为了提升效率，需要结合d3的`select()`方法，给每一个节点都添加id属性，以唯一标识每个节点，因为需要更方便地通过节点名称和版本号查询节点，使用了这两个属性来设置id。 例如 `@types/axios&1.2.3`，需使用正则表达式，去除特殊字符，最终使用`typesaxios123`作为id。

<iframe style="height:500px" src="//player.bilibili.com/player.html?aid=59317437&bvid=BV1Pt411G7qh&cid=103365806&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

<iframe src="//player.bilibili.com/player.html?aid=575193171&bvid=BV1kz4y1T7hY&cid=1245383999&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>