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
const KEY_MINUS = 189;
const KEY_TILDE = 192;

let holdLeft, holdRight, holdUp, holdDown, holdSpace, holdTab, holdX = false;

function initializeInput() {
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);
}

function keyPress(evt) {
    didInteract = true;
	evt.preventDefault();
	if(ScreenStates.control(evt.keyCode, true)) {
        evt.preventDefault();
	}
}

function keyRelease(evt) {
    if (ScreenStates.control(evt.keyCode, false)) {
        evt.preventDefault();
	}
}
