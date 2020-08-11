import Enemy from './Enemy';
import Tile from './Tile';
import Tower from './Tower';
import Projectile from './Projectile';
import GameObject from './GameObject';
import WorldMap from './WorldMap';
import Builder from './Builder';
import TowerFactory from './TowerFactory';

class GameScene extends Phaser.Scene {

    tileSize: number
    towerSize: number
    portalItera: number
    portals: Tile[]
    objects: GameObject[]
    enemySprites: Phaser.GameObjects.Sprite[]
    started: boolean
    towers: Tower[]
    map:WorldMap
    builder:Builder
    sprites:Phaser.GameObjects.Sprite[]

    projectiles: Projectile[];

    preload() {
        this.load.image('simpleTile', './assets/sprites/grass_tile_1.png')
        this.load.image('roadTile', './assets/sprites/road_tile.png')
        this.load.image('tower', './assets/sprites/tower.png');

        this.load.image('multistrikeTower', './assets/sprites/multistrikeTower.png');
        this.load.image('slowTower', './assets/sprites/slowTower.png');
        this.load.image('magicTower', './assets/sprites/magicTower.png');

        this.load.image('projectile', './assets/sprites/projectile.png');
        this.load.spritesheet('enemyPortal', './assets/sprites/portal.png', {
            frameWidth: 1024,
            frameHeight: 1024,
        });
        this.load.spritesheet('playerPortal', './assets/sprites/portal2.png', {
            frameWidth: 1024,
            frameHeight: 1024,
        });
        this.load.image('start', './assets/sprites/start.png');
        this.load.image('enemy', './assets/sprites/enemy3.png');
    }

    create() {
        this.tileSize = 128;
        this.map = new WorldMap(this.tileSize,100);
        this.builder = new Builder(this);
        this.builder.buildMap(this.map.array);       

        this.portalItera = 0;
        this.portals = [];   
        this.objects = [];     

        this.add.sprite(1300, 900, 'start').setInteractive().on('pointerdown', this.handleStart, this);

        this.addListeners();
        this.createUI();
    }

    createUI(){
        this.sprites = [];
        this.addTowerPanel(1200,100, 'tower');
        this.addTowerPanel(1200,228, 'multistrikeTower');
        this.addTowerPanel(1200,228+128, 'slowTower');
        this.addTowerPanel(1200,228+128*2, 'magicTower');
    }

    addTowerPanel(x,y,label){
        this.add.text(x+50,y,label);
        let sprite = this.add.sprite(x, y, label);
        sprite.displayHeight = 128; 
        sprite.displayWidth = 64;
        sprite.alpha = 0.5;
        this.sprites.push(sprite);
        sprite.setInteractive().on('pointerdown', function() { 
            for (let i=0; i<this.scene.sprites.length; i++){
                this.scene.sprites[i].alpha = 0.5;
            }
            this.sprite.alpha = 1; 
            this.scene.builder.buildmode = label;
        }, { scene:this, sprite:sprite });
    }


    addListeners(){
        this.events.addListener('destroyobject', this.destroyObject, this);
        this.events.addListener('enemyreached', this.destroyObject, this);
    }

    destroyObject(obj){
        this.objects = this.objects.filter((object) => object!=obj);
    }

    update() {
        this.objects.some((object) => {
            object.update(this);
        });
    }

    handleStart(this: GameScene) {
        this.createEnemies(10, this.portals[0]);
        this.started = true;
    }

    //EnemyManager??
    createEnemies(count, startingPoint){
        let waypoints = this.map.getWaypoints(this.portals[0]);
        for (let i=0; i<waypoints.length; i++){
            this.map.scaleToScreen(waypoints[i]);
        }

        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i*1000, function(scene){
                let enemy = new Enemy(scene,startingPoint.x * scene.tileSize + 100, startingPoint.y * scene.tileSize + 100);
                enemy.setWaypoints(waypoints);
                scene.objects.push(enemy);
            }, [this]);
        }
    }

    handleClick(this: Tile) {
        let scene = this.scene;   
        console.log(this);
        // buildTower/buildPortal
        let sprite;
        switch (this.type) {
            case 'roadTile':
                scene.portals.push(new Tile(this.x, this.y));
                scene.builder.buildAnimated(this.x, this.y, scene.portalItera % 2 == 0 ? 'enemyPortal' : 'playerPortal');
                scene.portalItera++;
                break;
            default:
                sprite = 'tower';
                let vec = {x:this.x, y:this.y};
                scene.map.scaleToScreen(vec);
                console.log(vec);
                let tower = new TowerFactory(vec.x,vec.y, scene.builder.buildmode, scene).produce();
                console.log(tower);
                scene.objects.push(tower);
                //scene.objects.push(new Tower(scene,this.x*scene.tileSize+100, this.y*scene.tileSize+100));
                break;
        }
    }
}

export default GameScene