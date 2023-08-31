import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import HeaderVue from '@/components/Header.vue'
import store from '../../store/index';

describe('Header test', () => {
    const wrapper = mount(HeaderVue, {
        props: {
            dependenciesList :[
                {value: 'package1&1.0.0'},
                {value: 'package3&3.0.0'},
                {value: 'package2&2.0.0'},
                {value: 'package4&4.0.0'},
            ]
        },
        global: {
            plugins: [store]
        }
    })
    const vm = wrapper.vm as any;

    test('shoud display name', () => {
        const displayNameBtn = wrapper.findAll('.switch .el-switch');
        const flag= vm.isShowName;
        displayNameBtn[0].trigger('click');
        expect(vm.isShowName).toBe(!flag);
    })

    test('shoud display allow', () => {
        const displayAllowBtn = wrapper.findAll('.switch .el-switch');
        const flag= vm.isShowArrow;
        displayAllowBtn[1].trigger('click');
        expect(vm.isShowArrow).toBe(!flag);
    })

    test('将查找的节点定位到图像中心', () => {
        const displayNameBtn = wrapper.findAll('.switch .el-switch');
        const flag= vm.isToCenter;
        displayNameBtn[2].trigger('click');
        expect(vm.isToCenter).toBe(!flag);
    })

})
