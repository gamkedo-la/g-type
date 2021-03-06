const LevelData = [
   {
    clearColor:"#010119",
    getBkgdColorLookup: function() {return backgroundColorLookup;},
    getBkgdStars: function() {return backgroundStars;},
    getBkgdParallaxLayer: function() {return backgroundParallaxLayer1;},
    getBkgdOffset: function() {return 50;},//50 is magic number based on background image
    getForegroundParallaxLayer: function() {return foregroundParallaxLayer1;},
    getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY};},

    initializeEnemies: function() {return initializeEnemies(TileMaps.levelOneWIP.layers[2].objects);},

    initializeTerrain: function() {return initializeTerrain(TileMaps.levelOneWIP.layers[1].objects);},

    initializeDebris: function() {return initializeDebris();},
    checkpointPositions:[0, 600, 1200]
  },
  {
        clearColor:"#010119",
        getBkgdColorLookup: function() {return backgroundColorLookup2;},
        getBkgdStars: function() {return backgroundStars;},
        getBkgdParallaxLayer: function() {return backgroundParallaxLayer2;},
        getBkgdOffset: function() {return 238;},//238 is magic number based on background image
        getForegroundParallaxLayer: function() {return foregroundParallaxLayer2;},
    getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY};},

        initializeEnemies: function() {return initializeEnemies(TileMaps.levelTwoWIP.layers[2].objects);},

        initializeTerrain: function() {return initializeTerrain(TileMaps.levelTwoWIP.layers[1].objects);},

        initializeDebris: function() {return initializeDebris();},
    checkpointPositions:[0, 600, 1200]
  },
  {
      clearColor:"#010119",
      getBkgdColorLookup: function() {return backgroundColorLookup3;},
      getBkgdStars: function() {return backgroundStars;},
      getBkgdParallaxLayer: function() {return backgroundParallaxLayer3;},
      getBkgdOffset: function() {return 240;},
      getForegroundParallaxLayer: function() {return foregroundParallaxLayer3;},
    getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY};},

      initializeEnemies: function() {return initializeEnemies(TileMaps.levelThreeWIP.layers[2].objects);},

      initializeTerrain: function() {return initializeTerrain(TileMaps.levelThreeWIP.layers[1].objects);},

      initializeDebris: function() {return initializeDebris();},
    checkpointPositions:[0, 600, 1200]
  },
  {
        clearColor:"#010119",
        getBkgdColorLookup: function() {return backgroundColorLookup;},
        getBkgdStars: function() {return backgroundStars;},
        getBkgdParallaxLayer: function() {return backgroundParallaxLayer1;},
        getBkgdOffset: function() {return 50;},//50 is magic number based on background image
        getForegroundParallaxLayer: function() {return foregroundParallaxLayer1;},
    getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY};},

        initializeEnemies: function() {return initializeEnemies(TileMaps.warpZoneWIP.layers[2].objects);},

        initializeTerrain: function() {return initializeTerrain(TileMaps.warpZoneWIP.layers[1].objects);},

        initializeDebris: function() {return initializeDebris();},
    checkpointPositions:[0, 600, 1200]
  }/*,
  {
        clearColor:"#010119",
        getBkgdColorLookup: function() {return backgroundColorLookup;},
        getBkgdStars: function() {return backgroundStars;},
        getBkgdParallaxLayer: function() {return backgroundParallaxLayer1;},
        getBkgdOffset: function() {return 50;},//50 is magic number based on background image
        getForegroundParallaxLayer: function() {return foregroundParallaxLayer1;},
    getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY};},

        initializeEnemies: function() {return initializeEnemies(TileMaps.levelOneH2.layers[2].objects);},

        initializeTerrain: function() {return initializeTerrain(TileMaps.levelOneH2.layers[1].objects);},

        initializeDebris: function() {return initializeDebris();},
    checkpointPositions:[0, 600, 1200]
  },*/
];

function getPath(pathsObject, entity) {
	let entityGroupValue = entity.properties[0].value;
	let matchingPath = pathsObject.find((path) => {
		return path.properties[0].value == entityGroupValue;
    });

    if(entity.type === EntityType.Rock01) {
//	    console.log("Matching Path: " + matchingPath);
    }

    if(matchingPath === undefined) {return null;};

	return JSON.parse(JSON.stringify(matchingPath));
}

function initializeEnemies(enemyData) {
    const enemies = [];
    let offRight = GameField.right + 50; //
    let enemiesData = enemyData;//TileMaps.levelOneH.layers[2].objects;
    let enemyPaths = enemiesData.filter((obj) => {return obj.type === "path"});
//    let colliderPaths = enemiesData.filter((obj) => {return obj.type === "freeCollider"});

    //obj.properties[0] is the Group, exists on all but is zero by default
    let enemiesInGroups = enemiesData.filter((obj) => {
                                             if(obj.properties.length === 0){
                                                obj.properties[0] = {value:  0}
                                             }
                                                return obj.properties[0].value > 0
                                             });

    //we need an empty at the beginning for the following reduce
    enemiesInGroups.unshift([]);
    //which sorts the enemies into group arrays if their group property is > 1.
    let enemyGroups = enemiesInGroups.reduce((group, obj) => {
                                                let groupNumber = obj.properties[0].value;
                                                if(!group[groupNumber]) { group[groupNumber] = []; }
                                                group[groupNumber].push(obj);
                                                return group;
                                                });

    //enemyGroups
    enemyGroups.forEach((group) => {
    let currentGroup = new EnemyGroup();
    group.forEach((obj) => {
      switch(obj.type) {
          case EntityType.FlyingEnemy1:
              //tiled-editor object origin is bottom-left, game engine sprite origin is top-left
              enemies.push(currentGroup.add(new FlyingEnemy1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value)));
              break;
          case EntityType.FlyingEnemy2:
              enemies.push(currentGroup.add(new FlyingEnemy2({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x,obj.properties[2].value, getPath(enemyPaths, obj))));
              break;
          case EntityType.FlyingEnemy3:
              enemies.push(currentGroup.add(new FlyingEnemy3({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, obj.properties[2].value, obj.x,obj.properties[1].value, getPath(enemyPaths, obj))));
              break;
          case EntityType.GroundEnemy1:
              enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[2].value, obj.x, obj.properties[1].value)));
              break;
          case EntityType.GroundEnemy2:
              enemies.push(currentGroup.add(new GroundEnemy2({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value, getPath(enemyPaths, obj))));
              break;
          case EntityType.GroundEnemy3:
              enemies.push(currentGroup.add(new GroundEnemy3({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x, obj.properties[1].value)));
              break;
          case EntityType.LaunchBay:
          	  const aBay = new LaunchBay({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x);
          	  if(!obj.visible) {aBay.isVisible = false;}
              enemies.push(currentGroup.add(aBay));
              break;
		  case EntityType.MiniBoss1:
              enemies.push(currentGroup.add(new MiniBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[4].value, obj.properties[3].value, 0, obj.x, obj.properties[1].value, obj.properties[2].value, getPath(enemyPaths, obj))));
              break;
          case EntityType.MiniMiniBoss1:
              enemies.push(currentGroup.add(new MiniMiniBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value, getPath(enemyPaths, obj))));
              break;		  
          case EntityType.Level2Boss:
              enemies.push(currentGroup.add(new Level2Boss({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x)));
              break;
          case EntityType.EyeBoss1:
              enemies.push(currentGroup.add(new EyeBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, PathType.None, 0, obj.x, obj.properties[1].value, getPath(enemyPaths, obj))));
              break;
          case "path":
              //do nothing
              break;
          default:
              console.error("can not find grouped enemy type: " + obj.type);
              break;
      }
                });
        });
        
    let noGroupsEnemies = enemiesData.filter((obj) => {return obj.properties[0].value == 0});
    noGroupsEnemies.forEach((obj) => {
        switch(obj.type) {
            case EntityType.FlyingEnemy1:
            //tiled-editor object origin is bottom-left, game engine sprite origin is top-left
                    enemies.push(new FlyingEnemy1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value));
                break;
            case EntityType.FlyingEnemy2:
                enemies.push(new FlyingEnemy2({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value, getPath(enemyPaths, obj)));
                break;
            case EntityType.FlyingEnemy3:
                enemies.push(new FlyingEnemy3({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, obj.properties[2].value, obj.x, obj.properties[1].value, getPath(enemyPaths, obj)));
                break;
            case EntityType.GroundEnemy1:
                enemies.push(new GroundEnemy1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[2].value, obj.x, obj.properties[1].value))
                break;
            case EntityType.GroundEnemy2:
                enemies.push(new GroundEnemy2({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value, getPath(enemyPaths, obj)));
                break;
            case EntityType.GroundEnemy3:
                enemies.push(new GroundEnemy3({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x, obj.properties[1].value));
                break;
            case EntityType.MiniBoss1:
                enemies.push(new MiniBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[4].value, obj.properties[3].value, 0, obj.x, obj.properties[1].value, obj.properties[2].value));
                break;
            case EntityType.EyeBoss1:
                enemies.push(new EyeBoss1({x:offRight + 250, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, obj.properties[2].value, 0, obj.x, obj.properties[1].value));
                break;
            case EntityType.AlienBoss1:
                enemies.push(new AlienBoss1({x:offRight + 250, y:GameField.y + obj.y - obj.height}, -20, PathType.None, 25, obj.x, 1));
                break;
           case EntityType.MaskBoss1:
                enemies.push(new MaskBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, obj.properties[2].value, 0, obj.x, obj.properties[1].value));
                break;
           case EntityType.MiniMiniBoss1:
                enemies.push(new MiniMiniBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[1].value, obj.properties[3].value, obj.x, obj.properties[2].value, getPath(enemyPaths, obj)));
                break;
            case EntityType.CargoBoss:
                enemies.push(new CargoBoss({x:offRight, y:GameField.y + obj.y - obj.height}, -20, PathType.None, 25, obj.x, 1));
                break;
            case EntityType.FreeCollider:
            	enemies.push(new FreeCollider(obj.properties[1].value, {x:offRight, y:GameField.y + obj.y - obj.height}, obj.x, JSON.parse(JSON.stringify(obj))));
            	break;
            case EntityType.EyeBoss1:
              enemies.push(new EyeBoss1({x:offRight, y:GameField.y + obj.y - obj.height}, obj.properties[3].value, PathType.None, 0, obj.x, obj.properties[1].value));
              break;
            default:
                console.error("can not find ungrouped enemy type: " + obj.type);
                break;
        }
    });

    return enemies;
}

function initializeTerrain(terrainData) {
    const world = [];
	let offRight = GameField.right + 50;
	window.warpCapsules = terrainData.filter(obj => {
											if(typeof obj.properties === "undefined"){
												obj.properties = [];
		  										obj.properties[0] = {value:  0}
											}
		   									return ((obj.properties[0].value > 0) && (obj.type === 'capsule1'));
										});
	const levelTerrain = terrainData.filter((obj) => {return obj.properties[0].value === 0});

    levelTerrain.forEach(obj => {
         switch(obj.type) {
            case EntityType.Bubble:
                world.push(new BubbleEntity(EntityType.Bubble, {x:offRight, y:GameField.y + obj.y - obj.height}, obj.x, 1, 1024));
                break;
            case EntityType.Capsule1:
                 world.push(new Capsule({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x));
                 break;
            case EntityType.RagnarokCapsule:
                 world.push(new RagnarokCapsule({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x));
                 break;
            default:
            	let timeDelay = 0;
            	let childrenCount = 0;
            	if(obj.properties[1] != undefined) {
	            	timeDelay = obj.properties[2].value;
	            	childrenCount = obj.properties[1].value;
            	}

                 world.push(new TerrainEntity(obj.type, {x:offRight, y:GameField.y + obj.y - obj.height}, obj.x, 1, 0, timeDelay, childrenCount));
                 break;
         }

	});

	window.warpGroup = new CapsuleGroup();
	warpCapsules.forEach(obj => {
		world.push(warpGroup.add(new Capsule({x:offRight, y:GameField.y + obj.y - obj.height}, obj.x)));
	});

	return world;
}

function initializeDebris() {
    const debris = [];
    return debris;
}


//Everything below is old, I'm just not ready to delete it completely yet.

/*    {//levelIndex = 0
 clearColor:"#010119",
 getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
 initializeEnemies: function() {
 const enemies = [];

 const firstGroup = new EnemyGroup();

 enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 0, 0, 1)));
 enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 600, 0, 1)));
 enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 1200, 0, 1)));
 enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 1800, 0, 1)));
 enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 2400, 0, 1)));

 const secondGroup = new EnemyGroup();

 enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 0, 500, 0)));
 enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 550, 500, 0)));
 enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1100, 500, 0)));
 enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1650, 500, 0)));
 enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 2200, 500, 0)));

 const thirdGroup = new EnemyGroup();

 enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 0, 800, 0)));
 enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 550, 800, 0)));
 enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1100, 800, 0)));
 enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1650, 800, 0)));
 enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 2200, 800, 0)));

 const fourthGroup = new EnemyGroup();

 enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 0, 1100, 1)));
 enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 550, 1100, 1)));
 enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 1100, 1100, 1)));
 enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 1650, 1100, 1)));
 enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 2200, 1100, 1)));

 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: GameField.midY - 52}, Math.PI/4, 0, PathType.None, 0, 120, 5));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: GameField.midY + 48}, 3*Math.PI/4, 0, PathType.None, 0, 120, 5));

 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, Math.PI/4, 0, PathType.None, 0, 1754, 15));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, -Math.PI/4, 0, PathType.None, 0, 1844, 15));

 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 250}, 3 * Math.PI/4, 0, PathType.None, 0, 3093, 15));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 252}, -3 * Math.PI/4, 0, PathType.None, 0, 3190, 15));

 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 555}, Math.PI/4, 0, PathType.None, 0, 3718, 15));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, -Math.PI/4, 0, PathType.None, 0, 3809, 15));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 656}, 3 * Math.PI/4, 0, PathType.None, 0, 3719, 15));

 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 506}, Math.PI/4, 0, PathType.None, 0, 4116, 15));
 enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 508}, -Math.PI/4, 0, PathType.None, 0, 4210, 15));

 enemies.push(new MiniBoss1({x: GameField.right, y: GameField.midY}, -100, PathType.Loop, 0, 5000, 100))
 enemies.push(new CargoBoss({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 0, 0, 1));

 return enemies;
 },
 initializeTerrain: function() {
 const world = [];
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 0));
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 100));
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 200));
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 300));
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 1000));
 world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 1100));

 world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: GameField.midY - 60}, 100, 2));
 world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: GameField.right + 50, y: GameField.midY - 120}, 600, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 1350, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: GameField.y + 5 * GameField.height / 6}, 850, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: GameField.y + 3 * GameField.height / 5 + 50}, 950, 2));

 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 547}, 1604, 2));
 world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 547}, 1734, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 169}, 1737, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 248}, 1750, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 291}, 1878, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 635}, 1899, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 228}, 2055, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 298}, 2202, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 160}, 2223, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 433}, 2339, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 629}, 2356, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 309}, 2409, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 185}, 2509, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 337}, 2523, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 429}, 2662, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 313}, 2663, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 205}, 2789, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 388}, 2812, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 572}, 2812, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 653}, 2932, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 414}, 2936, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 239}, 2939, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 377}, 3056, 2));
 world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 147}, 3084, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 756}, 3111, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 631}, 3234, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 576}, 3237, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 491}, 3256, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 281}, 3397, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 597}, 3399, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 405}, 3403, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 485}, 3525, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 554}, 3541, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 395}, 3567, 2));
 world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 547}, 3700, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 296}, 3716, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 234}, 3851, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 394}, 3979, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 458}, 3929, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 237}, 4010, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 543}, 4012, 2));
 world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 497}, 4100, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 682}, 4148, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 533}, 4286, 2));
 world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 120}, 4497, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 422}, 4321, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 306}, 4400, 2));
 world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 534}, 4496, 2));
 world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 623}, 4527, 2));

 const delta = 45;
 for(let i = 0; i < 30; i++) {
 let xPos = delta * Math.floor(i % 6);
 let yPos = delta * Math.floor(i / 6);

 let thisEntity;
 if(i === 9) {
 thisEntity = new Capsule({x: GameField.right + (50 + xPos), y: GameField.midY + (yPos - 112)}, 850);
 } else {
 thisEntity = new BubbleEntity(EntityType.Bubble, {x: GameField.right + (50 + xPos), y: GameField.midY + (yPos - 112)}, 850, 1, 3072);
 thisEntity.setInitialFrame(i % 5);
 }

 world.push(thisEntity);
 }

 return world;
 },
 initializeDebris: function() {
 const debris = [];
 let sprite = new AnimatedSprite(debrisSheet, 1, 68, 77, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:0, max:0}, 0);
 debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.y - 30}, 50, 1.5, 2.0, -2));
 debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.bottom - 75}, 55, 1.5, 2.0, 2.2));
 debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.bottom - 60}, 250, 1.5, 2.0, 1.3));

 return debris;
 },
 checkpointPositions:[0, 600, 1200]
 },
 {//levelIndex = 1
 clearColor: "#010119",//placeholder value
 getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
 initializeEnemies: function() {
 },
 initializeTerrain: function() {
 },
 initializeDebris: function() {
 },
 checkpointPositions:[0, 600, 1200]//placeholder values
 },
 {//levelIndex = 2
 clearColor: "#010119",//placeholder value
 getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
 initializeEnemies: function() {
 },
 initializeTerrain: function() {
 },
 initializeDebris: function() {
 },
 checkpointPositions:[0, 600, 1200]//placeholder values
 }*/
