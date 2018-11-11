/*
AudioClasses.js and AudioManager,js are an attemp my Michael Fewkes to make more complex audio behaviors simpler to implement.

Functions that all sound objects share:
.play()    plays from the beggining of the audio file
.stop()	    stops playback and resets playback time
.resume()    plays file from last playback time
.pause()    stops playback without resetting playback time
.setVolume()/.getVolume()    reports and sets object volume
.setMixLevel()    sets a volume pre setVolume(), used for settimg a volume relative to the mix
.setTime()/.getTime()    controls the playback time
.getDuration()    reports the duration of the file
.getPaused()    reports true if the file is not currently playing

Looped files:
To work around HTML's choppy looping, be don't use a traditional looped track.  Instead we have a tail extend 
out past the end of the loop and specify a duration at which the loop should happen.  Instead of having pops, 
clicks, and chops, we get a clean loop with no gaps of silence.
*/

//General
var isMuted = false;

//SFX Classes
var sfxVolume = localStorageHelper.getFloat('sfxVolume');
console.log("SFX Volume: " + sfxVolume);
if((sfxVolume === null) || (sfxVolume === undefined)) {
	localStorageHelper.setFloat('sfxVolume', 1);
	sfxVolume = 1;
}
SFXVolumeManager = new sfxVolumeManager();
function sfxVolumeManager() {
	var clipList = [];

	this.setVolume = function(amount) {
		if (amount > 1) {sfxVolume = 1;}
		else if (amount < 0) {sfxVolume = 0;}
		else {sfxVolume = amount;}
		for (var i in clipList) {
			clipList[i].updateVolume();
		}
		localStorageHelper.setFloat('sfxVolume', sfxVolume);
	};

	this.getVolume = function() {
		return sfxVolume;
	};

	this.updateVolume = function() {
		for(var i in clipList) {
			clipList[i].updateVolume();
		}
	};

	this.addToList = function(sfxClip) {
		clipList.push(sfxClip);
	};

	this.reportList = function() {
		return clipList;
	};
}

function getRandomVolume(){
	var min = 0.85;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function sfxClipSingle(filename) {//A simple, single buffer sound clip
	var soundFile = new Audio(audioPath+filename+audioFormat());
	soundFile.onerror = function(){soundFile = new Audio(audioPath+filename+audioFormat(true))};
	var clipVolume = 1;
	var randVolume = true;
	var clipName = filename;
	var duration = soundFile.duration;
	var mixVolume = 1;

	soundFile.pause();
	SFXVolumeManager.addToList(this);


	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile.currentTime = 0;
		this.updateVolume();
		soundFile.play();
	};

	this.stop = function() {
		soundFile.pause();
		soundFile.currentTime = 0;
	};

	this.resume = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile.play();
	};

	this.pause = function() {
		soundFile.pause();
	};

	this.updateVolume = function() {
		if (randVolume) {
			soundFile.volume = Math.pow(mixVolume * sfxVolume * clipVolume * getRandomVolume() * !isMuted, 2);
		} else {
			soundFile.volume = Math.pow(mixVolume * sfxVolume * clipVolume * !isMuted, 2);
		}
	};

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		soundFile.volume = Math.pow(mixVolume * newVolume * sfxVolume * !isMuted, 2);
		clipVolume = newVolume;
	};

	this.getVolume = function() {
		return sfxVolume * clipVolume * !isMuted;
	};

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	};

	this.setTime = function(time) {
		soundFile.currentTime = time;
	};

	this.getTime = function() {
		return soundFile.currentTime;
	};
	
	this.setClipName = function(name) {
		clipName = name;
	};

	this.getClipName = function() {
		return clipName;
	};
	
	this.getDuration = function() {
		return duration;
	};

	this.getPaused = function() {
		return soundFile.paused;
	};
}

function sfxClipOverlap(filename, voices = 2) {//A sound clip with as many buffers as specified
	var soundFile = new Array(voices);
	var maxVoices = soundFile.length;

	for (let i = 0; i < voices; i++) {
		soundFile[i] = new Audio(audioPath+filename+audioFormat());
		soundFile[i].onerror = function(){soundFile[i] = new Audio(audioPath+filename+audioFormat(true))};
		soundFile[i].pause();
	}

	var currentClip = 0;
	var clipVolume = 1;
	var randVolume = true;
	var clipName = filename;
	var duration = soundFile[0].duration;
	var mixVolume = 1;


	SFXVolumeManager.addToList(this);

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentClip++;
		if (currentClip >= maxVoices) {currentClip = 0;}

		soundFile[currentClip].currentTime = 0;
		this.updateVolume();
		soundFile[currentClip].play();
	};

	this.stop = function() {
		for (var i in soundFile) {
			soundFile[i].pause();
			soundFile[i].currentTime = 0;
		}
	};

	this.resume = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile[currentClip].play();
	};

	this.pause = function() {
		for (var i in soundFile) {
			soundFile[i].pause();
		}
	};

	this.updateVolume = function() {
		if (randVolume) {
			for (var i in soundFile) {
				soundFile[i].volume = Math.pow(mixVolume * sfxVolume * clipVolume * getRandomVolume() * !isMuted, 2);
			}
		} else {
			for (var i in soundFile) {
				soundFile[i].volume = Math.pow(mixVolume * sfxVolume * clipVolume * !isMuted, 2);
			}
		}
	};

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		for (var i in soundFile) {
			soundFile[i].volume = Math.pow(mixVolume * newVolume * sfxVolume * !isMuted, 2);
		}
		clipVolume = newVolume;
	};

	this.getVolume = function() {
		return sfxVolume * clipVolume * !isMuted;
	};

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	};

	this.setTime = function(time) {
		soundFile.currentTime[currentClip] = time;
	};

	this.getTime = function() {
		return soundFile[currentClip].currentTime;
	};
	
	this.setClipName = function(name) {
		clipName = name;
	};

	this.getClipName = function() {
		return clipName;
	};
	
	this.getDuration = function() {
		return duration;
	};

	this.getPaused = function() {
		return soundFile[currentClip].paused;
	};
}

function sfxClipLoop(filename, playLength) {//Double buffer sound file that loops
	var soundFile = new Array(new Audio(audioPath+filename+audioFormat()), new Audio(audioPath+filename+audioFormat()));
	soundFile[0].onerror = function(){soundFile[0] = new Audio(audioPath+filename+audioFormat(true))}
	soundFile[1].onerror = function(){soundFile[1] = new Audio(audioPath+filename+audioFormat(true))}
	var currentClip = 0;
	var duration = playLength;
	var trackName = filename;
	var clipVolume = 1;
	var mixVolume = 1;

	soundFile[0].pause();
	soundFile[1].pause();
	SFXVolumeManager.addToList(this);

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile[currentClip].currentTime = 0;
		this.updateVolume();
		soundFile[currentClip].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.stop = function() {
		soundFile[0].pause();
		soundFile[0].currentTime = 0;
		soundFile[1].pause();
		soundFile[1].currentTime = 0;
	};

	this.resume = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile[currentClip].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.pause = function() {
		soundFile[0].pause();
		soundFile[1].pause();
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile[currentClip].currentTime = time;
		this.updateVolume();
		soundFile[currentClip].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.triggerTimerEnded = function(callSign) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentClip++;
		if (currentClip > 1) {currentClip = 0;}
		this.play();
	};

	this.updateVolume = function() {
		soundFile[0].volume = Math.pow(mixVolume * sfxVolume  * clipVolume * !isMuted, 2);
		soundFile[1].volume = Math.pow(mixVolume * sfxVolume  * clipVolume * !isMuted, 2);
	};

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		soundFile[currentClip].volume = Math.pow(mixVolume * newVolume * sfxVolume * !isMuted, 2);
		clipVolume = newVolume;
		if (clipVolume <= 0) {
			this.pause();
		}
	};

	this.getVolume = function() {
		return clipVolume * !isMuted;
	};

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	};

	this.setTime = function(time) {
		var newTime = time;
		if(newTime < 0) {
			newTime = 0;
		}
		while (newTime >= duration) {
			newTime -= duration;
		}
		soundFile[currentClip].currentTime = newTime;
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.getTime = function() {
		return soundFile[currentClip].currentTime;
	};
	
	this.setClipName = function(name) {
		trackName = name;
	};

	this.getClipName = function() {
		return trackName;
	};
	
	this.getDuration = function() {
		return duration;
	};

	this.getPaused = function() {
		return soundFile[currentClip].paused;
	};
}

function sfxContainer(clipList) {//Basic Container
	var soundFile = [];
	var currentClip = 0;

	for (var i in clipList) {
		soundFile[i] = clipList[i];
		soundFile[i].pause();
	}

	var clipVolume = 1;

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		soundFile[currentClip].play();
	};

	this.stop = function() {
		for (var i in soundFile) {
			soundFile[i].stop();
		}
	};

	this.resume = function() {
		soundFile[currentClip].resume();
	};

	this.pause = function() {
		for (var i in soundFile) {
			soundFile[i].pause();
		}
	};

	this.loadClip = function(newClip, slot) {
		soundFile[slot] = newClip;
	};

	this.updateVolume = function() {
		for (var i in soundFile) {
			soundFile[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		soundFile[currentClip].setVolume(newVolume);
	};

	this.getVolume = function() {
		return soundFile[currentClip].getVolume();
	};

	this.setCurrentClip = function(clipNumber) {
		currentClip = clipNumber;
	};

	this.getCurrentClip = function() {
		 return currentClip;
	};
	
	this.getCurrentSound = function() {
		return soundFile[currentClip];
	};

	this.getListLength = function() {
		 return soundFile.length;
	};

	this.setTime = function(time) {
		soundFile[currentClip].setTime(time);
	};

	this.getTime = function() {
		return soundFile[currentClip].getTime();
	};
	
	this.setClipName = function(name) {
		soundFile[currentClip].setClipName(name);
	};

	this.getClipName = function() {
		return soundFile[currentClip].getClipName();
	};
	
	this.getDuration = function() {
		return soundFile[currentClip].getDuration();
	};

	this.getPaused = function() {
		return soundFile[currentClip].getPaused();
	};
}

function sfxContainerRandom(clipList) {//Plays a random list-item on playback
	var soundFile = [];
	var trackList = clipList;
	var currentClip = 0;

	for (var i in clipList) {
		soundFile[i] = clipList[i];
		soundFile[i].pause();
	}

	var clipVolume = 1;

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentClip = Math.floor(Math.random() * soundFile.length);
		soundFile[currentClip].play();
	};

	this.stop = function() {
		for (var i in trackList) {
			soundFile[i].stop();
		}
	};

	this.resume = function() {
		soundFile[currentClip].resume();
	};

	this.pause = function() {
		for (var i in trackList) {
			soundFile[i].pause();
		}
	};

	this.loadClip = function(newClip, slot) {
		soundFile[slot] = newClip;
	};

	this.updateVolume = function() {
		for (var i in trackList) {
			soundFile[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		soundFile[currentClip].setVolume(newVolume);
	};

	this.getVolume = function() {
		return soundFile[currentClip].getVolume();
	};

	this.setCurrentClip = function(clipNumber) {
		currentClip = clipNumber;
	};

	this.getCurrentClip = function() {
		 return currentClip;
	};

	this.getListLength = function() {
		 return soundFile.length;
	};

	this.setTime = function(time) {
		soundFile[currentClip].setTime(time);
	};

	this.getTime = function() {
		return soundFile[currentClip].getTime();
	};
	
	this.setClipName = function(name) {
		soundFile[currentClip].setClipName(name);
	};

	this.getClipName = function() {
		return soundFile[currentClip].getClipName();
	};
	
	this.getDuration = function() {
		return soundFile[currentClip].getDuration();
	};

	this.getPaused = function() {
		return soundFile[currentClip].getPaused();
	};
}


//Music Classes
var musicVolume = localStorageHelper.getFloat('musicVolume');
if((musicVolume === null) || (musicVolume === undefined)) {
	localStorageHelper.setFloat('musicVolume', 1);
	musicVolume = 1;
}
MusicVolumeManager = new musicVolumeManager();
function musicVolumeManager() {
	var trackList = [];

	this.setVolume = function(amount) {
		if (amount > 1) {musicVolume = 1;}
		else if (amount < 0) {musicVolume = 0;}
		else {musicVolume = amount;}
		for (var i in trackList) {
			trackList[i].updateVolume();
		}
		localStorageHelper.setFloat('musicVolume', musicVolume);
	};

	this.getVolume = function() {
		return musicVolume;
	};

	this.updateVolume = function() {
		for(var i in trackList) {
			trackList[i].updateVolume();
		}
	};

	this.addToList = function(musicTrack) {
		trackList.push(musicTrack);
	};

	this.reportList = function() {
		return trackList;
	};
}

function musicTrack(filename, playLength) {//Single buffer music file
	var musicFile = new Audio(audioPath+filename+audioFormat());
	musicFile.onerror = function(){musicFile = new Audio(audioPath+filename+audioFormat(true))};
	var trackName = filename;
	var duration = playLength;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile.pause();
	musicFile.loop = false;
	MusicVolumeManager.addToList(this);

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile.currentTime = 0;
		this.updateVolume();
		musicFile.play();
	};

	this.stop = function() {
		musicFile.pause();
		musicFile.currentTime = 0;
	};

	this.resume = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile.play();
	};

	this.pause = function() {
		musicFile.pause();
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile.currentTime = time;
		musicFile.play();
	};

	this.updateVolume = function() {
		musicFile.volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
	};

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		musicFile.volume = Math.pow(mixVolume * newVolume * musicVolume * !isMuted, 2);
		trackVolume = newVolume;
		if (trackVolume <= 0) { this.stop();}
	};

	this.getVolume = function() {
		return trackVolume * !isMuted;
	};

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	};

	this.getSourceTrack = function() {
		return this;
	};

	this.setTime = function(time) {
		musicFile.currentTime = time;
	};

	this.getTime = function() {
		return musicFile.currentTime;
	};
	
	this.setTrackName = function(name) {
		trackName = name;
	};

	this.getTrackName = function() {
		return trackName;
	};
	
	this.getDuration = function() {
		return duration;
	};

	this.getPaused = function() {
		return musicFile.paused;
	};

	this.getMeta = function() {
		return this.meta;
	};

	return this;
}

function musicTrackLoop(filename, playLength, meta) {//Double buffer music file that loops
	var musicFile = new Array(new Audio(audioPath+filename+audioFormat()), new Audio(audioPath+filename+audioFormat()));
	musicFile[0].onerror = function(){musicFile[0] = new Audio(audioPath+filename+audioFormat(true))};
	musicFile[1].onerror = function(){musicFile[1] = new Audio(audioPath+filename+audioFormat(true))};
	var currentTrack = 0;
	var duration = playLength;
	var trackName = filename;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile[0].pause();
	musicFile[1].pause();
	MusicVolumeManager.addToList(this);

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile[currentTrack].currentTime = 0;
		this.updateVolume();
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.meta = meta;

	this.stop = function() {
		musicFile[0].pause();
		musicFile[0].currentTime = 0;
		musicFile[1].pause();
		musicFile[1].currentTime = 0;
	};

	this.resume = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.pause = function() {
		musicFile[0].pause();
		musicFile[1].pause();
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicFile[currentTrack].currentTime = time;
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.triggerTimerEnded = function(callSign) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentTrack++;
		if (currentTrack > 1) {currentTrack = 0;}
		this.play();
	};

	this.updateVolume = function() {
		musicFile[0].volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
		musicFile[1].volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
	};

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		musicFile[currentTrack].volume = Math.pow(mixVolume * newVolume * musicVolume * !isMuted, 2);
		trackVolume = newVolume;
		if (trackVolume <= 0) { this.stop();}
	};

	this.getVolume = function() {
		return trackVolume * !isMuted;
	};

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	};

	this.getSourceTrack = function() {
		return this;
	};

	this.setTime = function(time) {
		var newTime = time;
		if(newTime < 0) {newTime = 0;}
		while (newTime >= duration) {newTime -= duration;}
		musicFile[currentTrack].currentTime = newTime;
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "loop");
	};

	this.getTime = function() {
		return musicFile[currentTrack].currentTime;
	};
	
	this.setTrackName = function(name) {
		trackName = name;
	};

	this.getTrackName = function() {
		return trackName;
	};
	
	this.getDuration = function() {
		return duration;
	};

	this.getPaused = function() {
		return musicFile[currentTrack].paused;
	};

	this.getMeta = function() {
		return this.meta;
	};
}

function musicContainer(trackList) {//Basic containers
	var musicTrack = [];
	var currentTrack = 0;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	var trackVolume = 1;

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
        for (var i in trackList) {
            musicTrack[i] = trackList[i];
            musicTrack[i].pause();
        }
		musicTrack[currentTrack].play();
	};

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	};

	this.nextTrack = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		currentTrack = (currentTrack + 1) % trackList.length;
		this.play();
	};

	this.prevTrack = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		currentTrack = (currentTrack - 1 + trackList.length) % trackList.length;
		this.play();
	};

	this.resume = function() {
		musicTrack[currentTrack].resume();
	};

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicTrack[currentTrack].playFrom(time);
	};

	this.loadTrack = function(newTrack, slot) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		var timeNow = musicTrack[currentTrack].getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	};

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	};

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	};

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	};

	this.getCurrentTrack = function() {
		 return currentTrack;
	};
	
	this.getCurrentMusic = function() {
		return musicTrack[currentTrack];
	};

	this.getListLength = function() {
		 return musicTrack.length;
	};

	this.getSourceTrack = function() {
		return musicTrack[currentTrack].getSourceTrack();
	};

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	};

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	};
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	};

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	};
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	};

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	};

	this.getTrackMeta = function() {
		return musicTrack[currentTrack].getMeta();
	};
}

function musicContainerRandom(trackList) {//Picks random list-item to play on play
	var musicTrack = [];
	var currentTrack = 0;
	var lastTrack = 0;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	var trackVolume = 1;

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentTrack = Math.floor(Math.random() * musicTrack.length);
		musicTrack[currentTrack].play();
	};

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	};

	this.resume = function() {
		musicTrack[currentTrack].resume();
	};

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicTrack[currentTrack].playFrom(time);
	};

	this.loadTrack = function(newTrack, slot) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		var timeNow = musicTrack[currentTrack].getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	};

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	};

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	};

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	};

	this.getCurrentTrack = function() {
		 return currentTrack;
	};

	this.getListLength = function() {
		 return musicTrack.length;
	};

	this.getSourceTrack = function() {
		return musicTrack[currentTrack].getSourceTrack();
	};

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	};

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	};
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	};

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	};
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	};

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	};
}

function musicContainerPlaylistRandom(trackList, maxDurationInSeconds = 180, minDurationInSeconds = 60) {//Picks new random list-item to play every loop
	var musicTrack = [];
	var lastTrack = 0;
	var playTime = 0;
	var playMax = maxDurationInSeconds;
	var playMin = minDurationInSeconds;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	var trackVolume = 1;
	var currentTrack = Math.floor(Math.random() * musicTrack.length);

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		if (playTime > playMin){
			if(Math.random() <= (playTime - playMin)/(playMax - playMin)) {
				while(currentTrack === lastTrack) {
					currentTrack = Math.floor(Math.random() * musicTrack.length);
				}
				playTime = 0;
			}
		}
		musicTrack[currentTrack].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "cue");
		AudioEventManager.removeTimerEvent(musicTrack[currentTrack].getSourceTrack(), "loop");
		lastTrack = currentTrack;
		playTime += musicTrack[currentTrack].getDuration();
	};

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	};

	this.resume = function() {
		musicTrack[currentTrack].resume();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "cue");
		AudioEventManager.removeTimerEvent(musicTrack[currentTrack].getSourceTrack(), "loop");
	};

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	};

	this.jump = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		playTime = playMax;
		this.play();
	};

	this.skip = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		this.play();
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicTrack[currentTrack].playFrom(time);
	};

	this.triggerTimerEnded = function(callSign) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.play();
	};

	this.loadTrack = function(newTrack, slot) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		var timeNow = musicTrack[currentTrack].getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	};

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	};

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	};

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	};

	this.getCurrentTrack = function() {
		 return currentTrack;
	};

	this.getListLength = function() {
		 return musicTrack.length;
	};

	this.getSourceTrack = function() {
		return musicTrack[currentTrack].getSourceTrack();
	};

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	};

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	};
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	};

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	};
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	};

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	};
}

function musicContainerSequence(trackList) {//Plays list-items in order
	var musicTrack = [];
	var lastTrack = 0;
	var currentTrack = 0;
	var trackVolume = 1;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	this.play = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicTrack[currentTrack].play();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "cue");
		AudioEventManager.removeTimerEvent(musicTrack[currentTrack].getSourceTrack(), "loop");
	};

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	};

	this.resume = function() {
		musicTrack[currentTrack].resume();
		AudioEventManager.addTimerEvent(this, (this.getDuration() - this.getTime()), "cue");
		AudioEventManager.removeTimerEvent(musicTrack[currentTrack].getSourceTrack(), "loop");
	};

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	};

	this.jump = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		playTime = playMax;
		this.play();
	};

	this.skip = function() {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		this.stop();
		this.play();
	};

	this.playFrom = function(time) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		musicTrack[currentTrack].playFrom(time);
	};

	this.triggerTimerEnded = function(callSign) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		currentTrack++;
		if(currentTrack < musicTrack.length) {
			this.play();
		} else {
			currentTrack = musicTrack.length - 1;
		}
	};

	this.loadTrack = function(newTrack, slot) {
        if(!didInteract) {return;}//if player hasn't interacted, play() will fail w/ error
		var timeNow = musicTrack[currentTrack].getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	};

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	};

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	};

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	};

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	};

	this.getCurrentTrack = function() {
		 return currentTrack;
	};

	this.getListLength = function() {
		 return musicTrack.length;
	};

	this.getSourceTrack = function() {
		return musicTrack[currentTrack].getSourceTrack();
	};

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	};

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	};
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	};

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	};
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	};

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	};
}
