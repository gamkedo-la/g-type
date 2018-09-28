//GhostShipEntity
function GhostShipEntity(position = {x:0, y:0}, speed = 0) {
	this.position = {x:position.x - 75, y:position.y};
	this.type = EntityType.GhostShip;
	const sprite = new AnimatedSprite(ghostSheet, 9, 64, 64, false, true, {min:0, max:0}, 0, {min:0, max:8}, 128, {min:8, max:8}, 0);
	const SPRITE_SCALE = 0.6;
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};
	let shotType = EntityType.PlayerShot;
	const pathPoints = [];
//	this.path = new EnemyPath(PathType.Points, this.position, speed, pathPoints, 0);
	let path = new GhostPath(75);
	this.isActive = false;
	
	this.collisionBody = null;
	
	this.setPosition = function(newPos) {
		this.position.x = newPos.x;
		this.position.y = newPos.y;
	};
	
	this.setSpeed = function(newSpeed) {
		this.path.updateSpeed(newSpeed);
	}
	
	this.update = function(deltaTime, playerPos) {
		if(!this.isActive) {return;}//don't update inactive ghosts
		sprite.update(deltaTime);
		
		const newPos = path.nextPoint(playerPos);
		if(newPos != null) {
			this.position.x = newPos.x;
			this.position.y = newPos.y;
		}
	};
	
	this.doShooting = function() {
		
	};
	
	this.draw = function() {
		if(!this.isActive) {return;}//don't draw inactive ghosts
		sprite.drawAt(this.position, this.size);
	};
	
	return this;
}

function GhostPath(distance = 75) {
	let distanceToPlayer = 0;
	let desiredDistance = distance;
	const points = [];
	
	this.nextPoint = function(playerPos) {
		addPoint(playerPos);
		
		if((points.length < 2) || (distanceToPlayer < 0.9 * desiredDistance)) {
			return {x:playerPos.x - desiredDistance, y: playerPos.y};
		}
		
		const newPosition = {x:0, y:0};
		while(distanceToPlayer > desiredDistance) {
			advanceGhostPos();
		}
		
		return points[0];
	};
	
	const advanceGhostPos = function() {
		const oldPos = points.splice(0, 1)[0];
		const newPos = points[0];
		
		const deltaX = oldPos.x - newPos.x;
		const deltaY = oldPos.y - newPos.y;
		
		distanceToPlayer -= (Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)));
	};
	
	const addPoint = function(newPoint) {
		points.push({x:newPoint.x, y:newPoint.y});

		if(points.length < 2) {return;}

		const previousEndPoint = points[(points.length - 2)];
		const deltaX = newPoint.x - previousEndPoint.x;
		const deltaY = newPoint.y - previousEndPoint.y;
		
		distanceToPlayer += Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));		
	};
	
	this.setDistance = function(newDistance) {
		desiredDistance = newDistance;
	};
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