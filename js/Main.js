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
	ScreenStates.run(timer.update());
};