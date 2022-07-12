
let startScene = new Phaser.Scene('Start')
    
startScene.create = function () {
    this.add.text(150,250, 'Click to Start',{fill: '#000', fontSize: '20px'})
    this.input.on('pointerup', ()=>{
        this.scene.stop('Start')
        this.scene.start('Game')
    })   
}