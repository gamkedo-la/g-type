setFormat();
setAudioPath("./audio/");

const DEFAULT_MUSIC_VOLUME = 0.7;
const DEFAULT_SFX_VOLUME = 0.6;
//set sound clips and music tracks here

//need to change file name to match
const menuMusic = new musicTrackLoop("Level1-CoyCompositions", 84, {author: "Coy Compositions", album: "G-Type OST", year: "2018", title: "Level 1 Coy Compositions"});  //By Coy Compositions
const level1Music = new musicTrackLoop("PrepareToStrike-v1", 100, {author: "JoeCS", album: "G-Type OST", year: "2018", title: "Prepare To Strike (Main Menu Theme)"});  //By Joe Spedale
const miniBoss1Music = new musicTrackLoop("MiniBoss", 40, {author: "Chris Markle", album: "G-Type OST", year: "2018", title: "Mini-Boss 1 Theme"});  //By Chris Markle
const boss1Music = new musicTrackLoop("stebs_g-type_boss_music", 43, {author: "Stebs", album: "G-Type OST", year: "2018", title: "Stebs G-Type Boss Music"});  //By Stebs
//menuMusic.setVolume(0.2);

const currentBackgroundMusic = new musicContainer([menuMusic, level1Music, miniBoss1Music, boss1Music]);
currentBackgroundMusic.setVolume(0.6);

//menu sfx
const pauseSound = new sfxClipSingle("PauseSound");
pauseSound.setVolume(0.4);
const resumeSound = new sfxClipSingle("ResumeSound");
resumeSound.setVolume(0.4);

//player sfx
const playerFireRegular = new sfxClipOverlap("PlayerFireRegular", 3);
playerFireRegular.setVolume(0.6);
const playerFireLaser = new sfxClipOverlap("PlayerFireLaser", 3);
playerFireLaser.setVolume(0.5);
const playerPowerUpActivate = new sfxClipSingle("PlayerPowerupActivate");
playerPowerUpActivate.setVolume(0.65);
const playerShieldActivate = new sfxClipSingle("PlayerShieldActivate");
playerShieldActivate.setVolume(0.7);
const playerShieldHit = new sfxClipOverlap("PlayerShieldReflect", 3);
playerShieldHit.setVolume(0.7);
const playerExplosion = new sfxClipSingle("PlayerExplosion");
playerExplosion.setVolume(0.6);
const extraLife = new sfxClipSingle("extraLife");
extraLife.setVolume(0.7);

//enemy and environment sfx
const enemySmallExplosion = new sfxClipOverlap("EnemySmallExplosion", 3);
enemySmallExplosion.setVolume(0.6);
const enemyMediumExplosion = new sfxClipOverlap("EnemyMediumExplosion", 3);
enemyMediumExplosion.setVolume(0.6);
const enemyLargeExplosion = new sfxClipOverlap("EnemyLargeExplosion", 3);
enemyLargeExplosion.setVolume(0.6);
const bubbleExplosion = new sfxClipOverlap("bubble", 3);
bubbleExplosion.setVolume(0.35);
const shotHitIndestructible = new sfxClipOverlap("PlayerShieldReflect", 3); //placeholder sound effect.  Need new made -LP
shotHitIndestructible.setVolume(0.6);

//const uiSelect = new sfxClipSingle("uiSelect");

const allSFX = {
	sfxList : [pauseSound, 
			   resumeSound, 
			   playerFireRegular, 
			   playerFireLaser, 
			   playerPowerUpActivate, 
			   playerShieldActivate, 
			   playerShieldHit,  
			   playerExplosion,
			   extraLife,
			   enemySmallExplosion,
			   enemyMediumExplosion,
			   bubbleExplosion,
			   shotHitIndestructible
			   ],
	stop: function(){
		for(var i=0; i < this.sfxList.length; i++){
			this.sfxList[i].stop();
		}
	}
};

function setFormat() {
	var audio = new Audio();
	if (audio.canPlayType("audio/ogg")) {
		audioFormatType = ".ogg";
	} else {
		audioFormatType = ".mp3";
	}
}

function setAudioPath(path = "") {
	audioPath = path;
}

function audioFormat(alt = false) {
	var format = audioFormatType;
	if (alt !== false) {
		format = ".mp3";
	}
	return format;
}

function toggleMute() {
	isMuted = !isMuted;
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function setMute(TorF) {
	isMuted = TorF;
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function getMute() {
	return isMuted;
}


//Time Manager
const REMOVE = 0; // Arrayformat [REMOVE]
const FADE = 1; // Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
const TIMER = 2; // Arrayformat [TIMER, track, endTime, callSign]
const STOP = 3; // Arrayformat [STOP, track, endTime]

var AudioEventManager = new audioEventManager();

function audioEventManager() {
	var eventList = [];
	var now = Date.now();

	this.returnEventList = function() {
		return eventList;
	};

	this.updateEvents = function() {
		now = Date.now();
		runList();
		cleanupList();
	};

	this.addFadeEvent = function(track, duration, endVol) {
		var check = checkListFor(FADE, track);
		var endTime = duration * 1000 + now;
		var startVolume = track.getVolume();

		if (check === "none") {
			eventList.push([FADE, track, now, endTime, startVolume, endVol, false]);
		} else {
			eventList[check] = [FADE, track, now, endTime, startVolume, endVol, false];
		}
	}

	this.addCrossfadeEvent = function(track, duration, endVol) {
		var check = checkListFor(FADE, track);
		var endTime = duration * 1000 + now;
		var startVolume = track.getVolume();

		if (check === "none") {
			eventList.push([FADE, track, now, endTime, startVolume, endVol, true]);
		} else {
			eventList[check] = [FADE, track, now, endTime, startVolume, endVol, true];
		}
	};

	this.addTimerEvent = function(track, duration, callSign = "none") {
		var thisTrack = track;
		var check = checkListFor(TIMER, thisTrack, callSign);
		var endTime = (duration * 1000) + now;

		if (check === "none") {
			eventList.push([TIMER, track, endTime, callSign]);
		} else {
			eventList[check] = [TIMER, track, endTime, callSign];
		}
	};

	this.addStopEvent = function(track, duration) {
		var thisTrack = track;
		var check = checkListFor(STOP, thisTrack);
		var endTime = (duration * 1000) + now;

		if (check === "none") {
			eventList.push([STOP, track, endTime]);
		} else {
			eventList[check] = [STOP, track, endTime];
		}
	};

	this.removeTimerEvent = function(track, callSign = "none") {
		var thisTrack = track;
		var check = checkListFor(TIMER, thisTrack, callSign);

		if (check === "none") {
			return;
		} else {
			eventList[check] = [REMOVE];
		}
	};

	this.removeStopEvent = function(track) {
		var thisTrack = track;
		var check = checkListFor(STOP, thisTrack);

		if (check === "none") {
			return;
		} else {
			eventList[check] = [REMOVE];
		}
	};

	function runList(){
		for (var i = 0; i < eventList.length; i++) {
			if (eventList[i][0] === FADE) {
				// Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() === false) {
						if(eventList[i][6]) {
							if(eventList[i][4] < eventList[i][5]){
								thisTrack.setVolume(scaleRange(0, 1, eventList[i][4], eventList[i][5], 
									Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 0, 1, now), 0.5)));
							} else {
								thisTrack.setVolume(scaleRange(1, 0, eventList[i][4], eventList[i][5], 
									Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 1, 0, now), 0.5)));
							}
						} else {
							thisTrack.setVolume(interpolateFade(eventList[i][2], eventList[i][3], eventList[i][4], eventList[i][5], now));
						}
					if (eventList[i][3] < now) {
						eventList[i] = [REMOVE];
					}
				}
			}
			if (eventList[i][0] === TIMER) {
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() == false) {
					if (eventList[i][2] <= now) {
						eventList[i] = [REMOVE];
						thisTrack.triggerTimerEnded(eventList[i][3]);
					}
				} else {
					eventList[i] = [REMOVE];
				}
			}
			if (eventList[i][0] === STOP) {
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() === false) {
					if (eventList[i][2] <= now) {
						eventList[i] = [REMOVE];
						thisTrack.stop();
					}
				}
			}
		}

	}

	function cleanupList() {
		eventList.sort(function(a, b){return b-a});
		while (eventList[eventList.length - 1] === REMOVE) {
			eventList.pop();
		}
	}

	function checkListFor(eventType, track, callSign = "none"){
		var foundItem = false;
		for (var i = 0; i < eventList.length; i++) {
			if (eventList[i][0] === eventType) {
				if (eventList[i][1] === track) {
					if(eventType === TIMER && eventList[i][3] === callSign) {
						foundItem = true;
						return i;
					} else if (eventType !== TIMER) {
						foundItem = true;
						return i;
					}
				}
			}
		}
		if (!foundItem) {
			return "none";
		}
	};
}

function interpolateFade(startTime, endTime, startVolume, endVolume, currentTime) {
	/*
	x1 = startTime
	y1 = startVolume

	x2 = endTime
	y2 = endVolume

	x = currentTime
	y = y1 + (x - x1)((y2 - y1)/(x2 - x1))
    currentVolume = startVolume + (now - startTime) * ((endVolume - startVolume) / (endTime - startTime))
	*/
	if (currentTime > endTime) {
		currentTime = endTime;
	}
	return startVolume + (currentTime - startTime) * ((endVolume - startVolume) / (endTime - startTime));
}

function scaleRange(inputStart, inputEnd, outputStart, outputEnd, value) {
	var scale = (outputEnd - outputStart) / (inputEnd - inputStart);
	return outputStart + ((value - inputStart) * scale);
}

//Game hooks
const VOLUME_INCREMENT = 0.1;

function turnVolumeUp() {
	MusicVolumeManager.setVolume(musicVolume + VOLUME_INCREMENT);
	SFXVolumeManager.setVolume(sfxVolume + VOLUME_INCREMENT);
}

function turnVolumeDown() {
	MusicVolumeManager.setVolume(musicVolume - VOLUME_INCREMENT);
	SFXVolumeManager.setVolume(sfxVolume - VOLUME_INCREMENT);
}

function pauseAudio() {
	currentBackgroundMusic.pause();
	// These objects do not exist?
//	engine_master.pause();
//	brake_master.pause();
//	countDown.pause();
}

function resumeAudio() {
	if (currentBackgroundMusic.getTime() > 0) {
		currentBackgroundMusic.resume();
	}
	
    MusicVolumeManager.updateVolume();
    SFXVolumeManager.updateVolume();
}
