//GhostShipEntity
function GhostShipEntity(position = {x:0, y:0}) {
	this.position = {x:position.x - 75, y:position.y};
	this.type = EntityType.GhostShip;
	const sprite = new AnimatedSprite(ghostSheet, 9, 64, 64, true, true, {min:0, max:0}, 0, {min:0, max:8}, 128, {min:8, max:8}, 0);
	const SPRITE_SCALE = 1;
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};
	let shotType = EntityType.PlayerShot;
//	let path = new GhostPath();
	this.isActive = false;
	
	this.collisionBody = null;
	
	this.setPosition = function(newPos) {
		this.position.x = newPos.x;
		this.position.y = newPos.y;
	}
	
	this.update = function(deltaTime, playerPos) {
		if(!this.isActive) {return;}//don't update inactive ghosts
		sprite.update(deltaTime);
		
		this.position.x = playerPos.x - 75;//temporary
		this.position.y = playerPos.y;//temporary
	};
	
	this.doShooting = function() {
		
	};
	
	this.draw = function() {
		if(!this.isActive) {return;}//don't draw inactive ghosts
		sprite.drawAt(this.position, this.size);
	};
	
	return this;
}

/*function KeyPoint(time = 0, point = {x:0, y:0}) {
	this.time = time;
	this.point = {x:point.x, y:point.y};
}

function GhostPath() {
	const keyPoints [];
	let currentTime = 0;
	
	this.addKeyPoint = function(newKeyPoint) {
		keyPoints.push(newKeyPoint);
	};
	
	this.nextPoint = function(deltaTime) {
		currentTime += deltaTime;
		const newPoint = {x:0, y:0};
		
		
		
		return newPoint;
	}
}*/