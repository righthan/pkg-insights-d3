
import { createApp } from 'vue'
import App from './App.vue'
import store, { key } from '@/store'
// 解决ElMessage无样式的问题
import 'element-plus/theme-chalk/src/index.scss'


createApp(App).use(store, key).mount('#app')
