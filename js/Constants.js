let canvas;
let canvasContext;
let loadingComplete = false;
let scene;
let timer = null;
let gameFont = null;
let currentLevelIndex = 0;
let worldSpeed = 1;
let gameSpeed = 1.5;
let remainingLives = 2;
let didInteract = false;

const TUTORIAL_LENGTH = 320; // flash "[X] TO FIRE" for how long (distance travelled) at start

let currentScore = 0;
let scoreText = "00000000" + currentScore.toString();
let highScore = 0;


let allHighScores = [];
const DRAW_COLLIDERS = false;
const COLLIDER_COLOR = 'yellow';
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 800;
const GameField = {
	x:50,
	y:150,
	width:800,
	height:600,
	right:850,
	bottom:750,
	midX:450,
	midY:450,
	bgOffset:50
}
const FRAMES_PER_SECOND = 60;
const SIM_STEP = 16;//milliseconds in each simulation step ~1/2 frame
const MAX_SHAKE_MAGNITUDE = 10;
const MAX_LIVES_TO_SHOW = 9;
const WARP_INDEX = 3;//This should be 3, once we have all three levels implemented
const SCORE_PER_EXTRA_LIFE = 30000;
const MAX_GHOSTS = 3;
let activatedAnyGhosts = false;

const BG_PARALLAX_RATIO_1 = [0.3, 0.25, 0.075, 0.3]; // starfield
const BG_PARALLAX_RATIO_2 = [0.2, 0.5, 0.2, 0.2]; // transparent planets
const BG_PARALLAX_RATIO_3 = [4.0, 8.0, 4.0, 4.0];//[2.0, 4.0, 2.0, 2.0]; // girders
const BG_COLOR_CHANGE_SPEED = 0.005; // pixels per second for the bacgroundColorLookup table

const gameTitle = {
	Main:"G-Type",
	Subtitle:"Advanced Strike Team"
};

const buttonTitle = {
	Help:"[H] for Help",
	Credits:"[C] for Credits",
	Enter:"[Enter] to Play"
};

const sliderTitle = {
	MusicVolume:"Music Volume",
	SFXVolume:"SFX Volume"
};

const localStorageKey = {
    MusicVolume: "musicVolume",
    SFXVolume: "effectsVolume",
    IsLocalStorageInitialized: "isLocalStorageInitialized",
    ShowedHelp: "showedHelp",
};

const assetPath = {
    Audio: "./audio/",
    Image: "images/"
};

const AudioTracks = {
	MainMenu:0,		//
	Level1:1, 		//
	MiniBoss1:2,	//
    EyeBoss1:5,		//
    AlienBoss1:6,   //
    MaskBoss1:2,    //
    MiniMiniBoss1:2,//
	Boss1:3,		//TODO: change these to
	Level2:0, 		//the correct indices from
	Level3:4, 		//the "currentBackgroundMusic"
	WarpLevel:8,	//array (AudioManager.js ~line 11) once
	GameOver:0,		//there is more than 1 element in that array
	GameEnding:7,	//
	Help:0,			//
	Options:0,		//
	Credits:7		//
};

const loadingText = "LOADING...";

const Color = {
	Red:"red",
	Blue:"blue",
	Green:"green",
	White:"white",
	Black:"black",
	Yellow:"yellow",
	Purple:"purple",
	Aqua:"aqua",
	Fuchaia:"fuchaia"
};

const CLEAR_COLOR = Color.Red;//TODO: Change to Color.Black before release

const LOADING_SCREEN = 'loading';
const MENU_SCREEN = 'menu';
const OPTIONS_SCREEN = 'options';
const LEVEL_SELECT_SCREEN = 'level';
const CREDITS_SCREEN = 'credits';
const HELP_SCREEN = 'help';
const STORY_SCENE_SCREEN = "story_scene";
const CUT_SCENE1_SCREEN = 'cut_scene1';
const CUT_SCENE2_SCREEN = 'cut_scene2';
const CUT_SCENE3_SCREEN = 'cut_scene3';
const DEMO_SCENE_SCREEN = 'demo_scene';
const GAME_SCREEN = 'game';
const PAUSE_SCREEN = 'pause';
const GAME_OVER_SCREEN = 'game_over';
const ENDING_SCREEN = 'game_finished';

const textAlignment = {
    Left: "left",
    Right: "right",
    Center: "center"
};

const Fonts = {
    MainTitle: "40px Tahoma",
    Subtitle: "30px Tahoma",
    ButtonTitle: "20px Tahoma",
    CreditsText: "16px Tahoma"
};

const textStrings = {
    Play: "Play",
    Back: "Back",
    Continue: "Continue",
    Help: "Help",
    Restart: "Restart",
    Resume:"Resume",
    Quit: "Quit",
    Options: "Options",
    Music: "Music",
    SoundFX: "SFX",
    Credits: "Credits",
    Main: "Main Menu",
    LevelSelect: 'Select Level',
    GameOver: "Game Over",
    Endgame: "Congratulations!",
    endgameScriptBad: [
	    "The Krammix were",
	    "defeated! The galaxy",
	    "is at peace again.",
	    "The lost USF crew",
	    "will never be",
	    "forgotten."
    ],
    endgameScriptGood: [
	    "G-Type was",
	    "victorious!",
	    "The Krammix were",
	    "defeated! The",
	    "ghosts of the USF",
	    "crew are free and",
	    "the galaxy is",
	    "at peace again."
    ],
    endgameScript: [
        // max width -------------v
        "You completed the game!",
        "The universe has been",
        "saved and peace has",
        "returned to the galaxy!",
        "",
        "Thank you for playing",
        "",
        "G-Type",
        "",
        "a Gamkedo production",
        "",
        "Special thanks to",
        "Kissa the cat",
        "Fireball the fish",
        "NASA",
        "The Trayford Family",
        "",
        "Copyright 2018"
    ],
    GameOverScript1:"G-Type failed the mission!",
    GameOverScript2:"The Krammix have consumed",
    GameOverScript3:"the galaxy!",
    CutScene1_1:"-PHASE 1-", //aka level 1 intro title
    CutScene1_2:"Pilot the G-Type ship to the hostile",
    CutScene1_3:"homeworld of the KRAMMIX.",
    CutScene1_4:"", //empty line
    CutScene1_5:"Good luck G-Type!",
    CutScene2_1:"-PHASE 2-", //aka level 1 intro title
    CutScene2_2:"Pilot the G-Type ship across the hostile",
    CutScene2_3:"surface KRAMMIX to find the alien HQ.",
    CutScene2_4:"", //empty line
    CutScene2_5:"Good luck G-Type!",
    CutScene3_1:"-PHASE 3-", //aka level 1 intro title
    CutScene3_2:"Pilot the G-Type ship through the",
    CutScene3_3:"alien HQ to end their evil forever.",
    CutScene3_4:"", //empty line
    CutScene3_5:"Good luck G-Type!",
    SkipCutScene:"[Space] or [Enter] to skip",
    Story:[
	"Year: 2276",
    "United Sol Force ships at the edge of",
    "the galaxy discovered an unknown ship in",
    "distress. USF crew landed on the ship to",
    "to scan for survivors. They found",
    "powerful technology and a message:",
    "THE KRAMMIX WILL DESTROY!",
    "The scans triggered an alarm and opened",
    "a wormhole to the Krammix home world.",
    "The ship disappeared into the wormhole",
    "taking some of the USF ships and helpless",
    "crew with it. The USF used the alien",
    "technology to build an experimental ship",
    "known as G-Type!",
    "Your Mission: Follow the alien ship,",
    "rescue the lost USF crew and stop the",
    "evil plans of the Krammix!"
    ],
    Contributors: [
{name:"H Trayford",   works: ['project lead','core functionality','scoring and score pop ups','powerup objects','enemy, projectile, and collision code','level 3 design','screenshake','menu base code','checkpoint and continues','enemy pathing','cut scene animations','ground enemy integration','main UI integration','missile, ghost, and clear powerups','boss behavior improvements','boss explosions','several flying and ground enemies','volcano','bug fixes'] },
{name:"Ryan Malm",   works: ['logo','tile editor integration','level 1 design','ground enemy rotation support','flickering after respawn','capsule pickup effects','test level','editor tutorial (internal use)','warp challenge functionality','main menu improvements','shot contrast tweaks','made parallax editable per stage'] },
{name:"Vaan Hope Khani",   works: ['HQ boss and eye boss art','boss 2 and 3 implementation','level 3 parallax art','high scores save, load, and display','mini-mini-bosses','turret platforms art (x5)','fire brick and fire stone art','ground enemy spritesheet','pause and options screen improvements','additional text cleanup'] },
{name:"Christer \"McFunkypants\" Kaitila",   works: ['ship thruster particles', 'background gradient/ sky/greeble','foreground parallax effect','parallax asteroids and truss','additional player collision tuning', 'capsule spawning', 'endgame functionality', 'caves test level','tilt sprite implemented', 'thruster animation hookup'] },
{name:"Jeff \"Axphin\" Hanlon",   works: ['main story writing','player ship sprite (including turns)','mini boss sprite','game font','thruster sprites','original player art (became a boss)','main menu selector', 'planet sprite'] },
{name:"Jaime Rivas",   works: ['explosion animation','shot flash effect','powerup refactoring','clear screen powerup'] },
{name:"Chris Markle",   works: ['player fire sound','small and large explosion sounds','shield sound','mini boss music','item pickup sound','menu interaction sounds'] },
{name:"Randy Tan Shaoxian",   works: ['text scroll support', 'cutscene code', 'level skip cheat','WASD input code','improved keyboard support'] },
{name:"Michelly Oliveira",   works: ['credits pause/play with space','extra life sound integration','powerups cheat','ghost ship explosion hookups', 'music loop support','auto-fire on options screen', 'demo scene movement'] },
{name:"Marc Silva",   works: ['cargo boss art and behavior','cargo boss projectiles art and code'] },
{name:"K. Anthony",   works: ['powerups spawn code','powerup increment feature', 'powerup buttons hookup'] },
{name:"Ian Ross",   works: ['locking powerups once used','testing/debug cheats support'] },
{name:"Andrew Mushel",   works: ['audio and code for laser sound','audio and code for powerup activation','extra life sound effect', 'music composition (warp speed)','audio for clear screen powerup'] },
{name:"Kirvee",   works: ['animated lives icons','UI design, border art, and UI sprites','force, speed, ghost powerup icons','QA testing'] },
{name:"Caspar \"SpadXIII\" Dunant",   works: ['starfield improvements','space debris'] },
{name:"Stebs",   works: ['boss music compsition','organized user testing'] },
{name:"T.",   works: ['options menu improvements','additional rock art'] },
{name:"Zak Ali",   works: ['bubble explosion (art and code)','ghost ship art'] },
{name:"Remy Lapointe",   works: ['particle editor', 'critical bug fix (was on player death)'] },
{name:"Kevin Pavlish",   works: ['shields cheat','pause screen improvements'] },
{name:"Lou \"Mass KonFuzion\" Herard",   works: ['code for force shield'] },
{name:"Vince McKeown",   works: ['ground enemy sprite'] },
{name:"Loren Pierce",   works: ['code for damage sound'] },
{name:"Vignesh Ramesh",   works: ['3 songs (Dil se, Energize, end title)'] },
{name:"Coy Compositions",   works: ['planetary descent music and boss music'] },
{name:"Joe C.S.",   works: ['song (prepare to strike)'] },
{name:"Tomanski",   works: ['rock sprites'] },
{name:"Dan Dela Rosa",   works: ['data persistence support'] },
{name:"pseudoLudo",   works: ['player explosion sound'] },
        // IF MAKING CHANGES that affect length update scrollLimit in credits.js
    ],
};

const PauseCause = {
    NotPaused: 0,
    PressedPause: 1,
    LostFocus: 2,
};

const DARKEN_BACKGROUNDS = true; // if true, all backgrounds are darker, to increase contrast
const DARKEN_BG_ALPHA = 0.25; // how much of the way to pure black? (0.0 to 1.0)

function Cheats() {
    //Could later add master toggle or special accesor for variables
    //Keep global for now

    //TODO: Add function that console.logs which cheats are active to call at program start

    this.documentDebugKeysIfEnabled = function() {
        if(this.debugKeysEnabled) {
            this.printCheatKeysInstructions();
        } else {
//            console.log("Debug Keys are turned off in Cheats.js");
        }
    }

    this.playerInvincible = false;
    this.debugKeysEnabled = false;

    this.printCheatKeysInstructions = function () {
        console.log("Cheat keys are turned on!");
        console.log("C adds capsules");
        console.log("E activates shield");
        console.log("L adds lives");
        console.log("0 - 9 changes game speed");
        console.log("J activates missiles");
        console.log("K activates double");
        console.log("H activates laser");
        console.log("T activates triple");
        console.log("G activates ghost ship");
        console.log("F activates force");
        console.log("O triggers the endgame");
        console.log("Shift + Left moves to previous level.");
        console.log("Shift + Right moves to next level.");
    };
}
let cheats = new Cheats();

