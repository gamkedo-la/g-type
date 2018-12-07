//FlyingEnemy2
function MiniMiniBoss1(position = {x:0, y:0}, speed = 80, pattern = PathType.None, spawnPos = 0, difficulty = 6, path = null) {
	this.type = EntityType.MiniMiniBoss1;
	this.group = null;
	this.worldPos = 0;
	this.score = 200;
	
    this.hitPoints = 10;     // Every enemy type should have a hitPoints property

	const SPRITE_SCALE = 1;
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	let timeToCourseChange = -1;
	let rndYVel;

    let sprite = new AnimatedSprite(miniminiBoss1Sheet, 3, 60, 29, false, true, {min:0, max:0}, 0, {min:0, max:2}, 256, {min:5, max:5}, 0);
	
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle, 
									  {points:   [], 
									   position: {x:(SPRITE_SCALE * 0) + this.position.x + this.size.width / 2, 
										   		  y:this.position.y + this.size.height / 2}, 
									   radius:   0.75 * this.size.width / 2, 
									   center:   {x:(SPRITE_SCALE * 0) + this.position.x + this.size.width / 2, 
										   		  y:this.position.y + this.size.height / 2}});
	let didCollide = false;
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn

		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			return;
		}
		
		timeToCourseChange -= deltaTime;
		this.worldPos = worldPos;		
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			if(!sprite.isDying) {
				
				if(timeToCourseChange < 0) {
					rndXVel = speed * Math.random();
					rndYVel = speed * Math.random();
					timeToCourseChange = 4096 * Math.random();
					
					if(this.position.x < playerPos.x) {
						vel.x = rndXVel;
					} else {
						vel.x = -rndXVel;
					}
					
					if(this.position.y < playerPos.y) {
						vel.y = rndYVel;
					} else {
						vel.y = -rndYVel;
					}
				}
				
				this.position.x += (vel.x * SIM_STEP / 1000);
				this.position.y += (vel.y * SIM_STEP / 1000);
			}
						
			if((this.position.x < -sprite.width) ||
			   (this.position.x > GameField.right) ||
			   (this.position.y < -sprite.height) ||
			   (this.position.y > GameField.bottom)) {
				scene.removeEntity(this, false);
				return;
			}
		}
		
        //store unused time for future use
		unusedTime = availableTime;
		
        //update the collision body position
		if(!sprite.isDying) {
			this.collisionBody.setPosition({x:this.position.x + this.size.height, 
											y:this.position.y + this.size.height / 2});
		}
		
		sprite.update(deltaTime);
		
		if(!sprite.isDying) {//Don't allow enemies to shoot when they are in the process of dying
			const firingChance = Math.floor(1000 * Math.random());
			if(firingChance < difficulty) {
				let yVel;
				if(this.position.y < playerPos.y) {
					yVel = 50;
				} else {
					yVel = -50;
				}
				
				let xVel = vel.x;
				if(this.position.x > (playerPos.x + 50)) {
					xVel -= 10;
				} else if(this.position.x < (playerPos.x - 50)) {
					xVel = -xVel;
				} else {
					xVel = 0;
				}
				
				if(difficulty > 10) {
					xVel *= 2;
					yVel *= 2;
				}
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet2, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
			}
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
		if(!sprite.isDying) {
			this.collisionBody.draw();
		}
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			const totalTime = (worldPos * SIM_STEP);
			this.position.x = position.x;
			this.position.y = position.y;
		}
	};
	
	this.didCollideWith = function(otherEntity) {
		if (otherEntity.collisionBody) {
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
		
		if (this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			
			scene.displayScore(this);

			sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
			
			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
			
			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;

			sprite.isDying = true;

			if((this.group != null) && (this.group !== undefined)) {
				this.group.amDying(this, this.worldPos);
			}

			sprite.wasBorn = true;
			scene.removeCollisions(this);

			enemySmallExplosion.play();
		} else {
			shotDamaged.play();
		}
	};
}
