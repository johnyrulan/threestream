import IRenderer from "./IRenderer";

export default interface IInteractiveTalkRenderer extends IRenderer {
    setMainVideo(streamId: string): void;
}