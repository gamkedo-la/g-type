//Image Loading
//Backgrounds
const starSheet = document.createElement("img");

//Terrain & World
const largeRhombusBoulder = document.createElement("img");
const bubble = document.createElement("img");

//Player Associated
const player1Sheet = document.createElement("img");
const playerShots = document.createElement("img");

//power ups
const capsule1Sheet = document.createElement("img");

//Enemy Associated
const flyingEnemySheet = document.createElement("img");
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
        
        //Terrain & World
        { imgName: largeRhombusBoulder, theFile: "Boulder.png" },
        { imgName: bubble, theFile: "Bubble.png" },

        // player related
        { imgName: player1Sheet, theFile: "G-TypePlayer1.png" },
        { imgName: playerShots, theFile: "PlayerShots.png" },

        // power ups
        { imgName: capsule1Sheet, theFile: "PowerUp.png" },

        // enemies
        { imgName: flyingEnemySheet, theFile: "FlyingEnemy1.png" },
        { imgName: enemyBulletSheet, theFile: "EnemyBullet.png" },

        // UI
//        { imgName: heartPic, theFile: "heart.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages