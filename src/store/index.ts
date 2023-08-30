import { type InjectionKey } from "vue";
import {
  createStore,
  Store,
  useStore as baseUseStore,
} from "vuex";
import { type RootStateTypes } from "@/store/interface";

export const store = createStore<RootStateTypes>({
  state: {
    isLoading: false,
    isLocalFile: false,
    isShowName: true,
    isShowArrow: true,
    isToCenter: true,
    pkgFocused: "",
    graph: {},
  },

  getters: {},

  mutations: {
    updateIsLoadingState(state: RootStateTypes, val: boolean) {
      state.isLoading = val;
    },
    updateIsLoacalFileState(state: RootStateTypes, val: boolean) {
      state.isLocalFile = val;
    },
    updateIsShowNameState(state: RootStateTypes, val: boolean) {
      state.isShowName = val;
    },
    updateIsShowArrowState(state: RootStateTypes, val: boolean) {
      state.isShowArrow = val;
    },
    updateIsToCenterState(state: RootStateTypes, val: boolean) {
      state.isToCenter = val;
    },
    updatePkgFocused(state: RootStateTypes, pkgName: string) {
      state.pkgFocused = pkgName;
    },
    setGraph(state: RootStateTypes, data) {
      state.graph = data;
    },
  },

  actions: {},

  modules: {},
});

export default store;
export const key: InjectionKey<Store<RootStateTypes>> = Symbol();
export function useStore() {
  return baseUseStore(key);
}
