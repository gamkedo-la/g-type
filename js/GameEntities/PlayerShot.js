//PlayerShot
function PlayerShot(position = {x:0, y:0}, velocity = {x:0, y:0}, collisionBody = null) {
	this.type = EntityType.PlayerShot;
	
	let pos = position;
	const MOVE_VELOCITY = 200;
	const SPRITE_SCALE = 1.5;
	const FLASH_SCALE = 4;
	let vel = velocity;
	let unusedTime = 0;
	
	this.wasReleased = false;
	let didCollide = false;
	this.isVisible = true;
	
	this.worldPos = null;
	
	const sprite = new AnimatedSprite(playerShots, 5, 25, 25, false, true, {min:0, max:0}, 128, {min:1, max:2}, 128, {min:3, max:4}, 32);
	const flashSprite = new AnimatedSprite(playerShotFlash, 5, 4, 4, false, true, {min: 0, max: 0}, 0, {min:0, max: 4}, 32, {min: 4, max: 4}, 0);
	
	const colliderPath = [{x: pos.x, y: pos.y + (2 * SPRITE_SCALE)}, 
					  	  {x: pos.x + SPRITE_SCALE * sprite.width, y: pos.y + (2 * SPRITE_SCALE)}, 
						  {x: pos.x + SPRITE_SCALE * sprite.width, y: pos.y + (3 * SPRITE_SCALE)}, 
						  {x: pos.x, y: pos.y + (3 * SPRITE_SCALE)}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:pos.x, y:pos.y}});

	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	this.setPosition = function(newPos) {
		pos = newPos;
		this.collisionBody.setPosition({x:pos.x, y:pos.y});
	}
	
	this.setVelocity = function(newVel) {
		vel = newVel;
	}
	
	this.update = function(deltaTime, worldPos) {
		if(this.worldPos == null) {
				this.worldPos = worldPos;
		}

		if(sprite.getDidDie()) {
			this.isVisible = false;
			this.isActive = false;
		}

		if(!this.isVisible) {return;}
		
		if(didCollide) {
			scene.removeEntity(this, true);
			didCollide = false;//prevent multiple calls to remove this entity;
		} else {
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				if(this.wasReleased) {
					pos.x += vel.x * SIM_STEP / 1000;
					pos.y += vel.y * SIM_STEP / 1000;
					this.collisionBody.setPosition({x:pos.x, y:pos.y});
				} else if(sprite.wasBorn) {
					this.wasReleased = true;
					vel.x = MOVE_VELOCITY;
				}
					
				availableTime -= SIM_STEP;
				
				if(pos.x > canvas.width) {
					this.isVisible = false;
					this.isActive = false;
					return;//bullet ran off screen, bail out
				}
			}
			
			unusedTime = availableTime;
		}
		
		flashSprite.update(deltaTime);
		sprite.update(deltaTime);
	}
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
		if(this.wasReleased) {
			const xPos = pos.x - (flashSprite.width * FLASH_SCALE);
			const yPos = pos.y + (this.size.height / 2) - (FLASH_SCALE * flashSprite.height / 2);
			flashSprite.drawAt({x:xPos, y:yPos}, {width:FLASH_SCALE * flashSprite.width, height:FLASH_SCALE * flashSprite.height});
		}
		
		let drawPos = {x:pos.x, y:pos.y};
		if(!sprite.wasBorn) {
			drawPos = {x:pos.x - 30, y:pos.y};
		}
		sprite.drawAt(drawPos, this.size);
		this.collisionBody.draw();
	}
	
	this.reset = function() {
		unusedTime = 0;
		didCollide = false;
		this.isVisible = true;
		this.isActive = true;
		this.wasReleased = false;
		
		sprite.wasBorn = false;
		sprite.isDying = false;
		sprite.setFrame(0);
		this.setVelocity({x:0, y:0});
	}
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		didCollide = true;
		sprite.isDying = true;
		vel = {x:0, y:0};
	}
	
	return this;
}