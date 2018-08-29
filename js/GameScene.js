//Game Scene
function GameScene(levelIndex) {
	const data = LevelData[levelIndex];
	this.worldPos = 0;
	this.shaking = false;
	const MAX_SHAKES = 10;
	this.remainingShakes = 0;
	this.shakeMagnitude = 0;
	this.gameIsOver = false;
	const starfield = new Starfield();
	const player = new Player(data.getPlayerSpawn());
	const collisionManager = new CollisionManager(player);
	let collisionBodiesToRemove = [];
	const gameEntities = new Set();
	const enemyBullets = new Set();
	let score = 0;
	
	const populateWorld = function(worldPos) {
		const enemies = data.initializeEnemies();
		
		for(let i = 0; i < enemies.length; i++) {
			const thisEnemy = enemies[i];
			
			thisEnemy.respawn(worldPos);
			
			gameEntities.add(thisEnemy);
			collisionManager.addEntity(thisEnemy, false);
		}
		
		const terrain = data.initializeTerrain();
		
		for(let i = 0; i < terrain.length; i++) {
			const thisTerrain = terrain[i];
			
			thisTerrain.respawn(worldPos);
			
			gameEntities.add(thisTerrain);
			collisionManager.addEntity(thisTerrain, false);
		}
	}
	
	populateWorld(0);//0 = start at the beginning
	
	this.update = function(deltaTime) {
		this.worldPos += worldSpeed;
		starfield.update(deltaTime, this.worldPos);
		player.update(deltaTime, this.worldPos);
		
	    for(let bullet of enemyBullets) {
		    bullet.update(deltaTime, this.worldPos);
	    }
		
		for(let entity of gameEntities) {
			entity.update(deltaTime, this.worldPos, {x:player.position.x, y:player.position.y});
		}
		
		const collisions = collisionManager.doCollisionChecks();
		
		for(let i = 0; i < collisionBodiesToRemove.length; i++) {
			collisionManager.removeEntity(collisionBodiesToRemove[i]);
		}
		
		collisionBodiesToRemove = [];
		
		if(this.shaking) {this.screenShake();}
	}
	
	this.reset = function() {
		let newWorldPos = 0;
		let i = 0;
		while(this.worldPos > data.checkpointPositions[i]) {
			newWorldPos = data.checkpointPositions[i];
			i++;
			if(i == data.checkpointPositions.length) {break;}
		}
		
		this.gameIsOver = false;
        this.score = 0;
        this.worldPos = newWorldPos;
        player.reset();
        
        gameEntities.clear();
        enemyBullets.clear();
        collisionManager.clearWorldAndBullets();
        
        populateWorld(newWorldPos);
	}
	
	this.setWorldPos = function(newWorldPos) {
		this.worldPos = newWorldPos;
	}
	
	this.draw = function() {
	    drawRect(0,0, canvas.width, canvas.height, data.clearColor);//Need to wipe the canvas clean each frame - eventually use a background image/video
	    
	    starfield.draw();
	    
	    for(let bullet of enemyBullets) {
		    bullet.draw();
	    }
	    
		for(let entity of gameEntities) {
			entity.draw();
		}
	    
	    player.draw();
	    
//	    score.draw();//TODO: implement this
	}
	
	this.collectedCapsule = function() {
		console.log("Update UI to show that the player collected another capsule");
	}
	
	this.removePlayer = function() {
		if(remainingLives < 1) {
			this.gameIsOver = true;
			canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		} else {
			remainingLives--;
			player.reset();
		}
	}
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			if(entityToRemove.collisionBody != null) {
				collisionManager.removeEntity(entityToRemove);
			}
			if(entityToRemove.type == EntityType.EnemyBullet) {
				enemyBullets.delete(entityToRemove);
			} else {
				gameEntities.delete(entityToRemove);
			}
		}
	}
	
	this.removeCollisions = function(entityToRemove) {
		collisionBodiesToRemove.push(entityToRemove);
	}
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			if(entityToAdd.collisionBody != null) {
				collisionManager.addEntity(entityToAdd);
			}
			
			if(entityToAdd.type == EntityType.EnemyBullet) {
				enemyBullets.add(entityToAdd);
			} else {
				gameEntities.add(entityToAdd);
			}
		}		
	}
	
	this.displayScore = function(entity) {
		score += entity.score;
		const newScore = new TextEntity(entity.score.toString(), Fonts.CreditsText, Color.White, {x:entity.position.x, y:entity.position.y}, 512);
		this.addEntity(newScore, false);
	}
	
	const checkpointForWorldPos = function(worldPos) {
		const checkpoints = data.checkpointPositions;
		for(let i = (checkpoints.length - 1); i >= 0; i--) {
			if(worldPos > checkpoints[i]) {
				return checkpoints[i];
			}
		}
		
		return 0;
	}
	
	this.shouldShake = function(magnitude) {
		this.shaking = true;
		this.remainingShakes = MAX_SHAKES;
		this.shakeMagnitude = magnitude;
	}
	
	this.screenShake = function() {
		this.remainingShakes--;
		if(this.remainingShakes <= 0) {
			this.remainingShakes = 0;
			this.shaking = false;
			this.shakeMagnitude = 0;
			canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		}
		
		const horizontal = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
		const vertical = Math.floor((this.shakeMagnitude) * Math.random() - this.shakeMagnitude / 2);
		
		canvasContext.setTransform(1, 0, 0, 1, horizontal, vertical);
		
		this.shakeMagnitude *= 0.9;
	}
	
	this.endShake = function() {
		this.remainingShakes = 0;
		this.screenShake();
	}
}