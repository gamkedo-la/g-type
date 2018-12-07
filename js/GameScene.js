//Game Scene
function GameScene(levelIndex, aPlayer = null, aUIManager = null, bgTime = null) {
	const data = LevelData[levelIndex];
	scene = this;
	this.worldPos = 0;
	this.shaking = false;
	const MAX_SHAKES = 10;
	this.remainingShakes = 0;
	this.shakeMagnitude = 0;
	this.gameIsOver = false;
	this.beatTheGame = false;
    this.levelIsComplete = false;
    this.didCompleteWarpChallenge = false;
    this.bgTime = bgTime;
    let starfield = new Starfield();
    if(levelIndex === WARP_INDEX) {
	    starfield = new Starfield(240, 120, 80, -64, -128, -256);
    } else if(levelIndex === 0) {
	    starfield = new Starfield(120, 60, 40, -32, -64, -128);
    }
    let player;
    if((aPlayer === null) || (aPlayer === undefined)) {
		player = new Player(data.getPlayerSpawn());
    } else {
		player = aPlayer;
        const playerSpawnPos = data.getPlayerSpawn();
        player.position.x = playerSpawnPos.x;
        player.position.y = playerSpawnPos.y;
        player.clearDeath();
    }
	const collisionManager = new CollisionManager(player);
	let collisionBodiesToRemove = [];
	const gameEntities = new Set();
	const foregroundEntities = new Set();
	const enemyBullets = new Set();

	this.parallaxOffset1 = 0;
	this.parallaxOffset2 = 0;
	this.parallaxOffset3 = 0;
	const bkgdColorLookup = data.getBkgdColorLookup();
	const bkgdStars = data.getBkgdStars();
	const bkgdParallaxLayer = data.getBkgdParallaxLayer();
	const bgOffset = data.getBkgdOffset();
	const foregroundLayer = data.getForegroundParallaxLayer();

    let uiManager;
    if(aUIManager === null) {
        uiManager= new UIManager();
    } else {
        uiManager = aUIManager;
    }
	uiManager.reloadScores();

	let nextLifeScore = SCORE_PER_EXTRA_LIFE;
	let worldPaused = false;

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
		if(!worldPaused) {
			if(levelIndex === WARP_INDEX) {
				if(this.worldPos > 21500) {
					this.levelComplete();
				} else {
					this.worldPos += 10.0 * worldSpeed;
				}
			} else {
				this.worldPos += gameSpeed * worldSpeed;
			}
		}

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

	//adding for debugging levels
	window.pos = function(newWorldPos) {
		scene.gameIsOver = false;
		scene.beatTheGame = false;
        scene.worldPos = newWorldPos;
        scene.endShake();

        //player.reset();
        //uiManager.reset(false);

        gameEntities.clear();
        enemyBullets.clear();
        collisionManager.clearWorldAndBullets();

        populateWorld(newWorldPos);
	};

	this.updateBackground = function(deltaTime) {
		// the dense starfield
		this.parallaxOffset1 = -1 * (this.worldPos * BG_PARALLAX_RATIO_1[currentLevelIndex] % bkgdStars.width);
		// the distant planets in midground
		this.parallaxOffset2 = -1 * (this.worldPos * BG_PARALLAX_RATIO_2[currentLevelIndex] % bkgdParallaxLayer.width);
		// things overlaid above the gameplay (girders)
		this.parallaxOffset3 = -1 * (this.worldPos * BG_PARALLAX_RATIO_3[currentLevelIndex] % foregroundLayer.width);

		if ((this.bgTime === null) || (this.bgTime === undefined)) {
			this.bgTime = deltaTime;
		} else {
			this.bgTime += deltaTime;
		}

		starfield.update(deltaTime, this.worldPos);
	};

	this.drawForeground = function() {
		// foreground layer: girders truss beams aligned to bottom of screen
		canvasContext.drawImage(foregroundLayer, this.parallaxOffset3, canvas.height - foregroundLayer.height);
		canvasContext.drawImage(foregroundLayer, this.parallaxOffset3 + foregroundLayer.width, canvas.height - foregroundLayer.height);
	}

	this.drawBackground = function() {

		const BG_SAMPLE_PIXELS = 16; // pixels of source img for entire screen - default 1

		// gradually tweened background fill color
		// scrolls through a super zoomed in lookup table (gradient texture)
		const sampleXPos = Math.floor(this.bgTime * BG_COLOR_CHANGE_SPEED) % bkgdColorLookup.width;
		//Need to account for sample potentially running off the end of the sample image
		if(sampleXPos > bkgdColorLookup.width - BG_SAMPLE_PIXELS) {
			const firstSampleWidth = bkgdColorLookup.width - sampleXPos;
			const secondSampleWidth = BG_SAMPLE_PIXELS - firstSampleWidth;
			const fillRatio = GameField.width / BG_SAMPLE_PIXELS;

			canvasContext.drawImage(bkgdColorLookup,
			// source x,y,w,d (scroll source x over time)
			sampleXPos, 0, firstSampleWidth, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x, GameField.y - bgOffset, Math.floor(fillRatio * firstSampleWidth), GameField.height + bgOffset);

			canvasContext.drawImage(bkgdColorLookup,
			// source x,y,w,d (scroll source x over time)
			0, 0, secondSampleWidth, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x + Math.floor(fillRatio * firstSampleWidth), GameField.y - bgOffset, Math.floor(fillRatio * secondSampleWidth), GameField.height + bgOffset);
		} else {
			canvasContext.drawImage(bkgdColorLookup,
			// source x,y,w,d (scroll source x over time)
			sampleXPos, 0, BG_SAMPLE_PIXELS, 100,
			// dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
			GameField.x, GameField.y - bgOffset, GameField.width, GameField.height + bgOffset);
		}

		// galaxy / starfield images, tiled, with parallax
		canvasContext.drawImage(bkgdStars, this.parallaxOffset1, 0);
		canvasContext.drawImage(bkgdStars, this.parallaxOffset1 + bkgdStars.width, 0);

		// distant planets and nebulae
		canvasContext.drawImage(bkgdParallaxLayer, this.parallaxOffset2, bgOffset);
		canvasContext.drawImage(bkgdParallaxLayer, this.parallaxOffset2 + bkgdParallaxLayer.width,+ bgOffset);

		// twinkling stars
		if(levelIndex === 1) {//level 2
			canvasContext.save();
			canvasContext.globalAlpha = 0.4;
		}

		if(levelIndex != 2) {
			starfield.draw();
		}

		if(levelIndex === 1) {//level 2
			canvasContext.restore();
		}
	}

	this.darkenBG = function() {
		drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT,'rgba(0,0,0,'+DARKEN_BG_ALPHA+')');
	}

	this.draw = function() {

		this.drawBackground();

		// an experiment inspired by user feedback to increase foreground contrast
		if (DARKEN_BACKGROUNDS) this.darkenBG();

		for(let bullet of enemyBullets) {
			bullet.draw();
		}

		for(let entity of gameEntities) {
			entity.draw();
		}

		player.draw();
		ParticleRenderer.renderAll(canvasContext);


		for(let entity of foregroundEntities) {
			entity.draw();
		}

		this.drawForeground();

		uiManager.draw();

		if (levelIndex === 0 && this.worldPos < TUTORIAL_LENGTH) {
			if (this.worldPos % 20 > 9) { // flash every few units travelled
				gameFont.printTextAt("[X] TO FIRE", {x:GameField.x + 10, y:Math.round(GameField.bottom/2) + 30}, 30, textAlignment.Left);
			}
		}
	};

	this.collectedCapsule = function() {
		uiManager.incrementPowerUpToActivate();
	};

	this.activatedShield = function() {
		player.activateShield();
		uiManager.powerUpWasActivated(PowerUpType.Shield, null);
	};

	this.deactivatedShield = function() {
		uiManager.powerUpWasDeactivated(PowerUpType.Shield);
	}

	this.activatedMissile = function() {
		player.setHasMissiles(true);
		uiManager.powerUpWasActivated(PowerUpType.Missile, null);
	};

	this.activatedDouble = function() {
		player.setShotTo(EntityType.PlayerDouble);
		uiManager.powerUpWasActivated(PowerUpType.Double, null);
	};

	this.activatedLaser = function() {
		player.setShotTo(EntityType.PlayerLaser);
		uiManager.powerUpWasActivated(PowerUpType.Laser, null);
	};

	this.activatedTriple = function() {
		player.setShotTo(EntityType.PlayerTriple);
		uiManager.powerUpWasActivated(PowerUpType.Triple, null);
	};

	this.activatedGhost = function() {
		activatedAnyGhosts = true;
		player.activateGhostShip();
		uiManager.powerUpWasActivated(PowerUpType.Ghost, (player.activeGhosts + 1));
	};

	this.activatedForce = function() {
		player.activateTheForce();
		uiManager.powerUpWasActivated(PowerUpType.Force, null);
	};

	this.activateBasePowerUps = function() {
		this.activatedShield();
		this.activatedMissile();
		this.activatedDouble();
		this.activatedGhost();
		this.activatedGhost();
		this.activatedGhost();
		remainingLives = 29;
	};

	this.removePlayer = function() {
		if(levelIndex === WARP_INDEX) {
			this.levelIsComplete = true;
			this.didCompleteWarpChallenge = false;
			currentLevelIndex = 0;
			player.restoreGhosts();
			return;
		}

		uiManager.clearPowerUps();
		player.reset();
		powerUpToActivate = PowerUpType.None;

		if(remainingLives < 1) {
			this.gameIsOver = true;
			this.beatTheGame = false;
			uiManager.reset(true);
		} else {
			remainingLives--;
			uiManager.reset(false);
		}
	};

	//add extra life
	this.life = function() {
		remainingLives++;
		extraLife.play();
	};

	this.worldShouldPause = function(shouldPause) {
		worldPaused = shouldPause;
	};

    this.levelComplete = function() {
        this.levelIsComplete = true;
    };

    this.getPlayerObject = function() {
        return player;
    };

    this.getUIManagerObject = function() {
        return uiManager;
    };

	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			if(entityToRemove.collisionBody != null) {
				collisionManager.removeEntity(entityToRemove);
			}
			if((isEnemyBullet(entityToRemove)) || (entityToRemove.type === EntityType.ReflectedShot)) {//reflected shots have type = ReflectedShot*/
				enemyBullets.delete(entityToRemove);
			} else {
				gameEntities.delete(entityToRemove);
			}
		}
	};

	this.removeCollisions = function(entityToRemove) {
		collisionBodiesToRemove.push(entityToRemove);
	};

	this.destroyAllOnScreen = function(destroyer) {
		for(let entity of gameEntities) {
			if((entity.position.x >= GameField.x) &&
			   (entity.position.x <= GameField.right) &&
			   (entity.position.y >= GameField.y) &&
			   (entity.position.y <= GameField.bottom)) {
				   if(entity.collisionBody != null) {
				   		entity.didCollideWith(destroyer);
				   }
			   }
		}
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

	this.activatePowerUp = function() {
		if(!uiManager.getCanActivatePowerUp()) {
			//play buzzer => can't activate a power up right now
			return;
		}

		const powerUpToActivate = uiManager.getPowerUpToActivate();

        if(powerUpToActivate === PowerUpType.Ghost) {
            uiManager.powerUpWasActivated(powerUpToActivate, (player.activeGhosts + 1));
        } else {
            uiManager.powerUpWasActivated(powerUpToActivate, null);
        }

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
				player.activateGhostShip();
				break;
			case PowerUpType.Shield:
				player.activateShield();
				break;
			case PowerUpType.Force:
				player.activateTheForce();
				break;
			default:
				break;
		}

		if(powerUpToActivate === PowerUpType.Shield) {
			playerShieldActivate.play();
		} else {
			playerPowerUpActivate.play();
		}

		uiManager.reset(false);
		//powerUpActivated.play();//TODO: need this SFX track in the game, goes at the end so it isn't played if "None" is the power up
	};

	this.displayScore = function(entity, position) {
		let showPos = {x:entity.position.x, y:entity.position.y};
		if(position != undefined) {
			showPos = {x:position.x, y:position.y};
		}
		const newScore = new TextEntity(entity.score.toString(), Fonts.CreditsText, Color.White, showPos, 512, false);
		this.addEntity(newScore, false);

		uiManager.addToScore(entity.score);
		if(uiManager.getScore() >= nextLifeScore) {
			this.life();
			nextLifeScore += SCORE_PER_EXTRA_LIFE;
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
		else{
			const horizontal = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
			const vertical = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);

			canvasContext.setTransform(1, 0, 0, 1, horizontal, vertical);

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
