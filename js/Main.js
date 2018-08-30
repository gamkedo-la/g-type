//Main for G-Type
const pausedText = "- P A U S E D -";

const buttonTitle = {
	Help:"[H] for Help",
	Credits:"[C] for Credits",
	Enter:"[Enter] to Play"
};

const sliderTitle = {
	MusicVolume:"Music Volume",
	SFXVolume:"SFX Volume"
};

window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "gameCanvas");
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

	initializeInput();
//	configureGameAudio();
//	loadAudio();
    
	loadImages();
	
	ScreenStates.setState(LOADING_SCREEN);
    gameUpdate = setInterval(update, 1000 / FRAMES_PER_SECOND);
};

window.focus();//necessary to ensure the game receives keyboard input once it is uploaded to itch.io

function windowOnBlur() {
	setPaused(true);
}

function windowOnFocus() {
//	playAndLoopMusic(backgroundMusic);
	setPaused(false);
}

function loadingDoneSoStartGame() {
	window.focus();
	timer = new Chronogram();
    
    ScreenStates.setState(MENU_SCREEN);
};

function update() {

	let dt = timer.update();

	ScreenStates.run(dt);
	
	ParticleEmitterManager.updateAllEmitters(dt/1000);
	ParticleRenderer.renderAll(canvasContext);
};

// This is example usage of localStorageHelper for storing high scores. This is only a test - code can be removed when high scores are implemented for real.

localStorageHelper.setInt('highscore1', 100);
console.log(localStorageHelper.getInt('highscore1'));
// Make sure this is a Number and not a String
console.log(typeof localStorageHelper.getInt('highscore1'));

localStorageHelper.setInt('highscore2', 200);
console.log(localStorageHelper.getInt('highscore2'));
// Make sure this is a Number and not a String
console.log(typeof localStorageHelper.getInt('highscore2'));

localStorageHelper.setInt('highscore3', 300);
console.log(localStorageHelper.getInt('highscore3'));
// Make sure this is a Number and not a String
console.log(typeof localStorageHelper.getInt('highscore3'));

// Make sure other methods work

localStorageHelper.setBoolean('key1', true);
console.log(localStorageHelper.getBoolean('key1'));
console.log(typeof localStorageHelper.getBoolean('key1'));

localStorageHelper.setFloat('key2', 0.5);
console.log(localStorageHelper.getFloat('key2'));
console.log(typeof localStorageHelper.getFloat('key2'));

localStorageHelper.setObject('key3', {"g-type": "rules!"});
console.log(localStorageHelper.getObject('key3'));
console.log(typeof localStorageHelper.getObject('key3'));
