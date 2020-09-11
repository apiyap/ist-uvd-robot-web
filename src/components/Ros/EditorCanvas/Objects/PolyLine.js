import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import { CanvasObject } from "../CanvasObject";

export class PolyLine extends CanvasObject {
  constructor(engine, x, y, pts) {
    super(engine, x, y);
    
    this.name = "PolyLine";
  
    for (var i = 0; i < pts.length; i++) {
      this.points[i] = pts[i];
    }
    console.log(pts);

  }

  draw(tr) {
    if (this.points.length > 1) {
      this.engine.context.save();
      this.engine.context.translate(this.pos.x, this.pos.y);

      this.engine.context.beginPath();
      this.engine.context.lineWidth = 1;
      this.engine.context.strokeStyle = "blue";
      this.engine.context.moveTo(0, 0);
      for (var i = 0; i < this.points.length; i++) {
        this.engine.context.lineTo(this.points[i].x, this.points[i].y);
      }
      this.engine.context.stroke();

      this.engine.context.restore();
    }
  }
}
