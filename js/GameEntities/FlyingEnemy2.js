//FlyingEnemy2
function FlyingEnemy2(position = {x:0, y:0}, speed = -10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {
	this.type = EntityType.FlyingEnemy2;
	this.group = null;
	this.worldPos = 0;
	this.score = 100;
	
	const SPRITE_SCALE = 1;
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	let rotation = 0;
	
	let sprite = new AnimatedSprite(flyingEnemy2Sheet, 6, 50, 50, false, true, {min:0, max:0}, 0, {min:0, max:5}, 256, {min:5, max:5}, 0);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
															position: {x:(SPRITE_SCALE * 0) + this.position.x + this.size.height / 2, y:this.position.y + this.size.height / 2}, 
															radius:   this.size.height / 2, 
															center:   {x:(SPRITE_SCALE * 0) + this.position.x + this.size.height / 2, y:this.position.y + this.size.height / 2}}
									  );
	let didCollide = false;
	
	const pathPoints = [
		{x: canvas.width, y: 100},
		{x: canvas.width / 3, y: 100},
		{x: 2 * canvas.width / 3, y: 500},
		{x: canvas.width + 50, y: 500},
	];
	
	this.path = new EnemyPath(PathType.Points, this.position, speed, pathPoints, timeOffset);
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn

		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			if((this.group != null) && (this.group !== undefined)) {
				this.group.remove(this, this.worldPos);
			}
			return;
		}
		
		this.worldPos = worldPos;
		
		rotation -= (deltaTime / 500);
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			if(!sprite.isDying) {
				const nextPos = this.path.nextPoint(SIM_STEP);
				if(nextPos !== undefined) {
					if(pattern === PathType.None) {
						this.position.x += (vel.x * SIM_STEP / 1000);
						this.position.y += (vel.y * SIM_STEP / 1000);
					} else if(pattern === PathType.Sine) {
						this.position.x += nextPos.x;
						this.position.y += nextPos.y;
					} else if(pattern === PathType.Points) {
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
		
		if(!sprite.isDying) {
			this.collisionBody.setPosition({x:(SPRITE_SCALE * 3) + this.position.x + this.size.height / 2, 
											y:this.position.y + this.size.height / 2});
		}
		
		sprite.update(deltaTime);
		
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
			
			const newBullet = new EnemyBullet({x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
			scene.addEntity(newBullet, false);
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position, this.size, rotation);
		if(!sprite.isDying) {
			this.collisionBody.draw();
		}
		
		if(didCollide) {
			didCollide = false;
			canvasContext.fillStyle = 'green';
			canvasContext.arc(this.position.x + sprite.width / 2, this.position.y + sprite.height / 2, 7, 0, 2 * Math.PI);
			canvasContext.fill();
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
		scene.displayScore(this);
		
		sprite = new AnimatedSprite(enemyExplosionSheet2, 18, 144, 144, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
		
		this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
		
		this.position.x = this.collisionBody.center.x - this.size.width / 2;
		this.position.y = this.collisionBody.center.y - this.size.height / 2;

		sprite.isDying = true;
		sprite.wasBorn = true;
		scene.removeCollisions(this);

		enemySmallExplosion.play();
	};
}
