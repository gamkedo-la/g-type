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
	const shots = [];
	const missiles = [];
	
	this.collisionBody = null;
	
	this.setPosition = function(newPos) {
		this.position.x = newPos.x;
		this.position.y = newPos.y;
	};
	
	this.setSpeed = function(newSpeed) {
		this.path.updateSpeed(newSpeed);
	}
	
	this.update = function(deltaTime, playerPos, worldPos) {
		if(!this.isActive) {return;}//don't update inactive ghosts
		sprite.update(deltaTime);
		
		const newPos = path.nextPoint(playerPos);
		if(newPos != null) {
			this.position.x = newPos.x;
			this.position.y = newPos.y;
		}
		
		//update all player shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].update(deltaTime, worldPos);
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].update(deltaTime, worldPos);
		}
	};
	
	this.doShooting = function(maxShots = 10, shotType = EntityType.PlayerShot, hasMissiles = false) {
		if(!this.isActive) {return;}//inactive ghosts don't shoot
		
		//enough time has passed so we can shoot again
			let newShot;
			if(shots.length === maxShots) {
				//basically a pool of shots, grab the oldest one
				newShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				newShot = new PlayerShot();
			}
			
			let secondShot;
			const secondVel = {x:150, y:-150};
			if(shots.length === maxShots) {
				//basically a pool of shots, grab the oldest one
				secondShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				secondShot = new PlayerShot();
			}
			
			let thirdShot;
			const thirdVel = {x:-200, y:0};
			if(shots.length === maxShots) {
				//basically a pool of shots, grab the oldest one
				thirdShot = shots.splice(0, 1)[0];
			} else {
				//not enough shots in the pool, so make a new one
				thirdShot = new PlayerShot();
			}
						
			switch(shotType) {
				case EntityType.PlayerShot:
					initializeShot(newShot, shotType, {x:this.position.x + 46, y:this.position.y + 5}, {x: 200, y: 0}, false);
					playerFireRegular.play();//play the audio
					break;
				case EntityType.PlayerDouble:
					initializeShot(newShot, shotType, {x:this.position.x + 46, y:this.position.y + 5}, {x: 200, y: 0}, false);
					initializeShot(secondShot, shotType, {x:this.position.x + 46, y:this.position.y  - 2}, {x: secondVel.x, y: secondVel.y}, true);
					playerFireRegular.play();
					break;
				case EntityType.PlayerLaser:
					initializeShot(newShot, shotType, {x:this.position.x + 34, y:this.position.y + 14}, {x: 600, y: 0}, false);
					playerFireLaser.play();
					break;
				case EntityType.PlayerTriple:
					initializeShot(newShot, shotType, {x:this.position.x + 46, y:this.position.y + 5}, {x: 200, y: 0}, false);
					initializeShot(secondShot, shotType, {x:this.position.x + 46, y:this.position.y + 5}, {x: secondVel.x, y: secondVel.y}, true);
					initializeShot(thirdShot, shotType, {x:this.position.x - thirdShot.size.width, y:this.position.y + 13}, {x: thirdVel.x, y: thirdVel.y}, true);
					playerFireRegular.play();
					break;
				default:
					initializeNewShot(newShot, shotType, {x:this.position.x + 46, y:this.position.y - 2}, {x: 200, y: 0});
					playerFireRegular.play();
					break;
			}
			
			if(hasMissiles) {
				let newMissile
				if(missiles.length === maxShots) {
					newMissile = missiles.splice(0, 1)[0];
					newMissile.setPosition({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)});
					newMissile.setVelocity({x:100, y:150});
				} else {
					newMissile = new PlayerMissile({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)}, {x:100, y:150});
				}
				
				newMissile.reset();
				missiles.push(newMissile);
				scene.addEntity(newMissile, true);
			}
	};
	
	const initializeShot = function(shot, shotType, shotPos, shotVel, isRotated) {
		shot.resetWithType(shotType);
		scene.addEntity(shot, true);
		shot.setPosition({x:shotPos.x, y:shotPos.y});
		shot.setVelocity({x: shotVel.x, y: shotVel.y});
		if(isRotated) {shot.rotation = Math.atan2(-shotVel.y, shotVel.x);}
		shots.push(shot);
	};
	
	this.draw = function() {
		if(!this.isActive) {return;}//don't draw inactive ghosts
		sprite.drawAt(this.position, this.size);
		
		//draw player shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].draw();
		}
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