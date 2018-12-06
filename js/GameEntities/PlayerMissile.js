//PlayerMissileEntity
function PlayerMissile(position = {x:0, y:0}, speed = {x:0, y:0}) {
	this.position = {x:position.x, y:position.y};
	this.setPosition = function(newPosition) {
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
		this.collisionBody.setPosition({x:this.position.x + 19, 
										y:this.position.y + 19});
	};
	
	let velocity = {x:speed.x, y:speed.y};
	this.setVelocity = function(newVel) {
		velocity = {x:newVel.x, y:newVel.y};
	};
	
	this.type = EntityType.PlayerMissile;
	
	this.worldPos = null;	
	this.isVisible = false;
	this.isActive = false;
	const SHOT_LIFE = 1
	this.shotLife = SHOT_LIFE;
	this.damagePoints = 2;
	let unusedTime = 0;

	const SPRITE_SCALE = 1;
	const sprite = new AnimatedSprite(missileSheet, 8, 28, 28, true, true, {min:0, max:0}, 0, {min:0, max:7}, 128, {min:7, max:7}, 32);
	
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};
	
	const TOP_BOTTOM_PADDING = 8;
	const LEFT_PADDING = 13;
	let didCollide = false;
	
	this.collisionBody = new Collider(ColliderType.Circle, 
										{points:   [], 
										 position: {x:this.position.x + 19, y:this.position.y + 19}, 
										 radius:   9, 
										 center:   {x:this.position.x + 19, y:this.position.y + 19}});
	
	this.update = function(deltaTime, worldPos) {
		if(this.worldPos === null) {
			this.worldPos = worldPos;
		}
		
		if(sprite.getDidDie()) {
			this.isVisible = false;
			this.isActive = false;
			scene.removeEntity(this, true);
		}

		if(!this.isVisible) {return;}
		
		if(didCollide) {
			didCollide = false;//prevent multiple calls to remove this entity;
		} else {
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				if(sprite.wasBorn) {
					this.position.x += velocity.x * SIM_STEP / 1000;
					this.position.y += velocity.y * SIM_STEP / 1000;
					this.collisionBody.setPosition({x:this.position.x + 19, 
													y:this.position.y + 19});					
				}
		
				availableTime -= SIM_STEP;
				
				if(this.position.x > GameField.right) {
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
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
        this.collisionBody.draw();
	};
	
	this.reset = function() {
		this.isVisible = true;
		this.isActive = true;
		this.shotLife = SHOT_LIFE;
		unusedTime = 0;
		sprite.wasBorn = false;
		sprite.clearDeath();
		
	}
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		this.shotLife--;
		if(this.shotLife === 0) {
			sprite.isDying = true;
			vel = {x:0, y:0};
			if((otherEntity.type == EntityType.RhombusBoulder) || //play sfx if missile hits non-destructible object -LP
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
