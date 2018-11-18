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

const BG_PARALLAX_RATIO_1 = [0.3, 0.25, 0.3, 0.3]; // starfield
const BG_PARALLAX_RATIO_2 = [0.2, 0.5, 0.2, 0.2]; // transparent planets
const BG_PARALLAX_RATIO_3 = [2.0, 4.0, 2.0, 2.0]; // girders
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
    EyeBoss1:2,		//
    AlienBoss1:2,     //
    MaskBoss1:2,     //
    MiniMiniBoss1:2,     //
	Boss1:3,		//TODO: change these to
	Level2:0, 		//the correct indices from
	Level3:4, 		//the "currentBackgroundMusic" 
	GameOver:0,		//array (AudioManager.js ~line 11) once
	GameEnding:0,	//there is more than 1 element in that array
	Help:0,			//
	Options:0,		//
	Credits:0		//
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
    CutScene1_1:"Operation SAVE THE UNIVERSE",
    CutScene1_2:"Phase 1 - Defeat Planetary Defenses",
    CutScene1_3:"to enable follow on forces to approach safely",
    SkipCutScene:"Enter to skip",
    Contributors: [
{name:"H Trayford",   works: ['stuff'] },
{name:"Ryan Malm",   works: ['stuff'] },
{name:"Vaan Hope Khani",   works: ['stuff'] },
{name:"Christer \"McFunkypants\" Kaitila",   works: ['stuff'] },
{name:"Jaime Rivas",   works: ['stuff'] },
{name:"Jeff Hanlon",   works: ['stuff'] },
{name:"Chris Markle",   works: ['stuff'] },
{name:"Randy Tan Shaoxian",   works: ['stuff'] },
{name:"Michelly Oliveira",   works: ['stuff'] },
{name:"Marc Silva",   works: ['stuff'] },
{name:"Ian Ross",   works: ['stuff'] },
{name:"K. Anthony",   works: ['stuff'] },
{name:"Kevin Pavlish",   works: ['stuff'] },
{name:"Andrew Mushel",   works: ['stuff'] },
{name:"Mary Brady",   works: ['stuff'] },
{name:"Caspar \"SpadXIII\" Dunant",   works: ['stuff'] },
{name:"Remy Lapointe",   works: ['stuff'] },
{name:"Stebs",   works: ['stuff'] },
{name:"Vince McKeown",   works: ['stuff'] },
{name:"T.",   works: ['stuff'] },
{name:"Zak Ali",   works: ['stuff'] },
{name:"Lou \"Mass KonFuzion\" Herard",   works: ['stuff'] },
{name:"Chris DeLeon",   works: ['stuff'] },
{name:"Vignesh Ramesh",   works: ['stuff'] },
{name:"Dan Dela Rosa",   works: ['stuff'] },
{name:"Loren Pierce",   works: ['stuff'] },
{name:"Joe C.S.",   works: ['stuff'] },
{name:"Liam Twose",   works: ['stuff'] },
{name:"pseudoLudo",   works: ['stuff'] },
{name:"Coy Compositions",   works: ['stuff'] },
{name:"Tomanski",   works: ['stuff'] }
        // IF MAKING CHANGES that affect length update scrollLimit in credits.js
    ],
};

const PauseCause = {
    NotPaused: 0,
    PressedPause: 1,
    LostFocus: 2,
};
