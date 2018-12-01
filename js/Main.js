//Main for G-Type
window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "gameCanvas");
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	cheats.documentDebugKeysIfEnabled();

	initializeInput();
//	configureGameAudio();
//	loadAudio();

	loadImages();
	window.scene = null
	ScreenStates.setState(LOADING_SCREEN);
//    gameUpdate = setInterval(update, 1000 / FRAMES_PER_SECOND);
};

window.focus();//necessary to ensure the game receives keyboard input once it is uploaded to itch.io

function windowOnBlur() {
	if(!loadingComplete) return;
	setPaused(true, PauseCause.LostFocus);
}

function windowOnFocus() {
//	playAndLoopMusic(backgroundMusic);
	if(!loadingComplete) return;
	setPaused(false, PauseCause.LostFocus);
}

function loadingDoneSoStartGame() {
	timer = new Chronogram();
	gameFont = new GameFont(fontImage, {width:16, height:16}, canvasContext);

    ScreenStates.setState(MENU_SCREEN);
    loadingComplete = true;

    gameUpdate = setInterval(update, 1000 / FRAMES_PER_SECOND);

	window.focus();
}

function update() {
//	if(!loadingComplete) return;

	if (timer === null) return; // bugfix: timer can sometimes be undefined here (while images are still loading)
	if (!gameFont === null) return;

	const dt = timer.update();

	ScreenStates.run(dt);

	ParticleEmitterManager.updateAllEmitters(dt/1000);
	// ParticleRenderer.renderAll(canvasContext); // moved to GameScene.draw so it goes underneath the GUI
}
