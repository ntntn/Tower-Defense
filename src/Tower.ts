import Projectile from './Projectile';

class Tower extends Phaser.GameObjects.Sprite {
    range:number
    time:number
    cooldown:number
    timer:Phaser.Time.TimerEvent
    constructor(scene, x, y, texture = 'tower', range = 2, cooldown = 1){
        super(scene,x,y,texture);
        this.displayHeight = 160;
        this.displayWidth = 80;
        scene.add.existing(this);
        
        this.range = range;
        this.time = cooldown;
        this.cooldown = cooldown;
        this.timer = undefined;
    }

    update(scene){
        //
        for (let i=0; i<scene.enemies.length; i++){
            let e = scene.enemies[i];
            let distance = new Phaser.Math.Vector2(e.x, e.y).subtract(new Phaser.Math.Vector2(this.x, this.y)).length();
            
            if (distance<=this.range*scene.tileSize){
                if (!this.timer || this.timer.getProgress() === 1){
                    this.startCooldown(scene);
                    this.attack(scene, scene.enemies[i]);
                }
            }
        }
    }

    startCooldown(scene){
        this.timer = scene.time.delayedCall(this.cooldown*1000, () => {});
    }

    attack(scene, enemy){
        console.log('Attack');
        scene.projectiles.push(new Projectile(scene, this.x, this.y-60, enemy));
    }
}

export default Tower;