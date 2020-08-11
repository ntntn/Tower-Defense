import Tower from './Tower';
import Enemy from './Enemy';
import Projectile from './Projectile';

class LazerTower extends Tower {
    range: number
    time: number
    cooldown: number
    timer: Phaser.Time.TimerEvent
    maxTargets: number
    sprite: Phaser.GameObjects.Sprite
    target: Enemy
    constructor(scene, x, y, texture = 'tower', range = 1, cooldown = 100, maxTargets = 1) {
        super(scene, x, y, texture);

        this.range = range;
        this.time = cooldown;
        this.cooldown = cooldown;
        this.timer = undefined;
        this.maxTargets = maxTargets;
    }

    update(scene) {
        let targets = [];
        //FIXME (scene.enemyManager.getEnemies())??
        if (!this.timer || this.timer.getProgress() === 1) {

            let enemies = scene.objects.filter((obj) => obj instanceof Enemy);
            

            for (let i = 0; i < enemies.length; i++) {
                let e = enemies[i];
                let distance = new Phaser.Math.Vector2(e.x, e.y).subtract(new Phaser.Math.Vector2(this.x, this.y)).length();
                if (distance <= this.range * scene.tileSize) {
                    targets.push(e);
                }

                if (targets.length === this.maxTargets) {
                    break;
                }
            }

            for (let j = 0; j < targets.length; j++) {
                this.attack(scene, targets[j]);
            }
            
        }
        
        if (this.sprite && this.target){
            let distance = new Phaser.Math.Vector2(this.target.x-this.x, this.target.y-this.y);
            this.sprite.displayHeight = distance.length();
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        }
    }

    startCooldown(scene) {
        this.timer = scene.time.delayedCall(this.cooldown * 1000, () => { });
    }

    attack(scene, enemy) {
        this.sprite?.destroy();

        this.target = enemy;
        let distance = new Phaser.Math.Vector2(enemy.x-this.x, enemy.y-this.y);
        this.sprite = scene.add.sprite(this.x,this.y,'lazer');
        this.sprite.displayWidth = 64;
        
        this.sprite.displayHeight = distance.length();
        console.log(Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y));
        //this.sprite.rotation = -Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        scene.anims.play('blast', this.sprite);

        this.startCooldown(scene);
    }
}

export default LazerTower;