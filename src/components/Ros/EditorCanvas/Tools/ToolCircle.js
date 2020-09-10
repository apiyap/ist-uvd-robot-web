import { ToolObject } from "../ToolObject";

export class ToolCircle extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "CIRCLE";
    this.icon = ["fas", "crosshairs"];
    this.visible = true;
    this.enabled = true;
    this.cursor = this._createCursor();
  }
  _createCursor() {
    var canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    var ctx = canvas.getContext("2d");

    // ctx.scale(
    //   canvas.width / ToolCursor.icon[0],
    //   canvas.height / ToolCursor.icon[1]
    // );
    ctx.fillStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.save()
    ctx.beginPath();
    ctx.arc(12, 12, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.save()
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(ctx.lineWidth+2,0);
    ctx.lineTo(ctx.lineWidth+2,ctx.lineWidth+6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,ctx.lineWidth+2);
    ctx.lineTo(ctx.lineWidth + 6,ctx.lineWidth+2);
    ctx.stroke();
    ctx.restore();

    // //console.log(ToolCursor.icon[4])
    // var path = new Path2D(ToolCursor.icon[4]);
    // //ctx.stroke(path);
    // ctx.fill(path);

    var dataURL = canvas.toDataURL("image/png");
    return "url(" + dataURL + ") 2 2, pointer";
  }

  init() {}
  draw(tr) {}
  update(t) {}
  exit() {}

 

  onMouseDown(e) {}

  onMouseMove(e) {}

  onMouseUp(e) {}
  onMouseWheel(e) {}
  onTouchStart(e) {}
  onTouchMove(e) {}
  onTouchEnd(e) {}
}
