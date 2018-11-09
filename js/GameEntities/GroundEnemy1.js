//GroundEnemy1
function GroundEnemy1(position = {x:0, y:0}, rotation = -Math.PI/2, spawnPos = 0, difficulty = 0) {
	this.type = EntityType.GroundEnemy1;
	this.group = null;
	this.worldPos = 0;
	this.score = 100;
	this.hitPoints = 4;     // Every enemy type should have a hitPoints property
	
	const SPRITE_SCALE = 1;
	this.position = {x: position.x + spawnPos, y:position.y};
	let unusedTime = 0;
	this.isVisible = true;
	this.rotation = rotation;
	
	const normalSprite = new AnimatedSprite(groundEnemySheet, 9, 30, 30, true, true, {min:0, max:0}, 0, {min:0, max:4}, 256, {min:5, max:8}, 128);
	const explosionSprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
	let sprite = normalSprite;
	
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle,
										{points: [], 
										position: {x:this.position.x, y:this.position.y}, 
										radius: this.size.height / 2, 
										center: {x:this.position.x + this.size.height / 2, y:this.position.y + this.size.height / 2}}
									  );
	let didCollide = false;
    
    this.path = new EnemyPath(PathType.None, this.position, 0, [], 0);//speed & timeOffset = 0
			
	this.update = function(deltaTime, worldPos, playerPos) {
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
		
		if(sprite !== explosionSprite) {
			this.doShooting(playerPos);
		}
	};
	
	this.doShooting = function(playerPos) {
		if(sprite === explosionSprite) {return;}//don't allow enemies to shoot while they are dying
		
		if(sprite.getDidDie()) {
			
			let facing = rotation + Math.PI / 2;
			if(facing > Math.PI) {
				facing -= (2 * Math.PI);
			} else if(facing < -Math.PI) {
				facing += (2 * Math.PI);
			}
						
			const angleToPlayer = Math.atan2(this.position.y - playerPos.y, playerPos.x - this.position.x);
			
			const deltaAngle = angleToPlayer - facing;
			if((deltaAngle > -Math.PI / 2) && (deltaAngle < Math.PI / 2)) {
				const xVel = 50 * Math.cos(angleToPlayer);
				const yVel = -50 * Math.sin(angleToPlayer);

				const bulletXPos = this.collisionBody.center.x + this.collisionBody.radius * Math.cos(facing);
				const bulletYPos = this.collisionBody.center.y - this.collisionBody.radius * Math.sin(facing);
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet1, {x: bulletXPos, y: bulletYPos}, {x: xVel, y:yVel});
				newBullet.setPosition({x:newBullet.position.x - newBullet.size.width / 2, 
									   y:newBullet.position.y - newBullet.size.height / 2});

				scene.addEntity(newBullet, false);
			}
					
			sprite.clearDeath();
			return;
		}
		
		const firingChance = Math.floor(1000 * Math.random());
		if(firingChance < difficulty) {
			sprite.isDying = true;//using the "dying" frames as "shooting" frames instead
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position, this.size, this.rotation);
		if(!sprite.isDying) {
			this.collisionBody.draw();
		}
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			const totalTime = (worldPos *  SIM_STEP);
            const nextPos = this.path.nextPoint(totalTime);
            this.position.x = nextPos.x;
            this.position.y = nextPos.y;
		}
	};
	
	this.didCollideWith = function(otherEntity) {
		if (otherEntity) {
			let entityType = otherEntity.type;
			if ((entityType === EntityType.PlayerForceUnit) ||
				(entityType === EntityType.RagnarokCapsule) || 
				(entityType === EntityType.PlayerShot) || 
				(entityType === EntityType.PlayerMissile) || 
				(entityType === EntityType.PlayerDouble) || 
				(entityType === EntityType.PlayerLaser) || 
				(entityType === EntityType.PlayerTriple) ||
				(entityType === EntityType.PlayerShield)) {
				this.hitPoints -= otherEntity.damagePoints;
			}
		} 
		else {
			this.hitPoints = 0; // TODO remove this catch-all; we want all collisions with player weapons to inflict damage based on their damagePoints
		}

		if (this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			
			scene.displayScore(this);
			
			if((this.group != null) && (this.group !== undefined)) {
				this.group.amDying(this, this.worldPos);
			}

			sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);

			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;

			sprite = explosionSprite;
			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
			
			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;
	
			sprite.isDying = true;
			sprite.wasBorn = true;
			scene.removeCollisions(this);
	
			enemySmallExplosion.play();
		}
	};
}
