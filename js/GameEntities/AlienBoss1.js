//Alien Ship Boss
function AlienBoss1(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {	
	this.type = EntityType.AlienBoss1;
	this.group = null;
	this.worldPos = 0;
	this.score = 7200;
	let previousBackgroundMusic = null;

    this.hitPoints = 4200;     // Every enemy type should have a hitPoints property
	
	const SPRITE_SCALE = 1; 
	this.position = position;
	this.vel = {x: -50, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	this.bulletsLeft = 0;
	this.timeSinceLastFire = 0;
	this.ticksInState = 0;
	this.timeSinceLastDip = 0;
	this.currentState = function(){}
	var state = {}
	this.rotation = 0;
	this.targetPos = {x: 0, y: 0};
	let sprite = new AnimatedSprite(alienBoss1Sheet, 
		/*frameCount =*/ 12, 
		/*frameWidth =*/ 211.7, 
		/*frameHeight =*/ 210, 
		/*reverses =*/ false, 
		/*autoLife =*/ true, 
		/*birthRange =*/ {min:0, max:1}, 
		/*birthRate =*/ 0, 
		/*lifeRange =*/ {min:0, max:11}, 
		/*lifeRate =*/ 328, 
		/*deathRange =*/ {min:0, max:1}, 
		/*deathRate =*/  512);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	const EXPLOSION_COUNT = 7;
	const explosions = [];
	const bosses = [];
	setInterval(this.spawnBosses, 5000);
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
    this.updateBosses = function(deltaTime) {
		spawnRate += deltaTime;
    
		if(bosses.length < BOSS_COUNT) {

			if((100 * Math.random()) < 100) {//1 in 20 chance the next boss should spawn
				if(spawnRate >= timeSinceSpawn) {
      				newBoss = new EnemyBullet(EntityType.MiniMiniBoss1, {x: this.position.x , y: this.collisionBody.center.y - 10}, {x: xVel, y:yVel});
	  				scene.addEntity(newBoss, true);
     			    spawnRate = 0;
    }
				const newBoss = new AnimatedSprite(MiniMiniBoss1Sheet, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
                newBoss.deltaXPos = (0.5 * this.size.width) - (this.size.width * Math.random());
                newBoss.deltaYPos = (0.5 * this.size.height) - (this.size.height * Math.random());
				
				newBoss.isDying = false;
				newBoss.wasBorn = true;
				
				bosses.push(newBoss);
			}
		}
		
		for(let i = 0; i < bosses.length; i++) {
			bosses[i].update(deltaTime);
		}
	};
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
            scene.levelComplete();
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
				this.currentState = state.entrance; 

		            currentBackgroundMusic.play();
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
						this.position.x += (this.vel.x * SIM_STEP / 1000);
						this.position.y += (this.vel.y * SIM_STEP / 1000);
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
				//scene.removeEntity(this, false);
				//return;
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
		//run current state
		this.currentState();
		this.ticksInState += -1;
		this.timeSinceLastDip += -1;
	};

	this.currentState = function(){}
	var state = {}
	state.entrance = function(){
		if(this.ticksInState == 1){
			
			this.vel.x = -300
			this.vel.y = 0;
		}
		
		if(this.position.x < 700){
			this.bulletsLeft = 100;
		}
		if(this.position.x < 650){
			this.bulletsLeft = 100;
		}
		if(this.position.x < 640){
			this.bulletsLeft = 100;
		}
		if(this.position.x < 500){
			this.vel.x = 0
			this.vel.y = 0;
			this.targetPos.y = this.position.y
			
			//this.currentState = state.phase1;
			this.changeState(state.pewpew);

		}
	}

	this.changeState = function(newState){
		this.ticksInState = 0
		this.currentState = newState;
	}

	this.oldDistance = 0
	state.phase1 = function(){
		if(this.ticksInState == 1){
			this.bulletsLeft = 15;
			this.targetPos.y = this.position.y
		}
		if(!sprite.isDying) {//Don't allow enemies to shoot when they are in the process of dying
			const firingChance = Math.floor(100 * Math.random());
		
			if(Math.abs(this.position.y - this.targetPos.y) > this.oldDistance){
				console.warn("going wrong way")
			}
			this.oldDistance = Math.abs(this.position.y - this.targetPos.y)
			if(Math.abs(this.position.y - this.targetPos.y) < 5){
				this.targetPos.y = Math.floor(400 * Math.random() + 200);

				if(this.targetPos.y > this.position.y){
					this.vel.y = 20
				} else {
					this.vel.y = -20
				}
			}

			if(this.bulletsLeft > 0 && this.timeSinceLastFire > 10){
				//fireBullet
				xVel = -130;
				yVel = (this.bulletsLeft -5) * 20;
				newBullet = new EnemyBullet(EntityType.EnemyBullet6, {x: this.position.x + 10, y: this.collisionBody.center.y - 20}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
				this.bulletsLeft -= 1;
				this.timeSinceLastFire = 0
			}

			if(this.bulletsLeft == 0 && firingChance < difficulty || this.timeSinceLastFire > 3000) {
				let yVel = -130;

				this.bulletsLeft = 10;
	
				
				let xVel = 20*Math.cos(this.position.x * 0.2);
				const newBullet = new EnemyBullet(EntityType.EnemyBullet7, {x: this.position.x + 10, y: this.collisionBody.center.y - 20}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
			}
			if(this.ticksInState > 600){
				this.changeState(state.pewpew)
				return;
			}
			if(this.timeSinceLastDip > 1000 && this.hitPoints < 1500){
				this.changeState(state.dip)
			}
		}

	}
	state.pewpew = function(){
		if(this.ticksInState == 1){
			this.bulletsLeft = 100;
			this.vel.x = 0
			this.vel.y = 0;
		}

		if(this.bulletsLeft > 0 && this.timeSinceLastFire > 25){
			//fireBullet
			xVel = -530;
			yVel = 1
			newBullet = new EnemyBullet(EntityType.EnemyBullet5, {x: this.position.x + 10, y: this.collisionBody.center.y - 20}, {x: xVel, y:yVel});
			scene.addEntity(newBullet, false);
			this.bulletsLeft -= 1;
			this.timeSinceLastFire = 0
		}

		if(this.bulletsLeft == 0) {
			this.changeState(state.phase1)
			//this.changeState(state.dip)
		}
	}

	state.dip = function(){
		if(this.ticksInState == 1){
			this.vel.x = -50

		}
		this.timeSinceLastDip = 0;
		if(this.vel.x < 450){
			this.vel.x -= 10
		}
		if(this.vel.y > 1){
			this.vel.y -= 3;
		} else {
			this.vel.y += 3;
		}
		if(this.position.x < -600){
			this.vel.y = 0
			this.vel.x = 0
			if(this.ticksInState > 300){
				this.position.x = 1000;
				this.changeState(state.entrance)
			}
		}
	}

	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		if((this.position.x < GameField.x - this.size.width) || 
		   (this.position.x > GameField.right) ||
		   (this.position.y < GameField.y - this.size.height) ||
		   (this.position.y > GameField.bottom)) {
			   return;
		}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
		if(!sprite.isDying) {
			this.collisionBody.draw();
	
		} else {
			this.drawExplosions();
		}
	};
	
	this.updateExplosions = function(deltaTime) {
		if(explosions.length < EXPLOSION_COUNT) {
			if((100 * Math.random()) < 25) {//1 in 20 chance the next explosion should spawn
				const newExplosion = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
                newExplosion.deltaXPos = (0.5 * this.size.width) - (this.size.width * Math.random());
                newExplosion.deltaYPos = (0.5 * this.size.height) - (this.size.height * Math.random());
				
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
            explosions[i].drawAt((this.position.x + explosions[i].deltaXPos), (this.position.y + explosions[i].deltaYPos), this.size.width * 2, this.size.height * 2);
		}
	};
	
	this.spawnBosses = function() {
		for(let i = 0; i < bosses.length; i++) {
            bosses[i].drawAt((this.position.x + bosses[i].deltaXPos), (this.position.y + bosses[i].deltaYPos), this.size.width * 2, this.size.height * 2);
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
				(entityType === EntityType.RagnarokCapsule) ||
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
