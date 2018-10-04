function Cheats() {
    //Could later add master toggle or special accesor for variables
    //Keep global for now

    //TODO: Add function that console.logs which cheats are active to call at program start
    this.documentDebugKeysIfEnabled = function() {
        if(this.debugKeysEnabled) {
            console.log("Debug Keys Enabled: ");
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
        } else {
            console.log("Debug Keys are turned off in Cheats.js");
        }
    }

    this.playerInvincible = false;
    this.debugKeysEnabled = true;
}
let cheats = new Cheats();
