//LevelData
const LevelData = [
	{//levelIndex = 0
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
			const enemies = [];

			const firstGroup = new EnemyGroup();
			
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 0, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 550, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1100, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1650, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 2200, 0, 1)));
			
			const secondGroup = new EnemyGroup();

			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 300, 0)));
			
			const thirdGroup = new EnemyGroup();
			
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 600, 0)));
			
			const fourthGroup = new EnemyGroup();

			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 0, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 550, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1100, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1650, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 2200, 900, 1)));
			
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: canvas.height / 2 - 90}, 50, 2));
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: canvas.height / 2 - 90}, 600, 2));
			
			return world;
		},
		checkpointPositions:[0, 600, 1200]
	},
	{//levelIndex = 1
		clearColor: "#010119",//placeholder value
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
			
		},
		initializeTerrain: function() {
			
		},
		checkpointPositions:[0, 600, 1200]//placeholder values
	}
];