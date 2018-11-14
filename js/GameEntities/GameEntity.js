const EntityType = {
	//Terrain & World
	RhombusBoulder:"rhombusBoulder",
	BrokenBoulder:"brokenBoulder",
	BrokenBoulderFlipped:"brokenBoulderFlipped",
	Rock01:"rock01",
	Rock02:"rock02",
	Rock03:"rock03",
	Rock04:"rock04",
	BigDestRock:"bigDestRock",
	SmDestRock1:"smDestRock1",
	SmDestRock2:"smDestRock2",
	SmDestRock3:"smDestRock3",
    Platform1:"platform1",
    WarpObstacle:"warpObstacle",
	Bubble:"bubble",
	
	//Miscellaneous
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
	RagnarokCapsule:"ragnarokCapsule",
	
	//Enemies
	FlyingEnemy1:"flyingEnemy1",
    FlyingEnemy2:"flyingEnemy2",
    FlyingEnemy3:"flyingEnemy3",
    GroundEnemy1:"groundEnemy1",
    GroundEnemy2:"groundEnemy2",
    GroundEnemy3:"groundEnemy3",
	EnemyBullet1:"enemyBullet1",
	EnemyBullet2:"enemyBullet2",
	EnemyBullet3:"enemyBullet3",
	EnemyBullet4:"enemyBullet4",
	MiniBoss1:"miniBoss1", 
	EyeBoss1:"eyeBoss1",
	AlienBoss1:"alienBoss1",
	MaskBoss1:"maskBoss1",
	MiniMiniBoss1:"miniminiBoss1",
	CargoBoss: "cargoBoss",
    LaunchBay:"launchBay"
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
        case EntityType.BrokenBoulder:
            return (new AnimatedSprite(brokenBoulder, 1, 77, 68, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.BrokenBoulderFlipped:
            return (new AnimatedSprite(brokenBoulderFlipped, 1, 77, 68, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.BigDestRock:
            return (new AnimatedSprite(bigDestRock, 1, 37, 39, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock1:
            return (new AnimatedSprite(smDestRock1, 1, 23, 21, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock2:
            return (new AnimatedSprite(smDestRock2, 1, 33, 24, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock3:
            return (new AnimatedSprite(smDestRock3, 1, 25, 25, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.Platform1:
            return (new AnimatedSprite(platform1, 5, 76, 38, false, true, {min:0, max:0}, 0, {min:0, max:4}, 512, {min:4, max:4}, 0));
        case EntityType.WarpObstacle:
            return (new AnimatedSprite(warpObstacle, 5, 107, 74, true, true, {min:0, max:0}, 0, {min:0, max:4}, 64, {min:4, max:4}, 0));
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

function TerrainEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1, speed = 0, timeDelay = 0, childrenCount = 0) {
	this.type = type;
	this.isVisible = true;
	this.position = position;
	this.worldPos = null;
	this.timeDelay = timeDelay;
	this.childrenCount = childrenCount;
	let unusedTime = 0;
	this.velocity = {x:0, y:0};//only used for destructible rocks, regular terrain does not need to change this
	
	if(((this.type === EntityType.BigDestRock) ||
		(this.type === EntityType.SmDestRock1) || 
		(this.type === EntityType.SmDestRock2) ||
		(this.type === EntityType.SmDestRock3)) &&
	   (this.childrenCount === 0)) {
		this.velocity.x = Math.ceil(20 * Math.random()) - 10;//get values between -9 and +10
		this.velocity.y = -Math.ceil(18 * Math.random()) - 18;//values between -14 and 0 (negative so they travel up)
	}
	
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
			case EntityType.BrokenBoulder:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) - 12)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2)), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.BrokenBoulderFlipped:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) - 12)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) - 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.BigDestRock:
			case EntityType.SmDestRock1:
			case EntityType.SmDestRock2:
			case EntityType.SmDestRock3:
				return (new Collider(ColliderType.Circle, {points:   [], 
															position: {x:pos.x + scale * sprite.width, y:pos.y + scale * sprite.height}, 
															radius:   (scale * sprite.height / 2) - 2, 
															center:   {x:pos.x + scale * sprite.width, y:pos.y + scale * sprite.height}}));
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
            case EntityType.Platform1:
                colliderPath.push({x: pos.x,                        y: pos.y});
                colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y});
                colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
                colliderPath.push({x: pos.x,                        y: pos.y + scale * sprite.height});
                
                return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
            case EntityType.WarpObstacle:
                colliderPath.push({x: pos.x + scale * 2,            y: pos.y + scale * (2 + (sprite.height / 2))});
                colliderPath.push({x: pos.x + scale * (sprite.width - 6), y: pos.y + scale * 4});
                colliderPath.push({x: pos.x + scale * (sprite.width - 6), y: pos.y + scale * (sprite.height - 4)});
                
                return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
		}
	};
	
	this.collisionBody = colliderForTypeAndPosition(type, this.position);
	this.didCollide = false;
	
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
			
			if(((this.type === EntityType.BigDestRock) ||
				(this.type === EntityType.SmDestRock1) || 
				(this.type === EntityType.SmDestRock2) ||
				(this.type === EntityType.SmDestRock3)) &&
			   (this.childrenCount === 0)) {
				this.position.x += this.velocity.x;
				this.position.y += this.velocity.y;//adding because velocities are negative
				this.velocity.y += 1;//apply a constant change to velocity to simulate gravity
			} else if((this.type === EntityType.BigDestRock) && (this.childrenCount > 0)) {
				this.isVisible = false;
				if(this.position.x < GameField.midX) {
					scene.worldShouldPause(true);
				}
				
				this.timeDelay -= deltaTime;
				if(this.timeDelay <= 0) {
					this.timeDelay = timeDelay;
					
					const newRock = new TerrainEntity(EntityType.BigDestRock, {x: this.position.x, y:this.position.y}, spawnPos);
					scene.addEntity(newRock);
					
					this.childrenCount--;
					if(this.childrenCount === 0) {
						scene.worldShouldPause(false);
						//need to tell the group this one is done...
					}
				}
			}
			
			unusedTime = availableTime;
			
			if(this.collisionBody.type === ColliderType.Polygon) {
				this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
			} else if(this.collisionBody.type === ColliderType.Circle) {
				this.collisionBody.setPosition({x:this.position.x + this.size.height / 2, 
											    y:this.position.y + this.size.height / 2});
			}
			
		} else if((this.position.x < GameField.x - this.size.width) || (this.position.y > GameField.bottom)) {
			scene.removeEntity(this, false);
		} 
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
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
		
		if(this.type === EntityType.BigDestRock) {
			let entityType = otherEntity.type;
			if ((entityType === EntityType.PlayerForceUnit) ||
				(entityType === EntityType.RagnarokCapsule) || 
				(entityType === EntityType.PlayerShot) || 
				(entityType === EntityType.PlayerMissile) || 
				(entityType === EntityType.PlayerDouble) || 
				(entityType === EntityType.PlayerLaser) || 
				(entityType === EntityType.PlayerTriple) ||
				(entityType === EntityType.PlayerShield)) {
					
					if(this.didCollide) {return;}
					
					this.didCollide = true;
					
					const chip1 = new TerrainEntity(EntityType.SmDestRock1, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip1.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip1.velocity.y *= 0.25;
					scene.addEntity(chip1);
					
					const chip2 = new TerrainEntity(EntityType.SmDestRock2, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip2.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip2.velocity.y *= 0.25;
					scene.addEntity(chip2);
					
					const chip3 = new TerrainEntity(EntityType.SmDestRock3, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip3.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip3.velocity.y *= 0.25;
					scene.addEntity(chip3);
					
					this.score = 100;
					scene.displayScore(this);
					
					scene.removeEntity(this);
			}
		} else if((this.type === EntityType.SmDestRock1) ||
				  (this.type === EntityType.SmDestRock2) ||
				  (this.type === EntityType.SmDestRock3)) {
					  
				    this.score = 50;
					scene.displayScore(this);
					  
				  	scene.removeEntity(this);
		}
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
