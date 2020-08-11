import GameObject from './GameObject';

class Tower extends GameObject {
    range:number
    time:number
    cooldown:number
    timer:Phaser.Time.TimerEvent
    constructor(scene, x, y, texture = 'tower'){
        super(scene,x,y,texture);
        this.displayHeight = 160;
        this.displayWidth = 80;
        scene.add.existing(this);
    }

    update(scene){
    }
}

export default Tower;