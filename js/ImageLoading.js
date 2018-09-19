//Image Loading
//UI
const gameFrame1 = document.createElement("img");
const gameFrame2 = document.createElement("img");
const lightedPowerUpUI = document.createElement("img");
const darkPowerUpUI = document.createElement("img");
const lightedSpacerUI = document.createElement("img");
const darkSpacerUI = document.createElement("img");
const fontImage = document.createElement("img");
const doubleShotUI = document.createElement("img");
const tripleShotUI = document.createElement("img");
const livesUI = document.createElement("img");

//Backgrounds
const starSheet = document.createElement("img");
const planetSheet = document.createElement("img");
const backgroundParallaxLayer1 = document.createElement("img");
const backgroundColorLookup = document.createElement("img");

//Terrain & World
const largeRhombusBoulder = document.createElement("img");
const bubble = document.createElement("img");
const debrisSheet = document.createElement("img");
const rock1 = document.createElement("img");
const rock2 = document.createElement("img");
const rock3 = document.createElement("img");
const rock4 = document.createElement("img");

//Player Associated
const player1Sheet = document.createElement("img");
const playerBoom2Sheet = document.createElement("img");
const playerShots = document.createElement("img");
const playerLaserShot = document.createElement("img");
const playerShotFlash = document.createElement("img");
const forceUnitSheet = document.createElement("img");
const missileSheet = document.createElement("img");

//power ups
const capsule1Sheet = document.createElement("img");

//Enemy Associated
const enemyExplosionSheet2 = document.createElement("img");
const flyingEnemySheet = document.createElement("img");
const flyingEnemy2Sheet = document.createElement("img");
const groundEnemySheet = document.createElement("img");
const enemyBulletSheet = document.createElement("img");
const enemyBullet2Sheet = document.createElement("img");

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
	    //UI 
        { imgName: gameFrame1, theFile: "GameUIFrame1.png" },	    
        { imgName: gameFrame2, theFile: "GameUIFrame2.png" },	    
        { imgName: lightedPowerUpUI, theFile: "LightedPowerUpUI.png" },	    
        { imgName: darkPowerUpUI, theFile: "DarkPowerUpUI.png" },	    
        { imgName: lightedSpacerUI, theFile: "LightedSpacerUI.png" },
        { imgName: darkSpacerUI, theFile: "DarkSpacerUI.png" },
        { imgName: fontImage, theFile: "G-Type-FontSheet_tight.png" },
        { imgName: doubleShotUI, theFile: "DoubleShotUI.png" },
        { imgName: tripleShotUI, theFile: "TripleShotUI.png" },
        { imgName: livesUI, theFile: "UILivesIconEven.png" },

        // backgrounds
        { imgName: starSheet, theFile: "Stars.png" },
        { imgName: planetSheet, theFile: "Planet.png" },
        { imgName: backgroundParallaxLayer1, theFile: "stars1024x1024.png" },
        { imgName: backgroundColorLookup, theFile: "backgroundColorLookup.png" },
                
        
        //Terrain & World
        { imgName: largeRhombusBoulder, theFile: "Boulder.png" },
        { imgName: bubble, theFile: "Bubble.png" },
        { imgName: debrisSheet, theFile: "DebrisSheet.png" },
        { imgName: rock1, theFile: "Rock01.png" },
        { imgName: rock2, theFile: "Rock02.png" },
        { imgName: rock3, theFile: "Rock03.png" },
        { imgName: rock4, theFile: "Rock04.png" },

        // player related
        { imgName: player1Sheet, theFile: "G-TypePlayer1.png" },
        { imgName: playerShots, theFile: "PlayerShots.png" },
		{ imgName: playerShotFlash, theFile: "player_shot_vfx_sheet.png"},
		{ imgName: playerBoom2Sheet, theFile: "player_explosion_v2_sheet.png"},
		{ imgName: playerLaserShot, theFile: "player_laser_shot_v5.png"},
		{ imgName: forceUnitSheet, theFile: "shape_hexagon_48x48.png"},
		{ imgName: missileSheet, theFile: "PlayerMissile.png"},

        // Capsules
        { imgName: capsule1Sheet, theFile: "PowerUp.png" },

        // enemies
        { imgName: enemyExplosionSheet2, theFile: "enemy_explosion_sheet_2.png" },
        { imgName: flyingEnemySheet, theFile: "FlyingEnemy1.png" },
        { imgName: flyingEnemy2Sheet, theFile: "FlyingEnemy2.png" },
        { imgName: groundEnemySheet, theFile: "GroundEnemy1.png" },
        { imgName: enemyBulletSheet, theFile: "EnemyBullet.png" },
        { imgName: enemyBullet2Sheet, theFile: "EnemyShot2.png" },

        // UI
//        { imgName: heartPic, theFile: "heart.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages
