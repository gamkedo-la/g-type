//GroundEnemy1
function GroundEnemy1(position = {x:0, y:0}, rotation = -Math.PI/2, speed = 0, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {
	this.type = EntityType.GroundEnemy1;
	this.group = null;
	this.worldPos = 0;
	this.score = 100;
	
    this.hitPoints = 4;     // Every enemy type should have a hitPoints property

	const SPRITE_SCALE = 1;
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	this.rotation = rotation;
	
	let sprite = new AnimatedSprite(groundEnemySheet, 7, 30, 30, true, true, {min:0, max:0}, 0, {min:0, max:4}, 256, {min:5, max:6}, 34);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

/*	const colliderPath = [
		{x: this.position.x, 							  y: this.position.y + SPRITE_SCALE * 17},
		{x: this.position.x + SPRITE_SCALE * (sprite.width / 2), y: this.position.y},
		{x: this.position.x + SPRITE_SCALE * sprite.width, 	  y: this.position.y + SPRITE_SCALE * 17},
		{x: this.position.x + SPRITE_SCALE * (sprite.width / 2), y: this.position.y + SPRITE_SCALE * sprite.height}
	];*/

	this.collisionBody = new Collider(ColliderType.Circle,
										{points: [], 
										position: {x:this.position.x, y:this.position.y}, 
										radius: this.size.height / 2, 
										center: {x:this.position.x + this.size.width / 2, y:this.position.y + this.size.height / 2}}
									  );
	let didCollide = false;
	
	this.path = new EnemyPath(PathType.None, this.position, speed, [], timeOffset);
	
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
		
		const firingChance = Math.floor(1000 * Math.random());
		if(firingChance < difficulty) {
			let facing = rotation + Math.PI / 2;
			if(facing > Math.PI) {
				facing -= (2 * Math.PI);
			} else if(facing < -Math.PI) {
				facing += (2 * Math.PI);
			}
						
			const angleToPlayer = Math.atan2(this.position.y - playerPos.y, playerPos.x - this.position.x);
			
			const deltaAngle = angleToPlayer - facing;
			if((deltaAngle > -Math.PI / 4) && (deltaAngle < Math.PI / 4)) {
				const xVel = 50 * Math.cos(angleToPlayer);
				const yVel = -50 * Math.sin(angleToPlayer);
				console.log("(" + xVel + ", " + yVel + ")");
				
				const newBullet = new EnemyBullet({x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
			}
			
//			console.log("deltaAngle: " + (180 * deltaAngle / Math.PI));
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
			const nextPos = this.path.nextPoint(totalTime - timeOffset);
			this.position.x = nextPos.x;
			this.position.y = nextPos.y;
		}
	};
	
	this.didCollideWith = function(otherCollider) {
		// Note: as of 2018-09-05, otherCollider is not a Collider; it is an entity that contains a Collider (e.g., a PlayerShot or a PlayerForceUnit)
		if (otherCollider.collisionBody.parentObj) {
			let entityType = otherCollider.collisionBody.parentObj.type;
			if (entityType === EntityType.PlayerForceUnit ||
				entityType === EntityType.PlayerShot) {
				this.hitPoints -= otherCollider.damagePoints;
			}
		} 
		else {
			this.hitPoints = 0; // TODO remove this catch-all; we want all collisions with player weapons to inflict damage based on their damagePoints
		}

		if (this.hitPoints <= 0) {
			scene.displayScore(this);

			sprite = new AnimatedSprite(enemyExplosionSheet2, 18, 144, 144, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);

			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;

			sprite.isDying = true;
			sprite.wasBorn = true;
			scene.removeCollisions(this);

			enemySmallExplosion.play();
		}
		// TODO else -- add SFX to show a non-lethal hit
	};
}
