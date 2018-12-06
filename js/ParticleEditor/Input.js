
// Static Input module. No need to create an instance: simply call its methods using Input.method().
// Made by your frenchie friend Remy with love <3 (with original script from the club of course)

// This might be slightly worse performance wise, as it uses string comparisons and creates large arrays for mapping inputs, but the key advantages are:
// no need to manually remap any new key desired (yay)
// keypresses all stored in one place as opposed to many global vars
// support for detecting inputs on only the first frame (analog to Unity's Input.GetKeyDown)

// Note: the "#" hack is a JS quickfix. Because JS is very weakly typed, inputting a string of a number ("4")
// treats it as an array index regardless. A non-numeral string is required for dict keys...


// IMPORTANT: The constructor, Input(), must be called in the Main.js file, after the game is started and canvas created
//            In addition, the update method must be called every frame, otherwise getKeyDown will not work
function Input() {

//    console.log("Initializing Input module.");

    var mouseX = 0;
    var mouseY = 0;
    let mouseIsOverCanvas = false;

    let useScaled = false;

    //Related to double presses and press intervals
    var doublePressAllowedInterval = 500;
    var timeSinceLastPress = 0;

    var lastKeyPressedCode = 0; //Stores the number value, not the # string.
    var currentKeyPressedCode = 0;

    let pressRecordedThisFrame = false;
    let pressRecordedLastFrame = false;
    let resetDoublePressNextFrame = false; //flag prevents "double press chaining", 3 presses 2 doubles, which is wrong 
    
    //Dict mapping keycodes with their "currently pressed" value
    var codeValuePairs = [];

    //Dict mapping keys with their keycodes (generated using the keycodes.js file)
    var nameCodePairs = keycodes;

    // Initialization of the value dictionary. Encoding for key states: [0,0] = no press, [0,1] = pressed this frame, [1,1] = holding
    // The state [1,0] is transitional, it tells the resetGetKeyDown method to wait 1 frame before clearing inputs so we have time to read first
    for (var name in nameCodePairs) {
        if (nameCodePairs.hasOwnProperty(name)) {
            var code = nameCodePairs[name];
            codeValuePairs["#" + code] = [0, 0];
        }
    }

    // To be called every frame. Argument is "dt" in milliseconds
    Input.update = function (dt) {

        Input.resetGetKeyDown();

        // Things you wanna do THE SAME FRAME as the key down (before checks)
        if (pressRecordedThisFrame) {
            //timeSinceLastPress = 0;
            //console.log("Time now 0")
            pressRecordedLastFrame = true;
            pressRecordedThisFrame = false;
        }
        // Things you wanna do THE NEXT FRAME after the key down (before checks)
        else if (pressRecordedLastFrame) {
            timeSinceLastPress = 0;
            pressRecordedLastFrame = false;
        }

        // Force the press interval to be after the allowed double press window (to avoid triples being recorded as two doubles)
        if (resetDoublePressNextFrame) {
            timeSinceLastPress = doublePressAllowedInterval + 1;
            resetDoublePressNextFrame = false;
        }

        timeSinceLastPress += dt;
    }

    // Resets all the values for the getKeyDown function. If not called every frame, getKeyDown will be unusable
    Input.resetGetKeyDown = function () {

        for (var code in codeValuePairs) {
            if (codeValuePairs.hasOwnProperty(code)) {
                var enc = codeValuePairs[code];

                if (enc[0] === 1 && enc[1] === 0) {
                    codeValuePairs[code] = [0, 1];
                } else if (enc[0] === 0 && enc[1] === 1) {
                    codeValuePairs[code] = [1, 1];
                }
            }
        }

    }


    // Call this when needing to reset all keys, like when minimizing the window
    Input.allKeysUp = function () {

        for (var code in codeValuePairs) {
            if (codeValuePairs.hasOwnProperty(code)) {
                codeValuePairs[code] = [0,0];
            }
        }
    }

    //Returns true if the key called "name" is currently pressed
    Input.getKey = function (name) {

        var toCheck = codeValuePairs["#" + nameCodePairs[name]];

        return (toCheck[1] === 1);
    }

    // Returns true on the frame during which the key called "name" is pressed
    Input.getKeyDown = function (name, useBuffer = false) {

        var toCheck = codeValuePairs["#" + nameCodePairs[name]];

        if (useBuffer) {
            //todo
        }

        return (toCheck[0] === 0 && toCheck[1] === 1);
    }

    // Returns true if pressed key "name" twice within doublePressAllowedInterval (Input parameter)
    Input.getDoublePress = function (name) {

        let toCheck = codeValuePairs["#" + nameCodePairs[name]];

        let val = (toCheck[0] === 0 && toCheck[1] === 1
            && nameCodePairs[name] === lastKeyPressedCode
            && timeSinceLastPress < doublePressAllowedInterval);
        
        if (val) { resetDoublePressNextFrame = true; } //prevents chain presses (pressing three times quickly triggering two double presses)

        return (val);

    }

    Input.getMouseX = function () {
        return mouseX;
    }
    Input.getMouseY = function () {
        return mouseY;
    }

    // These are just helper functions, they are a common usage of the regular getKey functions
    Input.getLeftHold = function () {
        var toCheck = codeValuePairs["#1"];
        return (toCheck[1] === 1);
    }

    Input.getLeftClick = function () {
        var toCheck = codeValuePairs["#1"];
        return (toCheck[0] === 0 && toCheck[1] === 1);
    }


    //////     Event handlers for key and mouse events (mouse clicks treated as key down)  ////
    Input.keyDown = function (evt) {

        // Ignore the exceptions where we want the normal browser functionalities
        if (evt.which === 122 || // allow F11 for fullscreen
            evt.which === 123 || // allow F12 for developer console
            (mouseIsOverCanvas === false && (keycodesAllowedOutsideCanvas.indexOf(evt.which) != -1))) //allow clicking when outside canvas
        {
            //console.log("allowed")
            return; //assumes that if we want normal browser behavior, the game doesn't use this key ;)
        }

        evt.preventDefault(); //prevents normal functionalities such as scrolling with arrows
        
        //for detecting double-presses
        lastKeyPressedCode = currentKeyPressedCode; 
        currentKeyPressedCode = evt.which;

        pressRecordedThisFrame = true; //flag used in Update method

        var toCheck = codeValuePairs["#" + evt.which];
        if (toCheck[0] == 0 && toCheck[1] == 0) {
            codeValuePairs["#" + evt.which] = [1, 0];
        } else {
            codeValuePairs["#" + evt.which] = [1, 1];
        } // see encodings explained at class definition
    };

    Input.keyUp = function (evt) {
        codeValuePairs["#" + evt.which] = [0, 0];
    };


    //Requires "canvas" and "scaledCanvas" global vars. Returns x,y in SMALL canvas coordinates, rounded
    Input.setMousePos = function (evt) {

        if (useScaled) {
            var rect = scaledCanvas.getBoundingClientRect();
        } else {
            var rect = canvas.getBoundingClientRect();
        }

        //let rect = canvasUsed.getBoundingClientRect();
        let root = document.documentElement;

        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;

        if (useScaled) {
            var scalingRatioX = canvas.width/scaledCanvas.width;
            var scalingRatioY = canvas.height/scaledCanvas.height;
    
            mouseX = Math.round(mouseX * scalingRatioX);
            mouseY = Math.round(mouseY * scalingRatioY);
        }

        //console.log(mouseX, mouseY);

    };


    // Important that everything here is AFTER the method defs. 
    document.addEventListener("keydown", Input.keyDown);
    document.addEventListener("keyup", Input.keyUp);
    document.addEventListener("mousedown", Input.keyDown); //clicks handled with keydown
    document.addEventListener("mouseup", Input.keyUp);

    // Mouse movement requires an object named "canvas". Otherwise, only keyboard input works
    if (!canvas) {
//        console.log("Error: no canvas object. Mouse movement detection is not supported.");
        return;
    }
    if (typeof scaledCanvas !== "undefined") {

        scaledCanvas.addEventListener("mousemove", Input.setMousePos);
        scaledCanvas.addEventListener("mouseover", function () { mouseIsOverCanvas = true; });
        scaledCanvas.addEventListener("mouseout", function () { mouseIsOverCanvas = false; });

        useScaled = true;
//        console.log("Canvas mode detected: using scaled canvas ('scaledCanvas variable').");

    } else {

        canvas.addEventListener("mousemove", Input.setMousePos);
        canvas.addEventListener("mouseover", function () { mouseIsOverCanvas = true; });
        canvas.addEventListener("mouseout", function () { mouseIsOverCanvas = false; });

        useScaled = false;
//        console.log("Canvas mode detected: no scaled canvas used (use regular 'canvas' variable).");
    }


};

// This was added for when certain HTML functionalities are needed, otherwise simply leave the content commented
// Edit this at your leisure to allow only certain keys, comment out certain lines etc.
var keycodesAllowedOutsideCanvas = [
    1, 2, 3, //mouse clicks
    48,49,50,51,52,53,54,55,56,57, //number keys
    37,38,39,40, //arrow keys
    8, 110, 188, 189, 190, //backspace, dash, comma and period

    //the entire alphabet
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
]

// Keycodes for the entire keyboard (probably). You can look up / change which string needs to be
// passed to the "Get" methods here
var keycodes = {
    mouseleft: 1,
    mousemiddle: 2, //does this matter depending on the mouse model? :thinking-face:
    mouseright: 3,
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    break: 19,
    capslock: 20,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    leftwindow: 91,
    rightwindow: 92,
    select: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimalpoint: 110,
    divide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    equalsign: 187,
    comma: 188,
    dash: 189,
    period: 190,
    forwardslash: 191,
    graveaccent: 192,
    openbracket: 219,
    backslash: 220,
    closebraket: 221,
    singlequote: 222
};