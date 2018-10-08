const EntityType = {
	//Terrain & World
	RhombusBoulder:"rhombusBoulder",
	Rock01:"rock01",
	Rock02:"rock02",
	Rock03:"rock03",
	Rock04:"rock04",
	Bubble:"bubble",
	Text:"text",
	CollidableText:"collidableText",
	
	//Player
	Player:"player",
	PlayerShot:"playerShot",
	PlayerMissile:"playerMissile",
	PlayerDouble:"playerDouble",
	PlayerLaser:"playerLaser",
	PlayerTriple:"playerTriple",
	PlayerForceUnit:"playerForceUnit",
	PlayerShield:"playerShield",
	GhostShip:"ghostShip",
	
	//capsules
	Capsule1:"capsule1",
	
	//Enemies
	FlyingEnemy1:"flyingEnemy1",
	FlyingEnemy2:"flyingEnemy2",
	GroundEnemy1:"groundEnemy1",
	EnemyBullet1:"enemyBullet1",
	EnemyBullet2:"enemyBullet2",
	MiniBoss1:"miniBoss1"
};

const spriteForType = function(type) {
	switch(type) {
		case EntityType.Rock01:
			return (new AnimatedSprite(rock1, 1, 74, 73, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock02:
			return (new AnimatedSprite(rock2, 1, 40, 40, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock03:
			return (new AnimatedSprite(rock3, 1, 32, 37, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock04:
			return (new AnimatedSprite(rock4, 1, 27, 27, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.RhombusBoulder:
			return (new AnimatedSprite(largeRhombusBoulder, 2, 90, 90, false, true, {min:0, max:0}, 0, {min:0, max:1}, 512, {min:1, max:1}, 0));
		case EntityType.Bubble:
			return (new AnimatedSprite(bubble, 10, 30, 30, true, true, {min:0, max:0}, 0, {min:0, max:4}, 128, {min:5, max:9}, 32));
	}
};

//Game Entity
function GameEntity(sprite, position = {x:0, y:0}, velocity = {x:0, y:0}, size = {width:sprite.width, height:sprite.height}, collisionBody = null) {
	let pos = position;
	let vel = velocity;
	let unusedTime = 0;
	this.size = size;
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);//update the image
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += vel.x * SIM_STEP / 1000;
			pos.y += vel.y * SIM_STEP / 1000;
		}
		
		unusedTime = availableTime;
	};
	
	this.draw = function() {
		sprite.drawAt(pos, size);
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	};
	
	return this;
}

function TerrainEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1) {
	this.type = type;
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;
	
	const sprite = spriteForType(type);
	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	const colliderForTypeAndPosition = function(type, pos) {
		let colliderPath = [];
		let collisionBody;
		switch(type) {
			case EntityType.RhombusBoulder:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) - 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) - 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock01:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock02:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * sprite.height / 2 + 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock03:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * 20});
				colliderPath.push({x: pos.x + scale * 2,				y: pos.y + scale * 12});
				colliderPath.push({x: pos.x + scale * (sprite.width / 2 - 1), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * (sprite.height / 2 - 1)});
				colliderPath.push({x: pos.x + scale * 10, y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, y: pos.y + scale * 27});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock04:
				colliderPath.push({x: pos.x, 			  			y: pos.y + scale * 14});
				colliderPath.push({x: pos.x + scale * 4,  			y: pos.y + scale * 8});
				colliderPath.push({x: pos.x + scale * 16, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 19, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 10});
				colliderPath.push({x: pos.x + scale * 10, 			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 17});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
		}
	};
	
	this.collisionBody = colliderForTypeAndPosition(type, this.position);
	
	this.update = function(deltaTime, worldPos) {
		if((worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			if(this.worldPos == null) {
				this.worldPos = worldPos;
			}
			
			sprite.update(deltaTime);//update the image
			
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				availableTime -= SIM_STEP;
				
				this.position.x -= (worldPos - this.worldPos);
				this.worldPos = worldPos;
			}
			
			unusedTime = availableTime;
			this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
		} else if(this.position.x < GameField.x - this.size.width) {
			scene.removeEntity(this, false);
		}
	};
	
	this.draw = function() {
		if((this.worldPos >= spawnPos) && 
		   (this.position.x > GameField.x - this.size.width) &&
		   (this.position.x <= GameField.right)) {
			sprite.drawAt(this.position, this.size);
			this.collisionBody.draw();
		}
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - spawnPos);
		}		
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	};
	
	return this;
}

function BubbleEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1, returnTime = -1) {
	this.type = type;
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;
	let didCollide = false;
	this.returnTime = returnTime;
	
	const sprite = spriteForType(type);
	sprite.wasBorn = true;

	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle,  {points:   [], 
										position: {x:this.position.x, y:this.position.y}, 
										radius:   this.size.height / 2, 
										center:   {x:this.position.x + this.size.height / 2, y:this.position.y + this.size.height / 2}});
	
	this.update = function(deltaTime, worldPos) {
		if(sprite.getDidDie()) {
			if(this.returnTime < 0) {//this bubble doesn't return
				scene.removeEntity(this, false);
				return;
			} else {
				this.returnTime -= deltaTime;
				if(this.returnTime < 0) {
					this.returnTime = returnTime;
					sprite.clearDeath();
					scene.addCollisions(this, false);
				}
			}
			
		}
		
		if((worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			if(this.worldPos == null) {
				this.worldPos = worldPos;
			}
			
			sprite.update(deltaTime);//update the image
			
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				availableTime -= SIM_STEP;
				
				this.position.x -= (worldPos - this.worldPos);
				this.worldPos = worldPos;
			}
			
			unusedTime = availableTime;
			this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
		} else if(this.position.x < GameField.x - this.size.width) {
			scene.removeEntity(this, false);
		}
	};
	
	this.draw = function() {
		if((this.worldPos >= spawnPos) && 
		   (this.position.x > GameField.x - this.size.width) &&
		   (this.position.x <= GameField.right)) {
			sprite.drawAt(this.position, this.size);
			this.collisionBody.draw();
		}
	};
	
	this.setInitialFrame = function(initialFrame) {
		sprite.setFrame(initialFrame);
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - spawnPos);
		}		
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		const entityType = otherEntity.type;
		if ((entityType === EntityType.PlayerForceUnit) ||
			(entityType === EntityType.PlayerShot) || 
			(entityType === EntityType.PlayerMissile) || 
			(entityType === EntityType.PlayerDouble) || 
			(entityType === EntityType.PlayerLaser) || 
			(entityType === EntityType.PlayerTriple) ||
			(entityType === EntityType.PlayerShield)) {

			didCollide = true;
			sprite.isDying = true;
			bubbleExplosion.play();
			scene.removeCollisions(this);
		}
	};
	
	return this;
}
