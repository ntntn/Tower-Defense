import GameObject from "./GameObject";
import { GameObjects } from "phaser";

class Enemy extends GameObject{
    speed:number
    waypoints:Phaser.Math.Vector2[]
    portal:Phaser.Math.Vector2
    reachedPortal:boolean
    hp:number
    dead: boolean
    constructor(scene, x, y, hp=10, speed=2){
        super(scene,x,y,'enemy');

        //FIXME
        this.displayHeight = 128;
        this.displayWidth = 128;

        this.hp = hp;
        this.speed = speed;
        this.waypoints = [];

        this.reachedPortal = false;
    }

    update(scene){
        if (this.isPathFinished()){
            this.handlePathFinished();
        }
        
        this.moveAlongPath();
    }

    moveAlongPath(){
        if (this.waypoints[0] == undefined) return;

        let dx = this.waypoints[0].x - this.x;
        let dy = this.waypoints[0].y - this.y;
        let vec = new Phaser.Math.Vector2(dx,dy);

        if (vec.length()<1) this.waypoints.shift();
        vec = vec.normalize();
        this.move(vec.x,vec.y);
    }

    isPathFinished(){
        let dx = this.x - this.portal.x;
        let dy = this.y - this.portal.y;
        let magnitude = Math.sqrt(dx*dx+dy*dy);
        return magnitude<1;
    }

    setWaypoints(waypoints){
        let pt = waypoints[waypoints.length-1];
        this.portal = new Phaser.Math.Vector2(pt.x,pt.y);

        for (let i=0; i<waypoints.length; i++){
            this.waypoints[i] = new Phaser.Math.Vector2(waypoints[i].x, waypoints[i].y);
        }        
    }

    takeDamage(value){
        this.hp -= value;

        if (this.hp<=0){
            this.handleDeath();
        }
    }

    handlePathFinished(){
        this.reachedPortal = true;
        //FIXME
        this.dead = true;

        this.scene.events.emit('enemyreached', this);

        this.destroy();
    }

    handleDeath(){
        //FIXME
        if (this.dead) return;

        this.scene.events.emit('destroyobject', this);
        //FIXME
        this.dead = true;

        this.destroy();
    }

    move(dx,dy){
        this.x+=dx*this.speed;
        this.y+=dy*this.speed;
    }
}

export default Enemy;