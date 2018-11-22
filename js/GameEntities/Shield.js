//ShieldEntity
function ShieldEntity(position = {x:0, y:0}, playerSize = {width:0, height:0}) {
	this.type = EntityType.PlayerShield;
	const MAX_HITPOINTS = 5;
	this.hitPoints = MAX_HITPOINTS;
	this.damagePoints = 1;
	this.isActive = false;
	const SPRITE_SCALE = 1;
	let wasReset = false;
	
	sprite = new AnimatedSprite(shieldSheet, 3, 60, 45, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
	
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};

	this.position = {x:position.x - (this.size.width - playerSize.width) / 2, y:position.y - (this.size.height - playerSize.height) / 2};
	
	//this path lays out the corners of the polygon collider for the player (a triangle in this case)
	const colliderPath = [{x: this.position.x + this.size.width/2, y: this.position.y + SPRITE_SCALE * 4}, //top point 
						  {x: this.position.x + 3 * this.size.width / 4, y: this.position.y + SPRITE_SCALE * 6}, //top, half way to right side
						  {x: this.position.x + this.size.width - SPRITE_SCALE * 1, y: this.position.y + SPRITE_SCALE * (sprite.height / 2)}, //right point
						  
						   
						  {x: this.position.x + 3 * this.size.width / 4, y: this.position.y + SPRITE_SCALE * 39}, //bottom, half way to right side
						  {x: this.position.x + this.size.width/2, y: this.position.y + SPRITE_SCALE * 41}, //bottom point
						  {x: this.position.x + this.size.width / 4, y: this.position.y + SPRITE_SCALE * 39}, //bottom, half way to left side
						  
						  {x: this.position.x + SPRITE_SCALE, y: this.position.y + SPRITE_SCALE * (sprite.height / 2)}, //left point 
						  {x: this.position.x + this.size.width / 4, y: this.position.y + SPRITE_SCALE * 6}]; //top, half way to left side
		
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	
	this.update = function(deltaTime, playerPos) {
		if(!this.isActive) {return;} //Don't need to update if not active
		
		if(this.hitPoints === 2) {
			if(sprite.getCurrentFrame() != 1) {
				sprite.setFrame(1);
				sprite.update(deltaTime);
			}
		} else if(this.hitPoints === 1) {
			if(sprite.getCurrentFrame() != 2) {
				sprite.setFrame(2);
				sprite.update(deltaTime);
			}
		} else if(this.hitPoints <= 0) {
			this.deactivate();
		}
		
		if(wasReset) {
			wasReset = false;
			sprite.update(deltaTime);
		}
		
		this.position.x = playerPos.x - (this.size.width - playerSize.width) / 2;
		this.position.y = playerPos.y - (this.size.height - playerSize.height) / 2;
		
		//keep the collisionBody position in synch with the visual position
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
	};
	
	this.draw = function() {
		if(!this.isActive) {return;}// Don't need to draw if not active
		
		sprite.drawAt(this.position, this.size);
		
		this.collisionBody.draw();
	};
	
	this.didCollideWith = function(otherEntity) {
		if((otherEntity.type === EntityType.Player) ||
		   (otherEntity.type === EntityType.PlayerShot) ||
		   (otherEntity.type === EntityType.PlayerMissile) ||
		   (otherEntity.type === EntityType.PlayerDouble) ||
		   (otherEntity.type === EntityType.PlayerLaser) ||
		   (otherEntity.type === EntityType.PlayerTriple) ||
		   (otherEntity.type === EntityType.PlayerForceUnit)) {
			   return; //Player weapons don't interact with the shields
		} else {
			this.hitPoints--;
			scene.shouldShake(MAX_SHAKE_MAGNITUDE / 2);
			if(this.hitPoints <= 0) {
				playerShieldFail.play();
			} else {
				playerShieldHit.play();
			}
		}
	};
	
	this.reset = function() {
		this.hitPoints = MAX_HITPOINTS;
		this.isActive = true;
		sprite.setFrame(0);
		wasReset = true;
	};
	
	this.deactivate = function() {
		this.isActive = false;
		scene.deactivatedShield();
		scene.removeCollisions(this);
	}
}



	
	
	
	
	