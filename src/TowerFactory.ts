import ProjectileTower from './ProjectileTower';
import MultistrikeTower from './MultistrikeTower';
import LazerTower from "./LazerTower";

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
                return new ProjectileTower(this.scene,this.x,this.y, this.type);
            case 'multistrikeTower':
                return new MultistrikeTower(this.scene,this.x,this.y, this.type);
            case 'lazerTower':
                return new LazerTower(this.scene, this.x, this.y, this.type);
            default:
                return new ProjectileTower(this.scene,this.x,this.y, this.type);
                break;
        }
    }
}

export default TowerFactory