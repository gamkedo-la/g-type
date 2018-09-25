//Player
function Player(position = {x:0, y:0}) {
	const thrustFrame = {
		min:2,
		max:0
	};
	
	const PlayerEvent = {
		Invincible:"invinciblePlayer",
		LastShot:"lastShot"
	};
	
	this.type = EntityType.Player;
	this.currentShotType = EntityType.PlayerShot;
	
	const sprite = new AnimatedSprite(player1Sheet, 6, 120, 76, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:3, max:5}, 128);
	const explosionSprite = new AnimatedSprite(playerBoom2Sheet, 13, 80, 80, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max: 12}, 64);
	explosionSprite.wasBorn = true;
	explosionSprite.isDying = true;
	let explosionEmitter = 0;
	
	const SPRITE_SCALE = 0.60;//make sure to change the x and y position of the playershot to match scaling
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	let hasMissiles = false;
	const ghosts = [];
	const MAX_GHOSTS = 3;
	
	const BASE_SPEED = 90;//essentially pixels per second
	const MAX_SHOTS_ON_SCREEN = 10;//TODO: maybe this should be adjustable as a power up or part of the "speed up" power up?
	const INVINCIBLE_TIME = 1500;//in milliseconds
	
	const BASE_SHOT_DELAY = 128;
	const DELAY_MULTIPLIER = 5
	let currentShotDelay = DELAY_MULTIPLIER * BASE_SHOT_DELAY;
	let isInvincible = false;

	const velocity = {x:0, y:0};
	const shots = [];
	const missiles = [];

	let currentSpeed = BASE_SPEED;
	
	this.position = {x: position.x, y: position.y};
	const shield = new ShieldEntity({x:this.position.x, y:this.position.y}, {width:this.size.width, height:this.size.height});
	
	//this path lays out the corners of the polygon collider for the player (a triangle in this case)
	const MARGIN=8; // allow some overlap to feel more "fair" to player
	const colliderPath = [{x: MARGIN+this.position.x + SPRITE_SCALE * 21, y: MARGIN+this.position.y + SPRITE_SCALE * 1}, 
						  {x: -MARGIN+this.position.x + SPRITE_SCALE * (sprite.width - 2), y: this.position.y + SPRITE_SCALE * sprite.height / 2}, 
						  {x: MARGIN+this.position.x + SPRITE_SCALE * 21, y: -MARGIN+this.position.y + SPRITE_SCALE * (sprite.height - 1)}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate
	
	this.update = function(deltaTime, worldPos) {
		sprite.update(deltaTime);//update the image
		shield.update(deltaTime, this.position);
		
		if(sprite.isDying) {
			explosionSprite.update(deltaTime);
		} 
		
		if(sprite.getDidDie()) {
			//indicates that the sprite has reached the final frame of the "death sequence"
			scene.removePlayer();
			sprite.isDying = false;
			scene.endShake();
			const emitterIndex = ParticleEmitterManager.pool.indexOf(explosionEmitter);
			ParticleEmitterManager.returnEmitterToPool(emitterIndex);
			if(playerExplosion.getTime() <= 0) {
				playerExplosion.play();
			}
			return;	
		} else if(!sprite.isDying) {
			this.adjustVelocityAndSpriteForPlayerInput();
					
			if(holdSpace) {//shooting
				this.doShooting();
			}
			
			for(let i = 0; i < ghosts.length; i++) {
				ghosts[i].update(deltaTime, {x:this.position.x, y:this.position.y});
			}
			
			//update all player shots
			for(let i = 0; i < shots.length; i++) {
				shots[i].update(deltaTime, worldPos);
			}
			
			for(let i = 0; i < missiles.length; i++) {
				missiles[i].update(deltaTime, worldPos);
			}
			
			//increment player position based on elapsed time calculated velocities
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				availableTime -= SIM_STEP;
				
				this.position.x += velocity.x * SIM_STEP / 1000;
				this.position.y += velocity.y * SIM_STEP / 1000;
			}
			
			//save any unused time for use during the next call to this.update
			unusedTime = availableTime;
			
			this.clampPositionToScreen();
			
			//keep the collisionBody position in synch with the visual position
			this.collisionBody.setPosition({x:this.position.x, y:this.position.y});

			if (this.forceUnitActive) {
				this.forceUnit.update(deltaTime, worldPos);
			}
			
			if(isInvincible) {
				if(timer.timeSinceUpdateForEvent(PlayerEvent.Invincible) >= INVINCIBLE_TIME) {
					this.setInvincible(false);
				} 
			}
		}
	};
	
	this.draw = function() {
		//If the player is invincible, draw just the player sprite at 50% opacity
		if(isInvincible) {
			canvasContext.save();
			let alpha = timer.getCurrentTime() % 20 < 10 ? 1 : 0.50;  //blinky blinky! 
			
			canvasContext.globalAlpha = alpha;
		}
		
		//draw the player
		sprite.drawAt(this.position, this.size);
		if((sprite.isDying) && (!explosionSprite.getDidDie())) {
			explosionSprite.drawAt(this.position, this.size);
		}
		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		this.collisionBody.draw();
		
		if(isInvincible) {
			canvasContext.restore();
		}

		if (this.forceUnitActive) {
			this.forceUnit.draw();
		}
		
		shield.draw();
		
		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].draw();
		}
		
		//draw player shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].draw();
		}
	};
	
	this.clampPositionToScreen = function() {
		//clamp player position to the screen
		if(this.position.x < GameField.x) {
			this.position.x = GameField.x;
		} else if(this.position.x > (GameField.right - this.size.width)) {
			this.position.x = GameField.right - this.size.width;
		}
		
		if(this.position.y < GameField.y + 50) {//50 is fudge factor to account for UI Frame size
			this.position.y = GameField.y + 50;
		} else if(this.position.y > (GameField.bottom - this.size.height)) {
			this.position.y = GameField.bottom - this.size.height;
		}
	};
	
	this.doShooting = function() {
		let timeSinceLastShot = timer.timeSinceUpdateForEvent(PlayerEvent.LastShot);
		if((timeSinceLastShot == null) || (timeSinceLastShot === undefined)) {
			//this is the first time the player has shot, so need to register the event with the timer object
			timeSinceLastShot = timer.registerEvent(PlayerEvent.LastShot);
		}
		
		if(timeSinceLastShot > currentShotDelay) {
			//enough time has passed so we can shoot again
			let newShot;
			if(shots.length === MAX_SHOTS_ON_SCREEN) {
				//basically a pool of shots, grab the oldest one
				newShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				newShot = new PlayerShot();
			}
			
			let secondShot;
			const secondVel = {x:150, y:-150};
			if(shots.length === MAX_SHOTS_ON_SCREEN) {
				//basically a pool of shots, grab the oldest one
				secondShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				secondShot = new PlayerShot();
			}
			
			let thirdShot;
			const thirdVel = {x:-200, y:0};
			if(shots.length === MAX_SHOTS_ON_SCREEN) {
				//basically a pool of shots, grab the oldest one
				thirdShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				thirdShot = new PlayerShot();
			}
						
			switch(this.currentShotType)
			{
				case EntityType.PlayerShot:
					initializeShot(newShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 13}, {x: 200, y: 0}, false);
					playerFireRegular.play();//play the audio
					break;
				case EntityType.PlayerDouble:
					initializeShot(newShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 13}, {x: 200, y: 0}, false);
					initializeShot(secondShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 6}, {x: secondVel.x, y: secondVel.y}, true);
					playerFireRegular.play();
					break;
				case EntityType.PlayerLaser:
					initializeShot(newShot, this.currentShotType, {x:this.position.x + 74, y:this.position.y + 22}, {x: 600, y: 0}, false);
					playerFireLaser.play();
					break;
				case EntityType.PlayerTriple:
					initializeShot(newShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 13}, {x: 200, y: 0}, false);
					initializeShot(secondShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 13}, {x: secondVel.x, y: secondVel.y}, true);
					initializeShot(thirdShot, this.currentShotType, {x:this.position.x - thirdShot.size.width, y:this.position.y + 13}, {x: thirdVel.x, y: thirdVel.y}, true);
					playerFireRegular.play();
					break;
				default:
					initializeNewShot(newShot, this.currentShotType, {x:this.position.x + 86, y:this.position.y + 6}, {x: 200, y: 0});
					playerFireRegular.play();
					break;
			}
			
			if(hasMissiles) {
				let newMissile
				if(missiles.length === MAX_SHOTS_ON_SCREEN) {
					newMissile = missiles.splice(0, 1)[0];
					newMissile.setPosition({x:this.position.x, y:this.position.y});
					newMissile.setVelocity({x:100, y:150});
				} else {
					newMissile = new PlayerMissile({x:this.position.x, y:this.position.y}, {x:100, y:150});
				}
				
				newMissile.reset();
				missiles.push(newMissile);
				scene.addEntity(newMissile, true);
			}
						
			timer.updateEvent(PlayerEvent.LastShot);
		}
	};
	
	const initializeShot = function(shot, shotType, shotPos, shotVel, isRotated) {
		shot.resetWithType(shotType);
		scene.addEntity(shot, true);
		shot.setPosition({x:shotPos.x, y:shotPos.y});
		shot.setVelocity({x: shotVel.x, y: shotVel.y});
		if(isRotated) {shot.rotation = Math.atan2(-shotVel.y, shotVel.x);}
		shots.push(shot);
	}
		
	this.adjustVelocityAndSpriteForPlayerInput = function() {
		//indicates the sprite is NOT "playing" the death animation => can still fly around the screen and shoot
		if(holdLeft) {
			velocity.x = -currentSpeed;
			sprite.setFrame(thrustFrame.min);//show a frame with minimal thrust fire
		} else if(holdRight) {
			velocity.x = currentSpeed;
			sprite.setFrame(thrustFrame.max);//show a frame with maximal thrust fire
		} else {
			velocity.x = 0;
		}
		
		if(holdUp) {
			velocity.y = -currentSpeed;
		} else if(holdDown) {
			velocity.y = currentSpeed;
		} else {
			velocity.y = 0;
		}	
	};
	
	this.setShotTo = function(newShotType) {
		this.currentShotType = newShotType;
	};
	
	this.activateTheForce = function() {
		if((this.forcUnit === null) || (this.foceUnit === undefined)) {
			this.forceUnit = new PlayerForceUnit({x:0, y:0});
			// Give the force unit a reference to "this", so we can update its position based on the ship's position
			this.forceUnit.parentObj = this;
		}

		this.forceUnitActive = true;
		scene.addEntity(this.forceUnit);
	};
	
	this.activateShield = function() {
		shield.reset();
		scene.addEntity(shield, true);
	};
	
	this.activateGhostShip = function() {
		let thisGhost;
		if(ghosts.length < 3) {
			thisGhost = new GhostShipEntity({x:this.position.x - 50, y:this.position.y});
			ghosts.push(thisGhost);
		} else {
			for(let i = 0; i < ghosts.length; i++) {
				if(!ghosts[i].isActive) {
					thisGhost = ghosts[i];
					thisGhost.setPosition({x:this.position.x - 50, y:this.position.y});
				}
			}
		}
		
		thisGhost.isActive = true;
	}
	
	this.didCollideWith = function(otherEntity) {
		if(otherEntity.type === EntityType.Capsule1) {
			scene.collectedCapsule();
			
		} else if(otherEntity.type === EntityType.PlayerShield) {
			return;//Player is not damaged by colliding with it's own shield
		} else {
			if (isInvincible || cheats.playerInvincible) {
				if(cheats.playerInvincible) {
					console.log("Note: cheats.playerInvincible turned on");
				}
				//TODO: does anything need to be done here?
			} else {
				scene.shouldShake(MAX_SHAKE_MAGNITUDE);
				sprite.isDying = true;
                playerExplosion.play();
				explosionEmitter = createParticleEmitter(this.position.x + this.size.width / 2,this.position.y + this.size.height / 2, exampleExplosion);
			}
		}
	};
	
	this.incrementSpeed = function() {
		let multiplier = currentSpeed / BASE_SPEED;
		multiplier += 1.0;
		currentSpeed = multiplier * BASE_SPEED;
		
		let delayMultiplier = currentShotDelay / BASE_SHOT_DELAY;
		delayMultiplier -= 0.5;
		if(delayMultiplier < 2) {
			delayMultiplier = 2;
		}
		currentShotDelay = delayMultiplier * BASE_SHOT_DELAY;
	}
	
	this.setHasMissiles = function(hasMiss) {
		hasMissiles = hasMiss;
	}
	
	//helper function to restore the player to initial state (restart/continue/new life/etc)
	this.reset = function() {
		//clear all power ups and player shots on screen
		this.clearPowerUps();
		this.clearBullets();
		
		//reset the player's position
		this.position.x = GameField.x;
		this.position.y = GameField.midY;
		
		//reset the player sprite
		sprite.clearDeath();
		explosionSprite.clearDeath();
		explosionSprite.wasBorn = true;
		explosionSprite.isDying = true;
		
		//give the player a short period of invincibility	
		this.setInvincible(true);
	};
	
	this.clearPowerUps = function() {
		//reset player shot to the base shot type
		this.currentShotType = EntityType.PlayerShot;
		
		//restore player speed and shooting rate to base values
		currentSpeed = BASE_SPEED;
		currentShotDelay = DELAY_MULTIPLIER * BASE_SHOT_DELAY;
		
		//clear Missiles and Shields Flags
		hasMissiles = false;
		shield.deactivate();
		
		//remove The Force from the scene and Collision manager & make it Inactive
		if((this.forceUnit !== null) && (this.forceUnit !== undefined)) {
			scene.removeEntity(this.forceUnit);
			this.forceUnitActive = false;
		}
		
		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].isActive = false;
		}
	};
	
	this.clearBullets = function() {
		for(let i = 0; i < shots.length; i++) {
			shots[i].isVisible = false;
			shots[i].isActive = false;
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].isVisible = false;
			missiles[i].isActive = false;
		}
	};
	
	this.setInvincible = function(newValue) {
		isInvincible = newValue;
		if(newValue) {
			timer.registerEvent(PlayerEvent.Invincible);
		}
	};
	
	return this;
}
