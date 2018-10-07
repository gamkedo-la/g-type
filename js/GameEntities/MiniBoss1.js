//Planetary Approach Mini-Boss
function MiniBoss1(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {
	this.position = {x:position.x, y:position.y};
	this.type = EntityType.MiniBoss1;
	this.worldPos = 0;
	this.score = 5000;
	
    this.hitPoints = 40;     // Every enemy type should have a hitPoints property

	const SPRITE_SCALE = 2.5;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	let rotation = 0;
	
	let sprite = new AnimatedSprite(miniBoss1Sheet, 6, 60, 34, false, true, {min:0, max:0}, 0, {min:0, max:2}, 256, {min:3, max:5}, 256);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
															position: {x:(SPRITE_SCALE * 0) + this.position.x + this.size.width / 2, 
																	   y:this.position.y + this.size.height / 2}, 
															radius:   this.size.height / 2, 
															center:   {x:(SPRITE_SCALE * 0) + this.position.x + this.size.width / 2, 
																	   y:this.position.y + this.size.height / 2}}
									  );
	let didCollide = false;
	
	const pathPoints = [
		{x: GameField.right - this.size.width, y: GameField.midY},
		{x: GameField.right - this.size.width, y: GameField.y},
		{x: GameField.right - this.size.width, y: GameField.bottom - this.size.height},
		{x: GameField.right - this.size.width, y: GameField.y},
		{x: GameField.right - this.size.width, y: GameField.bottom - this.size.height},
//		{x: GameField.right - this.size.width, y: GameField.y},
	];//TODO: Give the mini boss a path to follow
	
	this.path = new EnemyPath(pattern, this.position, speed, pathPoints, timeOffset);
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn

		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			return;
		}
		
		this.worldPos = worldPos;
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			if(!sprite.isDying) {
				const nextPos = this.path.nextPoint(SIM_STEP);
				if(nextPos !== undefined) {
					if(pattern === PathType.None) {
						this.position.x += (vel.x * SIM_STEP / 1000);
						//default should maybe be fly straight? removing y movement for level-load testing. -Rybar
						//this.position.y += (vel.y * SIM_STEP / 1000);  
					} else if(pattern === PathType.Sine) {
						this.position.x += nextPos.x;
						this.position.y += nextPos.y;
					} else if((pattern === PathType.Points) || (pattern === PathType.Loop)) {
						this.position.x = nextPos.x;
						this.position.y = nextPos.y;
					}
				}
			}
						
			if(this.position.x < -sprite.width) {
				scene.removeEntity(this, false);
				return;
			}
		}
		
		unusedTime = availableTime;
		
		if(!sprite.isDying) {//TODO: restore this once the miniboss has a collision body
			this.collisionBody.setPosition({x:(SPRITE_SCALE * 3) + this.position.x + this.size.height / 2, 
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
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet2, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
			}
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position, this.size);
		if(!sprite.isDying) {//TODO: restore this once the miniboss has a collision body
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
		
	this.didCollideWith = function(otherEntity) {
		//TODO: Implement this once the miniboss has a collision body	
	};
}