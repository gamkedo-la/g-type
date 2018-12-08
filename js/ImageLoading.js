//Graphics Common
function drawRect(x,y,w,h,color) {
	canvasContext.save();
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,w,h);
	canvasContext.restore();
}

function colorText(showWords, textX, textY, fillColor, fontface, textAlign = 'left', opacity = 1) {
  canvasContext.save();
  canvasContext.textAlign = textAlign;
  canvasContext.font = fontface;
  canvasContext.globalAlpha = opacity;
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
  canvasContext.restore();
}

function getFontWeight(font) {
  canvasContext.save();
  canvasContext.font = this.buttonFont;
  
  var weight = parseInt(font.match(/\d+/)[0]); //regex match the first string of digits
  
  canvasContext.restore();
  
  return weight;
}

function getTextWidth(txt, font) {
  canvasContext.save();
  canvasContext.font = font;
  
  var width = canvasContext.measureText(txt).width;
  
  canvasContext.restore();
  
  return width;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function wrapNumber(x, m) {
	const r = x % m;
	return (r < 0) ? r + m : r;
}

//Image Loading
//Logo
const titleLogo = document.createElement("img");

//UI
const gameFrame1 = document.createElement("img");
const gameFrame2 = document.createElement("img");
const lightedPowerUpUI = document.createElement("img");
const darkPowerUpUI = document.createElement("img");
const lightedSpacerUI = document.createElement("img");
const darkSpacerUI = document.createElement("img");
const fontImage = document.createElement("img");
const darkFontImage = document.createElement("img");
const doubleShotUI = document.createElement("img");
const tripleShotUI = document.createElement("img");
const livesUI = document.createElement("img");
const lightGhostUI = document.createElement("img");
const darkGhostUI = document.createElement("img");
const lightForceUI = document.createElement("img");
const darkForceUI = document.createElement("img");
const darkSpeedUI1 = document.createElement("img");
const darkSpeedUI2 = document.createElement("img");
const darkSpeedUI3 = document.createElement("img");
const darkSpeedUI3Plus = document.createElement("img");
const lightSpeedUI1 = document.createElement("img");
const lightSpeedUI2 = document.createElement("img");
const lightSpeedUI3 = document.createElement("img");
const lightSpeedUI3Plus = document.createElement("img");

//Backgrounds
const starSheet = document.createElement("img"); // bg twinkling star sprites
const planetSheet = document.createElement("img"); // bg planet sprites
const backgroundColorLookup = document.createElement("img"); // background gradients - Level 1
const backgroundColorLookup2 = document.createElement("img"); // background gradients - Level 2
const backgroundColorLookup3 = document.createElement("img"); // background gradients - Level 2
const backgroundStars = document.createElement("img"); // dense starfield
const backgroundParallaxLayer1 = document.createElement("img"); // planets and ships - Level 1
const backgroundParallaxLayer2 = document.createElement("img"); // ground and clouds - Level 1
const backgroundParallaxLayer3 = document.createElement("img"); // ground and clouds - Level 1
const foregroundParallaxLayer1 = document.createElement("img"); // overlay above gameplay - Level 1
const foregroundParallaxLayer2 = document.createElement("img"); // overlay above gameplay - Level 2
const foregroundParallaxLayer3 = document.createElement("img"); // overlay above gameplay - Level 2

//Terrain & World
const largeRhombusBoulder = document.createElement("img");
const brokenBoulder = document.createElement("img");
const brokenBoulderFlipped = document.createElement("img");
const bigDestRock = document.createElement("img");
const smDestRock1 = document.createElement("img");
const smDestRock2 = document.createElement("img");
const smDestRock3 = document.createElement("img");
const bubble = document.createElement("img");
const debrisSheet = document.createElement("img");
const rock1 = document.createElement("img");
const rock2 = document.createElement("img");
const rock3 = document.createElement("img");
const rock4 = document.createElement("img");
const volcano = document.createElement("img");
const flatRockPile = document.createElement("img");
const lvl1BotRock1 = document.createElement("img");
const lvl1TopRock1 = document.createElement("img");
const lvl1HorzRock1 = document.createElement("img");
const lvl1PyramidRocks = document.createElement("img");
const lvl1BotGate1Rocks = document.createElement("img");
const lvl1TopGate1Rocks = document.createElement("img");
const lvl1BotGate2Rocks = document.createElement("img");
const lvl1TopGate3Rocks = document.createElement("img");
const lvl1BotGate3Rocks = document.createElement("img");
const lvl1BotGate4Rocks = document.createElement("img");
const platform1 = document.createElement("img");
const warpObstacle = document.createElement("img");
const wormHole = document.createElement("img");
const lvl3AncientBoard = document.createElement("img");
const lvl3Square = document.createElement("img");
const lvl3Cast = document.createElement("img");
const lvl3Plus = document.createElement("img");
const lvl3Square2 = document.createElement("img");

//Player Associated
const player1Sheet = document.createElement("img");
const playerThruster = document.createElement("img");
const playerBoom2Sheet = document.createElement("img");
const playerShots = document.createElement("img");
const playerDoubleShot = document.createElement("img");
const playerTripleShot = document.createElement("img");
const playerLaserShot = document.createElement("img");
const playerShotFlash = document.createElement("img");
const forceUnitSheet = document.createElement("img");
const missileSheet = document.createElement("img");
const shieldSheet = document.createElement("img");
const ghostSheet = document.createElement("img");

//capsules
const capsule1Sheet = document.createElement("img");
const ragnarokSheet = document.createElement("img");

//Enemy Associated
const enemyExplosionSheet2 = document.createElement("img");
const flyingEnemy1Sheet = document.createElement("img");
const flyingEnemy1YellowSheet = document.createElement("img");
const flyingEnemy2Sheet = document.createElement("img");
const flyingEnemy2RedSheet = document.createElement("img");
const flyingEnemy3Sheet = document.createElement("img");
const flyingEnemy3RedSheet = document.createElement("img");
const groundEnemySheet = document.createElement("img");
const groundEnemy2Sheet = document.createElement("img");
const groundEnemy3Sheet = document.createElement("img");
const enemyBulletSheet = document.createElement("img");
const enemyBullet2Sheet = document.createElement("img");
const miniBoss1Sheet = document.createElement("img");
const eyeBoss1Sheet = document.createElement("img");
const alienBoss1Sheet = document.createElement("img");
const maskBoss1Sheet = document.createElement("img");
const miniminiBoss1Sheet = document.createElement("img");
const cargoBossSheet = document.createElement("img");
const pewpew1Sheet = document.createElement("img");
const pewpew2Sheet = document.createElement("img");
const pewpew3Sheet = document.createElement("img");
const pewpew4Sheet = document.createElement("img");
const pewpew5Sheet = document.createElement("img");
const rotatingEyeSheet = document.createElement("img");
const eyeBulletSheet = document.createElement("img");
const launchBaySheet = document.createElement("img");
const level2BossSheet = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;

    drawRect(0, 0, canvas.width, canvas.height, 'red');
	colorText("LOADING", canvas.width / 2, canvas.height / 2, 'white', 64, textAlignment.Center, opacity = 1);
	const numberText = "Remaining Images: " + picsToLoad.toString();
	colorText(numberText, canvas.width / 2, 2 * canvas.height / 3, 'white', 52, textAlignment.Center, opacity = 1);


    if (picsToLoad === 0) { // last image loaded?
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = assetPath.Image + fileName;
}

function loadImages() {
    const imageList = [
	    //Logo
        { imgName: titleLogo, theFile: "gTypeLogo.png" },

	    //UI
        { imgName: gameFrame1, theFile: "GameUIFrame1.png" },
        { imgName: gameFrame2, theFile: "GameUIFrame2.png" },
        { imgName: lightedPowerUpUI, theFile: "LightedPowerUpUI.png" },
        { imgName: darkPowerUpUI, theFile: "DarkPowerUpUI.png" },
        { imgName: lightedSpacerUI, theFile: "LightedSpacerUI.png" },
        { imgName: darkSpacerUI, theFile: "DarkSpacerUI.png" },
        { imgName: fontImage, theFile: "G-Type-FontSheet_tight.png" },
        { imgName: darkFontImage, theFile: "G-Type-FontSheet_CreditGameHit.png" },
        { imgName: doubleShotUI, theFile: "DoubleShotUI.png" },
        { imgName: tripleShotUI, theFile: "TripleShotUI.png" },
        { imgName: livesUI, theFile: "UILivesIconEven.png" },
        { imgName: lightGhostUI, theFile: "GhostShipUI-Lit.png" },
        { imgName: darkGhostUI, theFile: "GhostShipUI-Dark.png" },
        { imgName: lightForceUI, theFile: "ForceTempUI-Lit.png" },
        { imgName: darkForceUI, theFile: "ForceTempUI-Dark.png" },
        { imgName: darkSpeedUI1, theFile: "SpeedUI1Dark.png" },
        { imgName: darkSpeedUI2, theFile: "SpeedUI2Dark.png" },
        { imgName: darkSpeedUI3, theFile: "SpeedUI3Dark.png" },
        { imgName: darkSpeedUI3Plus, theFile: "SpeedUI3PlusDark.png" },
        { imgName: lightSpeedUI1, theFile: "SpeedUI1Lit.png" },
        { imgName: lightSpeedUI2, theFile: "SpeedUI2Lit.png" },
        { imgName: lightSpeedUI3, theFile: "SpeedUI3Lit.png" },
        { imgName: lightSpeedUI3Plus, theFile: "SpeedUI3PlusLit.png" },

        // backgrounds
        { imgName: starSheet, theFile: "Stars.png" },
        { imgName: planetSheet, theFile: "Planet_1.png" },
        { imgName: backgroundColorLookup, theFile: "backgroundColorLookup.png" },
        { imgName: backgroundColorLookup2, theFile: "backgroundColorLookup_level_2.png" },
        { imgName: backgroundColorLookup3, theFile: "backgroundColorLookup_level_2.png" },
        { imgName: backgroundStars, theFile: "stars1024x1024.png" },
        { imgName: backgroundParallaxLayer1, theFile: "backgroundParallax.png" },
        { imgName: backgroundParallaxLayer2, theFile: "backgroundParallax_level_2.png" },
        { imgName: backgroundParallaxLayer3, theFile: "backgroundParallax_level_3.png" },

        { imgName: foregroundParallaxLayer1, theFile: "foregroundParallax1_darker.png" },
        { imgName: foregroundParallaxLayer2, theFile: "foregroundParallax1_darker.png" },
        { imgName: foregroundParallaxLayer3, theFile: "foregroundParallax1_darker.png" },


        //Terrain & World
        { imgName: largeRhombusBoulder, theFile: "Boulder.png" },
        { imgName: brokenBoulder, theFile: "BrokenBoulder.png" },
        { imgName: brokenBoulderFlipped, theFile: "BrokenBoulderFlipped.png" },
        { imgName: bigDestRock, theFile: "DestructableBoulder_Big.png" },
        { imgName: smDestRock1, theFile: "DestructableRock_Sm1.png" },
        { imgName: smDestRock2, theFile: "DestructableRock_Sm2.png" },
        { imgName: smDestRock3, theFile: "DestructableRock_Sm3.png" },
        { imgName: bubble, theFile: "Bubble.png" },
        { imgName: debrisSheet, theFile: "DebrisSheet.png" },
        { imgName: rock1, theFile: "Rock01.png" },
        { imgName: rock2, theFile: "Rock02.png" },
        { imgName: rock3, theFile: "Rock03.png" },
        { imgName: rock4, theFile: "Rock04.png" },
        { imgName: volcano, theFile: "Volcano.png" },
        { imgName: flatRockPile, theFile: "FlatRockPile.png" },
        { imgName: lvl1BotRock1, theFile: "Lvl1CombinedBottomRocks.png" },
        { imgName: lvl1TopRock1, theFile: "Lvl1CombinedTopRocks.png" },
        { imgName: lvl1HorzRock1, theFile: "Lvl1HorzRocks.png" },
        { imgName: lvl1PyramidRocks, theFile: "Lvl1PyramidRocks.png" },
        { imgName: lvl1BotGate1Rocks, theFile: "Lvl1BotGate1Rocks.png" },
        { imgName: lvl1TopGate1Rocks, theFile: "Lvl1TopGate1Rocks.png" },
        { imgName: lvl1BotGate2Rocks, theFile: "Lvl1BotGate2Rocks.png" },
        { imgName: lvl1TopGate3Rocks, theFile: "Lvl1TopGate3Rocks.png" },
        { imgName: lvl1BotGate3Rocks, theFile: "Lvl1BotGate3Rocks.png" },
        { imgName: lvl1BotGate4Rocks, theFile: "Lvl1BotGate4Rocks.png" },
        { imgName: platform1, theFile: "Platform1-sheet.png" },
        { imgName: warpObstacle, theFile: "WarpZoneObstacleSpriteSheet.png" },
        { imgName: wormHole, theFile: "Level2WarpHole.png" },
        { imgName: lvl3AncientBoard, theFile: "Blocks/ancientBoard-sheet.png" },
        { imgName: lvl3Square, theFile: "Blocks/square.png" },
        { imgName: lvl3Square2, theFile: "Blocks/square2.png" },
        { imgName: lvl3Cast, theFile: "Blocks/cast.png" },
        { imgName: lvl3Plus, theFile: "Blocks/plus.png" },

        // player related
        { imgName: player1Sheet, theFile: "G-TypePlayer1-sm-v3.png" },
        { imgName: playerThruster, theFile: "G-TypePlayer1-Thruster.png" },
        { imgName: playerShots, theFile: "PlayerShots.png" },
        { imgName: playerDoubleShot, theFile: "PlayerUpwardShot.png" },
        { imgName: playerTripleShot, theFile: "PlayerRearShot.png" },
		{ imgName: playerShotFlash, theFile: "player_shot_vfx_sheet.png"},
		{ imgName: playerBoom2Sheet, theFile: "player_explosion_v2_sheet.png"},
		{ imgName: playerLaserShot, theFile: "player_laser_shot_v5.png"},
		{ imgName: forceUnitSheet, theFile: "TheForce.png"},
		{ imgName: missileSheet, theFile: "PlayerMissile2.png"},
		{ imgName: shieldSheet, theFile: "Shield.png"},
		{ imgName: ghostSheet, theFile: "Ghost-ship.png"},

        // Capsules
        { imgName: capsule1Sheet, theFile: "PowerUp.png" },
        { imgName: ragnarokSheet, theFile: "ragnarok_capsule_v2_sheet.png" },

        // enemies
        { imgName: enemyExplosionSheet2, theFile: "enemy_explosion_sheet_2.png" },
        { imgName: flyingEnemy1Sheet, theFile: "FlyingEnemy1.png" },
        { imgName: flyingEnemy1YellowSheet, theFile: "FlyingEnemy1Yellow.png" },
        { imgName: flyingEnemy2Sheet, theFile: "FlyingEnemy2.png" },
        { imgName: flyingEnemy2RedSheet, theFile: "FlyingEnemy2Red.png" },
        { imgName: flyingEnemy3Sheet, theFile: "FlyingEnemy3.png" },
        { imgName: flyingEnemy3RedSheet, theFile: "FlyingEnemy3Red.png" },
        { imgName: groundEnemySheet, theFile: "GroundEnemy1.png" },
        { imgName: groundEnemy2Sheet, theFile: "GroundEnemy2.png" },
        { imgName: groundEnemy3Sheet, theFile: "Turret.png" },
        { imgName: enemyBulletSheet, theFile: "EnemyBullet.png" },
        { imgName: enemyBullet2Sheet, theFile: "EnemyShot2.png" },
        { imgName: miniBoss1Sheet, theFile: "MiniBoss1.png" },
        { imgName: eyeBoss1Sheet, theFile: "EyeBoss1.png" },
        { imgName: alienBoss1Sheet, theFile: "AlienBoss1.png" },
        { imgName: miniminiBoss1Sheet, theFile: "MiniMiniBoss1.png" },
        { imgName: cargoBossSheet, theFile: "cargoBoss/CargoBoss.png" },
        { imgName: pewpew1Sheet, theFile: "cargoBoss/pewpew1.png" },
        { imgName: pewpew2Sheet, theFile: "cargoBoss/pewpew2.png" },
        { imgName: pewpew3Sheet, theFile: "cargoBoss/pewpew3.png" },
        { imgName: pewpew4Sheet, theFile: "cargoBoss/pewpew4.png" },
        { imgName: pewpew5Sheet, theFile: "cargoBoss/pewpew5.png" },
        { imgName: rotatingEyeSheet, theFile: "RotatingEyeBullet.png" },
        { imgName: eyeBulletSheet, theFile: "eyeBullet.png" },
        { imgName: launchBaySheet, theFile: "LaunchBay-sheet.png" },
        { imgName: level2BossSheet, theFile: "Level2Bosssheet.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages
