import {
    scale,
    rotate,
    translate,
    compose,
    applyToPoint,
  } from "transformation-matrix";
  import { CanvasObject } from "../CanvasObject";
  
  export class Docking extends CanvasObject {
    constructor(engine, x, y) {
      super(engine, x, y);
  
      this.name = "Docking";
    }
  
    // getRectangle() {
    //   return {
    //     x: this.pos.x,
    //     y: this.pos.y,
    //     width: this.width,
    //     height: this.height,
    //   };
    // }
    init() {}
    draw(tr) {}
    update(t) {}
    exit() {}
  }
  