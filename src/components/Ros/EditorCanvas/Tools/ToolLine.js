import { ToolObject } from "../ToolObject";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faPencilAlt);

const ToolCursor = icon({ prefix: "fas", iconName: "pencil-alt" });

export class ToolLine extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "LINE";
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
    ctx.save()
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

    ctx.save()
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(ctx.lineWidth,canvas.height-ctx.lineWidth);
    ctx.lineTo(ctx.lineWidth,canvas.height - ctx.lineWidth+6);
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(0,canvas.height - (ctx.lineWidth+2));
    // ctx.lineTo(ctx.lineWidth + 6,canvas.height - (ctx.lineWidth+2));
    // ctx.stroke();
    ctx.restore();

    var dataURL = canvas.toDataURL("image/png");
    return "url(" + dataURL + ") 2 22, pointer";
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
