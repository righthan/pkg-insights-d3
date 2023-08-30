<template>
  <h1>Dep-Analyze-Cli Insights</h1>
  <el-row align="middle">
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
        <el-button type="primary" @click="handleSearch">查找</el-button>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="switch-box">
        <div class="switch">
          <span>展示名字</span><el-switch size="small" v-model="isShowName" />
        </div>
        <div class="switch">
          <span>展示箭头</span><el-switch size="small" v-model="isShowArrow" />
        </div>
        <div class="switch">
          <span>定位到中心点</span
          ><el-switch size="small" v-model="isToCenter" />
        </div>
        <div class="upload-btn">
          <el-upload
            ref="uploadRef"
            action="#"
            accept="application/json"
            :on-change="handleUpdloadSuccess"
            :show-file-list="false"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :limit="1"
          >
            <template #trigger>
              <el-button size="small" type="success">上传JSON</el-button>
            </template>
          </el-upload>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage, type UploadFiles, type UploadUserFile } from "element-plus";
import { useStore } from "@/store";

const store = useStore();
const emit = defineEmits(["search", "renderLocalFile"]);
const props = defineProps<{
  dependenciesList: Array<{ value: string }>;
}>();

const searchKeyWords = ref<string>("");
const isShowName = ref(true);
const isShowArrow = ref(true);
const isToCenter = ref(true);
const uploadRef = ref();

watch(isShowName, () => {
  store.commit("updateIsShowNameState", isShowName);
});
watch(isShowArrow, () => {
  store.commit("updateIsShowArrowState", isShowArrow);
});
watch(isToCenter, () => {
  store.commit("updateIsToCenterState", isToCenter);
});

const handleSelect = (item: { value: string }) => {
  emit("search", item.value);
};

const handleSearch = () => {
  if (
    !props.dependenciesList.find((obj) => obj.value === searchKeyWords.value)
  ) {
    ElMessage({
      message: "查询的依赖不存在该项目, 或检查版本是否正确",
      type: "error",
      offset: 50,
    });
    return;
  }
  emit("search", searchKeyWords.value);
};
// 自动补全
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? props.dependenciesList.filter(createFilter(queryString))
    : props.dependenciesList;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (item: any) => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleUpdloadSuccess = (uploadFile: any, uploadFiles: UploadFiles) => {
  store.commit("updateIsLoacalFileState", true);
  emit("renderLocalFile", uploadFile);
  uploadRef.value.clearFiles();
  searchKeyWords.value = "";
};

const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  ElMessage({
    message: "文件数量不能多于1个",
    type: "error",
    offset: 50,
  });
  uploadRef.value.clearFiles();
};
</script>

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
.upload-btn {
  margin: 0 0 0 5px;
}
</style>
