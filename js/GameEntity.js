const EntityType = {
	//Terrain & World
	RhombusBoulder:"rhombusBoulder",
	
	//Player
	Player:"player",
	PlayerBullet:"playerBullet",
	
	//capsules
	Capsule1:"capsule1",
	
	//Enemies
	FlyingEnemy1:"flyingEnemy1",
	EnemyBullet:"enemyBullet"
}

//Game Entity
function GameEntity(sprite, position = {x:0, y:0}, velocity = {x:0, y:0}, size = {width:sprite.width, height:sprite.height}, collisionBody = null) {
	let pos = position;
	let vel = velocity;
	let unusedTime = 0;
	this.size = size
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);//update the image
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += vel.x * SIM_STEP / 1000;
			pos.y += vel.y * SIM_STEP / 1000;
		}
		
		unusedTime = availableTime;
	}
	
	this.draw = function() {
		sprite.drawAt(pos, size);
	}
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	}
	
	return this;
}

function TerrainEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1) {
	this.type = type;
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;

	const spriteForType = function(type) {
		switch(type) {
			case EntityType.RhombusBoulder:
				return (new AnimatedSprite(largeRhombusBoulder, 2, 90, 90, 512, {min:0, max:1}, false));
		}
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
		}
	}
	
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
		} else if(this.position.x < -this.size.width) {
			scene.removeEntity(this, false);
		}
	}
	
	this.draw = function() {
		if((this.worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			sprite.drawAt(this.position, this.size);
			this.collisionBody.draw();
		}
	}
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	}
	
	return this;
}