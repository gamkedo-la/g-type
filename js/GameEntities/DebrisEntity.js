function DebrisEntity(sprite, position = {x:0, y:0}, spawnPos = 0, speed = 4, scale = 1, rotation = 0) {
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;
	// Only use positive speed numbers because we always move right to left
	this.speed = Math.abs(speed);

	this.collisionBody = null;

	this.size = {width:scale * sprite.width, height:scale * sprite.height};

	this.angle = 0;
	// Make the rotation way smaller to have sensible numbers at creation
	rotation = rotation / 3000;

	this.update = function(deltaTime, worldPos) {
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
		if(this.position.x < GameField.x - this.size.width) {
			scene.removeEntity(this, false);
			return;
		}

		if(this.worldPos == null) {
			this.worldPos = worldPos;
		}

		sprite.update(deltaTime);//update the image

		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;

			this.position.x -= this.speed * (worldPos - this.worldPos);
			this.worldPos = worldPos;
		}

		unusedTime = availableTime;

		this.angle = wrapNumber(this.angle + rotation * deltaTime, Math.PI * 2);
	};

	this.draw = function() {
		if(this.worldPos < spawnPos) {return;}
		if((this.worldPos >= spawnPos) && 
		   (this.position.x > GameField.x - this.size.width) &&
		   (this.position.x <= GameField.right)) {
			sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height, this.angle);
		}		
	};

	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - spawnPos);
		}
	};

	return this;
}
