import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

export class CanvasObject {
    constructor(engine, x, y) {
      this.engine = engine;
      this.pos = { x: x, y: y };
      this.rot = 0;
      this.scale = 1;
      this.name = "CanvasObject";
      this.handlePoints = [];
      this.points = [];
      this.handlePoints[0] = {x:0,y:0};
      this.points[0] = {x:0,y:0};
      this.selected = false;
      this.visible = true;
      this.enabled = true;
    }
  
    getMinMax() {
      var min_x = Number.MAX_SAFE_INTEGER;
      var min_y = Number.MAX_SAFE_INTEGER;
      var max_x = Number.MIN_SAFE_INTEGER;
      var max_y = Number.MIN_SAFE_INTEGER;
  
      for (let i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        min_x = Math.min(min_x, p.x);
        min_y = Math.min(min_y, p.y);
        max_x = Math.max(max_x, p.x);
        max_y = Math.max(max_y, p.y);
        //console.log(rect);
      }
      // console.log(
      //   "min X:" + min_x + ",Y:" + min_y + ", max X:" + max_x + ", Y:" + max_y
      // );
  
      return {
        min: {
          x: min_x,
          y: min_y,
        },
        max: {
          x: max_x,
          y: max_y,
        },
      };
    }
    getMinMaxWorld() {
      var p = this.getMinMax();
      var tr =  this.getTransform();
      return {
        min: applyToPoint(tr, p.min),
        max: applyToPoint(tr, p.max),
      };
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
  
  