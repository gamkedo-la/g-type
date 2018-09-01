//Image Loading
//Backgrounds
const starSheet = document.createElement("img");
const planetSheet = document.createElement("img");

//Terrain & World
const largeRhombusBoulder = document.createElement("img");
const bubble = document.createElement("img");

//Player Associated
const player1Sheet = document.createElement("img");
const playerBoom2Sheet = document.createElement("img");
const playerShots = document.createElement("img");
const playerLaserShot = document.createElement("img");
const playerShotFlash = document.createElement("img");

//power ups
const capsule1Sheet = document.createElement("img");

//Enemy Associated
const enemyExplosionSheet2 = document.createElement("img");
const flyingEnemySheet = document.createElement("img");
const flyingEnemy2Sheet = document.createElement("img");
const enemyBulletSheet = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) { // last image loaded?
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = assetPath.Image + fileName;
}

function loadImages() {
    const imageList = [

        // backgrounds
        { imgName: starSheet, theFile: "Stars.png" },
        { imgName: planetSheet, theFile: "Planet.png" },
        
        //Terrain & World
        { imgName: largeRhombusBoulder, theFile: "Boulder.png" },
        { imgName: bubble, theFile: "Bubble.png" },

        // player related
        { imgName: player1Sheet, theFile: "G-TypePlayer1.png" },
        { imgName: playerShots, theFile: "PlayerShots.png" },
		{ imgName: playerShotFlash, theFile: "player_shot_vfx_sheet.png"},
		{ imgName: playerBoom2Sheet, theFile: "player_explosion_v2_sheet.png"},
		{ imgName: playerLaserShot, theFile: "player_laser_shot_v4.png"},

        // power ups
        { imgName: capsule1Sheet, theFile: "PowerUp.png" },

        // enemies
        { imgName: enemyExplosionSheet2, theFile: "enemy_explosion_sheet_2.png" },
        { imgName: flyingEnemySheet, theFile: "FlyingEnemy1.png" },
        { imgName: flyingEnemy2Sheet, theFile: "FlyingEnemy2.png" },
        { imgName: enemyBulletSheet, theFile: "EnemyBullet.png" },

        // UI
//        { imgName: heartPic, theFile: "heart.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages