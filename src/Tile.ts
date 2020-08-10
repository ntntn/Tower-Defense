import GameScene from "./GameScene";

class Tile{

    x:number;
    y:number;
    type:string;
    scene:GameScene
    
    constructor(x, y, type = null, scene = null){
        this.x = x;
        this.y = y;
        this.type = type;
        this.scene = scene;
    }
}

export default Tile;