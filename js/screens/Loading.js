function LoadingScreen() {
    this.transitionIn = function () {};
    this.transitionOut = function() {};
    this.run = function(deltaTime) {
	    colorText(loadingText + picsToLoad, canvas.width / 2, canvas.height / 2, Color.White, Fonts.ButtonTitle, textAlignment.Center);
    };
    this.control = function() {};
    return this;
}