import {
  // scale,
  inverse,
  // rotate,
  // translate,
  // compose,
  applyToPoint,
} from "transformation-matrix";

export class ToolObject {
  constructor(engine, options) {
    this.engine = engine;
    options = options || {};
    this.name = options.ros || "NONE";
    this.icon = ["fas", "ban"];
    this.visible = true;
    this.enabled = true;
    this.cursor = "none";

    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      diffX: 0,
      diffY: 0,
      endX: 0,
      endY: 0,
    };

    this.touchesInfo = {
      touches: [],
      startDis: 0,
      moveDis: 0,
      startScale: 1,
      isScale: false,
      isPan: false,
      startAngle: 0,
      startRot: 0,
      isRotate: false,
      rot: 0,
    };
  }
  init() {}
  draw(tr) {}
  update(t) {}
  exit() {}

  toWorld(pos) {
    var tr = inverse(this.engine.getTransform()); // draw in world coordinate
    return applyToPoint(tr, {
      x: pos.x,
      y: pos.y,
    });
  }

  getName() {
    return this.name;
  }
  getCursor() {
    return this.cursor;
  }

  onMouseDown(e) {
    this._dragStart({ x: e.offsetX, y: e.offsetY });
  }

  onMouseMove(e) {
    this._dragMove({ x: e.offsetX, y: e.offsetY });
  }

  onMouseUp(e) {
    this._dragEnd({ x: e.offsetX, y: e.offsetY });
  }

  onMouseWheel(e) {}

  onTouchStart(e) {
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();

    // console.log(touch);
    this._dragStart({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
  }
  onTouchMove(e) {

    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();

    //console.log(touch);
    this._dragMove({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });

  }
  onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const rect = e.target.getBoundingClientRect();

    //console.log(touch);
    this._dragEnd({ x: touch.clientX - rect.x, y: touch.clientY - rect.y });
  }

  _dragStart(p) {
    this.dragInfo.isDragging = true;
    this.dragInfo.startX = p.x; 
    this.dragInfo.startY = p.y; 
    this.dragInfo.moveX = p.x; 
    this.dragInfo.moveY = p.y; 

    this.dragInfo.diffX = 0;
    this.dragInfo.diffY = 0;
    // this.dragInfo.canvasX = this.engine.pos.x;
    // this.dragInfo.canvasY = this.engine.pos.y;
    //console.log("X:" + this.dragInfo.startX + ",Y:" + this.dragInfo.startY)
  }
  _dragMove(p) {
    if (this.dragInfo.isDragging) {
      this.dragInfo.moveX = p.x;
      this.dragInfo.moveY = p.y;
      this.dragInfo.diffX =  p.x /* event.clientX */ - this.dragInfo.startX;
      this.dragInfo.diffY =  p.y /* event.clientY */ - this.dragInfo.startY;
    }

  }

  _dragEnd(p) {
    if (this.dragInfo.isDragging) {
      this.dragInfo.isDragging = false;
      this.dragInfo.endX = p.x;
      this.dragInfo.endY = p.y;
    }
  }

}
