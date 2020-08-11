import Tower from './Tower';
import Enemy from './Enemy';
import Projectile from './Projectile';

class ProjectileTower extends Tower {
    range:number
    time:number
    cooldown:number
    timer:Phaser.Time.TimerEvent
    constructor(scene, x, y, texture = 'tower', range = 1.5, cooldown = 1){
        super(scene,x,y,texture);

        this.range = range;
        this.time = cooldown;
        this.cooldown = cooldown;
        this.timer = undefined;
    }

    update(scene){
        //FIXME (scene.enemyManager.getEnemies())??
        let enemies = scene.objects.filter((obj) => obj instanceof Enemy);

        for (let i=0; i<enemies.length; i++){
            let e = enemies[i];
            let distance = new Phaser.Math.Vector2(e.x, e.y).subtract(new Phaser.Math.Vector2(this.x, this.y)).length();
            
            if (distance<=this.range*scene.tileSize){
                if (!this.timer || this.timer.getProgress() === 1){
                    this.startCooldown(scene);
                    this.attack(scene, enemies[i]);
                }
            }
        }
    }

    startCooldown(scene){
        this.timer = scene.time.delayedCall(this.cooldown*1000, () => {});
    }

    attack(scene, enemy){
        console.log('Attack');
        //addobject Emit Event.....?
        scene.objects.push(new Projectile(scene, this.x, this.y-60, enemy));
    }
}

export default ProjectileTower;