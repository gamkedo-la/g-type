//EndgameScene
function EndgameScene(player) {
	this.type = "EndgameScene";
	this.shaking = false;
	const MAX_SHAKES = 10;
	this.remainingShakes = 0;
	this.shakeMagnitude = 0;
	const collisionManager = new CollisionManager(player);
	
	this.update = function(deltaTime, scrollPos) {
		player.update(deltaTime, 0);
		collisionManager.doCollisionChecks();
	};
	
	this.draw = function() {
		player.draw();
	};
	
	this.addEntity = function(entityToAdd, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.addPlayerBullet(entityToAdd);
		} else {
			if(entityToAdd.collisionBody != null) {
				collisionManager.addEntity(entityToAdd);
			}
		}		
	};
	
	this.removeEntity = function(entityToRemove, isPlayerBullet) {
		if(isPlayerBullet) {
			collisionManager.removePlayerBullet(entityToRemove);
		} else {
			if(entityToRemove.collisionBody != null) {
				collisionManager.removeEntity(entityToRemove);
			}
		}
	};
	
	this.removeCollisions = function(entityToRemove, isPlayerBullet) {
		this.removeEntity(entityToRemove, isPlayerBullet);
	};
	
	this.removePlayer = function() {
		player.reset();
		const newX = (GameField.midX * Math.random());
		const newY = (GameField.height / 4) + (GameField.midY * Math.random());
		player.position = {x:newX, y:newY};
	};
	
	this.shouldShake = function(magnitude) {
		this.shaking = true;
		this.remainingShakes = MAX_SHAKES;
		this.shakeMagnitude = magnitude;
	};
	
	this.collectedCapsule = function() {
		//play collected capsule sound
	};
}