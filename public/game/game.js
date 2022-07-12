
let startScene = new Phaser.Scene('Start')
    
startScene.create = function () {
    this.add.text(180,150, 'Beat Up The Baddies', {fill: '#fff', fontSize:'36px'} )
    this.add.text(310,350, 'Click to Start',{fill: '#fff', fontSize: '18px'})
    this.input.on('pointerup', ()=>{
        this.scene.stop('Start')
        this.scene.start('Game')
    })   
}

gameState = {
  healthPotions: 0,
  manaPotions: 0,
  powerUp: 0,
  health: 100,
  maxHealth: 100,
  mana: 3,
  fireballs: 3,
  strength: .5,
  score: 0,
  scoreText: 0,
  lastFired: 0,
  manaCoolDown: 0,
  healthCoolDown: 0,
  attackCoolDown: 0,
  fireSpeed: 225,
  tileSize: 32,
  tileMaps: {
    0: {
      width: 100,
      height: 20,
    },
  },
};

let gameScene = new Phaser.Scene("Game");

// current user data
let user = localStorage.getItem("user");
user = JSON.parse(user);

let hitclone;
let fire;
let mapWidth;
let mapHeight;
let spellKey;
let healthKey;
let player = this.gameState.player;
let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
let enemyGroup;

gameScene.init = function () {
  this.jumpVel = -400;
};

gameScene.preload = function () {
  this.load.image("background", "./game/assets/images/background.png");

  // enemy/player
  this.load.spritesheet("player", "./game/assets/player/adventurer.png", {
    frameWidth: 50,
    frameHeight: 37,
  });
  this.load.spritesheet("enemy", "./game/assets/enemy/enemy_sheet.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  // level images/data
  this.load.image("tiles", "./game/assets/images/Tileset.png");
  this.load.image("willow-sheet", "./game/assets/images/willows.png");
  this.load.image('stone-sheet',"./game/assets/images/stones.png" )
  this.load.tilemapTiledJSON(
    "level-1",
    "./game/assets/tilesets/level-1.1.json"
  );
  this.load.spritesheet("chest", "./game/assets/objects/Chest.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("coin", "./game/assets/objects/Coin.png", {
    frameWidth: 10,
    frameHeight: 10,
  });
  this.load.spritesheet(
    "bigfire",
    "./game/assets/spells/BigFireBall-sheet.png",
    { frameWidth: 49, frameHeight: 50, margin: 10, spacing: 15 }
  );

  // inventory
  this.load.spritesheet("potions", "./game/assets/gui/potions_gradient.png", {
    frameWidth: 16,
    frameHeight: 24,
  });
};

gameScene.create = function () {
  getInventory = async () => {
    //console.log('did i run?')
    const res = await fetch("https://ado-gameroom-api.herokuapp.com/api/getInventory", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
      }),
    });
    const data = await res.json();
    //console.log(data)
    for (let item of data) {
      if (item.name === "Health-Potion") {
        gameState.healthPotions++;
        gameState.healthText.setText(`  x ${gameState.healthPotions}`);
      }
      if (item.name === "Mana-Potion") {
        gameState.manaPotions++;
        gameState.manaText.setText(`  x ${gameState.manaPotions}`);
      }
      if (item.name === "Strength-Up") {
        gameState.powerUp++;
        gameState.strength++;
      }
    }
  };
  updateInventory = async (item_name, item_type, item_value) => {
    const res = await fetch("http://127.0.0.1:5000/api/inventory", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        item_type: item_type,
        item_name: item_name,
        value: item_value,
      }),
    });
    //console.log(user.id, 'user id')
    const data = await res.json();
    //console.log(data)
    if (data.status === "success") {
      //console.log(data, 'data')
    }
  };

  removeInventory = async (item_name) => {
    //console.log('did i run?')
    //console.log(user.id)
    const res = await fetch("http://127.0.0.1:5000/api/deleteItem", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        item_name: item_name,
      }),
    });
    const data = await res.json();
    //console.log(data)
    //console.log(user.id, 'user id')
  };

  addHealthPotion = function (player, item) {
    let spawnX = item.x
    let spawnY = item.y
    item.anims.play("open-chest", true);
    gameState.healthPotions++;
    gameState.healthText.setText(`  x ${gameState.healthPotions}`);

    item.disableBody(true, true);
    gameState.score += 50;
    gameState.scoreText.setText("Score: " + gameState.score);

    updateInventory("Health-Potion", "healing", 50);

    setTimeout(()=>{
        item.enableBody(true,spawnX,spawnY,true,true)
    }, Math.random() * 60000)

  };

  addManaPotion = function (player, item) {
    let spawnX = item.x
    let spawnY = item.y
    item.disableBody(true, true);
    gameState.manaPotions++;
    gameState.score += 1000;
    gameState.scoreText.setText("Score: " + gameState.score);
    gameState.manaText.setText(`  x ${gameState.manaPotions}`);

    updateInventory("Mana-Potion", "mana", 50);

    setTimeout(()=>{
        item.enableBody(true,spawnX,spawnY,true,true)
    }, Math.random() * 60000)
    
  };
  addStrength = function (player, item) {
    let spawnX = item.x
    let spawnY = item.y
    
    item.disableBody(true, true);
    gameState.score += 1000;
    gameState.scoreText.setText("Score: " + gameState.score);

    gameState.powerUp++;

    updateInventory("Strength-Up", "upgrade", 2);

    setTimeout(()=>{
        item.enableBody(true,spawnX,spawnY,true,true)
    }, Math.random() * 120000)

  };

  collectCoin = (player, coins) => {
    coins.disableBody(true, true);
    gameState.score += 10;
    gameState.scoreText.setText("Score: " + gameState.score);

    if (this.coins.countActive() === 50) {
      this.coins.children.iterate(function (child) {
        child.enableBody(
          true,
          child.x + Phaser.Math.Between(-200, 200),
          0,
          true,
          true
        );
      });
    }
  };

  fireBallcollison = (fireBall, enemy) => {
    fireBall.destroy();
    enemy.destroy();
    gameState.score += 50;
    gameState.scoreText.setText("Score: " + gameState.score);
  };


  // background stuff

  bg = this.add.image(0, 0, "background").setOrigin(0).setScale(1.4);
  bg.setScrollFactor(0);
  bg.height = 600;

  // add map method
  this.map = this.make.tilemap({ key: "level-1" });

  const groundTiles = (this.tileset = this.map.addTilesetImage("swamp","tiles"));
  const groundLayer = this.map.createStaticLayer("ground", groundTiles);

  const willowTiles = this.map.addTilesetImage("willows", "willow-sheet");
  const willowLayer = this.map.createStaticLayer("trees", willowTiles);

  const stoneTiles = this.map.addTilesetImage('stones','stone-sheet')
  const stoneLayer = this.map.addTilesetImage('stone-layer', stoneTiles)

  this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
  this.physics.world.setBoundsCollision(true, true, false, true);

  groundLayer.setCollision(
    [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      58, 59, 60,
    ],
    true
  );

  mapHeight = this.map.heightInPixels;
  mapWidth = this.map.widthInPixels;
  
  // ITEM/ENEMY GROUPS
  this.itemGroup = this.physics.add.group({immovable: true, allowGravity: false,});
  this.enemies = this.enemyGroup = this.physics.add.group({ immovable: true });
  enemyGroup = this.enemies;


  
  this.healthChest = this.physics.add.group({
    immovable: true,
    allowGravity: false,
  });
  
  this.manaChest = this.physics.add.group({
    immovable: true,
    allowGravity: false,
  });
  this.powerChest = this.physics.add.group({
    immovable: true,
    allowGravity: false,
  });
  // END GROUPS

  // SCORE
  gameState.scoreText = this.add
    .text(680, 10, "Score: 0", { fontSize: "15px", fill: "#fff" })
    .setScrollFactor(0);

  this.map.getObjectLayer("Objects").objects.forEach((object) => {
    if (object.name === "Start") {
      this.spawnPos = { x: object.x, y: object.y };
    }
    if (object.type === "health") {
      this.healthChest.create(object.x, object.y, "chest");
    }
    if (object.type === "mana") {
      this.manaChest.create(object.x, object.y, "chest");
    }
    if (object.type === "power") {
      this.powerChest.create(object.x, object.y, "chest");
    }
    if (object.name === "Enemies") {
      let enemy = this.enemies
        .create(object.x, object.y, "enemy")
        .setScale(1.25);
      enemy.body.setSize(19, 39);
      enemy.body.setOffset(8, 25);
      enemy.health = 100;
      enemy.attackCoolDown= 0;
    }
  });
  

  // debugging layer
  // const debugGraphics = this.add.graphics()
  // groundLayer.renderDebug(debugGraphics)

  // ANIMATIONS

  // run animation
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("player", { start: 8, end: 13 }),
    frameRate: 8,
    repeat: -1,
  });
  // idle animation
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1,
  });
  // jump animation
  this.anims.create({
    key: "jump",
    frames: this.anims.generateFrameNumbers("player", { start: 77, end: 78 }),
    frameRate: 10,
    repeat: -1,
  });
  // attack animation
  this.anims.create({
    key: "attack",
    frames: this.anims.generateFrameNumbers("player", { start: 47, end: 52 }),
    frameRate: 15,
    repeat: 0,
  });
  // magic animation
  this.anims.create({
    key: "spell",
    frames: this.anims.generateFrameNumbers("player", { start: 85, end: 95 }),
    frameRate: 22,
    repeat: 1,
  });

  // SPELL ANIMATIONS

  this.anims.create({
    key: "fire",
    frames: this.anims.generateFrameNumbers("bigfire", { start: 0, end: 12 }),
    frameRate: 12,
    repeat: -1,
  });

  // ENEMY ANIMATIONS
  this.anims.create({
    key: "enemy-idle",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 12 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "enemy-attack",
    frames: this.anims.generateFrameNumbers("enemy", { start: 13, end: 18 }),
    frameRate: 6,
    repeat: -1,
  });

  // ITEM ANIMATIONS
  this.anims.create({
    key: "spin-coin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "open-chest",
    frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 3 }),
    frameRate: 1,
    repeat: 0,
  });

  // inventory stuff
  getInventory();

  gameState.healthBar = this.add.text(7, 5, `Health: ${gameState.health}`, {fontSize: "20px",});
  gameState.healthBar.setScrollFactor(0);
  
  gameState.bullets = this.add.text(7, 35, `Fire Blast: ${gameState.mana}`)
  gameState.bullets.setScrollFactor(0)

  gameState.health_potion = this.add.image(15, 65, "potions", 0).setScale(1.5);
  gameState.health_potion.setScrollFactor(0);

  gameState.healthText = this.add.text(15,65, `  x ${gameState.healthPotions}`,{ fontSize: "15px", fill: "#fff" });
  gameState.healthText.setScrollFactor(0);

  gameState.mana_potion = this.add.image(15, 95, "potions", 4).setScale(1.5);
  gameState.manaText = this.add.text(15, 95, `  x ${gameState.manaPotions}`, {fontSize: "15px",fill: "#fff",});
  gameState.mana_potion.setScrollFactor(0);
  gameState.manaText.setScrollFactor(0);

  
  // PLAYER GROUP
  gameState.player = this.physics.add
    .sprite(this.spawnPos.x, this.spawnPos.y, "player")
    .setScale(1.75);

  gameState.player.setBounce(0.1);
  gameState.player.setCollideWorldBounds(true);
  this.physics.add.collider(gameState.player, groundLayer);
  this.physics.add.overlap(
    gameState.player,
    this.healthChest,
    addHealthPotion,
    null,
    this
  );
  this.physics.add.overlap(
    gameState.player,
    this.manaChest,
    addManaPotion,
    null,
    this
  );
  this.physics.add.overlap(
    gameState.player,
    this.powerChest,
    addStrength,
    null,
    this
  );

  gameState.player.body.setSize(19, 28);
  gameState.player.body.setOffset(17, 8);
  gameState.player.anims.play("idle", true);
  let direction = gameState.player.flipX ? -1 : 1;

  this.cameras.main.setBounds(
    0,
    0,
    this.map.widthInPixels,
    this.map.heightInPixels
  );
  this.cameras.main.startFollow(gameState.player);

  // END PLAYER GROUP

  Math.random() < 0.5 ? -1 : 1;

  // COINS GROUP
  this.coins = this.physics.add.group({
    key: "coin",
    repeat: 80,
    setXY: {
      x: Phaser.Math.Between(20, gameState.player.x + 20 * direction),
      y: 0,
      stepX: 50,
    },
  });

  this.coins.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(this.coins, groundLayer);
  Phaser.Actions.Call(
    this.coins.getChildren(),
    function (coin) {
      //console.log(coin)
    },
    this
  );
  this.physics.add.overlap(
    gameState.player,
    this.coins,
    collectCoin,
    null,
    this
  );
  // END COINS GROUP

  // FIRE GROUP
  this.fireBullets = this.physics.add.group({ allowGravity: false });
  this.physics.add.collider(
    this.fireBullets,
    this.enemies,
    fireBallcollison,
    null,
    this
  );

  meleeCollision = (player, enemy) => {
    if (gameState.player.anims.currentAnim.key === "attack") {
      enemy.health -= gameState.strength;
      //console.log(enemy.health)
    } else if (enemy.anims.currentAnim.key === "enemy-attack") {
      gameState.health -= .5;
      console.log(gameState.player.health)
      gameState.healthBar.setText(`Health: ${gameState.health}`);

    }
  };


  // enemy settings

  this.physics.add.collider(
    gameState.player,
    this.enemies,
    meleeCollision,
    null,
    this
  );
  this.physics.add.collider(this.enemies, groundLayer, detectEdge, null, this);

  // cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();
  spellKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  manaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  healthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


  console.log(this.enemies)
};

detectEdge = function (enemy, ground) {
  let tiles = ground.layer.data;
  let rightTile = tiles[ground.y][ground.x + 1];
  let leftTile = tiles[ground.y][ground.x - 1];

  if (rightTile === undefined || rightTile.index === -1) {
    enemy.flipX = true;
    enemy.setOrigin(0.9, 0.5);
    enemy.stepCount = this.stepLimit;
  } else if (leftTile === undefined || leftTile.index === -1) {
    //&&  enemy.x <= (leftTile.x * gameState.tileSize))) {
    //console.log("collided on left");
    //enemy.flipX = true;
    enemy.setOrigin(0.5, 0.5);
    enemy.flipX = false;
    enemy.stepCount = this.stepLimit;
  }

  //let y = Math.round(enemy.y / gameState.tileSize);
  //let x = Math.round(enemy.x / gameState.tileSize)
  
};

gameScene.update = function (time, delta) {
  let onGround =
    gameState.player.body.blocked.down || gameState.player.body.touching.down;
  let spell;

  useManaPotion = () => {
    if (gameState.manaPotions > 0) {
      gameState.mana += 3;
      gameState.manaPotions--;
      gameState.manaText.setText(`  x ${gameState.manaPotions}`);
    }
  };
  useHealthPotion = () => {
    if (gameState.healthPotions > 0) {
      gameState.health += 50;
      if (gameState.health > gameState.maxHealth) {
        gameState.health = gameState.maxHealth;
      }
      ////console.log(gameState.health,'health')
      gameState.healthPotions--;
      gameState.healthText.setText(`  x ${gameState.healthPotions}`);
      gameState.healthBar.setText(`Health: ${gameState.health}`);
    }
  };
  
  if (gameState.health <= 0 || gameState.player.y >= mapHeight - gameState.player.height) {
    if(gameState.player.y >= mapHeight - gameState.player.height){
      gameState.player.disableBody(true,false)
      gameState.player.setTint(0xff0000)
      this.physics.pause();
      this.anims.pauseAll();
    }
    else{
    gameState.player.disableBody(true,false)
    gameState.player.setTint(0xff0000)
    this.physics.pause();
    this.anims.pauseAll();

}
   setTimeout(()=>{
      
      this.add.text(280,150, 'Game Over', {fill: '#fff', fontSize:'36px'} ).setScrollFactor(0)
      this.add.text(270, 250, `Your Final Score: ${gameState.score}`, {fontSize: '18px'} ).setScrollFactor(0)
    }, 500)
    // this.scene.stop('Game')
    // this.scene.start('GameOver')

  }


  else if (this.cursors.space.isDown && time > gameState.attackCoolDown) {
    if (gameState.player.flipX) {
      gameState.player.body.setSize(24, 28);
      gameState.player.body.setOffset(3, 7);
    } else {
      gameState.player.body.setSize(24, 28);
    }

    gameState.player.anims.play("attack", true);
    gameState.player.setVelocityX(0);
    gameState.attackCoolDown = time + 120;
    if (!onGround) {
      setTimeout(() => {
        gameState.player.anims.play("jump", true);
      }, 450);
    }
  } else if (
    spellKey.isDown &&
    time > gameState.lastFired &&
    gameState.mana > 0
  ) {
    gameState.player.anims.play("spell", true);
    gameState.mana--;
    gameState.bullets.setText(`Fire Blast: ${gameState.mana}`)

    let offset = gameState.player.flipX ? -50 : 50;
    let dir = gameState.player.flipX ? -1 : 1;

    gameState.player.setVelocityX(0);

    let bullet = this.fireBullets.create(gameState.player.x + offset, gameState.player.y, "fire").setScale(1.25);
    
    bullet.anims.play("fire", true);
    dir < 1 ? (bullet.flipX = true) : (bullet.flipX = false);
    bullet.setVelocityX(gameState.fireSpeed * dir);
    
    gameState.lastFired = time + 2500;
  } else if (manaKey.isDown && time > gameState.manaCoolDown && gameState.manaPotions > 0) {
    useManaPotion();
    removeInventory("Mana-Potion")
    gameState.manaCoolDown = time + 1000;
  } else if (healthKey.isDown && time > gameState.healthCoolDown) {
    useHealthPotion();
    removeInventory("Health-Potion");
    gameState.healthCoolDown = time + 1000;
  } else if (this.cursors.left.isDown) {
    gameState.player.body.setSize(19, 28);
    gameState.player.body.setOffset(17, 8);

    gameState.player.flipX = true;
    gameState.player.setVelocityX(-160);
    if (onGround) {
      gameState.player.anims.play("run", true);
    }
  } else if (this.cursors.right.isDown) {
    gameState.player.body.setSize(19, 28);
    gameState.player.body.setOffset(17, 8);
    gameState.player.flipX = false;
    gameState.player.setVelocityX(160);
    if (onGround) {
      gameState.player.anims.play("run", true);
    }
  } else {
    if (
      (onGround && gameState.player.anims.currentFrame.isLast) ||
      gameState.player.anims.currentAnim.key === "run"
    ) {
      gameState.player.body.setSize(19, 28);
      gameState.player.body.setOffset(17, 8);
      gameState.player.anims.play("idle", true);
      gameState.player.setVelocityX(0);
    }
  }

  if (this.cursors.up.isDown && onGround) {
    gameState.player.body.setSize(19, 28);
    gameState.player.body.setOffset(17, 8);
    gameState.player.anims.stop("idle", true);
    gameState.player.anims.play("jump", true);

    gameState.player.setVelocityY(this.jumpVel);
  }
  Phaser.Actions.Call(
    this.fireBullets.getChildren(),
    function (bullet) {
      return;
    },
    globalThis
  );

Phaser.Actions.Call(
    enemyGroup.getChildren(),
    function (enemy) {
      if (enemy.health <= 0) {
        let spawnX = enemy.x;
        let spawnY = enemy.y;
        enemy.destroy();
        setTimeout(() => {
          let enemy = enemyGroup.create(spawnX, spawnY, "enemy").setScale(1.25);
          enemy.body.setSize(19, 39);
          enemy.body.setOffset(8, 25);
          enemy.health = 100;
          enemy.attackCoolDown = 0
        }, 30000);
      }

        if (Math.abs(enemy.x - this.gameState.player.x ) <= 60 && time > enemy.attackCoolDown) {
            if (enemy.flipX) {
                console.log(enemy)
                enemy.body.setSize(34, 42);
                enemy.body.setOffset(-5, 20);
              } 
            else {
                enemy.body.setSize(34, 42);
                enemy.body.setOffset(13, 22)
            
            }
            enemy.anims.play('enemy-attack', true)
            enemy.setVelocityX(0);
            enemy.attackCoolDown = time + 3000

        }
        else if (time > enemy.attackCoolDown) { 
            
            enemy.anims.play('enemy-idle', true)
            enemy.body.setSize(19, 39);
            enemy.body.setOffset(8, 25);
            
            if (enemy.body.blocked.right && !enemy.flipX) {
                enemy.flipX = true;
                enemy.setOrigin(0.9, 0.5);
                enemy.stepCount = this.stepLimit;
            }
            else if (enemy.body.blocked.left && enemy.flipX) {

                enemy.setOrigin(0.5, 0.5);
                enemy.flipX = false;
                enemy.stepCount = this.stepLimit;
            }
     
            enemy.stepCount++;

            if (enemy.stepCount > this.stepLimit) {   
                
                enemy.stepCount = 0;
                enemy.toggleFlipX();

        }
        if (!enemy.flipX) {
            enemy.setVelocityX(70);
        } 
        else if (enemy.flipX) {
            enemy.setVelocityX(70 * -1);
        }
    }
  },globalThis);
  Phaser.Actions.Call(
    this.coins.getChildren(),
    function (coin) {
      coin.anims.play("spin-coin", true);
      // if (coin.x < 1 || coin.x >= mapWidth) coin.disableBody(true,true)
      // if (coin.y >= mapHeight - 10) coin.disableBody(true,true)
    },
    globalThis
  );
};

let endScene = new Phaser.Scene('GameOver')

endScene.create = function () {
  this.add.text(280,150, 'Game Over', {fill: '#fff', fontSize:'36px'} )
  this.add.text(280, 250, `Your Final Score: ${gameState.score}`, {fontSize: '18px'} )
  this.add.text(300,350, 'Click to Start',{fill: '#fff', fontSize: '18px'})
  this.input.on('pointerup', ()=>{
      this.scene.stop('GameOver')
      this.scene.start('Start')
  })   
}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  scene: [startScene, gameScene, endScene],
  title: "Adventure",
  parent: "main",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
};

let game = new Phaser.Game(config);

// this.platforms = this.add.group()

// this.floor = this.add.tileSprite(0, 468, 30 * 32, 32, 'ground').setOrigin(0)
// this.physics.add.existing(this.floor, true)
// this.platforms.add(this.floor)
