console.clear();
// instigate our audio context ~~~~~~~~~~~~~~~ 1

// for cross browser way
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const listener = audioCtx.listener;

// Let's set the position of our listener based on where our boombox is.
const posX = 1000;
const posY = 1000;
const posZ = 1000;

var DIST = 1000;

if(listener.positionX) {
  listener.positionX.value = posX;
	listener.positionY.value = posY;
	listener.positionZ.value = posZ;
} else {
  listener.setPosition(posX, posY, posZ);
}

if(listener.forwardX) {
  listener.forwardX.value = 0;
	listener.forwardY.value = 0;
	listener.forwardZ.value = -1;
	listener.upX.value = 0;
	listener.upY.value = 1;
	listener.upZ.value = 0;
} else {
  listener.setOrientation(0, 0, -1, 0, 1, 0);
}

const pannerModel = 'HRTF';

const innerCone = 30;
const outerCone = 60;
const outerGain = 0;

const distanceModel = 'linear';

const maxDistance = 10000;

const refDistance = 1000;

const rollOff = 10000;

const positionX = posX+DIST;
const positionY = posY+1;
const positionZ = posZ;

const orientationX = -1.0;
const orientationY = 0.0;
const orientationZ = 0.0;

// let's use the class method for creating our panner node and pass in all those parameters we've set.

const panner = new PannerNode(audioCtx, {
	panningModel: pannerModel,
	distanceModel: distanceModel,
	positionX: positionX,
	positionY: positionY,
	positionZ: positionZ,
	orientationX: orientationX,
	orientationY: orientationY,
	orientationZ: orientationZ,
	refDistance: refDistance,
	maxDistance: maxDistance,
	rolloffFactor: rollOff,
	coneInnerAngle: innerCone,
	coneOuterAngle: outerCone,
	coneOuterGain: outerGain
})

const moveControls = document.querySelector('#move-controls').querySelectorAll('button');
const boombox = document.querySelector('.boombox-body');

// the transforms we can set
let transform = {
	xAxis: 0,
	yAxis: 0,
	zAxis: 0.8,
	rotateX: 0,
	rotateY: 0
}


// set up our bounds
const topBound = -posY;
const bottomBound = posY;
const rightBound =10;
const leftBound = -10;
const innerBound = 0.1;
const outerBound = 1.5;

// set up rotation constants
const rotationRate = 60; // bigger number slower sound rotation

const q = Math.PI/rotationRate; //rotation increment in radians

// get degrees for css
const degreesX = (q * 180)/Math.PI;
const degreesY = (q * 180)/Math.PI;

// function for setting the panner values and changing the styling
function moveBoombox(direction,value, prevMove) {
	switch (direction) {
		case 'ass':

			degrees=value
			rotate=(degrees*50)%360
			radians= rotate*Math.PI/180
			//console.log(rotate)
			tmpZ=Math.sin(-radians)*DIST
			tmpX=Math.cos(radians)*DIST
			//console.log(tmpZ)
			panner.positionZ.value = posZ + tmpZ;
			panner.positionX.value = posX + tmpX;
			//panner.positionX.linearRampToValueAtTime(posX+tmpX, audioCtx.currentTime + .75)
			//panner.positionZ.linearRampToValueAtTime(posZ+tmpZ, audioCtx.currentTime + .75)
			
			
			rotate=(degrees*50)%360
			radians= rotate*Math.PI/180
			z = Math.sin(radians);
		    x = -Math.cos(radians)
		    console.log(panner.positionX.value,panner.positionY.value,panner.positionZ.value, x, z)
		    panner.orientationX.value = x;
      		panner.orientationZ.value = z;
			break;
		case 'left':
			if (transform.xAxis > leftBound) {
				transform.xAxis -= 0.1;
				panner.positionX.value -= 1;
				console.log("left")
			}
		break;
		case 'up':
			if (transform.yAxis > topBound) {
				transform.yAxis -= 5;
				panner.positionY.value -= 0.3;
			}
		break;
		case 'right':
			if (transform.xAxis < rightBound) {
				transform.xAxis += 0.1;
				panner.positionX.value += 1;
				console.log("right")

			}
		break;
		case 'down':
			if (transform.yAxis < bottomBound) {
				transform.yAxis += 5;
				panner.positionY.value += 0.3;
			}
		break;
		case 'back':
			if (transform.zAxis > innerBound) {
				transform.zAxis -= 0.01;
				panner.positionZ.value -= 20;
			}
		break;
		case 'forward':
			if (transform.zAxis < outerBound) {
				transform.zAxis += 0.01;
				panner.positionZ.value += 20;
				console.log("forward")
			}
		break;
		case 'rotate-right':
			transform.rotateY += degreesY;
			//console.log(transform.rotateY);
     	// 'left' is rotation about y-axis with negative angle increment
      z = panner.orientationZ.value*Math.cos(-q) - panner.orientationX.value*Math.sin(-q);
      x = panner.orientationZ.value*Math.sin(-q) + panner.orientationX.value*Math.cos(-q);
      y = panner.orientationY.value;

      panner.orientationX.value = x;
      panner.orientationY.value = y;
      panner.orientationZ.value = z;
		break;
		case 'rotate-left':
			transform.rotateY -= degreesY;
			// 'right' is rotation about y-axis with positive angle increment
      z = panner.orientationZ.value*Math.cos(q) - panner.orientationX.value*Math.sin(q);
      x = panner.orientationZ.value*Math.sin(q) + panner.orientationX.value*Math.cos(q);
      y = panner.orientationY.value;
      panner.orientationX.value = x;
      panner.orientationY.value = y;
      panner.orientationZ.value = z;
		break;
		case 'rotate-up':
		transform.rotateX += degreesX;
			// 'up' is rotation about x-axis with negative angle increment
      z = panner.orientationZ.value*Math.cos(-q) - panner.orientationY.value*Math.sin(-q);
      y = panner.orientationZ.value*Math.sin(-q) + panner.orientationY.value*Math.cos(-q);
      x = panner.orientationX.value;
      panner.orientationX.value = x;
      panner.orientationY.value = y;
      panner.orientationZ.value = z;
		break;
		case 'rotate-down':
			transform.rotateX -= degreesX;
			// 'down' is rotation about x-axis with positive angle increment
      z = panner.orientationZ.value*Math.cos(q) - panner.orientationY.value*Math.sin(q);
      y = panner.orientationZ.value*Math.sin(q) + panner.orientationY.value*Math.cos(q);
      x = panner.orientationX.value;
      panner.orientationX.value = x;
      panner.orientationY.value = y;
      panner.orientationZ.value = z;
		break;
	}

  boombox.style.transform = 'translateX('+transform.xAxis+'px) translateY('+transform.yAxis+'px) scale('+transform.zAxis+') rotateY('+transform.rotateY+'deg) rotateX('+transform.rotateX+'deg)';

  /*const move = prevMove || {};
  move.frameId = requestAnimationFrame(() => moveBoombox(direction, move));
	return move;*/
}


moveControls.forEach(function(el) {

	let moving;
	el.addEventListener('mousedown', function() {

		let direction = this.dataset.control;
		if (moving && moving.frameId) {
			window.cancelAnimationFrame(moving.frameId);
		}
		moving = moveBoombox(direction);

	}, false);

	window.addEventListener('mouseup', function() {
		if (moving && moving.frameId) {
			window.cancelAnimationFrame(moving.frameId);
		}
	}, false)

})



// BOOMBOX FUNCTIONALITY HERE ~~~~~~~~~~~~~~~~~~~~~~~~~~~ 2
const audioElement = document.querySelector('audio');
audioElement.src = "no_romance.wav";
const track = audioCtx.createMediaElementSource(audioElement);

const playButton = document.querySelector('.tape-controls-play');

var toggle = true;
var prev = 0 
var count = 0
// play pause audio
playButton.addEventListener('click', function() {
	console.log("playing")
	setTimeout(function(){setInterval(function() {
		

		count += 0.3
		moveBoombox("ass",count)
		
	}
		,750)},0)
	


	// check if context is in suspended state (autoplay policy)
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	if (this.dataset.playing === 'false') {
		audioElement.play();
		this.dataset.playing = 'true';
	// if track is playing pause it
	} else if (this.dataset.playing === 'true') {
		audioElement.pause();
		this.dataset.playing = 'false';
	}

	let state = this.getAttribute('aria-checked') === "true" ? true : false;
	this.setAttribute( 'aria-checked', state ? "false" : "true" );

}, false);

// if track ends - an event is fired once the track ends via the audio api. We can listen for this and set the correct params on the html element
audioElement.addEventListener('ended', () => {
	playButton.dataset.playing = 'false';
	playButton.setAttribute( "aria-checked", "false" );
}, false);

// volume ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 4
const gainNode = audioCtx.createGain();

const volumeControl = document.querySelector('[data-action="volume"]');
volumeControl.addEventListener('input', function() {
	gainNode.gain.value = this.value;
}, false);

const pannerOptions = {pan: 0};
const stereoPanner = new StereoPannerNode(audioCtx, pannerOptions);
const pannerControl = document.querySelector('[data-action="panner"]');
pannerControl.addEventListener('input', function() {
	stereoPanner.pan.value = this.value;
}, false);

track.connect(gainNode).connect(stereoPanner).connect(panner).connect(audioCtx.destination);

const powerButton = document.querySelector('.control-power');

powerButton.addEventListener('click', function() {
	if (this.dataset.power === 'on') {
		audioCtx.suspend();
		this.dataset.power = 'off';
	} else if (this.dataset.power === 'off') {
		audioCtx.resume();
		this.dataset.power = 'on';
	}
	this.setAttribute( "aria-checked", state ? "false" : "true" );
	console.log(audioCtx.state);
}, false);
