import 'phaser';
import GameScene from './GameScene'

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: window.outerHeight,
    height: 1080,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: GameScene
};

const game = new Phaser.Game(config);
