

export class ToolObject {
    constructor(engine,options) {
      this.engine = engine;
      options = options || {};
      this.name = options.ros || "NONE";
      this.icon = ["fas", "ban"];
      this.visible = true;
      this.enabled = true;
    }

    draw(tr) {}
    update(t) {}
    exit() {}

    
    getName(){
        return this.name;
    }
    getCursor(){
      return 'none';
    }

    onMouseDown(e){

    }

    onMouseMove(e){

    }

    onMouseUp(e){

    }
    onMouseWheel(e){

    }
    onTouchStart(e){

    }
    onTouchMove(e){

    }
    onTouchEnd(e){

    }



}