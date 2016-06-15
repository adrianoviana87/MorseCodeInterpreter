var manager = new MManager('#m-textarea');

var SoundService = (function() {
  function SoundService() {    
      this.isPlaying = false;
      this.source = {};
      if (AudioContext) {
        var context = new AudioContext();
        var gainNode = context.createGain();
        var oscillator = context.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.value = 900;
        gainNode.connect(context.destination);
        gainNode.gain.value = 0;
        oscillator.start();
        this.source.start = function() {
          gainNode.gain.value = 1;
        };
        
        this.source.stop = function() {
          gainNode.gain.value = 0;
        };
      }
      else {
        var song = new Audio("http://adrianoviana.herobo.com/content/sine.wav?");
        song.controls = true;
        song.loop = true;
        song.autoplay = false;
        song.hidden = true;
        document.body.appendChild(song);
        $(song).hide();
        this.source.start = function() {
          song.play();
        };
        
        this.source.stop = function() {
          song.pause();
          song.currentTime = 0;
        };
      }
  }
  
  SoundService.prototype.start = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.source.start(); 
    }    
  };
  
  SoundService.prototype.stop = function() {
    if (this.isPlaying) {
      this.source.stop();
      this.isPlaying = false;      
    }
  };     
  
  return SoundService;
})();

var soundService = new SoundService();

function updateLetterTimeout() {
    var val = $('#letter-timeout').slider('option', 'value');
    $('#letter-timeout-value').text(val);
    manager.letterTime = val;
}

function updateWordTimeout() {
    var val = $('#word-timeout').slider('option', 'value');
    $('#word-timeout-value').text(val);
    manager.wordTime = val;
}

var waitingKeyUp = false;
$(function() {
	$('#pad').on('touchstart', function(event) {
		$(this).switchClass('up', 'down', 0);
		waitingKeyUp = true;
		manager.notifyStart(event.timeStamp);
		soundService.start();
	});
	
	$('#pad').on('touchend', function(event) {
		$(this).switchClass('down', 'up', 0);
		manager.notifyEnd(event.timeStamp);
		waitingKeyUp = false;
		soundService.stop();
	});
	
    $(document).keydown(function(event) {
        if (event.which == 8) {
            return;
        }
        if (waitingKeyUp) {
            return;
        }
		
		waitingKeyUp = true;
		manager.notifyStart(event.timeStamp);
		soundService.start();
        /*switch (event.which) {
            case 16:
            case 17:
            case 18:
            case 40:
                waitingKeyUp = true;
                manager.notifyStart(event.timeStamp);
                soundService.start();
                break;
            default:
                event.preventDefault();
                break;
        }*/
		
    });

    $(document).keyup(function(event) {
        if (event.which == 8) {
            return;
        }
		/*
        switch (event.which) {
            case 16:
            case 17:
            case 18:
            case 40:
                manager.notifyEnd(event.timeStamp);
                waitingKeyUp = false;
                soundService.stop();                
                break;
            default:
                event.preventDefault();
                break;
        }*/
		manager.notifyEnd(event.timeStamp);
		waitingKeyUp = false;
		soundService.stop();
    });

    $(document).keypress(function(event) {
        event.preventDefault();
    });


    $('#word-timeout').slider({max: 5000, min: 400});
    $('#word-timeout').on('slide', function(event, ui) {
        updateWordTimeout();
    });



    $('#letter-timeout').slider({max: 350, min: 100});
    $('#letter-timeout').on('slide', function(event, ui) {
        updateLetterTimeout();
    });

    $('#word-timeout').slider('option', 'value', manager.wordTime);
    $('#letter-timeout').slider('option', 'value', manager.letterTime);

    updateLetterTimeout();
    updateWordTimeout();

    $('#m-textarea').val('');

    $('#menu-clear-text').click(function() {
        $('#m-textarea').val('');
        $('#m-textarea').focus();
    });

});			