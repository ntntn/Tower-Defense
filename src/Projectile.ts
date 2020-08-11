import Enemy from './Enemy'

class Projectile extends Phaser.GameObjects.Sprite{
    
    speed:number
    target:Enemy
    damage:number
    constructor(scene,x,y, target, damage = 5, texture = 'projectile', speed = 6){
        super(scene,x,y,texture);
        this.displayWidth = 48;
        this.displayHeight = 48;
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        scene.add.existing(this);
    }

    update(scene){
        let direction = new Phaser.Math.Vector2(this.target.x, this.target.y).subtract(new Phaser.Math.Vector2(this.x,this.y))

        if (this.targetReached(direction)){
            this.damageTarget();
            this.destroy();
            return;
        }

        direction = direction.normalize();
        this.x+=direction.x*this.speed;
        this.y+=direction.y*this.speed;
    }

    
    targetReached(direction:Phaser.Math.Vector2){
        return direction.length()<=10;
    }

    damageTarget(){
        this.target.takeDamage(this.damage);
    }

    destroy(){
        this.scene.events.emit('destroyobject',this);
        super.destroy();
    }

}

export default Projectile;