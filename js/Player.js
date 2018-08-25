//Player
function Player(position = {x:0, y:0}) {
	const thrustFrame = {
		min:2,
		max:0
	};
	
	const sprite = new AnimatedSprite(player1Sheet, 3, 60, 38, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
	const SPRITE_SCALE = 1; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	let hasShield = false;
	
	const BASE_SPEED = 75;
	const MAX_SHOTS_ON_SCREEN = 10;
	const INVINCIBLE_TIME = 1500;//in milliseconds
	
	let currentShotDelay = 256;//TODO: Implement a power up which makes player shoot faster (maybe part of laser?)
	let isInvincible = false;

	const velocity = {x:0, y:0};
	const shots = [];

	let currentSpeed = BASE_SPEED;
	
	this.position = position;
	
	const colliderPath = [{x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * 1}, 
						  {x: this.position.x + SPRITE_SCALE * (sprite.width - 2), y: this.position.y + SPRITE_SCALE * sprite.height / 2}, 
						  {x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * (sprite.height - 1)}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	let didCollide = false;
	
	let unusedTime = 0;
	
	this.update = function(deltaTime, worldPos) {
		sprite.update(deltaTime);//update the image
		
		if(holdLeft) {
			velocity.x = -currentSpeed;
			sprite.setFrame(thrustFrame.min);
		} else if(holdRight) {
			velocity.x = currentSpeed;
			sprite.setFrame(thrustFrame.max);
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
				
		if(holdSpace) {
			let timeSinceLastShot = timer.timeSinceUpdateForEvent("lastShot");
			if((timeSinceLastShot == null) || (timeSinceLastShot == undefined)) {
				timeSinceLastShot = timer.registerEvent("lastShot");
			}
			
			if(timeSinceLastShot > currentShotDelay) {
				let newShot;
				if(shots.length == MAX_SHOTS_ON_SCREEN) {
					newShot = shots.splice(0, 1)[0];
				} else {
					newShot = new PlayerShot();
				}
				
				newShot.reset();
				scene.addEntity(newShot, true);
				newShot.setPosition({x:position.x + 50, y:position.y + 7});
							
				shots.push(newShot);
				timer.updateEvent("lastShot");
			}
		}
		
		for(let i = 0; i < shots.length; i++) {
			shots[i].update(deltaTime, worldPos);
		}
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			this.position.x += velocity.x * SIM_STEP / 1000;
			this.position.y += velocity.y * SIM_STEP / 1000;
		}
		
		if(this.position.x < 0) {
			this.position.x = 0;
		} else if(this.position.x > (canvas.width - this.size.width)) {
			this.position.x = canvas.width - this.size.width;
		}
		
		if(this.position.y < 0) {
			this.position.y = 0;
		} else if(this.position.y > (canvas.height - this.size.height)) {
			this.position.y = canvas.height - this.size.height;
		}
		
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
		
		unusedTime = availableTime;
		
		if(isInvincible) {
			if(timer.timeSinceUpdateForEvent("invinciblePlayer") >= INVINCIBLE_TIME) {
				this.setInvincible(false);
			} 
		}
	}
	
	this.draw = function() {
		if(isInvincible) {
			canvasContext.save();
			canvasContext.globalAlpha = 0.50;
		}
		
		sprite.drawAt(this.position, this.size);
		this.collisionBody.draw();
		
		if(isInvincible) {
			canvasContext.restore();
		}
		
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}
		
		if(didCollide) {
			didCollide = false;
		}
	}
	
	this.didCollideWith = function(otherEntity) {
		didCollide = true;
		
		if(otherEntity.type == EntityType.Capsule1) {
			//TODO: Update UI to indicate what power up the player can get now
			scene.collectedCapsule();
		} else {
			if(hasShield) {
				shield.hit();
			} else if(isInvincible) {
				//TODO: does anything need to be done here?
			} else {	
				scene.removePlayer();
			}
		}
	}
	
	this.reset = function() {
		this.clearPowerUps();
		this.position.x = 0;
		this.position.y = canvas.height / 2;
		this.setInvincible(true);
	}
	
	this.clearPowerUps = function() {
		//TODO: implement this
	}
	
	this.setInvincible = function(newValue) {
		isInvincible = newValue;
		if(newValue == true) {
			timer.registerEvent("invinciblePlayer");
		}
	}
	
	return this;
}