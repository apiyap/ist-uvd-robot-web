import { ToolObject } from "../ToolObject";

export class ToolPointer extends ToolObject {
  constructor(engine, options) {
    super(engine, options);
    options = options || {};
    this.name = options.ros || "POINTER";
    this.icon = ["fas", "mouse-pointer"];
    this.visible = true;
    this.enabled = true;
    this.cursor = "default";
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
