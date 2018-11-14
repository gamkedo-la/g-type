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
const platform1 = document.createElement("img");
const warpObstacle = document.createElement("img");

//Player Associated
const player1Sheet = document.createElement("img");
const playerThruster = document.createElement("img");
const playerBoom2Sheet = document.createElement("img");
const playerShots = document.createElement("img");
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
const launchBaySheet = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
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
        { imgName: foregroundParallaxLayer1, theFile: "foregroundParallax1.png" },
        { imgName: foregroundParallaxLayer2, theFile: "foregroundParallax1.png" },
        { imgName: foregroundParallaxLayer3, theFile: "foregroundParallax1.png" },


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
        { imgName: platform1, theFile: "Platform1-sheet.png" },
        { imgName: warpObstacle, theFile: "WarpZoneObstacleSpriteSheet.png" },

        // player related
        { imgName: player1Sheet, theFile: "G-TypePlayer1-sm-v3.png" },
        { imgName: playerThruster, theFile: "G-TypePlayer1-Thruster.png" },
        { imgName: playerShots, theFile: "PlayerShots.png" },
		{ imgName: playerShotFlash, theFile: "player_shot_vfx_sheet.png"},
		{ imgName: playerBoom2Sheet, theFile: "player_explosion_v2_sheet.png"},
		{ imgName: playerLaserShot, theFile: "player_laser_shot_v5.png"},
		{ imgName: forceUnitSheet, theFile: "TheForce.png"},
		{ imgName: missileSheet, theFile: "PlayerMissile.png"},
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
          { imgName: maskBoss1Sheet, theFile: "MaskBoss1.png" },
           { imgName: miniminiBoss1Sheet, theFile: "MiniMiniBoss1.png" },
        { imgName: cargoBossSheet, theFile: "cargoBoss/CargoBoss.png" },
        { imgName: pewpew1Sheet, theFile: "cargoBoss/pewpew1.png" },
        { imgName: pewpew2Sheet, theFile: "cargoBoss/pewpew2.png" },
        { imgName: launchBaySheet, theFile: "LaunchBay-sheet.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages
