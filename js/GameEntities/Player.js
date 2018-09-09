//Player
function Player(position = {x:0, y:0}) {
	const thrustFrame = {
		min:2,
		max:0
	};
	
	const PlayerEvent = {
		Incincible:"invinciblePlayer",
		LastShot:"lastShot"
	};
	
	this.type = EntityType.Player;
	this.currentShotType = EntityType.PlayerShot;
	
	const sprite = new AnimatedSprite(player1Sheet, 6, 60, 38, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:3, max:5}, 128);
	const explosionSprite = new AnimatedSprite(playerBoom2Sheet, 13, 80, 80, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max: 12}, 64);
	explosionSprite.wasBorn = true;
	explosionSprite.isDying = true;
	const SPRITE_SCALE = 1; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	let hasShield = false;//TODO: doesn't ever change because "shield" power up hasn't been implemented yet
	
	const BASE_SPEED = 75;//essentially pixels per second
	const MAX_SHOTS_ON_SCREEN = 10;//TODO: maybe this should be adjustable as a power up or part of the "speed up" power up?
	const INVINCIBLE_TIME = 1500;//in milliseconds
	
	let currentShotDelay = 256;//TODO: Implement a power up which makes player shoot faster (maybe part of laser?)
	let isInvincible = false;

	const velocity = {x:0, y:0};
	const shots = [];

	this.forceUnit = new PlayerForceUnit({x:0, y:0});
	this.forceUnit.parentObj = this;	// Give the force unit a reference to "this", so we can update its position based on the ship's position
	this.forceUnitActive = false;		// TODO control force unit being active/inactive using powerups and such

	let currentSpeed = BASE_SPEED;//TODO: Adjust this when the player chooses the "speed up" power up, need to reset it to base when the player dies
	
	this.position = {x: position.x, y: position.y};
	
	//this path lays out the corners of the polygon collider for the player (a triangle in this case)
	const colliderPath = [{x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * 1}, 
						  {x: this.position.x + SPRITE_SCALE * (sprite.width - 2), y: this.position.y + SPRITE_SCALE * sprite.height / 2}, 
						  {x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * (sprite.height - 1)}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate
	
	this.update = function(deltaTime, worldPos) {
		// TODO remove the hardcoding of forceUnitActive,
		//and the adding of the force unit Collider to the
		//collision manager -- the code is here for testing purposes
		if (this.forceUnitActive === false) {	// TODO control force unit being active/inactive using powerups and such
			this.forceUnitActive = true;	// Note: activating the force unit in update() out of "necessity" (couldn't do it in Player's constructor, because Player is instantiated in scene's constructor. i.e., scene is not a complete/ready object at the point the Player ctor is called)
			scene.addEntity(this.forceUnit);	// TODO move this function call into a function, e.g., when the player picks up a force unit powerup. Also, add the necessary call to remove the entity if the player gets blown up
		}
		
		sprite.update(deltaTime);//update the image
		
		if(sprite.isDying) {
			explosionSprite.update(deltaTime);
		} 
		
		if(sprite.getDidDie()) {
			//indicates that the sprite has reached the final frame of the "death sequence"
			scene.removePlayer();
			sprite.isDying = false;
			scene.endShake();
			return;	
		} else if(!sprite.isDying) {
			this.adjustVelocityAndSpriteForPlayerInput();
					
			if(holdSpace) {//shooting
				this.doShooting();
			}
			
			//update all player shots
			for(let i = 0; i < shots.length; i++) {
				shots[i].update(deltaTime, worldPos);
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
				if(timer.timeSinceUpdateForEvent(PlayerEvent.Incincible) >= INVINCIBLE_TIME) {
					this.setInvincible(false);
				} 
			}
		}
	};
	
	this.draw = function() {
		//If the player is invincible, draw just the player sprite at 50% opacity
		if(isInvincible) {
			canvasContext.save();
			canvasContext.globalAlpha = 0.50;
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
		
		//draw player shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}
	};
	
	this.clampPositionToScreen = function() {
		//clamp player position to the screen
		if(this.position.x < GameField.x) {
			this.position.x = GameField.x;
		} else if(this.position.x > (GameField.right - this.size.width)) {
			this.position.x = GameField.right - this.size.width;
		}
		
		if(this.position.y < GameField.y) {
			this.position.y = GameField.y;
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
			
			//initialize the newShot (whether it is new or pulled from the pool)
			newShot.resetWithType(this.currentShotType);
			scene.addEntity(newShot, true);
			switch(this.currentShotType)
			{
				case EntityType.PlayerShot:
					newShot.setPosition({x:this.position.x + 75, y:this.position.y + 6});
					break;
				case EntityType.PlayerLaser:
					newShot.setPosition({x:this.position.x + 65, y:this.position.y + 15});
					break;
				default:
					newShot.setPosition({x:this.position.x + 75, y:this.position.y + 6});
					break;
			}
						
			shots.push(newShot);
			timer.updateEvent(PlayerEvent.LastShot);
			playerFireRegular.play();//play the audio
		}
	};
	
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
	
	this.didCollideWith = function(otherEntity) {
		if(otherEntity.type === EntityType.Capsule1) {
			scene.collectedCapsule();
			

		} else {
			if(hasShield) {//shields not implemented => hasShield always = false
				scene.shouldShake(MAX_SHAKE_MAGNITUDE / 2);
				shield.hit();//need to implement the shield object, doesn't crash because hasShield is always false
			} else if(isInvincible) {
				//TODO: does anything need to be done here?
			} else {
				scene.shouldShake(MAX_SHAKE_MAGNITUDE);
				sprite.isDying = true;
				/*explosionSprite.isDying = true;
				explosionSprite.drawAt({x:this.position.x + this.size.width * 0.5, y:this.position.y + this.size.width * 0.5}, {width: explosionSprite.width, height: explosionSprite.height});*/
				createParticleEmitter(this.position.x + this.size.width / 2,this.position.y + this.size.height / 2, exampleExplosion);
			}
		}
	};
	
	this.incrementSpeed = function() {
		let multiplier = currentSpeed / BASE_SPEED;
		multiplier += 1.0;
		currentSpeed = multiplier * BASE_SPEED;
	}
	
	//helper function to restore the player to initial state (restart/continue/new life/etc)
	this.reset = function() {
		this.clearPowerUps();
		this.clearBullets();
		this.position.x = GameField.x;
		this.position.y = GameField.midY;
		sprite.clearDeath();
		explosionSprite.clearDeath();
		explosionSprite.wasBorn = true;
		explosionSprite.isDying = true;
		
		this.setInvincible(true);
	};
	
	this.clearPowerUps = function() {
		//TODO: implement this
		this.currentShotType = EntityType.PlayerShot;
		currentSpeed = BASE_SPEED;
	};
	
	this.clearBullets = function() {
		for(let i = 0; i < shots.length; i++) {
			shots[i].isVisible = false;
			shots[i].isActive = false;
		}
	};
	
	this.setInvincible = function(newValue) {
		isInvincible = newValue;
		if(newValue) {
			timer.registerEvent(PlayerEvent.Incincible);
		}
	};
	
	return this;
}
