import Enemy from './Enemy'

class Projectile extends Phaser.GameObjects.Sprite{
    
    speed:number
    target:Enemy
    damage:number
    constructor(scene,x,y, target, damage = 5, speed = 6, texture = 'projectile'){
        super(scene,x,y,texture);
        this.displayWidth = 48;
        this.displayHeight = 48;
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        scene.add.existing(this);
    }

    update(scene){
        //FIXME
        if (this.target.dead) this.destroy(scene);

        let direction = new Phaser.Math.Vector2(this.target.x, this.target.y).subtract(new Phaser.Math.Vector2(this.x,this.y))

        if (this.targetReached(direction)){
            this.damageTarget(scene);
            this.destroy(scene);
        }

        direction = direction.normalize();
        this.x+=direction.x*this.speed;
        this.y+=direction.y*this.speed;
    }

    
    targetReached(direction){
        return direction.length()<=10;
    }

    damageTarget(scene){
        this.target.takeDamage(this.damage);
    }

    destroy(scene){
        super.destroy();
        scene.projectiles = scene.projectiles.filter((proj) => proj != this);
    }

}

export default Projectile;