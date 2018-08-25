let canvas;
let canvasContext;
let scene;
let timer;
let currentLevelIndex = 0;
let worldSpeed = 1;
let remainingLives = 3;
	
const DEBUG = true;
const DRAW_COLLIDERS = false;
const COLLIDER_COLOR = 'yellow';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FRAMES_PER_SECOND = 30;
const SIM_STEP = 16;//milliseconds in each simulation step ~1/2 frame

const gameTitle = {
	Main:"G-Type",
	Subtitle:"Advanced Strike Team"
};

const localStorageKey = {
    MusicVolume: "musicVolume",
    SFXVolume: "effectsVolume",
    IsLocalStorageInitialized: "isLocalStorageInitialized",
    ShowedHelp: "showedHelp",
}

const assetPath = {
    Audio: "./audio/",
    Image: "images/"
}

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

const CLEAR_COLOR = Color.Red;

const LOADING_SCREEN = 'loading';
const MENU_SCREEN = 'menu';
const OPTIONS_SCREEN = 'options';
const LEVEL_SELECT_SCREEN = 'level';
const CREDITS_SCREEN = 'credits';
const HELP_SCREEN = 'help';
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
    Options: "Options",
    Music: "Music",
    SoundFX: "SFX",
    Credits: "Credits",
    Main: "Main Menu",
    LevelSelect: 'Select Level',
    GameOver: "Game Over",
    Contributors: [
        {name:"H Trayford",   works: ['Game Lead', 'Core Gameplay', 'Level Editor', 'AI Drivers', 'Background Parallax', 'Nitro Boost', 'Time Limit', 'Street Light Art', 'Animated Radio Tower', 'Collision Detection', 'Art Integration', 'Billboards (Over 10 Designs)'] },
/*        {name:"Terrence McDonnell", works: ['Signs (Over 28 Designs)', 'Checkpoint Code', 'Crashing Animation Code', 'Menu Improvements', 'Finish Line Animation', 'Stage Ground Colors', 'Track Design (Skyline, Mountain, Forest)','Main Menu Animation']},
        {name:"Artem Smirnov", works: ['Screen State Machine','City Skyline','Data Storage','End of Round Report','Level Select','Game Over Screen','Font Improvements','Dashboard Radio', 'Automatic Transmission']},
        {name:"Adam A. Lohnes", works: ['Truck Model and Sprites','Semi Model and Sprites','Bus Model and Sprites']},
        {name:"Christer McFunkypants Kaitila", works: ['Particle Effects', 'Car Spritesheet Code', 'Dashboard HUD Code', 'Cloudy Sky Backgrounds', 'Sharp Pixel Scaling','Gamepad Support', 'Kangaroo Sign', 'Title Parallax', 'Random Track Generator (Unreleased WIP)']},
        {name:"Michael Misha Fewkes", works: ['Custom Audio Engine Code','Sounds (Engine, Off Road, Brakes, Crash)', 'Sound Mixing', 'Starting Countdown']},
        {name:"Vignesh Ramesh", works: ['Music (Snow Level, Night Theme)','Player Car Model','Sound (Cheering)','Billboard (Slick Punch)']},
        {name:"Brandon Trumpold", works: ['Steering Feel Tweaks','Tuning (speeds, crash time)', 'RPM Needle Fix']},
        {name:"Stebs",  works: ['Billboard (East Coast Throwback)', 'Billboard (Presidential)', 'Billboard (Attractions)', 'Additional Tree Art']},
        {name:"Chris Markle", works: ['Music (Main Menu, Game Over)', 'Sound (Checkpoint)','Billboard (Globuton)']},
        {name:"Tomanski", works: ['Snowy Mountain Background','Props (Tires)','Props (Trees)','Main Menu Sprites']},
        {name:"Todd Enyeart", works: ['Billboard (Sandwich)','Billboard (Coffee)', 'Billboard (Fast Food)']},
        {name:"Barıs Koklu", works: ['Gear Shifting', "Game Over Screen Improvement"]},
        {name:"Joseph Spedale", works: ['Countdown Sounds', 'Music (Dr Juno)']},
        {name:"Remy Lapointe", works: ['Billboard (Arcaninjadroid)','Billboard (Spell Spiel)']},
        {name:"Mary Brady", works: ['Dashboard UI Art']},
        {name:"Dynokhan", works: ['Rear Car Bump Collision']},
        {name:"Dan Dela Rosa", works: ['Save State Improvements']},
        {name:"Jeremy Kenyon", works: ['Billboard (We Must Prepare)']},
        {name:"Trenton Pegeas", works: ['Billboard (Aether)']},
        {name:"Brian Boucher", works: ['Playtesting', 'Music Bug Fix']},
        {name:"Brian Dieffenderfer", works: ['Additional Road Tiles']},
        {name:"Chris DeLeon", works: ['Particle Camera Drift','Perspective Sprite Tweaks','Credits Data Entry']}*/
        // IF MAKING CHANGES that affect length update scrollLimit in credits.js
    ],
};