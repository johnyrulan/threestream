import { ActiveLoader, useLoading } from "vue-loading-overlay";

export default class LoadingHelper {
    private static loader = useLoading({
        color: '#ba34fd',
        loader: 'dots',
        backgroundColor: 'transparent'
    });

    static showLoader(canCancel = false) {
        return this.loader.show();
    }

    static hideLoader(currentLoader: ActiveLoader) {
        currentLoader.hide();
    }
}