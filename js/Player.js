//Player
function Player(position = {x:0, y:0}) {
	const thrustFrame = {
		min:2,
		max:0
	};
	
	const sprite = new AnimatedSprite(player1Sheet, 3, 30, 19, 128, {min:0, max:2});
	const SPRITE_SCALE = 2; //TODO: would like to increase the size of the sprite and change this back to 1.
	const size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	let hasShield = false;
	
	const BASE_SPEED = 75;
	const MAX_SHOTS_ON_SCREEN = 10;
	const INVINCIBLE_TIME = 500;//in milliseconds
	
	let currentShotDelay = 256;//TODO: Implement a power up which makes player shoot faster (maybe part of laser?)
	let isInvincible = false;

	const velocity = {x:0, y:0};
	const shots = [];

	let currentSpeed = BASE_SPEED;
	
	let pos = position;
	
	const colliderPath = [{x: pos.x + SPRITE_SCALE * 6, y: pos.y + SPRITE_SCALE * 1}, 
						  {x: pos.x + SPRITE_SCALE * (sprite.width - 2), y: pos.y + SPRITE_SCALE * sprite.height / 2}, 
						  {x: pos.x + SPRITE_SCALE * 6, y: pos.y + SPRITE_SCALE * (sprite.height - 1)}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:pos.x, y:pos.y}});
	let didCollide = false;
	
	let unusedTime = 0;
	
	this.update = function(deltaTime) {
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
			shots[i].update(deltaTime);
		}
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += velocity.x * SIM_STEP / 1000;
			pos.y += velocity.y * SIM_STEP / 1000;
		}
		
		if(pos.x < 0) {
			pos.x = 0;
		} else if(pos.x > (canvas.width - size.width)) {
			pos.x = canvas.width - size.width;
		}
		
		if(pos.y < 0) {
			pos.y = 0;
		} else if(pos.y > (canvas.height - size.height)) {
			pos.y = canvas.height - size.height;
		}
		
		this.collisionBody.setPosition({x:pos.x, y:pos.y});
		
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
			canvasContext.globalAlpha = 0.8;
		}
		
		sprite.drawAt(pos, size);
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
		pos.x = 0;
		pos.y = canvas.height / 2;
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