//LevelData
const LevelData = [
	{//levelIndex = 0
		clearColor:"#010119",
		initializeEnemies: function() {
			const firstGroup = new EnemyGroup();
			const enemies = [];
			
			enemies.push(firstGroup.add(new FlyingEnemy1({x: 3 * canvas.width / 4, y: 450}, -80, MovementPattern.Sine)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: 2 * canvas.width / 3, y: 300}, -80, MovementPattern.Sine)));
			
			return enemies;
		}
	},
	{//levelIndex = 1
		
	}
];