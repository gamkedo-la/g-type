//GhostShipEntity
function GhostShipEntity(position = {x:0, y:0}, distance = 75) {
	this.position = {x:position.x - distance, y:position.y};
	this.type = EntityType.GhostShip;

	const normalSprite = new AnimatedSprite(ghostSheet, 9, 64, 64, false, true, {min:0, max:0}, 0, {min:0, max:8}, 128, {min:8, max:8}, 0);
	let sprite = normalSprite;
	const SPRITE_SCALE = 0.6;
	const MISSILE_VELOCITY = {x:100, y:150};
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};

	const pathPoints = [];

	let path = new GhostPath(distance);
	this.isActive = false;
	const NORMAL_SHOT_SPEED = 1200;
	const secondVel = {x:NORMAL_SHOT_SPEED, y:-NORMAL_SHOT_SPEED};
	const thirdVel = {x:-NORMAL_SHOT_SPEED, y:0};
	const shots = [];
	const missiles = [];
	
	this.collisionBody = null;
	
	this.setPosition = function(newPos) {
		this.position.x = newPos.x;
		this.position.y = newPos.y;
	};
	
	this.update = function(deltaTime, playerPos, worldPos) {
		if(!this.isActive) {return;}//don't update inactive ghosts
		
		sprite.update(deltaTime);
		
		const newPos = path.nextPoint(playerPos);
		if(newPos != null) {
			this.position.x = newPos.x;
			this.position.y = newPos.y;
		} else {
			this.position.x = playerPos.x;
			this.position.y = playerPos.y;
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
		let newShot;
		let secondShot;
		let thirdShot;
		
		if(shots.length >= maxShots) {
			//basically a pool of shots, grab the oldest one
			newShot = shots.splice(0, 1)[0];
		} else {
			//not enough shots in the pool, so make a new one
			newShot = new PlayerShot();
		}
		
		switch(shotType) {
			case EntityType.PlayerShot:
				initializeShot(newShot, EntityType.PlayerShot, 
				               {x:this.position.x + 50, y:this.position.y + 4}, 
				               {x: NORMAL_SHOT_SPEED, y: 0}, false);
				               
				playerFireRegular.play();//play the audio
				break;
			case EntityType.PlayerDouble:
				initializeShot(newShot, EntityType.PlayerShot, 
				               {x:this.position.x + 50, y:this.position.y + 4}, 
				               {x: NORMAL_SHOT_SPEED, y: 0}, false);
				               
				if(shots.length >= maxShots) {
					//basically a pool of shots, grab the oldest one
					secondShot = shots.splice(0, 1)[0];
				} else {
					//not enough shots in the pool, so make a new one
					secondShot = new PlayerShot();
				}
				               
				initializeShot(secondShot, EntityType.PlayerDouble, 
				               {x:this.position.x + 40, y:this.position.y + 6}, 
				               {x: secondVel.x, y: secondVel.y}, true);
				               
				playerFireRegular.play();
				break;
			case EntityType.PlayerLaser:
				initializeShot(newShot, shotType, 
				               {x:this.position.x + 50, y:this.position.y + 13}, 
				               {x: 3 * NORMAL_SHOT_SPEED, y: 0}, false);
				               
				playerFireLaser.play();
				break;
			case EntityType.PlayerTriple:
				initializeShot(newShot, EntityType.PlayerShot, 
				               {x:this.position.x + 50, y:this.position.y + 4}, 
				               {x: NORMAL_SHOT_SPEED, y: 0}, false);
				
				if(shots.length >= maxShots) {
					//basically a pool of shots, grab the oldest one
					secondShot = shots.splice(0, 1)[0];
				} else {
					//not enough shots in the pool, so make a new one
					secondShot = new PlayerShot();
				}
				
				initializeShot(secondShot, EntityType.PlayerDouble,
				               {x:this.position.x + 40, y:this.position.y + 6}, 
				               {x: secondVel.x, y: secondVel.y}, true);
				
				if(shots.length >= maxShots) {
					//basically a pool of shots, grab the oldest one
					thirdShot = shots.splice(0, 1)[0];
				} else {
					//not enough shots in the pool, so make a new one
					thirdShot = new PlayerShot();
				}
				
				initializeShot(thirdShot, EntityType.PlayerTriple, 
				               {x:this.position.x, y:this.position.y + 6}, 
				               {x: thirdVel.x, y: thirdVel.y}, true);
				
				playerFireRegular.play();
				break;
			default:
				initializeNewShot(newShot, shotType, 
				                  {x:this.position.x + 80, y:this.position.y + 4}, 
				                  {x: NORMAL_SHOT_SPEED, y: 0});
				playerFireRegular.play();
				break;
		}
		
		if(hasMissiles) {
			let newMissile
			if(missiles.length >= maxShots) {
				newMissile = missiles.splice(0, 1)[0];
				newMissile.setPosition({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)});
				newMissile.setVelocity(MISSILE_VELOCITY);
			} else {
				newMissile = new PlayerMissile({x:this.position.x + this.size.width / 2, y:this.position.y + (2 * this.size.height / 3)}, MISSILE_VELOCITY);
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
		shots.push(shot);
	};
	
	this.draw = function() {
		if(!this.isActive) {return;}//don't draw inactive ghosts
		
		//draw ghost shots
		for(let i = 0; i < shots.length; i++) {
			shots[i].draw();
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].draw();
		}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);		
	};
	
	this.clearBullets = function() {
		for(let i = 0; i < shots.length; i++) {
			shots[i].isVisible = false;
			shots[i].isActive = false;
			scene.removeCollisions(shots[i], true);
		}
		
		for(let i = 0; i < missiles.length; i++) {
			missiles[i].isVisible = false;
			missiles[i].isActive = false;
			scene.removeCollisions(missiles[i], true);
		}
	};

	this.playerDied = function() {
		if(sprite.isDying) {return;}

		sprite = new AnimatedSprite(playerBoom2Sheet, 13, 80, 80, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max: 12}, 64);

		sprite.isDying = true;
		
		this.clearBullets();
	};
	
	this.restore = function() {
		sprite = normalSprite;
		sprite.wasBorn = false;
		sprite.isDying = false;
		sprite.currentFrame = 0;
	}

	this.reset = function() {
		sprite.isDying = false;
		this.isActive = false;

		sprite = new AnimatedSprite(ghostSheet, 9, 64, 64, false, true, {min:0, max:0}, 0, {min:0, max:8}, 128, {min:8, max:8}, 0);
	};
	
	return this;
}

function GhostPath(distance = 75) {
	let distanceToPlayer = 0;
	let desiredDistance = distance;
	const points = [];
	
	this.getPointCount = function() {
		return points.length;
	};
	
	this.nextPoint = function(playerPos) {
		addPoint(playerPos);
		
		if(points.length < 2) {
			return null;
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
		if(points.length < 1) {
			points.push(newPoint);
			return;
		}
		
		if((newPoint.x === points[points.length - 1].x) &&
		   (newPoint.y === points[points.length - 1].y)) {
			   return;
		}
		
		points.push(newPoint);

		const previousEndPoint = points[(points.length - 2)];
		const deltaX = newPoint.x - previousEndPoint.x;
		const deltaY = newPoint.y - previousEndPoint.y;
		
		distanceToPlayer += Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));		
	};
	
	this.setDistance = function(newDistance) {
		desiredDistance = newDistance;
	};
}