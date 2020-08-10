import Enemy from './Enemy';
import Tile from './Tile';
import Tower from './Tower';
import Projectile from './Projectile';

class GameScene extends Phaser.Scene {

    tileSize: number
    towerSize: number
    portalItera: number
    portals: Tile[]
    enemies: Enemy[]
    enemySprites: Phaser.GameObjects.Sprite[]
    started: boolean
    map: number[][]
    towers: Tower[]

    projectiles: Projectile[];

    preload() {
        this.load.image('simpleTile', './assets/sprites/grass_tile_1.png')
        this.load.image('roadTile', './assets/sprites/road_tile.png')
        this.load.image('tower', './assets/sprites/tower.png');
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

        this.map = [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]

/*         this.map = [
            [0, 0, 0, 0, 1, 1, 1, 0],
            [1, 1, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 0, 0],
            [1, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ] */

        this.tileSize = 128

        this.drawMap(this.map);
       

        this.portalItera = 0;
        this.portals = [];
        this.enemies = [];
        this.towers = [];
        this.enemySprites = [];
        this.projectiles = [];

        this.events.addListener('enemydeath', this.handleEnemyDeath, this);

        let start = this.add.sprite(500, 1150, 'start');
        start.setInteractive();
        start.on('pointerdown', this.handleStart, this);
    }

    handleEnemyDeath(enemy){
        this.enemies = this.enemies.filter((en) => en!=enemy);
    }

    drawMap(map){
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                let type: String
                switch (map[y][x]) {
                    case 1:
                        //build road Tile
                        type = 'roadTile'
                        this.buildTile(x, y, type)
                        break
                    case 0:
                        //build simple Tile
                        type = 'simpleTile';
                        this.buildTile(x, y, type);
                        break
                }
            }
        }
    }

    update() {
        //тупо сделать OBJECTS.SOME(OBJ.UPDATE(scene)) для всех обжектов и не париться
        this.towers.some((tower) => {
            tower.update(this);
        });

        this.projectiles.some((proj)=>{
            proj.update(this);
        });

        this.enemies.some((enemy) => {
            enemy.moveAlongPath();
            if (enemy.reachedPortal) this.handleEnemyReachedPortal(enemy);
        });
    }

    handleEnemyReachedPortal(enemy) {
        this.enemies = this.enemies.filter((en) => en != enemy);
        enemy.destroy();
    }

    //Map class?
    getWaypoints(map, start) {
        let waypoints = [];
        waypoints.push({ x: start.x, y: start.y });

        //while (true) 
        for (let i = 0; i <= 9999; i++) {
            let neighbours = this.getNeighbours(map, waypoints[i]);

            neighbours = neighbours.filter((tile) => {
                let flag = true;
                waypoints.some((p) => {
                    if (p.x == tile.x && p.y == tile.y) {
                        flag = false;
                    }
                });
                return flag;
            });

            if (neighbours.length == 0) break;

            waypoints.push(neighbours[0]);
        }

        for (let i=0; i<waypoints.length; i++){
            waypoints[i].x=waypoints[i].x*this.tileSize+100;
            waypoints[i].y=waypoints[i].y*this.tileSize+100;
        }

        return waypoints;
    }

    //Map class?
    getNeighbours(map, tile) {
        let directions = [[0, 1], [1, 0]];

        let neighbours = [];

        for (let i = 0; i < 2; i++) {
            let dx1 = directions[i][0];
            let dy1 = directions[i][1];

            let dx2 = -directions[i][0];
            let dy2 = -directions[i][1];

            let x = tile.x + dx1;
            let y = tile.y + dy1;

            if (this.isValid(map, x, y) && map[y][x] == 1) neighbours.push({ x: x, y: y });
            x = tile.x + dx2;
            y = tile.y + dy2;
            if (this.isValid(map, x, y) && map[y][x] == 1) neighbours.push({ x: x, y: y });
        }

        return neighbours;
    }

    //Map class?
    isValid(map, j, i) {
        return i >= 0 && i < map.length && j >= 0 && j < map[i].length;
    }


    handleStart(this: GameScene) {
        this.createEnemies(10, this.portals[0]);

        this.started = true;
    }

    //EnemyManager??
    createEnemies(count, startingPoint){
        let enemyPortal = this.portals[0];
        let waypoints:Phaser.Math.Vector2[] = this.getWaypoints(this.map, this.portals[0]);

        for (let i = 0; i < count; i++) {
            var timer = this.time.delayedCall(i*1000, function(scene){
                let enemy = new Enemy(scene,startingPoint.x * scene.tileSize + 100, startingPoint.y * scene.tileSize + 100);
                enemy.setWaypoints(waypoints);
                scene.enemies.push(enemy);
            }, [this]);
        }
    }

    buildAnimated(x, y, type) {
        let sprite = this.add.sprite(x * this.tileSize + 100, y * this.tileSize + 100, type);
        sprite.displayHeight = this.tileSize;
        sprite.displayWidth = this.tileSize;
        let anim = sprite.anims;

        this.anims.create({
            key: 'anim' + this.portalItera,
            frames: this.anims.generateFrameNumbers(type, {}),
            frameRate: 20,
            repeat: -1
        });

        anim._startAnimation('anim' + this.portalItera);
    }

    buildTile(x, y, type) {
        let sprite: Phaser.GameObjects.Sprite = this.add.sprite(x * this.tileSize + 100, y * this.tileSize + 100, type)
        sprite.displayWidth = this.tileSize
        sprite.displayHeight = this.tileSize

        let tile = new Tile(x, y, type, this);

        sprite.setInteractive();
        sprite.on('pointerdown', this.handleClick, tile);
    }

    handleClick(this: Tile) {
        let scene = this.scene;
        // buildTile/buildPortal

        let sprite;
        switch (this.type) {
            case 'roadTile':
                scene.portals.push(new Tile(this.x, this.y));
                scene.buildAnimated(this.x, this.y, scene.portalItera % 2 == 0 ? 'enemyPortal' : 'playerPortal');
                scene.portalItera++;
                break;
            default:
                sprite = 'tower';
                scene.towers.push(new Tower(scene,this.x*scene.tileSize+100, this.y*scene.tileSize+100));
                //scene.buildTile(this.x, this.y, 'tower');
                break;
        }
    }
}

export default GameScene