
/**
 * Remy's particle editor (name still TBD)
 * 
 * Required files: Editor.html, Main.js, ParticleSystem.js, Input.js, GraphicsCommon.js
 * Current version: v.1.1.3 (29th of August 2018)
 * 
 * Homemade JavaScript particle editor for Gamkedo Club games and more.
 * Export your configurations and use 'createParticleEmitter(x,y, config)' in your code for sparks to fly!
 * (Requires ParticleSystem.js)
 * 
 * Thank you Christer for the idea and help with optimizing the particle system code.
 * 
 * "And now I am at rest, understanding that in software, and hearts, and life...
 *  ...all the features can never truly be added." -Atrus
 */



////////////////////////            Basic window-related functionalities        ////////////////////////

const CANVAS_W = 1000;
const CANVAS_H = 750;

var editorRunning = true;

window.onload = function () {

    window.focus();
    
    canvas = document.getElementById("canvas");
    canvasContext = canvas.getContext("2d");

    tintCanvas = document.createElement("canvas"); //used in conjuction with the ParticleRenderer
    tintContext = tintCanvas.getContext("2d");

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);


    colorRect(0, 0, canvas.width, canvas.height, 'purple');
    colorText('LOADING', canvas.width / 2, canvas.height / 2, 'orange');

    Input(); // initialize inputs

    startParticleEditor();
};

function windowOnResize() {

    //Removed things related to fullscreen mode as their are not necessary a.t.m
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.imageSmoothingEnabled = false;
    canvasContext.msImageSmoothingEnabled = false;
    canvasContext.imageSmoothingEnabled = false;
}

function onFullscreenChange() {
//    console.log("Fullscreen mode just changed! =)");
}

function onFullscreenError() {
//    console.log("Fullscreen request was denied.");
}

function toggleFullScreen() {
//    console.log("Toggling FULLSCREEN mode...");
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

// These functions (by Nick P.) allow the toggling of the window focus so that the game truly stops when out of focus
function windowOnFocus() {

    if (!editorRunning) {
        editorRunning = true;
        lastTime = (new Date()).getTime();
        animationRequestID = requestAnimationFrame(updateAll);
        Input.allKeysUp();
    }
}
function windowOnBlur() {

    editorRunning = false;
    cancelAnimationFrame(animationRequestID);
}


////////////////////////            Main loop        ////////////////////////

function updateAll () {

    //Update the time variation
    now = (new Date()).getTime();
    dt = now - lastTime; //note: dt is a GLOBAL variable accessed freely in many update functions
    lastTime = now;
    dt = dt/1000;

    Input.update(dt*1000);

    clearScreen(canvas);

    // Not worth having a separate function for handling this input
    if (Input.getKeyDown("space")) {
        updateParticleViewer();
    }

    ParticleEmitterManager.updateAllEmitters(dt);
    ParticleRenderer.renderAll(canvasContext);

    animationRequestID = requestAnimationFrame(updateAll); //updateAll will then start calling itself depending on anim frames
}


////////////////////////            Editor logic and functions        ////////////////////////

var allSliders = document.getElementsByClassName("slider");
var allNumInputs = document.getElementsByClassName("numInput");
var allCheckboxes = document.getElementsByClassName("check");
var allColorPickers = document.getElementsByClassName("color");


var currentConfig;

var defaultConfig = {
    "speed":400,
    "size":10,
    "angle":0,
    "emissionRate":200,
    "duration":5,
    "immortal":false,
    "particleLife":2,
    "color": [255,236,0,1],
    "endColor": [255,0,0,1],
    "useGradient":true,
    "useTexture":false,
    "textureAdditive":false,
    "fadeAlpha":true,
    "fadeSpeed":true,
    "fadeSize":true,
    "gravity":0,
    "xVar":25,
    "yVar":25,
    "speedVar":150,
    "sizeVar":2,
    "angleVar":360,
    "particleLifeVar":0,
    "startColorVar": [0,0,0,0],
    "endColorVar": [0,0,0,0],
    "endColorToggle":true,
    "colorVarToggle":false
    }

// Re-applies the entirety of "config" argument and updates the input fields to reflect this
function applyAllConfig (config) {


    for (let i = 0, l = allSliders.length; i<l; i++) {

        allSliders[i].value = config[allSliders[i].name];
    }
    for (let i = 0, l = allNumInputs.length; i<l; i++) {

        allNumInputs[i].value = config[allNumInputs[i].id];
    }
    for (let i = 0, l = allCheckboxes.length; i<l; i++) {

        allCheckboxes[i].checked = config[allCheckboxes[i].name] === true ? "checked" : null;
    }
    for (let i = 0, l = allColorPickers.length; i<l; i++) {

        allColorPickers[i].value = config[allColorPickers[i].name];
    }

    updateParticleViewer();
}

// Helper function for applying default
function applyDefaultConfig () {

    currentConfig = JSON.parse(JSON.stringify(convertColorsArrayToHex(defaultConfig))); //make a copy of the default config

    applyAllConfig(currentConfig);

}


// Works both if the "var = name" part is pasted or if it's not
function loadConfig () {

    let configString = prompt("Please paste the emitter configuration you wish to edit.");
    
    if (!configString || configString==="") { return; } //handle Cancel click

    //Cut out the "var = " if the user pasted it
    if (configString.indexOf("= ") !== -1) {
        configString = configString.slice(configString.indexOf("= ") + 2);
    }


    try {
        currentConfig = convertColorsArrayToHex(JSON.parse(configString));
        applyAllConfig(currentConfig);
        //currentConfig = loadConfig;
    } catch (error) {
//        console.log("Error: entered configuration is not valid");
    }

}

// As the classic pastable not-JSON ;)
function exportConfig () {

    let convertedConfig = convertColorsHexToArray(currentConfig);

    let string = JSON.stringify(convertedConfig).split(",").join(",\n");

    string = string.replace("{", "{\n");
    string = string.replace("}", "\n}");

    let nameFieldValue = document.getElementById("emitterName").value;
    let varName = nameFieldValue ? nameFieldValue : "config";
    string = "var " + varName + " = " + string;

    prompt("Paste your configuration in code", string);
}


function startParticleEditor() {

    animationRequestID = requestAnimationFrame(updateAll); //updateAll will then start calling itself depending on anim frames

    lastTime = (new Date()).getTime();

    // Give event handlers to all input fields (yes I know this was a really dumb way to do it)

    // Sliders
    for (let i = 0, l = allSliders.length; i<l; i++) {

        allSliders[i].oninput = function () {

            let numInput = document.getElementById(this.name);
            numInput.value = this.value*1;
        }

        allSliders[i].onchange = function () {
            
            currentConfig[this.name] = this.value*1;

            updateParticleViewer();
        }
    }
    
    // Number fields
    for (let i = 0, l = allNumInputs.length; i<l; i++) {

        allNumInputs[i].value = allSliders[allNumInputs[i].id].value; //give initial values to be same as slider
        allNumInputs[i].step = allSliders[allNumInputs[i].id].step; 
        allNumInputs[i].min = allSliders[allNumInputs[i].id].min; 
        allNumInputs[i].max = allSliders[allNumInputs[i].id].max; 

        allNumInputs[i].oninput = function () {

            currentConfig[this.id] = this.value*1;

            let slider = document.getElementsByName(this.id);
            slider[0].value = this.value*1;
            updateParticleViewer();
        }

    }

    // Checkboxes
    for (let i = 0, l = allCheckboxes.length; i<l; i++) {

        allCheckboxes[i].onchange = function () {
            
            currentConfig[this.name] = (this.checked); //ahhh JavaScript

            updateParticleViewer();
        }
    }

    // Color pickers
    for (let i = 0, l = allColorPickers.length; i<l; i++) {

        allColorPickers[i].onchange = function () {

            currentConfig[this.name] = this.value;

            updateParticleViewer();
        }
    }

    applyDefaultConfig();

    updateParticleViewer();

}

function updateParticleViewer () {

    ParticleEmitterManager.killAllEmittersHard(); //kill the current viewer

    //convert hex values to rgba array
    let convertedConfig = convertColorsHexToArray(currentConfig);

    // set end color as start color if not currently toggled, same thing for variation
    if (!document.getElementsByName("endColorToggle")[0].checked) {
        convertedConfig.endColor = convertedConfig.color;
    }
    if (!document.getElementsByName("colorVarToggle")[0].checked) {
        convertedConfig.startColorVar = [0,0,0,0];
        convertedConfig.endColorVar = [0,0,0,0];
    }

    //create the new particle emitter
    createParticleEmitter(CANVAS_W/2,CANVAS_H/2, convertedConfig);

}

////////////        Color conversion from Hex to Array and vice versa       ////////////


// Hex input in format "#RRBBGG", alphaVal between 0 and 1 numeric
// Returns [r, g, b, alphaVal] array
function hexInputToArray (hexInput, alphaVal) {

    let array = hexInput.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
    array.push(alphaVal)
    
    return array;
}

// Array input in format [r, g, b, alphaVal]
// Returns hex format #RRGGBB
function arrayInputToHex (arrayInput) {

    //let hexString = arrayInput.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
    let RR = arrayInput[0].toString(16);
    let GG = arrayInput[1].toString(16);
    let BB = arrayInput[2].toString(16);
    if (RR.length === 1) { RR = "0" + RR;}
    if (GG.length === 1) { GG = "0" + GG;}
    if (BB.length === 1) { BB = "0" + BB;}

    let hexString = "#" + RR + GG + BB;
    
    return hexString;
}

// Converts all the colors to the proper [r,g,b,a] array format, and return a NEW config object
function convertColorsHexToArray (config) {

    let converted = JSON.parse(JSON.stringify(config));

    converted.color = hexInputToArray(config.color, 1);
    converted.endColor = hexInputToArray(config.endColor, 1);
    converted.startColorVar = hexInputToArray(config.startColorVar, 0);
    converted.endColorVar = hexInputToArray(config.endColorVar, 0);

    return converted;

}

// Converts all the colors to the proper [r,g,b,a] array format, and return a NEW config object
function convertColorsArrayToHex (config) {

    let converted = JSON.parse(JSON.stringify(config));

    converted.color = arrayInputToHex(config.color);
    converted.endColor = arrayInputToHex(config.endColor);
    converted.startColorVar = arrayInputToHex(config.startColorVar);
    converted.endColorVar = arrayInputToHex(config.endColorVar);

    return converted;

}


// Draws over everything and resets the canvas. This is the first draw function that must be called
function clearScreen(canvas) {

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    colorRectAlpha(0,0, canvas.width,canvas.height, [26,26,26,1]);

}