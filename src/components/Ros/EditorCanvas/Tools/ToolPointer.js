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

export class ToolPointer extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.name || "POINTER";
    this.icon = ["fas", "mouse-pointer"];
    this.visible = true;
    this.enabled = true;
    this.cursor = "default";
  }

  draw(tr) {
    if (this.dragInfo.isDragging) {
      // draw in screen  coordinate
      var p =  {
        x: this.dragInfo.startX,
        y: this.dragInfo.startY,
      };
      var p2 = {
        x: this.dragInfo.moveX,
        y: this.dragInfo.moveY,
      };

      this.engine.context.lineWidth = 1;
      this.engine.context.beginPath();
      this.engine.context.strokeStyle = "lime";
      this.engine.context.rect(p.x, p.y, p2.x - p.x, p2.y - p.y);
      this.engine.context.stroke();
    }
  }
}
