//FlyingEnemy1
function FlyingEnemy1(position = {x:0, y:0}, speed = -10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {
	this.type = EntityType.FlyingEnemy1;
	this.group = null;
	this.worldPos = 0;
	
	const SPRITE_SCALE = 2; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	
	const sprite = new AnimatedSprite(flyingEnemySheet, 5, 30, 21, 128, {min:0, max:4}, true);
	let size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
															position: {x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2}, 
															radius:   size.height / 2, 
															center:   {x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2}}
									  );
	let didCollide = false;
	
	this.path = new EnemyPath(PathType.Sine, this.position, speed, [], timeOffset);
	
	this.update = function(deltaTime, worldPos) {
		this.worldPos = worldPos;
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			const nextPos = this.path.nextPoint(SIM_STEP);
			if(pattern == PathType.None) {
				this.position.x += (vel.x * SIM_STEP / 1000);
				this.position.y += (vel.y * SIM_STEP / 1000);
			} else {
				if(nextPos != undefined) {
					this.position.x += nextPos.x;
					this.position.y += nextPos.y;
				}
			}
						
			if(this.position.x < -sprite.width) {
				scene.removeEntity(this, false);
				return;
			}
		}
		
		unusedTime = availableTime;
		
		this.collisionBody.setPosition({x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2});
		sprite.update(deltaTime);
		
		const firingChance = Math.floor(1000 * Math.random());
		if(firingChance < difficulty) {
			let yVel;
			if(this.position.y < canvas.height / 2) {
				yVel = 50;
			} else {
				yVel = -50;
			}
			const newBullet = new EnemyBullet({x: this.position.x - 10, y: this.collisionBody.center.y}, {x: vel.x - 10, y:yVel});
			scene.addEntity(newBullet, false);
		}
	}
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position, size);
		this.collisionBody.draw();
		
		if(didCollide) {
			didCollide = false;
			canvasContext.fillStyle = 'green';
			canvasContext.arc(this.position.x + sprite.width / 2, this.position.y + sprite.height / 2, 7, 0, 2 * Math.PI);
			canvasContext.fill();
		}
	}
	
	this.didCollideWith = function(otherCollider) {
		if((this.group != null) && (this.group != undefined)) {
			this.group.remove(this, this.worldPos);
		}
		scene.removeEntity(this, false);
	}
}