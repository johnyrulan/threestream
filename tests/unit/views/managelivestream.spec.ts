import { shallowMount } from "@vue/test-utils";
import ManageLivestream from '@/views/ManageLivestream.vue';
import { Livestream } from "@/services/api/models";

let wrapper: any;

describe('ManageLivestream.vue', () => {
    beforeEach(async() => {
        jest.resetModules();
        const obj: Livestream = {name: '', timezone: '', startTime: new Date(), hostUserId: ''};

        wrapper = shallowMount(ManageLivestream);

        wrapper.vm.getLivestream = jest.fn(() => Promise.resolve(obj));
        wrapper.vm.saveLivestream = jest.fn(() => Promise.resolve());
        wrapper.vm.getWaxAssets = jest.fn(() => Promise.resolve());
        wrapper.vm.initializePopover = jest.fn();

    });

    it('Publish button should save the livestream with the published status', () => {
        const publishBtn = wrapper.find('#publishBtn');
        publishBtn.trigger('click');
        expect(wrapper.vm.saveLivestream).toHaveBeenCalled();
    });

    it('Save as draft button should save the livestream with the draft status', async () => {
        const saveAsDraftBtn = wrapper.find('#saveAsDraftBtn');
        saveAsDraftBtn.trigger('click');
        expect(wrapper.vm.saveLivestream).toHaveBeenCalled();
    });
});