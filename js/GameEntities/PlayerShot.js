//PlayerShot
function PlayerShot(position = {x:0, y:0}, velocity = {x:0, y:0}, collisionBody = null) {
	this.type = EntityType.PlayerShot;
	
	let pos = position;
	const MOVE_VELOCITY = 400;
	const SPRITE_SCALE = 1;
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
	const doubleSprite = new AnimatedSprite(playerDoubleShot, 5, 25, 25, false, true, {min:0, max:0}, 128, {min:1, max:2}, 128, {min:3, max:4}, 32);
	const tripleSprite = new AnimatedSprite(playerTripleShot, 5, 25, 25, false, true, {min:0, max:0}, 128, {min:1, max:2}, 128, {min:3, max:4}, 32);
	const laserSprite = new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64);
	
	let sprite = normalSprite;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle, 
									{points:   [], 
									 position: {x:pos.x, y:pos.y + 12}, 
									 radius:   6, 
									 center:   {x:pos.x, y:pos.y + 12}});
	
	this.setPosition = function(newPos) {
		pos = newPos;
		this.updateCollisionBodyPos()
	};
	
	this.updateCollisionBodyPos = function() {
		switch(this.type) {
			case EntityType.PlayerShot:
				this.collisionBody.setPosition({x:pos.x, y:pos.y + 12});
				break;
			case EntityType.PlayerDouble:
				this.collisionBody.setPosition({x:pos.x + 11, y:pos.y - 1});
				break;
			case EntityType.PlayerLaser:
				this.collisionBody.setPosition({x:pos.x + 10, y:pos.y + 6});
				break;
			case EntityType.PlayerTriple:
				this.collisionBody.setPosition({x:pos.x + 30, y:pos.y + 12});
				break;
		}
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
					this.updateCollisionBodyPos()
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
		
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
		let xPos, yPos;
		switch(this.type) {
			case EntityType.PlayerShot:
				//cos(0) = 1, sin(0) = 0
				xPos = pos.x - (this.size.width/2);
				yPos = pos.y + (this.size.height/2);
				
				if(!sprite.wasBorn) {
					xPos -= 15;
					yPos += 2;
				}
				break;
			case EntityType.PlayerDouble:
				//cos(45 degrees) & sin(45 degrees) are both ~0.707
				xPos = (pos.x + this.size.width/2) - (this.size.width * 0.707);
				yPos = (pos.y + this.size.height / 2) - (this.size.height * 0.707 / 2);
				
				if(!sprite.wasBorn) {
					xPos -= 11;
					yPos += 8;
				}
				
				break;
			case EntityType.PlayerLaser://laser isn't rotated, just like the normal player shot
				//cos(0) = 1, sin(0) = 0
				xPos = pos.x - (this.size.width/2);
				yPos = pos.y + (this.size.height/2) + 2;//+2 is fudge for sprite differences
				break;
			break;
			case EntityType.PlayerTriple:
				//cos(180 degrees) = -1, sin(180 degrees) = 0
				xPos = (pos.x + this.size.width/2 + (this.size.width/2));
				yPos = (pos.y + this.size.height / 2);
				break;
		}
		
		
		
		sprite.drawAt(xPos, yPos - sprite.height/2, this.size.width, this.size.height);
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
				sprite = doubleSprite;
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
				sprite = tripleSprite;
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
		
		if(otherEntity.type === EntityType.FreeCollider) {return false;}
		
		this.shotLife--;
		if(this.shotLife === 0) {
			sprite.isDying = true;
			scene.removeCollisions(this, true);
			vel = {x:0, y:0};
			if((otherEntity.type == EntityType.RhombusBoulder) || //Play sfx if shot hits non desctructible object -LP
			   (otherEntity.type == EntityType.Rock01) ||
			   (otherEntity.type == EntityType.Rock02) ||
			   (otherEntity.type == EntityType.Rock03) ||
			   (otherEntity.type == EntityType.Rock04) ||
			   (otherEntity.type == EntityType.BrokenBoulder) ||
			   (otherEntity.type == EntityType.BrokenBoulderFlipped) ||
			   (otherEntity.type == EntityType.Platform1) ||
			   (otherEntity.type == EntityType.Level2Boss) ||
			   (otherEntity.type == EntityType.WarpObstacle))   {
				shotHitIndestructible.play();
			   }	
		}
	};
	
	return this;
}
