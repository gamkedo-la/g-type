//Graphics Common
function drawRect(x,y,w,h,color) {
	canvasContext.save();
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,w,h);
	canvasContext.restore();
}

function colorText(showWords, textX, textY, fillColor, fontface, textAlign = 'left', opacity = 1) {
  canvasContext.save();
  canvasContext.textAlign = textAlign;
  canvasContext.font = fontface;
  canvasContext.globalAlpha = opacity;
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
  canvasContext.restore();
}

function getFontWeight(font) {
  canvasContext.save();
  canvasContext.font = this.buttonFont;
  
  var weight = parseInt(font.match(/\d+/)[0]); //regex match the first string of digits
  
  canvasContext.restore();
  
  return weight;
}

function getTextWidth(txt, font) {
  canvasContext.save();
  canvasContext.font = font;
  
  var width = canvasContext.measureText(txt).width;
  
  canvasContext.restore();
  
  return width;
}