import {
    scale,
    rotate,
    translate,
    compose,
    applyToPoint,
  } from "transformation-matrix";
  import { drawCross, toRadians, toDegrees } from "../../NavCanvas/Utiles";

  import { CanvasObject } from "../CanvasObject";
  
  export class Line extends CanvasObject {
    constructor(engine, x, y,x2,y2) {
      super(engine, x, y);
  
      this.name = "Line";
      this.points[1] = {x:x2-x ,y:y2-y};
       
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
    exit() {}
    update(t) {}
    draw(tr) {
      this.engine.context.save();
      this.engine.context.translate(this.pos.x, this.pos.y);

      //drawCross(this.engine.context, this.points[0], 6, "red", 0.5);
      this.engine.context.lineWidth = 1;
      this.engine.context.beginPath();
      this.engine.context.strokeStyle = "blue";
      this.engine.context.moveTo(this.points[0].x, this.points[0].y);
      this.engine.context.lineTo(this.points[1].x, this.points[1].y);
      this.engine.context.stroke();


      this.engine.context.restore();

    }
  }
  