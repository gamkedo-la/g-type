//PowerUp Types
const PowerUpType = {
	None:"none",
	Speed:"speed",
	Double:"double",
	Laser:"laser",
	Triple:"triple",
	Ghost:"ghost",
	Shield:"shield",
	Force:"force"
}

//Game Scene
function GameScene(levelIndex) {
	const data = LevelData[levelIndex];
	this.worldPos = 0;
	this.shaking = false;
	const MAX_SHAKES = 10;
	this.remainingShakes = 0;
	this.shakeMagnitude = 0;
	this.gameIsOver = false;
	const starfield = new Starfield();
	const player = new Player(data.getPlayerSpawn());
	const collisionManager = new CollisionManager(player);
	let collisionBodiesToRemove = [];
	const gameEntities = new Set();
	const foregroundEntities = new Set();
	const enemyBullets = new Set();
	let score = 0;
	let powerUpToActivate = PowerUpType.None;
	
	const populateWorld = function(worldPos) {
		const terrain = data.initializeTerrain();
		
		for(let i = 0; i < terrain.length; i++) {
			const thisTerrain = terrain[i];
			
			thisTerrain.respawn(worldPos);
			
			gameEntities.add(thisTerrain);
			collisionManager.addEntity(thisTerrain, false);
		}

		const enemies = data.initializeEnemies();
		
		for(let i = 0; i < enemies.length; i++) {
			const thisEnemy = enemies[i];
			
			thisEnemy.respawn(worldPos);
			
			gameEntities.add(thisEnemy);
			collisionManager.addEntity(thisEnemy, false);
		}
		
		// foregroundEntities
		const debris = data.initializeDebris();

		for(let i = 0; i < debris.length; i++) {
			const thisDebris = debris[i];

			thisDebris.respawn(worldPos);

			foregroundEntities.add(thisDebris);
		}
	};
	
	populateWorld(0);//0 = start at the beginning
	
	this.update = function(deltaTime) {
		this.worldPos += 2 * worldSpeed;
		starfield.update(deltaTime, this.worldPos);
		player.update(deltaTime, this.worldPos);
		
	    for(let bullet of enemyBullets) {
		    bullet.update(deltaTime, this.worldPos);
	    }
		
		for(let entity of gameEntities) {
			entity.update(deltaTime, this.worldPos, {x:player.position.x, y:player.position.y});
		}

		for(let entity of foregroundEntities) {
			entity.update(deltaTime, this.worldPos, {x:player.position.x, y:player.position.y});
		}
		
		let collisions;
		if(!player.getIsDying()) {
			collisions = collisionManager.doCollisionChecks();
		}
		 
		for(let i = 0; i < collisionBodiesToRemove.length; i++) {
			collisionManager.removeEntity(collisionBodiesToRemove[i]);
		}
		
		collisionBodiesToRemove = [];
		
		if(this.shaking) {this.screenShake();}
	};
	
	this.reset = function() {
		let newWorldPos = 0;
		let i = 0;
		while(this.worldPos > data.checkpointPositions[i]) {
			newWorldPos = data.checkpointPositions[i];
			i++;
			if(i === data.checkpointPositions.length) {break;}
		}
		
		this.gameIsOver = false;
        this.score = 0;
        this.worldPos = newWorldPos;
        this.endShake();
        
        player.reset();
        
        gameEntities.clear();
        enemyBullets.clear();
        collisionManager.clearWorldAndBullets();
        
        populateWorld(newWorldPos);
	};
	
	this.setWorldPos = function(newWorldPos) {
		this.worldPos = newWorldPos;
	};
	
	this.draw = function() {
		// background images, tiled, ready for parallax effects
		canvasContext.drawImage(backgroundParallaxLayer1,-1*(this.worldPos*0.3%backgroundParallaxLayer1.width),0);
		canvasContext.drawImage(backgroundParallaxLayer1,-1*(this.worldPos*0.3%backgroundParallaxLayer1.width)+backgroundParallaxLayer1.width,0);

		starfield.draw();

		for(let bullet of enemyBullets) {
			bullet.draw();
		}

		for(let entity of gameEntities) {
			entity.draw();
		}

		player.draw();

		for(let entity of foregroundEntities) {
			entity.draw();
		}

		//drawPowerUpBar();

//	    score.draw();//TODO: implement this
	};
	
	this.collectedCapsule = function() {
		incrementPowerUpToActivate();
		console.log("Update UI to show that the player collected another capsule");
	};
	
	this.removePlayer = function() {
		if(remainingLives < 1) {
			this.gameIsOver = true;
			canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		} else {
			remainingLives--;
			player.reset();
			powerUpToActivate = PowerUpType.None;
		}
	};
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			if(entityToRemove.collisionBody != null) {
				collisionManager.removeEntity(entityToRemove);
			}
			if(entityToRemove.type === EntityType.EnemyBullet) {
				enemyBullets.delete(entityToRemove);
			} else {
				gameEntities.delete(entityToRemove);
			}
		}
	};
	
	this.removeCollisions = function(entityToRemove) {
		collisionBodiesToRemove.push(entityToRemove);
	};
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			if(entityToAdd.collisionBody != null) {
				collisionManager.addEntity(entityToAdd);
			}
			
			if(entityToAdd.type === EntityType.EnemyBullet) {
				enemyBullets.add(entityToAdd);
			} else {
				gameEntities.add(entityToAdd);
			}
		}		
	};
	
	const incrementPowerUpToActivate = function() {
		switch(powerUpToActivate) {
			case PowerUpType.None:
				powerUpToActivate = PowerUpType.Speed;
				break;
			case PowerUpType.Speed:
				powerUpToActivate = PowerUpType.Double;
				break;
			case PowerUpType.Double:
				powerUpToActivate = PowerUpType.Laser;
				break;
			case PowerUpType.Laser:
				powerUpToActivate = PowerUpType.Triple;
				break;
			case PowerUpType.Triple:
				powerUpToActivate = PowerUpType.Ghost;
				break;
			case PowerUpType.Ghost:
				powerUpToActivate = PowerUpType.Shield;
				return;
			case PowerUpType.Shield:
				powerUpToActivate = PowerUpType.Force;
				break;
			case PowerUpType.Force:
				powerUpToActivate = PowerUpType.Speed;
				break;
		}
		
		console.log("PowerUp To Activate: " + powerUpToActivate);
	}
	
	this.activatePowerUp = function() {
		switch(powerUpToActivate) {
			case PowerUpType.None:
				return;//No power up so exit now and don't play the activation sound
			case PowerUpType.Speed:
				player.incrementSpeed();
				powerUpToActivate = PowerUpType.None;
				return;
			case PowerUpType.Double:
//				player.setShotTo(EntityType.PlayerDouble);//TODO: restore this once Double is implemented
				console.log("Tried to set player shot to Double");
				powerUpToActivate = PowerUpType.None;
				break;
			case PowerUpType.Laser:
				player.setShotTo(EntityType.PlayerLaser);
				powerUpToActivate = PowerUpType.None;
				break;
			case PowerUpType.Triple:
//				player.setShotTo(EntityType.PlayerTriple);//TODO: restore this once Triple is implemented
				console.log("Tried to set player shot to Triple");
				powerUpToActivate = PowerUpType.None;
				break;
			case PowerUpType.Ghost:
				//TODO: Need to do something here...
				console.log("Tried to activate a Ghost Ship");
				powerUpToActivate = PowerUpType.None;
				return;
			case PowerUpType.Shield:
				//TODO: Need to do something here...
				console.log("Tried to activate shields");
				powerUpToActivate = PowerUpType.None;
				break;
			case PowerUpType.Force:
				//TODO: Need to do something here...
				console.log("Tried to 'Use The Force!'");
				powerUpToActivate = PowerUpType.None;
				break;
			default:
				break;
		}
		//powerUpActivated.play();//TODO: need this SFX track in the game, goes at the end so it isn't played if "None" is the power up
	};
	
	this.displayScore = function(entity) {
		score += entity.score;
		const newScore = new TextEntity(entity.score.toString(), Fonts.CreditsText, Color.White, {x:entity.position.x, y:entity.position.y}, 512, false);
		this.addEntity(newScore, false);
	};
	
	const checkpointForWorldPos = function(worldPos) {
		const checkpoints = data.checkpointPositions;
		for(let i = (checkpoints.length - 1); i >= 0; i--) {
			if(worldPos > checkpoints[i]) {
				return checkpoints[i];
			}
		}
		
		return 0;
	};
	
	this.spawnPowerUp = function(type, data) {
		// Should take in a type of powerup to spawn
		

		// Choose random location at which to spawn it

		// Signal UI to update

	};
	
	this.shouldShake = function(magnitude) {
		this.shaking = true;
		this.remainingShakes = MAX_SHAKES;
		this.shakeMagnitude = magnitude;
	};
	
	this.screenShake = function() {
		this.remainingShakes--;
		if(this.remainingShakes <= 0) {
			this.remainingShakes = 0;
			this.shaking = false;
			this.shakeMagnitude = 0;
			canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		}
		
		const horizontal = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
		const vertical = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
		
		canvasContext.setTransform(1, 0, 0, 1, horizontal, vertical);
		
		this.shakeMagnitude *= 0.9;
	};
	
	this.endShake = function() {
		this.remainingShakes = 0;
		this.screenShake();
	};

	this.spawnSpecialCapsule = function(type, data) {
		// Should take in a type of capsule to spawn

	};

	// TODO: Draw power ups. 
	// Then, upon collection of X number of capsules, should update UI to make appropriate button enabled

	const drawPowerUpBar = function() {

		const PowerUps = [
			{
				title: 'Speed Up'
			}
		];

		const canvas = document.getElementById('gameCanvas');
		const powerUpBar = drawRect(0, canvas.height - 50, canvas.width, 50, '#0000FF'); 

		printPowerUps(PowerUps);

	};

	const printPowerUps = function(powerUpItems, yOffset = null) {
		const DISABLED_COLOR = '#A8A8A8';
		const ENABLED_COLOR = '#ffffff';
	    let powerUpButtonMenuX = 20;
	    let powerUpMenuY = canvas.height - 15;

	    let powerUpMenuX = 50;

	    let selectorXOffset = 20;

	    let buttonsXOffset = powerUpMenuX + 70;

	    for (let i = 0; i < powerUpItems.length; i++){
	    	drawRect(powerUpButtonMenuX + (selectorXOffset * i), canvas.height - 35, 150, 25, DISABLED_COLOR); 
	    	console.log(powerUpButtonMenuX + (selectorXOffset * i));
		    colorText(powerUpItems[i].title, powerUpMenuX + selectorXOffset * i, powerUpMenuY, Color.Black, Fonts.ButtonTitle, textAlignment.Left);
	    }
	};
}
