import { describe, test, expect } from 'vitest'
import { store } from '@/store'


describe('Store test', () => {
    test('updateIsLoacalFileState', () => {
        store.commit('updateIsLoacalFileState', false);
        expect(store.state.isLocalFile).toBe(false);
    })
    test('updateIsShowNameState', () => {
        store.commit('updateIsShowNameState', false);
        expect(store.state.isShowName).toBe(false);
    })
    test('updateIsShowArrowState', () => {
        store.commit('updateIsShowArrowState', false);
        expect(store.state.isShowArrow).toBe(false);
    })
    test('updateIsToCenterState', () => {
        store.commit('updateIsToCenterState', false);
        expect(store.state.isToCenter).toBe(false);
    })
    test('updatePkgFocused', () => {
        store.commit('updatePkgFocused', 'packageName');
        expect(store.state.pkgFocused).toBe('packageName');
    })
    test('setGraph', () => {
        store.commit('setGraph', 1);
        expect(store.state.graph).toBe(1);
    })
})