class GameObject extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        scene.add.existing(this);
    }

    update(scene){        
    }
}

export default GameObject;