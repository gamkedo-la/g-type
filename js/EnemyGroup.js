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

const PathType = {
	None:"none",
	Sine:"sine",
	Points:"points"
}

function EnemyPath(type = PathType.None, start = {x:0, y:0}, speed = 0, points = [], timeOffset = 0) {
	let elapsedTime = 0;
	this.nextPoint = function(deltaTime) {
		elapsedTime += deltaTime;
		if(elapsedTime >= timeOffset) {
			if(type == PathType.None) {
				return {};
			} else if(type == PathType.Sine) {
				return {x:speed * deltaTime / 1000, y:0.0025 * canvas.height * Math.sin((elapsedTime - timeOffset) / 500)};
			} else if(type == PathType.Points) {
				
			}
		}
	}
}