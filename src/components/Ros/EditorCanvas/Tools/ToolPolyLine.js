import { ToolDrawObject } from "./ToolDrawObject";
import { PolyLine } from "../Objects/PolyLine";
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
import { faMarker } from "@fortawesome/free-solid-svg-icons";

library.add(faMarker);

const ToolCursor = icon({ prefix: "fas", iconName: "marker" });

export class ToolPolyLine extends ToolDrawObject {
  static MaxDistance = 10;

  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.name || "POLYLINE";
    this.icon = ["fas", "bezier-curve"];
    this.visible = true;
    this.enabled = true;
    this.cursor = this._createCursor();

    this.points = [];
    this.index = 0;
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

  onMouseDown(e) {
    super.onMouseDown(e);

    this.points = [];
    this.index = 0;
    this.points[this.index] = {
      x: this.dragInfo.startX,
      y: this.dragInfo.startY,
    };
   
  }

  onMouseMove(e) {
    super.onMouseMove(e);
    if (this.dragInfo.isDragging){
      var p = this.points[this.index];
      var dx = this.dragInfo.moveX - p.x;
      var dy = this.dragInfo.moveY - p.y;
      var moveDis = Math.sqrt(dx * dx + dy * dy);
      if (moveDis > ToolPolyLine.MaxDistance) {
        this.index++;
        this.points[this.index] = {
          x: this.dragInfo.moveX,
          y: this.dragInfo.moveY,
        };
         
      }
    }
    
  }

  onMouseUp(e) {
    super.onMouseUp(e);
      var invTr = inverse(this.engine.getTransform()); // draw in world coordinate
      var p = applyToPoint(invTr, {
        x: this.dragInfo.startX,
        y: this.dragInfo.startY,
      });

    

     var pts=[];
     for(var i =0;i<this.points.length;i++ ){

      var pt = applyToPoint(invTr, {
        x: this.points[i].x - this.dragInfo.startX,
        y: this.points[i].y - this.dragInfo.startY,
      });
      pts[i] = pt;

     }

    this.index = this.engine.add( new PolyLine(this.engine,p.x,p.y,pts));
  }

  draw(tr) {
    super.draw(tr);
    if (this.dragInfo.isDragging && this.points.length > 1) {
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
      this.engine.context.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 1; i < this.points.length; i++) {
        this.engine.context.lineTo(this.points[i].x, this.points[i].y);
      }

      this.engine.context.stroke();
    }
  }
}
