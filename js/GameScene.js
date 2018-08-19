//Game Scene
function GameScene(levelIndex) {
	const data = LevelData[levelIndex];
	this.gameIsOver = false;
	const starfield = new Starfield();
	const player = new Player({x:canvas.width / 2, y:canvas.height / 2});
	const collisionManager = new CollisionManager(player);
	const gameEntities = new Set();
	
	const enemies = data.initializeEnemies();
	
	for(let i = 0; i < enemies.length; i++) {
		gameEntities.add(enemies[i]);
		collisionManager.addEntity(enemies[i], false);
	}	
	
	const testBullet = new EnemyBullet({x: canvas.width / 2, y: canvas.height / 3}, {x: 1, y: 5});
	gameEntities.add(testBullet);
	collisionManager.addEntity(testBullet, false);
	
	this.update = function(deltaTime) {
		starfield.update(deltaTime);
		player.update(deltaTime);
		
		for(let entity of gameEntities) {
			entity.update(deltaTime);
		}
		
		const collisions = collisionManager.doCollisionChecks();
	}
	
	this.draw = function() {
	    drawRect(0,0, canvas.width, canvas.height, data.clearColor);//Need to wipe the canvas clean each frame - eventually use a background image/video
	    
	    starfield.draw();
	    
		for(let entity of gameEntities) {
			entity.draw();
		}
	    
	    player.draw();
	}
	
	this.removePlayer = function() {
//		this.gameIsOver = true;
	}
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			collisionManager.removeEntity(entityToRemove);
			gameEntities.delete(entityToRemove);
		}
	}
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			collisionManager.addEntity(entityToAdd);
			gameEntities.add(entityToAdd);
		}		
	}	
}