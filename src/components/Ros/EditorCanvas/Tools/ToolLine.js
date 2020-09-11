import { ToolDrawObject } from "./ToolDrawObject";
import { Line } from "../Objects/Line";
import { drawCross, toRadians, toDegrees } from "../../NavCanvas/Utiles";
import {
  inverse,
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";

import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faPencilAlt);
const ToolCursor = icon({ prefix: "fas", iconName: "pencil-alt" });

export class ToolLine extends ToolDrawObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.name || "LINE";
    this.icon = ["fas", "pencil-alt"];
    this.visible = true;
    this.enabled = true;
    this.cursor = this._createCursor();
  }
  _createCursor() {
    var canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.beginPath();
    ctx.scale(
      canvas.width / ToolCursor.icon[0],
      canvas.height / ToolCursor.icon[1]
    );
    ctx.fillStyle = "blue";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    //console.log(ToolCursor.icon[4])
    var path = new Path2D(ToolCursor.icon[4]);
    //ctx.stroke(path);
    ctx.fill(path);
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(ctx.lineWidth, canvas.height - ctx.lineWidth);
    ctx.lineTo(ctx.lineWidth, canvas.height - ctx.lineWidth + 6);
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(0,canvas.height - (ctx.lineWidth+2));
    // ctx.lineTo(ctx.lineWidth + 6,canvas.height - (ctx.lineWidth+2));
    // ctx.stroke();
    ctx.restore();

    var dataURL = canvas.toDataURL("image/png");
    return "url(" + dataURL + ") 2 22, pointer";
  }

  onMouseUp(e) {
    super.onMouseUp(e);
    var invTr = inverse(this.engine.getTransform()); // draw in world coordinate
    var p = applyToPoint(invTr, {
      x: this.dragInfo.startX,
      y: this.dragInfo.startY,
    });
    var p2 = applyToPoint(invTr, {
      x: this.dragInfo.endX,
      y: this.dragInfo.endY,
    });

    this.index = this.engine.add(new Line(this.engine, p.x, p.y, p2.x, p2.y));
  }

  draw(tr) {
    super.draw(tr);
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

      this.engine.context.lineWidth = 1;
      this.engine.context.beginPath();
      this.engine.context.strokeStyle = "blue";
      this.engine.context.moveTo(p.x, p.y);
      this.engine.context.lineTo(p2.x, p2.y);
      this.engine.context.stroke();
    }
  }
}
