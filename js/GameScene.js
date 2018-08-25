//Game Scene
function GameScene(levelIndex) {
	const data = LevelData[levelIndex];
	this.worldPos = 0;
	this.gameIsOver = false;
	const starfield = new Starfield();
	const player = new Player(data.getPlayerSpawn());
	const collisionManager = new CollisionManager(player);
	const gameEntities = new Set();
	const enemyBullets = new Set();
	
	const enemies = data.initializeEnemies();
	
	for(let i = 0; i < enemies.length; i++) {
		gameEntities.add(enemies[i]);
		collisionManager.addEntity(enemies[i], false);
	}
		
	const terrain = data.initializeTerrain();
	for(let i = 0; i < terrain.length; i++) {
		gameEntities.add(terrain[i]);
		collisionManager.addEntity(terrain[i], false);
	}
	
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
	}
	
	this.removePlayer = function() {
		if(remainingLives < 1) {
			this.gameIsOver = true;
		} else {
			remainingLives--;
			player.reset();
		}
	}
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			collisionManager.removeEntity(entityToRemove);
			if(entityToRemove.type == EntityType.EnemyBullet) {
				enemyBullets.delete(entityToRemove);
			} else {
				gameEntities.delete(entityToRemove);
			}
		}
	}
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			collisionManager.addEntity(entityToAdd);
			if(entityToAdd.type == EntityType.EnemyBullet) {
				enemyBullets.add(entityToAdd);
			} else {
				gameEntities.add(entityToAdd);
			}
		}		
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
}