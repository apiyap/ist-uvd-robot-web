import { ToolDrawObject } from "./ToolDrawObject";

export class ToolRect extends ToolDrawObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.name || "RECT";
    this.icon = ["fas", "vector-square"];
    this.visible = true;
    this.enabled = true;
    this.cursor = this._createCursor();
  }
  _createCursor() {
    var canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 18;
    var ctx = canvas.getContext("2d");

    // ctx.scale(
    //   canvas.width / ToolCursor.icon[0],
    //   canvas.height / ToolCursor.icon[1]
    // );
    ctx.save()
    ctx.fillStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(ctx.lineWidth,ctx.lineWidth);
    ctx.lineTo(canvas.width-ctx.lineWidth,ctx.lineWidth);
    ctx.lineTo(canvas.width-ctx.lineWidth,canvas.height - ctx.lineWidth);
    ctx.lineTo(ctx.lineWidth, canvas.height - ctx.lineWidth);
    ctx.lineTo(ctx.lineWidth,ctx.lineWidth);
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
    //console.log(ToolCursor.icon[4])
    //var path = new Path2D(ToolCursor.icon[4]);
    //ctx.fill(path);

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
