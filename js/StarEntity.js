//Star Entity
function StarEntity(sprite, position = {x:0, y:0}, velocity = {x:0, y:0}, size = {width:sprite.width, height:sprite.height}, collisionBody = null) {
	let pos = position;
	let vel = velocity;
	let unusedTime = 0;
	
	sprite.setRandomFrame();
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);//update the image
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += vel.x * SIM_STEP / 1000;
			pos.y += vel.y * SIM_STEP / 1000;
			
			if(pos.x < -sprite.width) {
				pos.x = canvas.width + sprite.width;
			}
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