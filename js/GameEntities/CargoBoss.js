//Cargo Ship Boss
function CargoBoss(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {	
	this.type = EntityType.FlyingEnemy1;
	this.group = null;
	this.worldPos = 0;
	this.score = 100;
	let previousBackgroundMusic = null;

    this.hitPoints = 400;     // Every enemy type should have a hitPoints property
	
	const SPRITE_SCALE = 1; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.position = position;
	let vel = {x:speed, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	this.bulletsLeft = 0;
	this.timeSinceLastFire = 0;
	let sprite = new AnimatedSprite(cargoBossSheet, 
		/*frameCount =*/ 2, 
		/*frameWidth =*/ 300, 
		/*frameHeight =*/ 200, 
		/*reverses =*/ true, 
		/*autoLife =*/ true, 
		/*birthRange =*/ {min:0, max:1}, 
		/*birthRate =*/ 0, 
		/*lifeRange =*/ {min:0, max:1}, 
		/*lifeRate =*/ 128, 
		/*deathRange =*/ {min:1, max:1}, 
		/*deathRate =*/  0);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	const EXPLOSION_COUNT = 7;
	const explosions = [];

	//all magic numbers in collider path are based on the sprite
	const colliderPath = [{x: this.position.x + 23 * SPRITE_SCALE, y: this.position.y + 112 * SPRITE_SCALE},
						  {x: this.position.x + 91 * SPRITE_SCALE, y: this.position.y + 46 * SPRITE_SCALE},
						  {x: this.position.x + 113 * SPRITE_SCALE, y: this.position.y + 46 * SPRITE_SCALE},
						  {x: this.position.x + 113 * SPRITE_SCALE, y: this.position.y + 23 * SPRITE_SCALE},
						  {x: this.position.x + 178 * SPRITE_SCALE, y: this.position.y + 23 * SPRITE_SCALE},
						  {x: this.position.x + 178 * SPRITE_SCALE, y: this.position.y + 46 * SPRITE_SCALE},
						  {x: this.position.x + 252 * SPRITE_SCALE, y: this.position.y + 46 * SPRITE_SCALE},
						  {x: this.position.x + 255 * SPRITE_SCALE, y: this.position.y + 134 * SPRITE_SCALE},
						  {x: this.position.x + 229 * SPRITE_SCALE, y: this.position.y + 184 * SPRITE_SCALE},
						  {x: this.position.x + 151 * SPRITE_SCALE, y: this.position.y + 186 * SPRITE_SCALE},
						  {x: this.position.x + 139 * SPRITE_SCALE, y: this.position.y + 169 * SPRITE_SCALE},
						  {x: this.position.x + 84 * SPRITE_SCALE, y: this.position.y + 169 * SPRITE_SCALE},
						  {x: this.position.x + 30 * SPRITE_SCALE, y: this.position.y + 151 * SPRITE_SCALE}];
	
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	
	let didCollide = false;
	
	this.path = new EnemyPath(PathType.Sine, this.position, speed, [], timeOffset);

	this.update = function(deltaTime, worldPos, playerPos) {
		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			return;
		}
		
		this.worldPos = worldPos;
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
		
		if((this.worldPos > spawnPos + 50) && (!sprite.isDying)) {
			if(previousBackgroundMusic === null) {
				scene.worldShouldPause(true);
				previousBackgroundMusic = currentBackgroundMusic.getCurrentTrack();
				currentBackgroundMusic.setCurrentTrack(AudioTracks.Boss1);
				
				if(currentBackgroundMusic.getTime() > 0) {
		            currentBackgroundMusic.resume();    
		        } else {
		            currentBackgroundMusic.play();
		        }				
			}
		} else if((sprite.isDying) && (previousBackgroundMusic != null)) {
			scene.worldShouldPause(false);
			currentBackgroundMusic.setCurrentTrack(previousBackgroundMusic);
            currentBackgroundMusic.play();
			previousBackgroundMusic = null;			
		}
		
		let availableTime = unusedTime + deltaTime;
		this.timeSinceLastFire += deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			if(!sprite.isDying) {
				const nextPos = this.path.nextPoint(SIM_STEP);
				if(nextPos !== undefined) {
					if(pattern === PathType.None) {
						this.position.x += (vel.x * SIM_STEP / 1000);
						//this.position.y += (vel.y * SIM_STEP / 1000);
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
			sprite.update(deltaTime);
			this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
		} else {
			sprite.update(deltaTime / 4);
			this.updateExplosions(deltaTime);
		}
		
		
		
		if(!sprite.isDying) {//Don't allow enemies to shoot when they are in the process of dying
			const firingChance = Math.floor(100 * Math.random());
			if(this.bulletsLeft > 0 && this.timeSinceLastFire > 500){
				//fireBullet
				xVel = -10;
				yVel = (this.bulletsLeft -5) * 20;
				newBullet = new EnemyBullet(EntityType.EnemyBullet2, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
				this.bulletsLeft -= 1;
			}

			if(this.bulletsLeft == 0 && firingChance < difficulty) {
				let yVel;
				this.bulletsLeft = 10;
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
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet2, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
			}
		}
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		if((this.position.x < GameField.x - this.size.width) || 
		   (this.position.x > GameField.right) ||
		   (this.position.y < GameField.y - this.size.height) ||
		   (this.position.y > GameField.bottom)) {
			   return;
		}
		
		sprite.drawAt(this.position, this.size);
		if(!sprite.isDying) {
			this.collisionBody.draw();
		} else {
			this.drawExplosions();
		}
	};
	
	this.updateExplosions = function(deltaTime) {
		console.log("Explosion Count: " + explosions.length);
		if(explosions.length < EXPLOSION_COUNT) {
			if((100 * Math.random()) < 25) {//1 in 20 chance the next explosion should spawn
				const newExplosion = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
				newExplosion.deltaXPos = (this.size.width * Math.random());
				newExplosion.deltaYPos = (this.size.height * Math.random());
				
				newExplosion.isDying = true;
				newExplosion.wasBorn = true;
				
				explosions.push(newExplosion);
			}
		}
		
		for(let i = 0; i < explosions.length; i++) {
			explosions[i].update(deltaTime);
		}
	};
	
	this.drawExplosions = function() {
		for(let i = 0; i < explosions.length; i++) {
			explosions[i].drawAt({x:(this.position.x + explosions[i].deltaXPos), y: (this.position.y + explosions[i].deltaYPos)}, this.size);
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
		if (otherEntity) {
			let entityType = otherEntity.type;
			if ((entityType === EntityType.PlayerForceUnit) ||
				(entityType === EntityType.PlayerShot) || 
				(entityType === EntityType.PlayerMissile) || 
				(entityType === EntityType.PlayerDouble) || 
				(entityType === EntityType.PlayerLaser) || 
				(entityType === EntityType.PlayerTriple) ||
				(entityType === EntityType.PlayerShield)) {
				this.hitPoints -= otherEntity.damagePoints;
			}
		} 
		else {
		    this.hitPoints = 0; // TODO remove this catch-all; we want all collisions with player weapons to inflict damage based on their damagePoints
		}
		
		if (this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			
			scene.displayScore(this);

			sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
			
			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
			
			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;

			sprite.isDying = true;
			sprite.wasBorn = true;
			scene.removeCollisions(this);

			enemyLargeExplosion.play();
		}
		// TODO else -- add SFX to show a non-lethal hit
	};
}