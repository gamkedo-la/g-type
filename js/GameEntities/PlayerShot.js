//PlayerShot
function PlayerShot(position = {x:0, y:0}, velocity = {x:0, y:0}, collisionBody = null) {
	this.type = EntityType.PlayerShot;
	
	let pos = position;
	const MOVE_VELOCITY = 400;
	const SPRITE_SCALE = 1;
	const FLASH_SCALE = 1;
	let vel = velocity;
	let unusedTime = 0;
	
	this.wasReleased = false;
	this.shotLife = 0;
	let didCollide = false;
	this.isVisible = true;
	let collisionBodyOffset = {x:0, y:0};
	this.rotation = 0;
	
	this.worldPos = null;

    this.damagePoints = 4;   // Damage points = how many hit points to remove on contact with an enemy (every weapon that can inflict damage on an enemy must have this property
	
	const TOP_BOTTOM_PADDING = 10;//number of transparent pixels at the top and bottom of the image
	const RIGHT_PADDING = 5;//number of transparent pixels to the right of the image
	
	const normalSprite = new AnimatedSprite(playerShots, 5, 25, 25, false, true, {min:0, max:0}, 128, {min:1, max:2}, 128, {min:3, max:4}, 32);
	const laserSprite = new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64);
	const flashSprite = new AnimatedSprite(playerShotFlash, 5, 4, 4, false, true, {min: 0, max: 0}, 0, {min:0, max: 4}, 32, {min: 4, max: 4}, 0);
	
	let sprite = normalSprite;
	
	const colliderPath = [{x: pos.x, y: pos.y + (TOP_BOTTOM_PADDING * SPRITE_SCALE)}, 
					  	  {x: pos.x + SPRITE_SCALE * (sprite.width - RIGHT_PADDING), y: pos.y + (TOP_BOTTOM_PADDING * SPRITE_SCALE)}, 
						  {x: pos.x + SPRITE_SCALE * (sprite.width - RIGHT_PADDING), y: pos.y + ((sprite.height - TOP_BOTTOM_PADDING) * SPRITE_SCALE)}, 
						  {x: pos.x, y: pos.y + ((sprite.height - TOP_BOTTOM_PADDING) * SPRITE_SCALE)}];

    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:pos.x, y:pos.y}});

	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	this.setPosition = function(newPos) {
		pos = newPos;
		this.collisionBody.setPosition({x:pos.x, y:pos.y + collisionBodyOffset.y});
	};
	
	this.setVelocity = function(newVel) {
		vel = {x:newVel.x, y:newVel.y};
	};
	
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
					this.collisionBody.setPosition({x:pos.x + collisionBodyOffset.x, y:pos.y + collisionBodyOffset.y});
				} else if(sprite.wasBorn) {
					this.wasReleased = true;
				}
					
				availableTime -= SIM_STEP;
				
				if(pos.x > GameField.right) {
					this.isVisible = false;
					this.isActive = false;
					return;//bullet ran off screen, bail out
				}
			}
			
			unusedTime = availableTime;
		}
		
		flashSprite.update(deltaTime);
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
		if(this.wasReleased) {
			const xPos = (pos.x + this.size.width/2 - FLASH_SCALE * flashSprite.width/2) - (this.size.width/2 * Math.cos(this.rotation)) - (FLASH_SCALE * flashSprite.width/2 * Math.cos(this.rotation));
			const yPos = (pos.y + this.size.height / 2 - FLASH_SCALE * flashSprite.height/2) + (this.size.height / 2 * Math.sin(this.rotation)) + (FLASH_SCALE * flashSprite.height/2 * Math.sin(this.rotation));
//			const yPos = pos.y + (this.size.height / 2) - (FLASH_SCALE * flashSprite.height / 2);
			flashSprite.drawAt({x:xPos, y:yPos}, {width:FLASH_SCALE * flashSprite.width, height:FLASH_SCALE * flashSprite.height}, this.rotation);
		}
		
		let drawPos = {x:pos.x, y:pos.y};
		if(!sprite.wasBorn) {
			drawPos = {x:pos.x - 30, y:pos.y};
		}
		
		sprite.drawAt(drawPos, this.size, this.rotation);
		this.collisionBody.draw();
	};
	
	this.resetWithType = function(newType) {
		this.type = newType;
		switch(newType)
		{
			case EntityType.PlayerShot:
				sprite = normalSprite;
				this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
				collisionBodyOffset = {x:0, y:0};
				this.shotLife = 1;
				break;
			case EntityType.PlayerDouble:
				sprite = normalSprite;
				this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
				collisionBodyOffset = {x:0, y:0};
				this.shotLife = 1;
				break;
			case EntityType.PlayerLaser:
				sprite = laserSprite;
				this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
				collisionBodyOffset = {x:7, y:-9};
				this.shotLife = 2;
				break;
			case EntityType.PlayerTriple:
				sprite = normalSprite;
				this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
				collisionBodyOffset = {x:0, y:0};
				this.shotLife = 1;
				break;
		}
		
		unusedTime = 0;
		didCollide = false;
		this.isVisible = true;
		this.isActive = true;
		this.wasReleased = false;
		
		sprite.wasBorn = false;
		sprite.isDying = false;
		sprite.setFrame(0);
		this.setVelocity({x:0, y:0});
		this.rotation = 0;
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		this.shotLife--;
		if(this.shotLife === 0) {
			sprite.isDying = true;
			scene.removeCollisions(this, true);
			vel = {x:0, y:0};
			if((otherEntity.type == EntityType.RhombusBoulder) || //Play sfx if shot hits non desctructible object -LP
			   (otherEntity.type == EntityType.Rock01) ||
			   (otherEntity.type == EntityType.Rock02) ||
			   (otherEntity.type == EntityType.Rock03) ||
			   (otherEntity.type == EntityType.Rock04))   {
				shotHitIndestructible.play();
			   }
			
		}
	};
	
	return this;
}
