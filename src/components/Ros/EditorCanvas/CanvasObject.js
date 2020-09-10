import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

export class CanvasObject {
    constructor(engine, x, y) {
      this.engine = engine;
      this.pos = { x: x, y: y };
      this.rot = 0;
      this.scale = 1;
      this.name = "CanvasObject";
      this.points = [];
      this.points[0] = this.pos;
      this.selected = false;
      this.visible = true;
      this.enabled = true;
    }
  
    getTransform(){
      return compose(
        translate(this.pos.x,this.pos.y),
        rotate(this.rot),
        scale(this.scale, this.scale)
      );
    }
  
    // getRectangle() {
    //   return {
    //     x: this.pos.x,
    //     y: this.pos.y,
    //     width: this.width,
    //     height: this.height,
    //   };
    // }
    init(){}
    draw(tr) {}
    update(t) {}
    exit() {}
  }
  
  