function Cheats() {
    //Could later add master toggle or special accesor for variables
    //Keep global for now

    //TODO: Add function that console.logs which cheats are active to call at program start
    this.documentDebugKeysIfEnabled = function() {
        if(this.debugKeysEnabled) {
            console.log("Debug Keys Enabled: ");
            console.log("C adds capsules");
            console.log("L adds lives");
            console.log("0 - 9 changes game speed");
        } else {
            console.log("Debug Keys are turned off in Cheats.js");
        }
    }


    this.playerInvincible = false;
    this.debugKeysEnabled = true;
}
let cheats = new Cheats();