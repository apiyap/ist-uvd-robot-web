import {
  scale,
  inverse,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import { ToolObject } from "./ToolObject";
import { ToolZoomPan } from "./Tools/ToolZoomPan";
import { ToolPointer } from "./Tools/ToolPointer";
import { ToolLine } from "./Tools/ToolLine";
import { ToolPolyLine } from "./Tools/ToolPolyLine";
import { ToolRect } from "./Tools/ToolRect";
import { ToolCircle } from "./Tools/ToolCircle";
import { ToolDocking } from "./Tools/ToolDocking";
import { ToolRoom } from "./Tools/ToolRoom";
import { ToolRoute } from "./Tools/ToolRoute";
import { ToolNoGo } from "./Tools/ToolNoGo";
import { ToolText } from "./Tools/ToolText";

export class EditorCanvas {
  static min_scale = 0.25;
  static max_scale = 6.0;
  constructor(canvas) {
    // Get a reference to the canvas
    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.secondsPassed = 0.0;
    this.oldTimeStamp = 0.0;

    this.pos = { x: 0, y: 0 };
    this.rot = 0;
    this.scale = 1;
    this.scaleStep = 0.25;

    this.canvasObjects = [];
    this.activeTool = "NONE";
    this.cursor = null;
    this.toolObjects = {
      // NONE : new ToolObject(this),
      POINTER: new ToolPointer(this),
      ZOOMPAN: new ToolZoomPan(this),
      LINE: new ToolLine(this),
      POLYLINE: new ToolPolyLine(this),
      RECT: new ToolRect(this),
      CIRCLE: new ToolCircle(this),
      TEXT: new ToolText(this),
      DOCKING: new ToolDocking(this),
      ROOM: new ToolRoom(this),
      ROUTE: new ToolRoute(this),
      NOGO: new ToolNoGo(this),
    };

    this.mapObj = null;

    // mouse event
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    this.canvas.addEventListener(
      "DOMMouseScroll",
      (e) => this.handleScroll(e),
      false
    );
    this.canvas.addEventListener(
      "mousewheel",
      (e) => this.handleScroll(e),
      false
    );

    this.canvas.addEventListener(
      "touchstart",
      (e) => this.touchStartHandler(e),
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      (e) => this.touchMoveHandler(e),
      false
    );
    this.canvas.addEventListener(
      "touchend",
      (e) => this.touchEndHandler(e),
      false
    );
  }

  add(obj){
    this.canvasObjects.unshift(obj);
  }

  //Export
  getCanvas() {
    return this.canvas;
  }

  getImage() {
    const img = new Image();
    const data = this.canvas.toDataURL("image/png");
    img.src = data;
    return img;
  }

  ///Event  Handle
  handleScroll(evt) {
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseWheel(evt);
    }
    return evt.preventDefault() && false;
  }

  onMouseDown(event) {
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseDown(event);
    }
  }
  onMouseMove(event) {
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseMove(event);
    }
  }
  onMouseUp(event) {
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onMouseUp(event);
    }
  }

  touchStartHandler(e) {
    e.preventDefault();

    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchStart(e);
    }
  }
  touchMoveHandler(e) {
    e.preventDefault();
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchMove(e);
    }
  }
  touchEndHandler(e) {
    e.preventDefault();
    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].onTouchEnd(e);
    }
  }

  scaleUp() {
    if (this.scale < EditorCanvas.max_scale) this.scale += this.scaleStep;
    this.viewToMap();
  }

  scaleDown() {
    if (this.scale > EditorCanvas.min_scale) this.scale -= this.scaleStep;
    this.viewToMap();
  }
  setScale(v) {
    this.scale = v;
    if (this.scale > EditorCanvas.max_scale) this.scale = EditorCanvas.max_scale;
    if (this.scale < EditorCanvas.min_scale) this.scale = EditorCanvas.min_scale;
    this.viewToMap();
  }

  getTransform() {
    return compose(
      translate(this.pos.x, this.pos.y),
      rotate(this.rot),
      scale(this.scale, this.scale)
    );
  }
  setActiveTool(v) {
    if (this.toolObjects[v]) {
      this.activeTool = v;
      this.cursor = this.toolObjects[v].getCursor();
      //console.log(this.cursor);
      this._setCursor();
    }
  }

  _setCursor() {
    if (this.cursor !== null || this.cursor !== "") {
      this.canvas.style.cursor = this.cursor;
    } else this.canvas.style.cursor = "default";
  }


  rotateViewLeft() {
    var step = Math.PI / 2;
    this.rot -= step;

    this.rot = Math.round(this.rot / step) * step;
    this.viewToMap();
    this.viewToMap();

  }

  rotateViewRight() {
    var step = Math.PI / 2;

    this.rot += step;
    //vec.x = Mathf.Round(vec.x / 90) * 90;
    //(Math.ceil(number*20)/20)
    this.rot = Math.round(this.rot / step) * step;
    this.viewToMap();
    this.viewToMap();

  }

  viewToMap() {
    //From Screen coordinate
    var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    //to world coordinate
    var ctW = applyToPoint(inverse(this.getTransform()), ct);
    if (this.mapObj !== null) {
      var rW = applyToPoint(
        compose(this.mapObj.getTransform()),
        this.mapObj.getMapOrigin()
      );
      var diff = { x: ctW.x - rW.x, y: ctW.y - rW.y };
      var dW = applyToPoint(this.getTransform(), diff); // apply diff to world coordinate
      // console.log("Rot:" + radians_to_degrees(this.rot));
      // console.log("Diff:");
      // console.log(dW);

      this.pos.x = dW.x;
      this.pos.y = dW.y;
    }
  }


  init() {
    // Loop over all game objects
    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].init();
      if (this.canvasObjects[i].name === "ImageMapClient") {
        this.mapObj = this.canvasObjects[i];
      }
      
    }
    this.gameLoop(0);
  }

  gameLoop(timeStamp) {
    // Update game objects in the loop
    // Calculate how much time has passed
    this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    this.secondsPassed = Math.min(this.secondsPassed, 0.1);

    // Pass the time to the update
    this.update(this.secondsPassed);
    this.draw();
    // console.log("time:" + timeStamp)

    window.requestAnimationFrame((timeStamp) => {
      this.gameLoop(timeStamp);
    });
  }

  update(secondsPassed) {
    // Loop over all game objects
    for (let i = 0; i < this.canvasObjects.length; i++) {
      if (this.canvasObjects[i].enabled)
        this.canvasObjects[i].update(secondsPassed);
    }

    //detectCollisions();

    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].update(secondsPassed);
    }
  }

  draw() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    //World coordinate
    this.context.save();

    this.context.translate(this.pos.x, this.pos.y);
    this.context.rotate(this.rot);
    this.context.scale(this.scale, this.scale);

    // Do the same to draw
    let tr = this.context.getTransform();
    //this.context.setTransform(tr) ;
    for (let i = 0; i < this.canvasObjects.length; i++) {
      if (this.canvasObjects[i].visible === true)
        this.canvasObjects[i].draw(tr);
    }

    this.context.restore();

    // var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    // //from world coordinate
    // var ctW = applyToPoint(inverse(this.getTransform()), ct); // drawin world coordinate
    // drawCross(this.context, ctW, 20, "orange");

    // if (this.gridObj !== null) {
    //   var rW = applyToPoint(
    //     compose(this.gridObj.getTransform()),
    //     this.gridObj.getRobotPixel()
    //   );
    //   drawCross(this.context, rW, 20, "orange");
    // }

    //World coordinate
    this.context.save();

    this.context.translate(this.pos.x, this.pos.y);
    this.context.rotate(this.rot);
    this.context.scale(this.scale, this.scale);

    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].draw();
    }

    this.context.restore();

    //for DEBUG coordinate
    //Screen coordinate

    // var p = applyToPoint(this.getTransform(), { x: 0, y: 0 });
    // drawCross(this.context, p, 20, "red");

    // //get Robot position from screen coordinate
    // if (this.gridObj !== null) {
    //   var r = applyToPoint(
    //     compose(this.getTransform(), this.gridObj.getTransform()),
    //     this.gridObj.getRobotPixel()
    //   );
    //   drawCross(this.context, r, 20, "blue");

    //   this.context.beginPath();
    //   this.context.moveTo(ct.x, ct.y);
    //   this.context.lineTo(r.x, r.y);
    //   this.context.moveTo(ct.x, ct.y);
    //   this.context.lineTo(p.x, p.y);
    //   //ctx.strokeStyle = color;
    //   this.context.stroke();
    // }

    // drawCross(this.context, ct, 20);
  }

  exit() {
    for (let i = 0; i < this.toolObjects.length; i++) {
      this.toolObjects[i].exit();
    }

    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].exit();
    }
  }
}
