import { Camera } from "../entity/Camera";
import { Entity } from "../entity/Entity";
import { Viewport } from "../Viewport";

export class Scene {

    /**
     * All entities except viewport Camera are included in here;
     */
    entities : Map<String,Entity>

    /**
     * @todo All scene changing updates will be routed through here to prompt redrawing in all associated Viewports.
     */
    viewports:Viewport[];


    /**
     * Represent the origin for actions like Viewport panning, object inserting etc.
     * @todo implement rendering types for entities
     */
    // cursor3d : Entity;


    constructor() {
        this.entities = new Map<String,Entity>();
        this.viewports = [];
    }

    /**
     * Redraws all connected viewports after a change
     * @todo implement this ig
     */
    onUpdate () {

        this.viewports.forEach((viewport) => {
            
            

        });

    }










    









}