import {
  scale,
  inverse,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import { drawCross, toRadians, toDegrees } from "../NavCanvas/Utiles";

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

import { ImageMapClient } from "./Objects/ImageMapClient";

export class EditorCanvas {
  static min_scale = 0.25;
  static max_scale = 6.0;
  constructor(canvas, options) {
    options = options || {};
    this.ros = options.ros;

    // Get a reference to the canvas
    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.secondsPassed = 0.0;
    this.oldTimeStamp = 0.0;

    this.pos = { x: 0, y: 0 };
    this.rot = 0;
    this.scale = 1;
    this.scaleStep = 0.25;

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

  add(obj) {
    //this.canvasObjects.unshift(obj);
    this.canvasObjects.push(obj);
    return this.canvasObjects.length - 1;
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

  scaleUp(p) {
    var old = this.scale;
    if (this.scale < EditorCanvas.max_scale) this.scale += this.scaleStep;
    var scalechange = this.scale - old;
    this.viewToCursor(p, scalechange);
    //this.viewToMap();
  }

  scaleDown(p) {
    var old = this.scale;
    if (this.scale > EditorCanvas.min_scale) this.scale -= this.scaleStep;
    var scalechange = this.scale - old;
    this.viewToCursor(p, scalechange);
    //this.viewToMap();
  }
  setScale(v) {
    this.scale = v;
    if (this.scale > EditorCanvas.max_scale)
      this.scale = EditorCanvas.max_scale;
    if (this.scale < EditorCanvas.min_scale)
      this.scale = EditorCanvas.min_scale;
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
    // this.viewToMap();
    // this.viewToMap();
    this.viewAll();
  }

  rotateViewRight() {
    var step = Math.PI / 2;

    this.rot += step;
    //vec.x = Mathf.Round(vec.x / 90) * 90;
    //(Math.ceil(number*20)/20)
    this.rot = Math.round(this.rot / step) * step;
    // this.viewToMap();
    // this.viewToMap();
    this.viewAll();
  }

  viewToMap() {
    //From Screen coordinate
    var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    //to world coordinate
    var ctW = applyToPoint(inverse(this.getTransform()), ct);
    if (this.mapObj !== null) {
      var ctMap = this.mapObj.getMapOrigin();
      var rW = applyToPoint(this.mapObj.getTransform(), ctMap);
      var diff = { x: ctW.x - rW.x, y: ctW.y - rW.y };
      var dW = applyToPoint(this.getTransform(), diff); // apply diff to world coordinate
      // console.log("Rot:" + radians_to_degrees(this.rot));
      // console.log("Diff:");

      this.pos.x = dW.x;
      this.pos.y = dW.y;
    }
  }

  viewToCursor(p, scalechange) {
    //to world coordinate
    var ctW = applyToPoint(inverse(this.getTransform()), p);

    var offsetX = -(ctW.x * scalechange);
    var offsetY = -(ctW.y * scalechange);

    this.pos.x += offsetX;
    this.pos.y += offsetY;
  }

  getMinMax() {
    var min_x = Number.MAX_SAFE_INTEGER;
    var min_y = Number.MAX_SAFE_INTEGER;
    var max_x = Number.MIN_SAFE_INTEGER;
    var max_y = Number.MIN_SAFE_INTEGER;

    for (let i = 0; i < this.canvasObjects.length; i++) {
      var p = this.canvasObjects[i].getMinMaxWorld();
      // console.log(p);
      min_x = Math.min(min_x, p.min.x);
      min_y = Math.min(min_y, p.min.y);
      max_x = Math.max(max_x, p.max.x);
      max_y = Math.max(max_y, p.max.y);
    }
    // console.log(
    //   "min X:" + min_x + ",Y:" + min_y + ", max X:" + max_x + ", Y:" + max_y
    // );

    return {
      min: {
        x: min_x,
        y: min_y,
      },
      max: {
        x: max_x,
        y: max_y,
      },
    };
  }

  viewAll() {
    var bound = this.getMinMax();
    //console.log(bound)
    var scalX = this.canvas.width / (bound.max.x - bound.min.x);
    var scalY = this.canvas.height / (bound.max.y - bound.min.y);
    var sc = Math.min(scalX, scalY);
    //console.log("view scale:"+sc)
    this.setScale(sc);
    //console.log(this.scale)
  }

  imageReady() {
    console.log("imageReady");
    this.viewAll();
  }

  init() {
    console.log("init");
    this.mapObj = new ImageMapClient(this, 0, 0, {
      ros: this.ros,
      callBack: () => this.imageReady(),
    });

    this.canvasObjects = [this.mapObj];

    // Loop over all game objects
    for (let i = 0; i < this.canvasObjects.length; i++) {
      this.canvasObjects[i].init();
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
    let tr = this.getTransform();
    //this.context.setTransform(tr) ;
    for (let i = 0; i < this.canvasObjects.length; i++) {
      if (this.canvasObjects[i].visible === true)
        this.canvasObjects[i].draw(tr);
    }

    this.context.restore();

    //World coordinate
    // this.context.save();

    // this.context.translate(this.pos.x, this.pos.y);
    // this.context.rotate(this.rot);
    // this.context.scale(this.scale, this.scale);

    if (this.toolObjects[this.activeTool]) {
      this.toolObjects[this.activeTool].draw(tr);
    }

  //  this.context.restore();

    //for DEBUG coordinate
    //World coordinate
    // this.context.save();

    // this.context.translate(this.pos.x, this.pos.y);
    // this.context.rotate(this.rot);
    // this.context.scale(this.scale, this.scale);

    // var ct = { x: this.canvas.width / 2, y: this.canvas.height / 2 };

    // //Screen position on world coordinate

    // var p = applyToPoint(inverse(this.getTransform()), { x: 0, y: 0 });
    // drawCross(this.context, p, 20, "red");
    // //from world coordinate
    // var ctW = applyToPoint(inverse(this.getTransform()), ct); // drawin world coordinate
    // drawCross(this.context, ctW, 20, "orange");

    // if (this.toolObjects[this.activeTool]) {
    //   if (this.toolObjects[this.activeTool].dragInfo.isDragging) {
    //     var tp = applyToPoint(inverse(this.getTransform()), {
    //       x: this.toolObjects[this.activeTool].dragInfo.startX,
    //       y: this.toolObjects[this.activeTool].dragInfo.startY,
    //     });
    //     drawCross(this.context, tp, 20, "blue");
    //   }
    // }

    // this.context.restore();

    //Draw on screen coordinate
    // drawCross(this.context, ct, 10);
    // if (this.toolObjects[this.activeTool]) {
    //   if (this.toolObjects[this.activeTool].dragInfo.isDragging) {
        
    //     drawCross(this.context, {
    //       x: this.toolObjects[this.activeTool].dragInfo.startX,
    //       y: this.toolObjects[this.activeTool].dragInfo.startY,
    //     }, 20, "blue");
    //   }
    // }

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
