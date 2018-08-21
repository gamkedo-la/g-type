//LevelData
const LevelData = [
	{//levelIndex = 0
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
			const firstGroup = new EnemyGroup();
			const enemies = [];
			
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 0, 0)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 550, 0)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 1100, 0)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 1650, 0)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 2200, 0)));
			
			const secondGroup = new EnemyGroup();

			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 300)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 300)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 300)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 300)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 300)));
			
			return enemies;
		}
	},
	{//levelIndex = 1
		
	}
];