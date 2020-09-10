import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import * as ROSLIB from "roslib";
import { CanvasObject } from "../CanvasObject";
import { drawCross, toRadians, toDegrees } from "../../NavCanvas/Utiles";

export class ImageMapClient extends CanvasObject {
  constructor(engine, x, y, options) {
    super(engine, x, y);
    this.name = "ImageMapClient";

    options = options || {};
    var ros = options.ros;
    var topic = options.topic || "/map";

    this.width = 40;
    this.height = 40;

    this.imgData = null;
    this.message = null;
    this.isRecieved = false;
    this.imageBitmap = null;

    // subscribe to the topic
    this.rosTopic = new ROSLIB.Topic({
      ros: ros,
      name: topic,
      messageType: "nav_msgs/OccupancyGrid",
      compression: "png",
    });

    this.rosTopic.subscribe((e) => this.messageCallback(e));
  }

  messageCallback(e) {
    // we only need this once
    this.rosTopic.unsubscribe();
    this.message = e; //save message
    //console.log(e);
    this.isRecieved = true;

  }

  // getRectangle() {
  //   return {
  //     x: this.pos.x,
  //     y: this.pos.y,
  //     width: this.width,
  //     height: this.height,
  //   };
  // }
  init() {}
  update(t) {
    if (this.message != null && this.isRecieved) {
      // set the size
      this.width = this.message.info.width;
      this.height = this.message.info.height;

      this.imgData = this.engine.context.createImageData(
        this.width,
        this.height
      );

      for (var row = 0; row < this.height; row++) {
        for (var col = 0; col < this.width; col++) {
          // determine the index into the map data
          var mapI = col + (this.height - row - 1) * this.width;
          // determine the value
          var data = this.message.data[mapI];
          var val;
          if (data === 100) {
            val = 0;
          } else if (data === 0) {
            val = 255;
          } else {
            val = 127;
          }

          // determine the index into the image data array
          var i = (col + row * this.width) * 4;
          // r
          this.imgData.data[i] = val;
          // g
          this.imgData.data[++i] = val;
          // b
          this.imgData.data[++i] = val;
          // a
          this.imgData.data[++i] = 255;
        }
      }
      this.isRecieved = false; //process completed

      createImageBitmap(this.imgData, 0, 0, this.width, this.height).then(
        (imageBitmap) => {this.imageBitmap = imageBitmap;
        //console.log(this.imageBitmap );
        }
      );
    }
  }

  
  draw(tr) {
    if (this.imageBitmap !== null) {
      this.engine.context.save();

      this.engine.context.translate(this.pos.x, this.pos.y);
      this.engine.context.drawImage(this.imageBitmap, 0, 0);
      this.drawMapGrid("blue", 0.1);

      drawCross(this.engine.context, this.getMapOrigin(), 6, "red", 0.5);
      this.engine.context.restore();
    }
  }
  getMapOrigin() {
    return this.getPixel({
      x: 0,
      y: 0,
    });
  }
    // ros to world
    getPixel(pos) {
        var x = 0;
        var y = 0;
        if (this.message) {
          x =
            (pos.x - this.message.info.origin.position.x) /
            this.message.info.resolution;
          y =
            this.height -
            (pos.y - this.message.info.origin.position.y) /
              this.message.info.resolution;
        }
    
        return {
          x: x,
          y: y,
        };
      }
    
      //world to ROS
      getRos(pos) {
        var rosX =
          pos.x * this.message.info.resolution +
          this.message.info.origin.position.x;
        var rosY =
          -(pos.y - this.height) * this.message.info.resolution +
          this.message.info.origin.position.y;
        return {
          x: rosX,
          y: rosY,
        };
      }

  drawMapGrid(color = "black", lineW = 1) {
    if (this.message) {
      var rosPosOrg = {
        x: this.message.info.origin.position.x,
        y: this.message.info.origin.position.y,
      };
      var rosMaxPos = {
        x: this.message.info.origin.position.x * -1,
        y: this.message.info.origin.position.y * -1,
      };
      var linesX = [];

      for (var x = rosPosOrg.x; x <= rosMaxPos.x; x++) {
        linesX.push({
          from: this.getPixel({ x: x, y: rosPosOrg.y }),
          to: this.getPixel({ x: x, y: rosMaxPos.y }),
        });
      }
      var linesY = [];
      for (var y = rosPosOrg.y; y <= rosMaxPos.y; y++) {
        linesY.push({
          from: this.getPixel({ x: rosPosOrg.x, y: y }),
          to: this.getPixel({ x: rosMaxPos.x, y: y }),
        });
      }

      this.engine.context.beginPath();

      for (let i = 0; i < linesX.length; i++) {
        this.engine.context.moveTo(linesX[i].from.x, linesX[i].from.y);
        this.engine.context.lineTo(linesX[i].to.x, linesX[i].to.y);
      }
      for (let i = 0; i < linesY.length; i++) {
        this.engine.context.moveTo(linesY[i].from.x, linesY[i].from.y);
        this.engine.context.lineTo(linesY[i].to.x, linesY[i].to.y);
      }

      this.engine.context.lineWidth = lineW;
      // set line color
      this.engine.context.strokeStyle = color;
      this.engine.context.stroke();
    }
  }


  exit() {
    if (this.rosTopic) this.rosTopic.unsubscribe();
  }
}
