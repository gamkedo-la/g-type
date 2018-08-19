//FlyingEnemy1
function FlyingEnemy1(position = {x:0, y:0}, speed = -10, pattern = MovementPattern.None) {
	this.type = EntityType.FlyingEnemy1;
	this.group = null;
	
	const SPRITE_SCALE = 2; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	timer.registerEvent("flyingEnemy1Spawn");
	
	const sprite = new AnimatedSprite(flyingEnemySheet, 5, 30, 21, 128, {min:0, max:4}, true);
	let size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
															position: {x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2}, 
															radius:   size.height / 2, 
															center:   {x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2}}
									  );
	let didCollide = false;
	
	this.update = function(deltaTime) {
		if(!this.isVisible) {return;}
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			this.position.x += (vel.x * SIM_STEP / 1000);
			if(pattern == MovementPattern.None) {
				this.position.y += (vel.y * SIM_STEP / 1000);
			} else if(pattern == MovementPattern.Sine){
				this.position.y += (0.005 * canvas.height * Math.sin(Math.PI * timer.timeSinceUpdateForEvent("flyingEnemy1Spawn") / 1000));
			}
			
			if(this.position.x < 0) {
				this.isVisible = false;
				return;
			}
		}
		
		unusedTime = availableTime;
		
		this.collisionBody.setPosition({x:(SPRITE_SCALE * 3) + this.position.x + size.height / 2, y:this.position.y + size.height / 2});
		sprite.update(deltaTime);
	}
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
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
			this.group.remove(this);
		}
		scene.removeEntity(this, false);
	}
}