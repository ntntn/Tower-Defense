import Tile from './Tile';
import GameScene from "./GameScene";

class Builder {
    scene:GameScene
    buildmode:string
    constructor(scene){
        this.scene = scene;
        this.buildmode = 'tower';
    }

    buildMap(map){
        console.log(map);
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

    buildTile(x, y, type) {
        let tile = new Tile(x, y, type, this.scene);
        let spritePos = new Phaser.Math.Vector2(x,y);
        this.scene.map.scaleToScreen(spritePos);
        let sprite = this.scene.add.sprite(spritePos.x, spritePos.y, type)
        sprite.displayWidth = sprite.displayHeight = this.scene.tileSize;
        //FIXME
        sprite.setInteractive();
        sprite.on('pointerdown', this.scene.handleClick, tile);
    }

    buildAnimated(x, y, type) {
        let sprite = this.scene.add.sprite(x * this.scene.tileSize + 100, y * this.scene.tileSize + 100, type);
        sprite.displayHeight = this.scene.tileSize;
        sprite.displayWidth = this.scene.tileSize;
        let anim = sprite.anims;

        this.scene.anims.create({
            key: 'anim' + this.scene.portalItera,
            frames: this.scene.anims.generateFrameNumbers(type, {}),
            frameRate: 20,
            repeat: -1
        });

        anim._startAnimation('anim' + this.scene.portalItera);
    }
}

export default Builder