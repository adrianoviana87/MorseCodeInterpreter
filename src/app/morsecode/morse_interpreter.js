/* 
 * @author adrianoviana87@gmail.com
 * 
 */


function Letter(unitArray, letter) {
	var self = this;
	self.units = unitArray;
	self.letter = letter;
	self.equals = function(unitArray) {		
		if(unitArray == undefined) {
			return false;
		}
		if(unitArray.length != self.units.length) {
			return false;
		}
		for(var i = 0; i < self.units.length; i++) {
			if(self.units[i] != unitArray[i]) {
				return false;
			}
		}
		return true;		
	}
}

function Letters() {
	var self = this;
	self.letters = [];
	self.letters.push(new Letter([0,1], 'A'));
	self.letters.push(new Letter([1,0,0,0], 'B'));
	self.letters.push(new Letter([1,0,1,0], 'C'));
	self.letters.push(new Letter([1,0,0], 'D'));
	self.letters.push(new Letter([0], 'E'));
	self.letters.push(new Letter([0,0,1,0], 'F'));
	self.letters.push(new Letter([1,1,0], 'G'));
	self.letters.push(new Letter([0,0,0,0], 'H'));
	self.letters.push(new Letter([0,0], 'I'));
	self.letters.push(new Letter([0,1,1,1], 'J'));
	self.letters.push(new Letter([1,0,1], 'K'));
	self.letters.push(new Letter([0,1,0,0], 'L'));
	self.letters.push(new Letter([1,1], 'M'));
	self.letters.push(new Letter([1,0], 'N'));
	self.letters.push(new Letter([1,1,1], 'O'));
	self.letters.push(new Letter([0,1,1,0], 'P'));
	self.letters.push(new Letter([1,1,0,1], 'Q'));
	self.letters.push(new Letter([0,1,0], 'R'));
	self.letters.push(new Letter([0,0,0], 'S'));
	self.letters.push(new Letter([1], 'T'));
	self.letters.push(new Letter([0,0,1], 'U'));
	self.letters.push(new Letter([0,0,0,1], 'V'));
	self.letters.push(new Letter([1,0,0,1], 'X'));
	self.letters.push(new Letter([1,1,0,0], 'Z'));
	self.letters.push(new Letter([0,1,1], 'W'));
	self.letters.push(new Letter([1,0,1,1], 'Y'));
	self.letters.push(new Letter([0,1,0,1,0,1], '. '));	
	self.letters.push(new Letter([1,1,1,1,1], '0'));
	self.letters.push(new Letter([0,1,1,1,1], '1'));
	self.letters.push(new Letter([0,0,1,1,1], '2'));
	self.letters.push(new Letter([0,0,0,1,1], '3'));
	self.letters.push(new Letter([0,0,0,0,1], '4'));
	self.letters.push(new Letter([0,0,0,0,0], '5'));
	self.letters.push(new Letter([1,0,0,0,0], '6'));
	self.letters.push(new Letter([1,1,0,0,0], '7'));
	self.letters.push(new Letter([1,1,1,0,0], '8'));
	self.letters.push(new Letter([1,1,1,1,0], '9'));
	self.letters.push(new Letter([1,1,0,0,1,1], ','));
	self.letters.push(new Letter([0,0,1,1,0,0], '?'));
	self.letters.push(new Letter([0,1,1,1,1,0], "'"));
	self.letters.push(new Letter([1,0,1,0,1,1], '!'));
	self.letters.push(new Letter([1,0,0,1,0], '/'));
	self.letters.push(new Letter([1,0,1,1,0], '('));
	self.letters.push(new Letter([1,0,1,1,0,1], ')'));
	self.letters.push(new Letter([0,1,0,0,0], '&'));
	self.letters.push(new Letter([1,1,1,0,0,0], ':'));
	self.letters.push(new Letter([1,0,1,0,1,0], ';'));
	self.letters.push(new Letter([1,0,0,0,1], '='));
	self.letters.push(new Letter([0,1,0,1,0], '+'));
	self.letters.push(new Letter([1,0,0,0,0,1], '-'));
	self.letters.push(new Letter([0,0,1,1,0,1], '_'));
	self.letters.push(new Letter([0,0,0,1,0,0,1], '$'));
	self.letters.push(new Letter([0,1,1,0,1,0], '@'));
	
	self.getLetter = function(unitArray) {
		for(var i = 0; i < self.letters.length; i++) {
			if(self.letters[i].equals(unitArray)) {
				return self.letters[i];
			}
		}
		return false;
	};
}

function KeyStroke() {
	var self = this;
	self.dahTime = 150;
	self.startTime;
	self.endTime;
	self.duration;
	self.unit = 0;
	self.process = function () {	
		self.duration = self.endTime - self.startTime;		
		if(self.duration >= self.dahTime) {
			self.unit = 1;
		}
		//alert(self.duration);
	};
	self.notifyStart = function(time) {		
		self.startTime = time;		
	};
	
	self.notifyEnd = function(time) {		
		self.endTime = time;
		self.process();
	};
	self.clear = function() {
		self.startTime = 0;
		self.endTime = 0;
		self.duration = 0;
		self.unit = 0;
	};
}

function MManager(elementId) {
	var self = this;
	self.letterTimmer;	
	self.wordTimmer;
	self.elementId = elementId;
	self.lastStart = 0;
	// states
	// 0 = waiting key down
	// 1 = waiting key up	
	self.state = 0;
	self.wordTime = 600;
	self.letterTime = 300;
	self.startTime = 0;
	self.endTime = 0;
	self.stroke = new KeyStroke();
	self.unitBuffer = [];
	self.strokeBuffer = [];
	self.knownLetters = new Letters();
	self.notifyStart = function(timeStamp) {
		if(self.state != 0) {
			return;
		}
		clearTimeout(self.letterTimmer);
		clearTimeout(self.wordTimmer);
		$(self.elementId).css('background', '#77a0c6');		
		self.state = 1;
		self.stroke.notifyStart(timeStamp);		
				
	};
	
	self.notifyEnd = function(timeStamp) {
		if(self.state != 1) {
			return;
		}
		$(self.elementId).css('background', '');
		self.endTime = timeStamp;
		self.stroke.notifyEnd(timeStamp);
		self.unitBuffer.push(self.stroke.unit);
		self.stroke.clear();
		self.startLetterTimeout();
		self.state = 0;
	};
	
	self.startLetterTimeout = function() {
		self.letterTimmer = setTimeout(function() {	
			self.addLetter();		    
			self.startWordTimeout();
		}, self.letterTime);
	};
	
	self.startWordTimeout = function() {
		self.wordTimmer = setTimeout(function() {
			self.appendToElement(' ');			
		}, self.wordTime);
	};
	
	self.addLetter = function() {
		var letter = self.knownLetters.getLetter(self.unitBuffer);
		if(!letter) {
			self.appendToElement('?');			
		} else {
			self.appendToElement(letter.letter);
		}
		self.unitBuffer.length = 0;
	};
	
	self.appendToElement = function(txt) {
		$(self.elementId).val($(self.elementId).val() + txt);
	};	
}