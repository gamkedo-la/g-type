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
	if (ScreenStates.state !== GAME_SCREEN) {
    setPaused(false, ScreenStates.pauseCause);
  }
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

//Chronogram
function Chronogram() {
	let lastUpdate = Date.now();
	const events = {};
	
	this.getCurrentTime = function() {
		return Date.now();
	};
	
	this.update = function() {
		const previousLastUpdate = lastUpdate;
		lastUpdate = Date.now();
		return (worldSpeed * (lastUpdate - previousLastUpdate));
	};
	
	this.timeSinceUpdate = function() {
		let now = Date.now();
		return (now - lastUpdate);
	};
	
	this.registerEvent = function(eventName) {
		const thisTime = Date.now();
		events[eventName] = {time:thisTime, lastUpdate:thisTime};
		return thisTime;
	};
	
	this.updateEvent = function(eventName) {
		const thisTime = Date.now();
		const deltaTime = thisTime - events[eventName].lastUpdate
		events[eventName].lastUpdate = thisTime;
		return deltaTime;
	};
	
	this.timeSinceUpdateForEvent = function(eventName) {
		if(events[eventName] === undefined) {return null;}
		
		return (worldSpeed * (Date.now() - events[eventName].lastUpdate));
	};
	
	return this;
}

let localStorageHelper = new LocalStorageHelper();

/**
 * Safe wrappers for localStorage methods.
 */
function LocalStorageHelper() {

  // Typeless values

  /**
   * A safe wrapper around the localStorage.getItem() function. According to the MDN documentation:
   * `The getItem() method of the Storage interface, when passed a key name, will return that key's value or null if the key does not exist.`
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {string} A DOMString containing the value of the key. If the key does not exist, null is returned.
   */
  this.getItem = function(keyName) {
    try {
      return window.localStorage.getItem(keyName);
    }
    catch(e) {
      return null;
    }
  };

  /**
   * A safe wrapper around the Storage.setItem() function. According to the MDN documentation:
   * `The setItem() method of the Storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists.`
   * @param {string} keyName A DOMString containing the name of the key you want to create/update.
   * @param {string} keyValue A DOMString containing the value you want to give the key you are creating/updating.
   */
  this.setItem = function(keyName, keyValue) {
    try {
      window.localStorage.setItem(keyName, keyValue);
    }
    catch(e) {
    }
  };

  // Boolean values

  /**
   * Retrieves a Boolean value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {boolean}
   */
  this.getBoolean = function(keyName) {
    let storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return storedValue === 'true';
  };

  this.setBoolean = this.setItem;

  // Integer values

  /**
   * Retrieves an integer value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {int}
   */
  this.getInt = function(keyName) {
    let storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return parseInt(storedValue);
  };

  this.setInt = this.setItem;

  // Float values

  /**
   * Retrieves a floating point number from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {number}
   */
  this.getFloat = function(keyName) {
    let storedValue = this.getItem(keyName);
    if(storedValue === null) {return storedValue;}
    return parseFloat(storedValue);
  };

  this.setFloat = this.setItem;

  // Object values

  /**
   * Retrieves a JavaScript object from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to retrieve the value of.
   * @return {Object}
   */
  this.getObject = function(keyName) {
    let storedValue = this.getItem(keyName);
    if (typeof storedValue !== "string") {
      return null;
    }
    return JSON.parse(storedValue);
  };

  /**
   * Retrieves a Boolean value from localStorage.
   * @param {string} keyName A DOMString containing the name of the key you want to create/update.
   * @param {Object} keyValue A JavaScript object containing the value you want to give the key you are creating/updating.
   */
  this.setObject = function(keyName, keyValue) {
    let valueToStore = JSON.stringify(keyValue);
    this.setItem(keyName, valueToStore);
  };
}

//Input
const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_PGUP = 33;
const KEY_PGDOWN = 34;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const DIGIT_0 = 48;
const DIGIT_1 = 49;
const DIGIT_2 = 50;
const DIGIT_3 = 51;
const DIGIT_4 = 52;
const DIGIT_5 = 53;
const DIGIT_6 = 54;
const DIGIT_7 = 55;
const DIGIT_8 = 56;
const DIGIT_9 = 57;

const KEY_A = 65;
const KEY_B = 66;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_H = 72;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_P = 80;
const KEY_Q = 81;  
const KEY_R = 82;
const KEY_S = 83;
const KEY_T = 84;
const KEY_U = 85;
const KEY_V = 86;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Y = 89;
const KEY_Z = 90;

const KEY_PLUS = 187;
const KEY_NUMPAD_ADD = 107;
const KEY_MINUS = 189;
const KEY_NUMPAD_SUBTRACT = 109;
const KEY_TILDE = 192;
const KEY_SHIFT = 16;
const KEY_CTRL = 17;
const KEY_ALT = 18;

let holdKey = [];

holdKey[KEY_UP] = false;
holdKey[KEY_DOWN] = false;
holdKey[KEY_LEFT] = false;
holdKey[KEY_RIGHT] = false;
holdKey[KEY_W] = false;
holdKey[KEY_S] = false;
holdKey[KEY_A] = false;
holdKey[KEY_D] = false;
holdKey[KEY_SPACE] = false;
holdKey[KEY_TAB] = false;
holdKey[KEY_X] = false;

let keydownMap = {};

function initializeInput() {
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyDown);	
}
    
function keyDown(evt) {
	if (evt.type == "keydown") {
    didInteract = true;
    if(currentBackgroundMusic.getTime() > 0){
        currentBackgroundMusic.resume();
    }
    else {
        currentBackgroundMusic.play();
    }	
	}
	
	keydownMap[evt.keyCode] = evt.type == "keydown";

	evt.preventDefault();
	if (ScreenStates.control(keydownMap, false)) {
		evt.preventDefault();
	}		
}