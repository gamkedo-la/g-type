//Planetary Approach Mini-Boss
function MiniBoss1(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0, pathOffset = -50, path = null) {
	this.position = {x:position.x, y:position.y};
	this.type = EntityType.MiniBoss1;
	this.worldPos = 0;
	this.score = 5000;
	let previousBackgroundMusic = null;
	let didSpawn = true;
	let shouldResumeGame = true;
	
    this.hitPoints = 80;     // Every enemy type should have a hitPoints property
    const INVINCIBILITY_TIME = 128;
    this.invincibilityTime = 0;

	const SPRITE_SCALE = 2.5;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	let rotation = 0;
	
	let sprite = new AnimatedSprite(miniBoss1Sheet, 6, 60, 34, false, true, {min:0, max:0}, 0, {min:0, max:2}, 256, {min:3, max:5}, 256);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	const colliderPath = [{x: this.position.x, y: this.position.y + this.size.height / 2 + (3 * SPRITE_SCALE)}, 
						  {x: this.position.x + this.size.width - (10 * SPRITE_SCALE), y: this.position.y - (3 * SPRITE_SCALE)}, 
						  {x: this.position.x + this.size.width - (10 * SPRITE_SCALE), y: this.position.y + this.size.height + (3 * SPRITE_SCALE)}];
						  
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	
	let didCollide = false;
	
	let pathPoints = [
		{x: GameField.right + 400, y: GameField.midY},
		{x: GameField.right - this.size.width, y: GameField.midY},
		{x: GameField.right - this.size.width, y: GameField.y},
		{x: GameField.right - this.size.width, y: GameField.bottom - this.size.height},
		{x: GameField.right - this.size.width, y: GameField.y},
		{x: GameField.right - this.size.width, y: GameField.bottom - this.size.height},
//		{x: GameField.right - this.size.width, y: GameField.y},
	];//TODO: Give the mini boss a path to follow
	
	this.updatePathOffset = function(additionalOffset) {
		didSpawn = false;
		shouldResumeGame = false;
		this.isVisible = false;
		
        pathPoints.forEach((point) => {
            point.x -= additionalOffset;
        });
    
	    this.path = new EnemyPath(pattern, this.position, speed, pathPoints);
    };
	
	if(path) {
        if(path.polygon === undefined) {
            pathPoints = path.polyline.slice(0);
        } else {
            pathPoints = path.polygon.slice(0);
        }
        
        pathPoints.forEach((point) => {
            point.x += GameField.x + GameField.width + pathOffset;
            point.y += GameField.y + path.y;
        });
    }
    
    this.path = new EnemyPath(pattern, this.position, speed, pathPoints);
    
    this.spawn = function(deltaX) {
        if(didSpawn) {return;}//only spawn once
        const deltaPos = {x:deltaX, y:0};
        this.path.updatePosition(deltaPos);
        this.position = this.path.putAtFirstPoint();
        this.isVisible = true;
        didSpawn = true;
    };
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn

		if(this.invincibilityTime > 0) {
			this.invincibilityTime -= deltaTime;
		}

		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			return;
		}
		
		this.worldPos = worldPos;
		if((this.worldPos > spawnPos + 50) && (!sprite.isDying)) {
			if(previousBackgroundMusic === null) {
				scene.worldShouldPause(true);
				previousBackgroundMusic = currentBackgroundMusic.getCurrentTrack();
				currentBackgroundMusic.setCurrentTrack(AudioTracks.MiniBoss1);
				
				this.path.updatePosition({x: -100, y:0});//using -100 to get the sprite fully on screen
				
	            currentBackgroundMusic.play();
			}
		} else if((sprite.isDying) && (previousBackgroundMusic != null) && (shouldResumeGame)) {
			scene.worldShouldPause(false);
			currentBackgroundMusic.setCurrentTrack(previousBackgroundMusic);
            currentBackgroundMusic.play();
			previousBackgroundMusic = null;			
		}
		
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
			this.collisionBody.setPosition({x:this.position.x, 
											y:this.position.y});
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
					xVel -= 30;
				} else if(this.position.x < (playerPos.x - 50)) {
					xVel = -xVel;
				} else {
					xVel = 0;
				}
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet2, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
				laserShot.play();
			}
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
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
		if(this.invincibilityTime > 0) {return;}
		
		if((otherEntity.type === EntityType.Player) ||
		   (otherEntity.type === EntityType.RagnarokCapsule) || 
		   (otherEntity.type === EntityType.PlayerShot) ||
		   (otherEntity.type === EntityType.PlayerMissile) ||
		   (otherEntity.type === EntityType.PlayerDouble) ||
		   (otherEntity.type === EntityType.PlayerLaser) ||
		   (otherEntity.type === EntityType.PlayerTriple) ||
		   (otherEntity.type === EntityType.PlayerForceUnit)) {
			   
			   this.hitPoints -= otherEntity.damagePoints;
			   enemySmallExplosion.play();
			   this.invincibilityTime = INVINCIBILITY_TIME;
		}
		   
		if(this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			enemyLargeExplosion.play();
			
			if((this.group != null) && (this.group !== undefined)) {
                this.group.amDying(this, this.worldPos);
            }
			
			scene.displayScore(this);
			sprite.isDying = true;
			scene.removeCollisions(this);	
		}
	};
}
