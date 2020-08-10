import GameScene from "./GameScene";

class Enemy extends Phaser.GameObjects.Sprite{
    speed:number
    waypoints:Phaser.Math.Vector2[]
    portal:Phaser.Math.Vector2
    reachedPortal:boolean
    hp:number
    constructor(scene, x, y, hp=10, speed=2){
        super(scene,x,y,'enemy');

        //FIXME
        this.displayHeight = 128;
        this.displayWidth = 128;

        this.hp = hp;
        this.speed = speed;
        this.waypoints = [];

        this.reachedPortal = false;

        scene.add.existing(this);
    }

    moveAlongPath(){
        if (this.waypoints[0] == undefined) return;
        if (this.isPathFinished()){
            this.handlePathFinished();
        }

        let dx = this.waypoints[0].x - this.x;
        let dy = this.waypoints[0].y - this.y;

        let magnitude = Math.sqrt(dx*dx+dy*dy);

/*         if (this.waypoints[0].x == this.portal.x && this.waypoints[0].y == this.portal.y) {
            //destroy this enemy
            if (magnitude<1){
                this.reachedPortal = true;
                this.destroy();
            }
        } */       

        if (magnitude>1){
            dx /= magnitude;
            dy /= magnitude;            
        }
        else this.waypoints.shift();    

        this.move(dx,dy);
    }

    isPathFinished(){
        let dx = this.x - this.portal.x;
        let dy = this.y - this.portal.y;
        let magnitude = Math.sqrt(dx*dx+dy*dy);
        return magnitude<1;
    }

    handlePathFinished(){
        this.reachedPortal = true;
        this.destroy();
    }

    setWaypoints(waypoints){
        let pt = waypoints[waypoints.length-1];
        this.portal = new Phaser.Math.Vector2(pt.x,pt.y);

        for (let i=0; i<waypoints.length; i++){
            this.waypoints[i] = new Phaser.Math.Vector2(waypoints[i].x, waypoints[i].y);
        }        
    }


    move(dx,dy){
        this.x+=dx*this.speed;
        this.y+=dy*this.speed;
    }
}

export default Enemy;