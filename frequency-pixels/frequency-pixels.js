(function(){
         
  /* init this trash */
  
  var $window = $(window);
  var $canvas = $('<canvas id="chill-vibes" width="' + $window.width() + '" height="' + $window.height() + '">Your browser doesn\'t support canvas. Boo-hiss.</canvas>');
  $('body').prepend($canvas);
  var ctx = $canvas[0].getContext('2d');
  
  ctx.font="40px monospace";
  var gradient=ctx.createLinearGradient(0,0,$canvas.width(),0);
  gradient.addColorStop("0","red");
  gradient.addColorStop("0.5","purple");
  gradient.addColorStop("1.0","yellow");
  ctx.fillStyle=gradient;
  ctx.fillText("press j until the smiths",300,100);

  
  /* helpers to randomize */
  
  var getRandomNumber = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  var getRandomPosition = function(){
    var pos = {
      x: getRandomNumber(0, $window.width()),
      y: getRandomNumber(0, $window.height())
    };
    
    return pos;
  };
  
  var getRandomColor = function(){
    var color = {
      r: getRandomNumber(0, 255),
      g: getRandomNumber(0, 255),
      b: getRandomNumber(0, 255)
    };
    
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  };
  
  
  
  /* helpers to draw */
  
  var draw = function() {
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    for (var i = 0; i < bufferLength; i++) {
      pixelSize = dataArray[i];

      var position = getRandomPosition();
      
      ctx.beginPath();
      var xPos = ( Math.ceil(position.x/pixelSize) * pixelSize ) - pixelSize;
      var yPos = ( Math.ceil(position.y/pixelSize) * pixelSize ) - pixelSize;
      ctx.moveTo (position.x, position.y);
      ctx.fillStyle = getRandomColor();
      ctx.lineHeight = 0;
      
      ctx.fillRect(xPos,yPos,pixelSize,pixelSize);
      
      count++;
    }
  };
  
  
  
  /* AUDIO GARBAGE */
  
  var loadAudio = function(url) {
    var request = new XMLHttpRequest();
    request.open('GET', audioURL, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      audioCtx.decodeAudioData(request.response, function(buffer) {
        midiBuffer = buffer;
      });
    }
    request.send();
  }

  var onKeyDown = function(e){
    switch (e.keyCode) {
      case 74: // j
        playSong();
        break;
    }
  };
  
  var playSong = function(){
    if ( midiBuffer && !playSound ) {
      playSound = audioCtx.createBufferSource();
      playSound.buffer = midiBuffer;
      playSound.connect(audioCtx.destination);
      playSound.start(0);
      
      playSound.connect(analyser);
      
      analyser.fftSize = 128;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(dataArray);
      count = 0;
      
      draw();
    }

  };
  
  
  /* LET'S MAKE SOME GARBAGE ART */
        
  var playSound, dataArray, bufferLength, count;
  var midiBuffer = null;
  var audioURL = 'girlfriend.mp3';
  var pixelSize = 15;
  
  // web audio api turn upppp
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();
  var analyser = audioCtx.createAnalyser();
  
  loadAudio(audioURL);
  window.addEventListener("keydown",onKeyDown);

})()