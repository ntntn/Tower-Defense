import Enemy from './Enemy'

class Projectile extends Phaser.GameObjects.Sprite{
    
    speed:number
    target:Enemy
    constructor(scene,x,y, target, texture = 'projectile', speed = 6){
        super(scene,x,y,texture);
        this.displayWidth = 48;
        this.displayHeight = 48;
        this.speed = speed;
        this.target = target;
        scene.add.existing(this);
    }

    update(scene){
        let direction = new Phaser.Math.Vector2(this.target.x, this.target.y).subtract(new Phaser.Math.Vector2(this.x,this.y))

        if (this.targetReached(direction)){
            scene.projectiles = scene.projectiles.filter((proj) => proj != this);
            this.destroy();
        }

        direction = direction.normalize();
        this.x+=direction.x*this.speed;
        this.y+=direction.y*this.speed;
    }

    
    targetReached(direction){
        return direction.length()<=10;
    }
}

export default Projectile;