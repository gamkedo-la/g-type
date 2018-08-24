//PlayerShot
function PlayerShot(position = {x:0, y:0}, velocity = {x:0, y:0}, collisionBody = null) {
	this.type = EntityType.PlayerBullet;
	
	let pos = position;
	const MOVE_VELOCITY = 200;
	const SPRITE_SCALE = 5;
	let vel = velocity;
	let unusedTime = 0;
	
	this.wasReleased = false;
	let didCollide = false;
	this.isVisible = true;
	
	const sprite = new AnimatedSprite(playerShots, 5, 5, 5, 128, {min:0, max:4}, false);
	sprite.update = function(deltaTime) {
		let availableTime = this.unusedTime + deltaTime;
		
		while(availableTime >= this.frameRate) {
			availableTime -= this.frameRate;
			
			if(this.currentFrame == 1) {
				this.currentFrame = 2;//hard coded for now
			} else {
				this.currentFrame = 1;//hard coded for now
			}
		}
		
		this.unusedTime = availableTime;
		
		this.currentFramePos.x = this.width * (this.currentFrame % this.FRAMES_PER_ROW);
		this.currentFramePos.y = this.height * (Math.floor(this.currentFrame / this.FRAMES_PER_ROW));
	}
	
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
	
	this.update = function(deltaTime) {
		if(!this.isVisible) {return;}
		
		if(didCollide) {
			if(sprite.currentFrame < sprite.frameRange.max - 1) {
				sprite.setFrame(sprite.frameRange.max - 1);
			} else if(sprite.currentFrame < sprite.frameRange.max) {
				sprite.setFrame(sprite.frameRange.max);
			} else {
				this.isVisible = false;
				this.isActive = false;
				scene.removeEntity(this, true);
			}
		} else {
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				if(!this.wasReleased) {
					this.wasReleased = true;
					sprite.setFrame(0);//hard coded to the first 'traveling' frame for now
					vel.x = MOVE_VELOCITY;
				} else {
					pos.x += vel.x * SIM_STEP / 1000;
					pos.y += vel.y * SIM_STEP / 1000;
					this.collisionBody.setPosition({x:pos.x, y:pos.y});
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
		
		sprite.update(deltaTime);
	}
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
		sprite.drawAt(pos, this.size);
		this.collisionBody.draw();
	}
	
	this.reset = function() {
		unusedTime = 0;
		didCollide = false;
		this.isVisible = true;
		this.isActive = true;
		this.wasReleased = false;
		sprite.setFrame(0);
		this.setVelocity({x:0, y:0});
	}
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		didCollide = true;
//		this.isVisible = false;
//		this.isActive = false;
		
//		scene.removeEntity(this, true);
	}
	
	return this;
}