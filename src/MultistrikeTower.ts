import Tower from './Tower';
import Enemy from './Enemy';
import Projectile from './Projectile';

class MultistrikeTower extends Tower {
    range: number
    time: number
    cooldown: number
    timer: Phaser.Time.TimerEvent
    maxTargets: number
    constructor(scene, x, y, texture = 'tower', range = 2, cooldown = 1, maxTargets = 3) {
        super(scene, x, y, texture);

        this.range = range;
        this.time = cooldown;
        this.cooldown = cooldown;
        this.timer = undefined;
        this.maxTargets = maxTargets;
    }

    update(scene) {
        //FIXME (scene.enemyManager.getEnemies())??
        if (!this.timer || this.timer.getProgress() === 1) {
            console.log('update');

            let enemies = scene.objects.filter((obj) => obj instanceof Enemy);
            let targets = [];

            for (let i = 0; i < enemies.length; i++) {
                let e = enemies[i];
                let distance = new Phaser.Math.Vector2(e.x, e.y).subtract(new Phaser.Math.Vector2(this.x, this.y)).length();
                if (distance <= this.range * scene.tileSize) {
                    targets.push(e);
                }
                console.log(targets);
                if (targets.length === this.maxTargets) {
                    break;
                }
            }

            for (let j = 0; j < targets.length; j++) {
                this.attack(scene, targets[j]);
            }
            this.startCooldown(scene);
        }
    }

    startCooldown(scene) {
        this.timer = scene.time.delayedCall(this.cooldown * 1000, () => { });
    }

    attack(scene, enemy) {
        console.log('Attack');
        //addobject Emit Event.....?
        scene.objects.push(new Projectile(scene, this.x, this.y - 60, enemy, 2, 'fireball'));
    }
}

export default MultistrikeTower;