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

let selectedPowerUp = "none";

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
		
		this.updateBackground(deltaTime);
		
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
	
	this.updateBackground = function(deltaTime) {

		this.parallaxOffset1 = -1*(this.worldPos*BG_PARALLAX_RATIO_1%backgroundParallaxLayer1.width);

		if (!this.bgTime) {
			this.bgTime = deltaTime; 
		} else {
			this.bgTime += deltaTime;
		}
		
		starfield.update(deltaTime, this.worldPos);

	}

	this.drawBackground = function() {

		const BG_SAMPLE_PIXELS = 16; // pixels of source img for entire screen - default 1

		// gradually tweened background fill color
		// scrolls through a super zoomed in lookup table (gradient texture)
		const sampleXPos = Math.floor(this.bgTime * BG_COLOR_CHANGE_SPEED) % backgroundColorLookup.width;
		//Need to account for sample potentially running off the end of the sample image
		if(sampleXPos > backgroundColorLookup.width - BG_SAMPLE_PIXELS) {
			const firstSampleWidth = backgroundColorLookup.width - sampleXPos;
			const secondSampleWidth = BG_SAMPLE_PIXELS - firstSampleWidth;
			const fillRatio = GameField.width / BG_SAMPLE_PIXELS;
			
			canvasContext.drawImage(backgroundColorLookup,
			// source x,y,w,d (scroll source x over time)
			sampleXPos, 0, firstSampleWidth, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x, GameField.y, Math.floor(fillRatio * firstSampleWidth), GameField.height); 
			
			canvasContext.drawImage(backgroundColorLookup,
			// source x,y,w,d (scroll source x over time)
			0, 0, secondSampleWidth, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x + Math.floor(fillRatio * firstSampleWidth), GameField.y, Math.floor(fillRatio * secondSampleWidth), GameField.height); 
		} else {
			canvasContext.drawImage(backgroundColorLookup,
			// source x,y,w,d (scroll source x over time)
			sampleXPos, 0, BG_SAMPLE_PIXELS, 100, 
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x, GameField.y, GameField.width, GameField.height); 
		}

		// galaxy / starfield images, tiled, with parallax
		canvasContext.drawImage(backgroundParallaxLayer1,this.parallaxOffset1,0);
		canvasContext.drawImage(backgroundParallaxLayer1,this.parallaxOffset1+backgroundParallaxLayer1.width,0);

		// twinkling stars
		starfield.draw();
	}
	
	this.draw = function() {

		this.drawBackground();

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

		drawPowerUpBar(PowerUpType, powerUpToActivate);

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
			if((entityToRemove.type === EntityType.EnemyBullet1) || (entityToRemove.type === EntityType.EnemyBullet2)) {
				enemyBullets.delete(entityToRemove);
			} else {
				gameEntities.delete(entityToRemove);
			}
		}
	};
	
	this.removeCollisions = function(entityToRemove) {
		collisionBodiesToRemove.push(entityToRemove);
	};
	
	this.addCollisions = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			if(entityToAdd.collisionBody != null) {
				collisionManager.addEntity(entityToAdd);
			}
		}
	}
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			if(entityToAdd.collisionBody != null) {
				collisionManager.addEntity(entityToAdd);
			}
			
			if((entityToAdd.type === EntityType.EnemyBullet1) || (entityToAdd.type === EntityType.EnemyBullet2)) {
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
				//powerUpToActivate = PowerUpType.Laser;
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
				powerUpToActivate = PowerUpType.None;
				break;
		}
		printPowerUps(PowerUpType, powerUpToActivate);
		console.log("PowerUp To Activate: " + powerUpToActivate);
	}
	
	this.activatePowerUp = function() {
		console.log('activating power up');
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

	// Draw power ups. 
	const drawPowerUpBar = function(PowerUps = PowerUpType) {
		printPowerUps(PowerUps);

	};

	const printPowerUps = function(powerUpItems, selected = powerUpToActivate) {
		const powerUpNames = Object.values(powerUpItems);
		const DISABLED_COLOR = '#A8A8A8';
		const ENABLED_COLOR = '#FFFF00';
		const BUTTON_WIDTH = 90;
	    const powerUpButtonMenuStartX = GameField.x + 20;
	    const powerUpMenuY = GameField.bottom + 35;
	    const powerUpMenuTextStartX = GameField.x + 65;
	    const buttonXOffset = 20;

	    for (let i = 1; i < powerUpNames.length; i++){
	    	if (powerUpNames[i] === selected) {
	    		color = ENABLED_COLOR;
	    	} else {
	    		color = DISABLED_COLOR;
	    	}

	    	// x,y,w,h,color
	    	drawRect(powerUpButtonMenuStartX + ((BUTTON_WIDTH + buttonXOffset) * (i - 1)), GameField.bottom + 15, BUTTON_WIDTH, 25, color); 
	    	// showWords, textX, textY, fillColor, fontface, textAlign = 'left', opacity = 1
		    colorText(powerUpNames[i], powerUpMenuTextStartX + ((BUTTON_WIDTH + buttonXOffset) * (i - 1)), powerUpMenuY, Color.Black, Fonts.ButtonTitle, textAlignment.Center);
	    }
	};
}
