var canvas = document.getElementById('canvas');
canvas.setAttribute('style', 'border:1px solid black; margin:0 auto; display:block;');
var ctx = canvas.getContext('2d');

DEGREE = Math.PI / 180;

var frames = 0;

var sprite = new Image();
sprite.src = 'images/sprite.png';

var gameState = {
	current: 0,
	getReady: 0,
	game: 1,
	gameOver: 2
}
var startButton = {
	x: 120,
	y: 263,
	w: 83,
	h: 29

}

document.addEventListener('keydown',function(event){
	if(event.keyCode == 32){
		switch (gameState.current) {
			case gameState.getReady:
				gameState.current = gameState.game;
				break;
			case gameState.game:
				bird.flap();
				break;
			case gameState.gameOver:
				var rect = canvas.getBoundingClientRect();
				var clickX = event.clientX - rect.left;
				var clickY = event.clientY - rect.top;
	
				if (clickX >= startButton.x && clickX <= startButton.x + startButton.w && clickY >= startButton.y && clickY <= startButton.y + startButton.h) {
					pipes.reset();
					bird.speedReset();
					score.reset();
					gameState.current = gameState.getReady;
				}
		}
	}
});

canvas.addEventListener('click', function (event) {
	switch (gameState.current) {
		case gameState.getReady:
			gameState.current = gameState.game;
			break;
		case gameState.game:
			bird.flap();
			break;
		case gameState.gameOver:
			var rect = canvas.getBoundingClientRect();
			var clickX = event.clientX - rect.left;
			var clickY = event.clientY - rect.top;

			if (clickX >= startButton.x && clickX <= startButton.x + startButton.w && clickY >= startButton.y && clickY <= startButton.y + startButton.h) {
				pipes.reset();
				bird.speedReset();
				score.reset();
				gameState.current = gameState.getReady;
			}
			break;	
	}
});


var background = {
	sX: 0,
	sY: 0,
	w: 275,
	h: 226,
	x: 0,
	y: canvas.height - 226,

	draw: function () {
		ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
		ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
	}

}

var foreground = {
	sX: 276,
	sY: 0,
	w: 224,
	h: 112,
	x: 0,
	y: canvas.height - 112,
	dx: 2,

	draw: function () {
		ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
		ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
	},
	update: function () {
		if (gameState.current == gameState.game) {
			this.x = (this.x - this.dx) % (this.w / 2);
		}
	}
}


var bird = {
	animation: [{
			sX: 276,
			sY: 112
		},
		{
			sX: 276,
			sY: 139
		},
		{
			sX: 276,
			sY: 164
		},
		{
			sX: 276,
			sY: 139
		},
	],
	x: 50,
	y: 150,
	w: 34,
	h: 26,
	radius: 12,

	gravity: 0.25,
	jump: 5,
	speed: 0,
	rotation: 0,

	frame: 0,

	draw: function () {
		var bird = this.animation[this.frame];

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

		ctx.restore();
	},

	flap: function () {
		this.speed = -this.jump;
	},

	update: function () {
		this.period = gameState.current == gameState.getReady ? 10 : 5;
		this.frame += frames % this.period == 0 ? 1 : 0;
		this.frame = this.frame % this.animation.length;

		if (gameState.current == gameState.getReady) {
			this.y = 150;
			this.rotation = 0 * DEGREE;
		} else {
			this.speed += this.gravity;
			this.y += this.speed;
			if (this.y + this.h / 2 >= canvas.height - foreground.h) {
				this.y = canvas.height - foreground.h - this.h / 2;
				if (gameState.current == gameState.game) {
					gameState.current = gameState.gameOver;
				}
			}
			if (this.speed >= this.jump) {
				this.rotation = 90 * DEGREE;
				this.frame = 1;
			} else {
				this.rotation = -25 * DEGREE;
			}
		}

	},
	speedReset: function () {
		this.speed = 0;
	}


}

var getReady = {
	sX: 0,
	sY: 228,
	w: 173,
	h: 152,
	x: canvas.width / 2 - 173 / 2,
	y: 80,

	draw: function () {
		if (gameState.current === gameState.getReady) {
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
		}
	}
}

var gameOver = {
	sX: 175,
	sY: 228,
	w: 225,
	h: 202,
	x: canvas.width / 2 - 225 / 2,
	y: 90,

	draw: function () {
		if (gameState.current === gameState.gameOver) {
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
		}
	}
}

var pipes = {
	position: [],

	top: {
		sX: 553,
		sY: 0
	},
	bottom: {
		sX: 502,
		sY: 0
	},

	w: 53,
	h: 400,
	gap: 85,
	maxYPos: -150,
	dx: 2,

	draw: function () {
		for (var i = 0; i < this.position.length; i++) {
			var p = this.position[i];

			var topYPos = p.y;
			var bottomYPos = p.y + this.h + this.gap;

			// pipe north
			ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

			// pipe south
			ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
		}
	},
	update: function () {
		if (gameState.current !== gameState.game) {
			return;
		}
		if (frames % 100 == 0) {
			this.position.push({
				x: canvas.width,
				y: this.maxYPos * (Math.random() + 1)
			});
		}
		for (var i = 0; i < this.position.length; i++) {
			var p = this.position[i];

			var bottomPipeYPos = p.y + this.h + this.gap;

			if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
				gameState.current = gameState.gameOver;
			}
			if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
				gameState.current = gameState.gameOver;
			}

			p.x -= this.dx;

			if (p.x + this.w <= 0) {
				this.position.shift();
				score.value += 1;

				score.best = Math.max(score.value, score.best);
				localStorage.setItem('best', score.best);
				console.log(score.best);
			}
		}
	},
	reset: function () {
		this.position = [];
	}
}


var score = {
	best: parseInt(localStorage.getItem('best')) || 0,
	value: 0,
	// newBest: 0,

	draw: function () {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#000000';

		if (gameState.current == gameState.game) {
			ctx.lineWidth = 2;
			ctx.font = '35px Teko';
			ctx.fillText(this.value, canvas.width / 2, 50);
			ctx.strokeText(this.value, canvas.width / 2, 50);
		} else if (gameState.current == gameState.gameOver) {
			ctx.font = '25px Teko';
			ctx.fillText(this.value, 225, 186);
			ctx.strokeText(this.value, 225, 228);

			ctx.fillText(this.best, 225, 228);
			ctx.strokeText(this.best, 225, 228);
		}
	},
	reset: function () {
		this.value = 0;
	}
}


function draw() {
	ctx.fillStyle = "#70c5ce";
	ctx.fillRect(0, 0, 320, 480);
	background.draw();
	foreground.draw();
	bird.draw();
	pipes.draw();
	getReady.draw();
	gameOver.draw();
	score.draw();
}

function update() {
	bird.update();
	foreground.update();
	pipes.update();
}

function loop() {
	update();
	draw();
	frames++;
	requestAnimationFrame(loop);
}
loop();