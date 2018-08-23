//LevelData
const LevelData = [
	{//levelIndex = 0
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
			const firstGroup = new EnemyGroup();
			const enemies = [];
			
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 0, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 550, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 1100, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 1650, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 150}, -100, PathType.Sine, 2200, 0, 1)));
			
			const secondGroup = new EnemyGroup();

			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 200, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 200, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 200, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 200, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 200, 0)));
			
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: 150}, 150, 2));
			
			return world;
		},
		checkpointPositions:[0, 600, 1200]
	},
	{//levelIndex = 1
		
	}
];