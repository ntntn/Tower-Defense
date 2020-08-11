import Tower from "./Tower";

class TowerFactory {
    x:number
    y:number
    type:string
    scene:Phaser.Scene
    constructor(x,y,type, scene){
        this.x = x;
        this.y = y;
        this.type = type;
        this.scene = scene;
    }

    produce(){
        console.log(this.type);
        switch(this.type){
            case 'tower':
                return new Tower(this.scene,this.x,this.y,'tower');
            case 'multistrikeTower':
                return new Tower(this.scene,this.x,this.y,'multistrikeTower');
            default:
                return new Tower(this.scene,this.x,this.y, this.type);
                break;
        }
    }
}

export default TowerFactory