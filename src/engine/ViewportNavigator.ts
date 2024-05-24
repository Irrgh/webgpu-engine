import { Viewport } from './Viewport';
export abstract class ViewportNavigator {

    protected viewport : Viewport;

    constructor (viewport : Viewport) {
        this.viewport = viewport;
    }

    abstract use():void
    abstract stop():void

}