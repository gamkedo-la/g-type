const EnemyType = {
	Flying1:"flying1",
}

const MovementPattern = {
	None:"none",
	Sine:"sine",
}

//Enemy Grouping
function EnemyGroup() {
	this.enemies = [];
	this.hasPowerUp = true;
	
	this.add = function(newEnemy) {
		this.enemies.push(newEnemy);
		
		newEnemy.group = this;
		
		return newEnemy;
	}
	
	this.remove = function(enemyToRemove) {
		const indexToRemove = this.enemies.indexOf(enemyToRemove);
		this.enemies.splice(indexToRemove, 1);
		
		if((this.enemies.length == 0) && (this.hasPowerUp)) {
			this.hasPowerUp = false;
			
			const newPowerUp = new PowerUp({x:enemyToRemove.position.x, y:enemyToRemove.position.y});
			scene.addEntity(newPowerUp, false);
		}
	}	
}