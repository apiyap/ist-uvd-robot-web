import { ToolObject } from "../ToolObject";
import { drawCross, toRadians, toDegrees } from "../../NavCanvas/Utiles";
import {
  inverse,
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";


export class ToolDrawObject extends ToolObject {
  constructor(engine, options) {
    super(engine, options);

    options = options || {};
    this.name = options.name || "DRAWOBJECT";
    this.cursor = "default";
    this.index = 0;


  }







  draw(tr){
    if (this.dragInfo.isDragging) {
       // draw in screen coordinate
      var p = {
        x: this.dragInfo.startX,
        y: this.dragInfo.startY,
      };
      var p2 = {
        x: this.dragInfo.moveX,
        y: this.dragInfo.moveY,
      };

      drawCross(this.engine.context, p, 4, "blue", 1);
      drawCross(this.engine.context, p2, 4, "red", 1);

    }
  }
}
