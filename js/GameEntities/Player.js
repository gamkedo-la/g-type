//Player
function Player(position = {x:0, y:0}) {
	const thrusterFrame = { // of the thruster plasma sprite
		min:2,
		mid:1,
		max:0
	};
	const thrustFrame = { // of the ship sprite
		min:0,
		max:0
	};
	const downFrame = {
		min:1,
		max:2
	};
	const upFrame = {
		min:3,
		max:4
	};
	const idleFrame = {
		min:0,
		max:0
	};

	const PlayerEvent = {
		Invincible:"invinciblePlayer",
		LastShot:"lastShot",
		LastMissile:"lastMissile"
	};

	this.type = EntityType.Player;
	this.currentShotType = EntityType.PlayerShot;

	// original version 1 of player sprite
	// const sprite = new AnimatedSprite(player1Sheet, 6, 62, 27, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:3, max:5}, 128);

	// v2 of player sprite with tilting - 52px x 32px
	// sheet, frameCount, frameWidth, frameHeight, reverses, autoLife, birthRange, birthRate, lifeRange, lifeRate, deathRange, deathRate
	// FIXME: we need thruster frames added to the art, and reverses is false and likeRate is a big number
	// because otherwise it flickers between intended frame and a different tilt frame (min can't == max? always assumes max-1 when looping)
	const sprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, 9999999, {min:5, max:7}, 128);

	const thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, 9999999, {min:0, max:0}, 128);

	const explosionSprite = new AnimatedSprite(playerBoom2Sheet, 13, 80, 80, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max: 12}, 64);
	explosionSprite.wasBorn = true;
	explosionSprite.isDying = true;
	let explosionEmitter = 0;
	let trailEmitter = 0;

	const SPRITE_SCALE = 1.0;//make sure to change the x and y position of the playershot to match scaling
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	this.thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};
	this.thrusterPosition = {x:0,y:0};
	let hasMissiles = false;
	const ghosts = [];
    this.activeGhosts = 0;

	const BASE_SPEED = 160;//essentially pixels per second
	const MAX_SHOTS_ON_SCREEN = 10;//TODO: maybe this should be adjustable as a power up or part of the "speed up" power up?
	const INVINCIBLE_TIME = 1500;//in milliseconds

	const BASE_SHOT_DELAY = 96; //this should be faster for main gun, independent slower variable for missiles
	const BASE_MISSILE_DELAY = 144;
	const DELAY_MULTIPLIER = 5;
	const NORMAL_SHOT_SPEED = 1200;
	const MISSILE_VELOCITY = {x:125, y:175};
	const secondVel = {x:NORMAL_SHOT_SPEED, y:-NORMAL_SHOT_SPEED};
	const thirdVel = {x:-NORMAL_SHOT_SPEED, y:0};
	let currentShotDelay = DELAY_MULTIPLIER * BASE_SHOT_DELAY;
	let currentMissileDelay = DELAY_MULTIPLIER * BASE_MISSILE_DELAY;
	let isInvincible = false;

	const velocity = {x:0, y:0};
	const shots = [];
	const missiles = [];

	let currentSpeed = BASE_SPEED;

	this.position = {x: position.x, y: position.y};
	const shield = new ShieldEntity({x:this.position.x, y:this.position.y}, {width:this.size.width, height:this.size.height});

	//this path lays out the corners of the polygon collider for the player (a triangle in this case)
	const MARGIN = 4; // allow some overlap to feel more "fair" to player
	const THRUSTER = 10;

	const colliderPath = [{x: this.position.x + MARGIN + THRUSTER, y: this.position.y + (1.5 * MARGIN)},
						  {x: this.position.x + this.size.width - (1.5 * MARGIN), y: this.position.y + (this.size.height / 2) + MARGIN / 2},
						  {x: this.position.x + MARGIN + THRUSTER, y: this.position.y + this.size.height - MARGIN}];

	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	this.getIsDying = function() {
		return sprite.isDying;
	};

	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate

	this.update = function(deltaTime, worldPos) {
		sprite.update(deltaTime);//update the image
		thrusterSprite.update(deltaTime); // unused?
		shield.update(deltaTime, this.position);

		if(sprite.isDying) {
			explosionSprite.update(deltaTime);
		}

		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].update(deltaTime, {x:this.position.x, y:this.position.y}, worldPos);
		}

		if(sprite.getDidDie()) {
			//indicates that the sprite has reached the final frame of the "death sequence"
			scene.removePlayer();
			sprite.isDying = false;
			this.clearBullets();

			if(playerExplosion.getTime() <= 0) {
				playerExplosion.play();
			}
			return;
		} else if(!sprite.isDying) {
			this.adjustVelocityAndSpriteForPlayerInput();

			trailEmitter = createParticleEmitter(this.position.x,this.position.y + this.size.height / 2, playerTrail);

			if(holdKey[KEY_X]) {//shooting
				this.doShooting();
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

		//draw the thruster
		if(!sprite.isDying) {
			let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
			this.thrusterPosition.x = this.position.x - 28 + thrusterMod;
			this.thrusterPosition.y = this.position.y;
	
			thrusterSprite.drawAt(this.thrusterPosition.x, this.thrusterPosition.y, this.thrusterSize.width, this.thrusterSize.height);
		}

		//draw player shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}

		for(let i = 0; i < missiles.length; i++) {
			missiles[i].draw();
		}
		
		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].draw();
		}

		//draw the player
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
		if((sprite.isDying) && (!explosionSprite.getDidDie())) {
			explosionSprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
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
		console.log("Player Shot Count: " + shots.length);
		let timeSinceLastShot = timer.timeSinceUpdateForEvent(PlayerEvent.LastShot);
		let timeSinceLastMissile = timer.timeSinceUpdateForEvent(PlayerEvent.LastMissile);
		if((timeSinceLastShot == null) || (timeSinceLastShot === undefined)) {
			//this is the first time the player has shot, so need to register the event with the timer object
			timeSinceLastShot = timer.registerEvent(PlayerEvent.LastShot);
			timeSinceLastMissile = timer.registerEvent(PlayerEvent.LastMissile);
		}

		if(timeSinceLastShot > currentShotDelay) {
			//enough time has passed so we can shoot again
			for(let i = 0; i < ghosts.length; i++) {
				ghosts[i].doShooting(MAX_SHOTS_ON_SCREEN, this.currentShotType, hasMissiles);
			}
			
			let newShot;
			let secondShot;
			let thirdShot;
			
			if(shots.length >= MAX_SHOTS_ON_SCREEN) {
				//basically a pool of shots, grab the oldest one
				newShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				newShot = new PlayerShot();
			}

			switch(this.currentShotType) {
				case EntityType.PlayerShot:
					initializeShot(newShot, EntityType.PlayerShot, 
					               {x:this.position.x + 70, y:this.position.y + 4}, 
					               {x: NORMAL_SHOT_SPEED, y: 0}, false);
					               
					playerFireRegular.play();//play the audio
					break;
				case EntityType.PlayerDouble:
					initializeShot(newShot, EntityType.PlayerShot, 
					               {x:this.position.x + 70, y:this.position.y + 4}, 
					               {x: NORMAL_SHOT_SPEED, y: 0}, false);
					
					if(shots.length >= MAX_SHOTS_ON_SCREEN) {
						//basically a pool of shots, grab the oldest one
						secondShot = shots.splice(0, 1)[0];
					} else {
						//not enough shots in the pool, so make a new one
						secondShot = new PlayerShot();
					}
					
					initializeShot(secondShot, EntityType.PlayerDouble, 
					               {x:this.position.x + 60, y:this.position.y + 2}, 
					               {x: secondVel.x, y: secondVel.y}, true);
					
					playerFireRegular.play();
					break;
				case EntityType.PlayerLaser:
					initializeShot(newShot, this.currentShotType, 
					               {x:this.position.x + 70, y:this.position.y + 13}, 
					               {x: 3 * NORMAL_SHOT_SPEED, y: 0}, false);
					               
					playerFireLaser.play();
					break;
				case EntityType.PlayerTriple:
					initializeShot(newShot, EntityType.PlayerShot, 
					               {x:this.position.x + 70, y:this.position.y + 4}, 
					               {x: NORMAL_SHOT_SPEED, y: 0}, false);
					
					if(shots.length >= MAX_SHOTS_ON_SCREEN) {
						//basically a pool of shots, grab the oldest one
						secondShot = shots.splice(0, 1)[0];
					} else {
						//not enough shots in the pool, so make a new one
						secondShot = new PlayerShot();
					}
		
					initializeShot(secondShot, EntityType.PlayerDouble, 
					               {x:this.position.x + 80, y:this.position.y + 4}, 
					               {x: secondVel.x, y: secondVel.y}, true);
					
					if(shots.length >= MAX_SHOTS_ON_SCREEN) {
						//basically a pool of shots, grab the oldest one
						thirdShot = shots.splice(0, 1)[0];
					} else {
						//not enough shots in the pool, so make a new one
						thirdShot = new PlayerShot();
					}
					
					initializeShot(thirdShot, EntityType.PlayerTriple, 
					               {x:this.position.x - thirdShot.size.width, y:this.position.y + 4}, 
					               {x: thirdVel.x, y: thirdVel.y}, true);
					
					playerFireRegular.play();
					break;
				default:
					initializeNewShot(newShot, this.currentShotType, 
					                  {x:this.position.x + 80, y:this.position.y + 4}, 
					                  {x: NORMAL_SHOT_SPEED, y: 0});
					playerFireRegular.play();
					break;
			}

			timer.updateEvent(PlayerEvent.LastShot);
		}

		if((hasMissiles) && (timeSinceLastMissile > currentMissileDelay)) {
			let newMissile
			if(missiles.length >= MAX_SHOTS_ON_SCREEN) {
				newMissile = missiles.splice(0, 1)[0];
				newMissile.setPosition({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)});
				newMissile.setVelocity(MISSILE_VELOCITY);
			} else {
				newMissile = new PlayerMissile({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)}, MISSILE_VELOCITY);
			}

			newMissile.reset();
			missiles.push(newMissile);
			scene.addEntity(newMissile, true);

			timer.updateEvent(PlayerEvent.LastMissile);
		}
	};

	const initializeShot = function(shot, shotType, shotPos, shotVel, isRotated) {
		shot.resetWithType(shotType);
		scene.addEntity(shot, true);
		shot.setPosition({x:shotPos.x, y:shotPos.y});
		shot.setVelocity({x: shotVel.x, y: shotVel.y});
		shots.push(shot);
	};

	this.adjustVelocityAndSpriteForPlayerInput = function() {
		//adjust tilt frames based on velocity independent of keypresses
		sprite.setFrame(idleFrame.min);
		if(velocity.y < 0){
			if(velocity.y > -currentSpeed * .85){sprite.setFrame(upFrame.min)}
			else ( sprite.setFrame(upFrame.max) );
		}
		else if (velocity.y > 0){
			if(velocity.y < currentSpeed * .85){sprite.setFrame(downFrame.min)}
			else ( sprite.setFrame(downFrame.max) );
		}
		thrusterSprite.setFrame(thrusterFrame.mid);
		if(velocity.x < 0){
			if(velocity.x > -currentSpeed * .85){thrusterSprite.setFrame(thrusterFrame.mid)}
			else ( thrusterSprite.setFrame(thrusterFrame.min) );
		}
		else if (velocity.x > 0){
			if(velocity.x < currentSpeed * .85){thrusterSprite.setFrame(thrusterFrame.mid)}
			else ( thrusterSprite.setFrame(thrusterFrame.max) );
		}


		//indicates the sprite is NOT "playing" the death animation => can still fly around the screen and shoot
		if(holdKey[KEY_LEFT] || holdKey[KEY_A]) {
			if(velocity.x > -currentSpeed) {
				velocity.x -= 0.6 * currentSpeed;
			} else {
				velocity.x = -currentSpeed;
			}
			//sprite.setFrame(thrustFrame.min);//show a frame with minimal thrust fire
			//thrusterSprite.setFrame(thrusterFrame.min);
		} else if(holdKey[KEY_RIGHT] || holdKey[KEY_D]) {
			if(velocity.x < currentSpeed) {
				velocity.x += 0.6 * currentSpeed;
			} else {
				velocity.x = currentSpeed;
			}
			//sprite.setFrame(thrustFrame.max);//show a frame with maximal thrust fire
			//thrusterSprite.setFrame(thrusterFrame.max);
		} else {
			velocity.x *= 0.5;
			if((velocity.x < 0.25 * currentSpeed) && (velocity.x > -0.25 * currentSpeed)) {
				velocity.x = 0;
			}
			//sprite.setFrame(idleFrame.min);
			//thrusterSprite.setFrame(thrusterFrame.mid);
		}

		if(holdKey[KEY_UP] || holdKey[KEY_W]) {
			if(velocity.y > -currentSpeed) {
				velocity.y -= 0.6 * currentSpeed;
			} else {
				velocity.y = -currentSpeed;
			}


		} else if(holdKey[KEY_DOWN] || holdKey[KEY_S]) {
			if(velocity.y < currentSpeed) {
				velocity.y += 0.6 * currentSpeed;
			} else {
				velocity.y = currentSpeed;
			}
			//sprite.setFrame(downFrame.max); // tilt ship
		} else {
			velocity.y *= 0.5;
			if((velocity.y < 0.25 * currentSpeed) && (velocity.y > -0.25 * currentSpeed)) {
				velocity.y = 0;
			}
			//sprite.setFrame(idleFrame.max);
		}
	};

	this.setShotTo = function(newShotType) {
		this.currentShotType = newShotType;
	};

	this.activateTheForce = function() {
		if((this.forceUnit === null) || (this.forceUnit === undefined)) {
			this.forceUnit = new PlayerForceUnit({x:0, y:0});
			// Give the force unit a reference to "this", so we can update its position based on the ship's position
			this.forceUnit.parentObj = this;
		}

		this.forceUnitActive = true;
		scene.addEntity(this.forceUnit, false);
	};

	this.activateShield = function() {
		shield.reset();
		scene.addEntity(shield, true);
	};

	this.activateGhostShip = function() {
        if(this.activeGhosts >= MAX_GHOSTS) {return;}
        
        if(this.activeGhosts < ghosts.length) {//previously created a ghost which isn't currently active
	        for(let i = 0; i < ghosts.length; i++) {
		        if(!ghosts[i].isActive) {
					thisGhost = ghosts[i];
					break;//found the first one which is inActive => done
				}
	        }
        } else {//never had this many active simultaneously before so need to make a new one
	        thisGhost = new GhostShipEntity({x:this.position.x, y:this.position.y}, 75 * (1 + ghosts.length));
			ghosts.push(thisGhost);
        }
        
        thisGhost.isActive = true;
        this.activeGhosts++;
    };

	this.didCollideWith = function(otherEntity) {
		if(otherEntity.type === EntityType.Capsule1) {
			scene.collectedCapsule();
		} else if((otherEntity.type === EntityType.PlayerShield) || (otherEntity.type === EntityType.RagnarokCapsule)) {
			return;//Player is not damaged by colliding with it's own shield or with the RagnarokCapsule
		} else if(otherEntity.type === EntityType.FreeCollider || otherEntity.type === EntityType.Text) {
			return;//Player is not damaged by colliding with a free collider, or harmless text
		} else {
			if (isInvincible || cheats.playerInvincible) {
				if(cheats.playerInvincible) {
				}
			} else {
				if(shield.isActive) {
					if(isTerrain(otherEntity)) {
						if((otherEntity.type === EntityType.BigDestRock) || 
						   (otherEntity.type === EntityType.SmDestRock1) || 
						   (otherEntity.type === EntityType.SmDestRock2) || 
						   (otherEntity.type === EntityType.SmDestRock3)) {
							   //do nothing, shield does protect agains destructible terrain
						} else {
							this.playerHit(otherEntity);
						}
					}
				} else {
					this.playerHit(otherEntity);
				}
			}
		}
	};
	
	this.playerHit = function(otherEntity) {
		scene.shouldShake(MAX_SHAKE_MAGNITUDE);
		sprite.isDying = true;
		sprite.unusedTime = 0;
		playerExplosion.play();
		explosionEmitter = createParticleEmitter(this.position.x + this.size.width / 2,this.position.y + this.size.height / 2, exampleExplosion);
		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].playerDied();
		}
	};
	
	this.restoreGhosts = function() {
		for(let i = 0; i < ghosts.length; i++) {
			if(ghosts[i].isActive) {
				ghosts[i].restore();
			}
		}
	};

	this.incrementSpeed = function() {
		let multiplier = currentSpeed / BASE_SPEED;
        multiplier += 0.25;//1.0;
		currentSpeed = multiplier * BASE_SPEED;

		let delayMultiplier = currentShotDelay / BASE_SHOT_DELAY;
		delayMultiplier -= 1.0;
		if(delayMultiplier < 2) {
			delayMultiplier = 2;
		}
		currentShotDelay = delayMultiplier * BASE_SHOT_DELAY;

		let missileDelayMult = currentMissileDelay / BASE_MISSILE_DELAY;
		missileDelayMult -= 1.0;
		if(missileDelayMult < 2) {
			missileDelayMult = 2;
		}
		currentMissileDelay = missileDelayMult * BASE_MISSILE_DELAY;
    };

	this.setHasMissiles = function(hasMiss) {
		hasMissiles = hasMiss;
    };

	//helper function to restore the player to initial state (restart/continue/new life/etc)
	this.reset = function() {
		//clear all power ups and player shots on screen
		this.clearPowerUps();
		this.clearBullets();

		//reset the player's position
		this.position.x = GameField.x;
		this.position.y = GameField.midY;

        this.clearDeath();

		//give the player a short period of invincibility
		this.setInvincible(true);
	};

    this.clearDeath = function() {
        //reset the player sprite
        sprite.clearDeath();
        explosionSprite.clearDeath();
        explosionSprite.wasBorn = true;
        explosionSprite.isDying = true;
    };

	this.clearPowerUps = function() {
		//reset player shot to the base shot type
		this.currentShotType = EntityType.PlayerShot;

		//restore player speed and shooting rate to base values
		currentSpeed = BASE_SPEED;
		currentShotDelay = DELAY_MULTIPLIER * BASE_SHOT_DELAY;
		currentMissileDelay = DELAY_MULTIPLIER * BASE_MISSILE_DELAY;

		//clear Missiles and Shields Flags
		hasMissiles = false;
		shield.deactivate();

		//remove The Force from the scene and Collision manager & make it Inactive
		if((this.forceUnit !== null) && (this.forceUnit !== undefined)) {
			scene.removeEntity(this.forceUnit);
			this.forceUnitActive = false;
		}


		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].reset();
		}
        this.activeGhosts = 0;
	};

	this.clearBullets = function() {
		for(let i = 0; i < shots.length; i++) {
			shots[i].isVisible = false;
			shots[i].isActive = false;
			scene.removeCollisions(shots[i], true);
		}

		for(let i = 0; i < missiles.length; i++) {
			missiles[i].isVisible = false;
			missiles[i].isActive = false;
			scene.removeCollisions(missiles[i], true);
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
