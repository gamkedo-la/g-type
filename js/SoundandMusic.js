//SoundandMusic
let audioFormat;
let musicSound = null;
let pauseSound;
let resumeSound;
let menuMusic;
let musicVolume;
let effectsVolume;
let currentBackgroundMusic;
let isMuted = false;
const VOLUME_INCREMENT = 0.05;

function configureGameAudio() {
	currentBackgroundMusic = new backgroundMusicClass();
	
	musicVolume = parseFloat(localStorage.getItem(localStorageKey.MusicVolume));
	effectsVolume = parseFloat(localStorage.getItem(localStorageKey.SFXVolume));
	
	if(musicVolume === null) {
		musicVolume = 1;
	}
	
	if(effectsVolume === null) {
		effectsVolume = 1;
	}	
}

function loadAudio() {
	pauseSound = new SoundOverlapsClass(assetPath.Audio + "PauseSound");
	resumeSound = new SoundOverlapsClass(assetPath.Audio + "ResumeSound");
	menuMusic = assetPath.Audio + "beeblebrox";
}

function setFormat() {
    const audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
        audioFormat = ".mp3";
    } else {
        audioFormat = ".ogg";
    }
}

function backgroundMusicClass() {	
    this.loopSong = function(filenameWithPath) {
        setFormat(); // calling this to ensure that audioFormat is set before needed

        if (musicSound != null) {
            musicSound.pause();
            musicSound = null;
        }
        musicSound = new Audio(filenameWithPath + audioFormat);
        musicSound.loop = true;
        this.setVolume(musicVolume);
    }

    this.pauseSound = function() {
        musicSound.pause();
    }

    this.resumeSound = function() {
        musicSound.play();
    }

    this.startOrStopMusic = function() {
        if (musicSound.paused) {
            musicSound.play();
        } else {
            musicSound.pause();
        }
    }
	
	this.setVolume = function(volume) {
		// Multipliction by a boolean serves as 1 for true and 0 for false
		console.log("Music Sound: " + musicSound + ", musicSound.volume: " + musicSound.volume);
		musicSound.volume = Math.pow(volume * !isMuted, 2);
		
		if(musicSound.volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			musicSound.play();
		}
	}
}

function SoundOverlapsClass(filenameWithPath) {
    setFormat();

    const fullFilename = filenameWithPath;
	let soundIndex = 0;
    const sounds = [new Audio(fullFilename + audioFormat), new Audio(fullFilename + audioFormat)];

    this.play = function() {
				if(!sounds[soundIndex].paused) {
					sounds.splice(soundIndex, 0, new Audio(fullFilename + audioFormat));
				}
        sounds[soundIndex].currentTime = 0;
        sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
        sounds[soundIndex].play();

        soundIndex = (++soundIndex) % sounds.length;
    }
}

function getRandomVolume(){
	var min = 0.9;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	isMuted = !isMuted;
	currentBackgroundMusic.setVolume(musicVolume);
}

function setEffectsVolume(amount)
{
	effectsVolume = amount;
	if(effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
}

function setMusicVolume(amount){
	musicVolume = amount;
	if(musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	currentBackgroundMusic.setVolume(musicVolume);
}

function turnVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}