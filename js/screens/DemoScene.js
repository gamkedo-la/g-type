//DemoScene
function DemoSceneScreen() {
	let runtime = 0;
	this.transitionIn = function demoPlayScreenTransitionIn() {
		runtime = 0;
	    remainingLives = 2;

        scene = new DemoScene(0);
        
        let backgroundMusicIndex= AudioTracks.Level1;
        
        currentBackgroundMusic.setCurrentTrack(backgroundMusicIndex);
        if(currentBackgroundMusic.getTime() > 0) {
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }

    };
    
    this.transitionOut = function demoPlayScreenTransitionOut() {
		clearKeyboardInput();
		this.remainingShakes = 0;
	    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        currentBackgroundMusic.pause();
        allSFX.stop();
//	    scene = null;
    };
    
    const clearKeyboardInput = function() {
	    holdKey[KEY_SPACE] = false;
	    holdKey[KEY_UP] = false;
	    holdKey[KEY_W] = false;
	    holdKey[KEY_DOWN] = false;
	    holdKey[KEY_S] = false;
	    holdKey[KEY_LEFT] = false;
	    holdKey[KEY_A] = false;
	    holdKey[KEY_RIGHT] = false;
		holdKey[KEY_D] = false;
		holdKey[KEY_X] = false;
    };
   

    this.run = function demoPlayScreenRun(deltaTime) {
	    runtime += deltaTime;
	    	    
	    updateDemoControls(runtime);
	    
        scene.update(deltaTime);
        
        scene.draw();
        
	    if(runtime % 600 > 300) {
		    gameFont.printTextAt("Press Any Key", {x:GameField.midX, y:GameField.midY - 52}, 35, textAlignment.Center);
		    gameFont.printTextAt("to Start", {x:GameField.midX, y:GameField.midY + 17}, 35, textAlignment.Center);
	    }

        if(scene.gameIsOver){
			scene.remainingShakes = 0;
			scene.screenShake();
            ScreenStates.setState(MENU_SCREEN);
        }
    };
    
	this.control = function demoPlayScreenControl() {
        menuSelect.play();
		ScreenStates.setState(MENU_SCREEN);
	};

	
	const updateDemoControls = function(runtime) {
		holdKey[KEY_SPACE] = true;
		if(runtime < 300) {
			holdKey[KEY_X] = false;
		} else if(runtime < 600) {// >300
			holdKey[KEY_RIGHT] = true;
		} else if(runtime < 900) {// >600
		//	do nothing
		} else if(runtime < 1500) {// >900
			holdKey[KEY_RIGHT] = false;
		} else if(runtime < 3000) {// >1500
			holdKey[KEY_RIGHT] = true;
		} else if(runtime < 3500) {// >3000
			holdKey[KEY_RIGHT] = false;
		} else if(runtime < 8500) {// >3500
			holdKey[KEY_X] = true;
		} else if(runtime < 9000) {// >8500
			holdKey[KEY_X] = false;
		} else if(runtime < 10500) {// >9000
			holdKey[KEY_LEFT] = true;
			holdKey[KEY_DOWN] = true;
		} else if(runtime < 16500) {// >10500
			holdKey[KEY_DOWN] = false;
			holdKey[KEY_LEFT] = false;
			holdKey[KEY_X] = true;
		} else if(runtime < 17500) {// >16500
			holdKey[KEY_RIGHT] = true;
			holdKey[KEY_X] = false;
		} else if(runtime < 23000) {// >17500
			holdKey[KEY_RIGHT] = false;
			holdKey[KEY_X] = true;
		} else if(runtime < 24500) {// >23000
			holdKey[KEY_UP] = true;
		} else if(runtime < 29000) {// >24500
			holdKey[KEY_UP] = false;
		} else if(runtime < 30000) {// >29000
			holdKey[KEY_RIGHT] = true;
		} else if(runtime < 32000) {// >30000
			holdKey[KEY_RIGHT] = false;
			holdKey[KEY_DOWN] = true;
		} else if(runtime < 32500) {// >32000
			holdKey[KEY_DOWN] = false;
		} else {// >32500
			ScreenStates.setState(MENU_SCREEN);
		}
		
		if(scene.capsuleCount === 2) {
			scene.activatePowerUp();
		} else if(scene.capsuleCount === 3) {
			scene.activatePowerUp();
		}
	}
    
    return this;
}
		
function DemoScene(levelIndex = 0) {	
	const data = LevelData[levelIndex];
	this.worldPos = 0;
	this.shaking = false;
	const MAX_SHAKES = 10;
	this.remainingShakes = 0;
	this.shakeMagnitude = 0;
	this.gameIsOver = false;
	this.beatTheGame = false;
	const starfield = new Starfield();
	const player = new Player(data.getPlayerSpawn());
	const collisionManager = new CollisionManager(player);
	let collisionBodiesToRemove = [];
	const gameEntities = new Set();
	const foregroundEntities = new Set();
	const enemyBullets = new Set();
	let uiManager = new UIManager();
	this.capsuleCount = 0;
	
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
		
		uiManager.update(deltaTime);
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
		this.beatTheGame = false;
        this.worldPos = newWorldPos;
        this.endShake();
        
        player.reset();
        uiManager.reset(false);
        
        gameEntities.clear();
        enemyBullets.clear();
        collisionManager.clearWorldAndBullets();
        
        populateWorld(newWorldPos);
	};
	
	this.setWorldPos = function(newWorldPos) {
		this.worldPos = newWorldPos;
	};
	
	this.updateBackground = function(deltaTime) {

		this.parallaxOffset1 = -1 * (this.worldPos * BG_PARALLAX_RATIO_1 % backgroundStars.width);

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
			GameField.x, GameField.y - GameField.bgOffset, Math.floor(fillRatio * firstSampleWidth), GameField.height + GameField.bgOffset); 
			
			canvasContext.drawImage(backgroundColorLookup,
			// source x,y,w,d (scroll source x over time)
			0, 0, secondSampleWidth, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x + Math.floor(fillRatio * firstSampleWidth), GameField.y - GameField.bgOffset, Math.floor(fillRatio * secondSampleWidth), GameField.height + GameField.bgOffset); 
		} else {
			canvasContext.drawImage(backgroundColorLookup,
			// source x,y,w,d (scroll source x over time)
			sampleXPos, 0, BG_SAMPLE_PIXELS, 100, 
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset); 
		}

		// galaxy / starfield images, tiled, with parallax
		canvasContext.drawImage(backgroundStars, this.parallaxOffset1, 0);
		canvasContext.drawImage(backgroundStars, this.parallaxOffset1 + backgroundStars.width, 0);

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

		uiManager.draw();
	};
	
	this.collectedCapsule = function() {
		uiManager.incrementPowerUpToActivate();
		this.capsuleCount++;
	};
	
	this.removePlayer = function() {
		this.gameIsOver = true;
		this.beatTheGame = false;
		canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		uiManager.reset(true);
		//ScreenStates.setState(MENU_SCREEN, 1);
//		if(remainingLives < 1) {
			
/*		} else {
			remainingLives--;
			player.reset();
			powerUpToActivate = PowerUpType.None;
			uiManager.reset(false);
		}*/
	};
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			if(entityToRemove.collisionBody != null) {
				collisionManager.removeEntity(entityToRemove);
			}
			if(isEnemyBullet(entityToRemove)) {
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
			
			if(isEnemyBullet(entityToAdd)) {
				enemyBullets.add(entityToAdd);
			} else {
				gameEntities.add(entityToAdd);
			}
		}		
	};
	this.worldShouldPause = function(shouldPause) {
		worldPaused = shouldPause;
	};
   
	this.activatePowerUp = function() {
		if(!uiManager.getCanActivatePowerUp()) {
			//play buzzer => can't activate a power up right now
			return;
		}
		
		const powerUpToActivate = uiManager.getPowerUpToActivate();
		uiManager.powerUpWasActivated(powerUpToActivate);
		
		switch(powerUpToActivate) {
			case PowerUpType.None:
				return;//No power up so exit now and don't play the activation sound
			case PowerUpType.Speed:
				player.incrementSpeed();
				break;
			case PowerUpType.Missile:
				player.setHasMissiles(true);
				break;
			case PowerUpType.Double:
				player.setShotTo(EntityType.PlayerDouble);
				break;
			case PowerUpType.Laser:
				player.setShotTo(EntityType.PlayerLaser);
				break;
			case PowerUpType.Triple:
				player.setShotTo(EntityType.PlayerTriple);
				break;
			case PowerUpType.Ghost:
				//TODO: Need to do something here...
				return;
			case PowerUpType.Shield:
				//TODO: Need to do something here...
				break;
			case PowerUpType.Force:
				//TODO: Need to do something here...
				player.activateTheForce();
				break;
			default:
				break;
		}
		
		uiManager.reset(false);
		//powerUpActivated.play();//TODO: need this SFX track in the game, goes at the end so it isn't played if "None" is the power up
	};
	
	this.displayScore = function(entity) {
		const newScore = new TextEntity(entity.score.toString(), Fonts.CreditsText, Color.White, {x:entity.position.x, y:entity.position.y}, 512, false);
		this.addEntity(newScore, false);
		
		uiManager.addToScore(entity.score);
		if(uiManager.getScore() % 1000 == 0) {//TODO: change this to a reasonable value 30,000?
			remainingLives++;
		}
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
		else {
			const horizontal = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
			const vertical = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
			
			canvasContext.transform(1, 0, 0, 1, horizontal, vertical);
			
			this.shakeMagnitude *= 0.9;
		}
		
	};
	
	this.endShake = function() {
		this.remainingShakes = 0;
		this.screenShake();
	};

	this.spawnSpecialCapsule = function(type, data) {
		// Should take in a type of capsule to spawn

	};	
}