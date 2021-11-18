const INITIAL_TAIL = 5;
const FPS = 10;
const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");
const SCORE = document.getElementById("score");
const SCREEN_SIZE = screen.width;

const snake = {
  x: 1,
  y: 1,
  dx: 0,
  dy: 0,
  tail: INITIAL_TAIL,
  trail: [],
  color: 'white',

  respaw: function () {
    console.log('respaw');
    this.x = this.y = 1;
    this.dx = this.dy = 0;
    this.trail = [];
    this.tail = INITIAL_TAIL;
  },

  pickFruit: function () {
    this.tail++;
  },

  checkColision: function () {

    if (
      this.x == -1 ||
      this.y == -1 ||
      this.x == SCREEN_SIZE ||
      this.y == SCREEN_SIZE
    ) {
      return true;
    }

    if (
      this.dx != 0 || this.dy != 0
    ) {
      for (x of this.trail) {
        if (x.x == this.x && this.y == x.y) { return true; }
      }
    }

    return false;
  },

  move: function () {
    this.x += this.dx;
    this.y += this.dy;
  },

  update: function () {
    this.move();
    if (this.checkColision())
      game.gameOver();
    this.trail.push({ x: this.x, y: this.y });
    while (this.trail.length > this.tail) {
      this.trail.shift();
    }
  },

  render: function () {
    ctx.fillStyle = this.color;
    this.trail.forEach(element => {
      ctx.fillRect(element.x, element.y, 1, 1);
    });
  }
};

const fruit = {
  create: function (x, y) {
    return {
      x: x,
      y: y,
      color: 'green',

      render: function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 1, 1);
      },
    };
  }
};

const fruitTimer = {
  create: function (time, action) {
    setInterval(action, 1000 * time);
  }
};

const game = {
  snake: snake,
  fruits: [],
  score: 0,

  update: function () {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, screen.width, screen.height);
    this.snake.update();
  },

  render: function () {
    this.snake.render();
    this.fruits.forEach(x => x.render());
  },

  loop: function () {
    this.update();
    this.render();
    this.checkPickup();
  },

  hasSnake: function (x, y) {
    for (x of this.snake.trail) {
      if (x.x == x || x.y == y)
        return true;
    }
  },

  generateFruit: function () {
    let x, y;
    do {
      x = Math.floor(Math.random() * SCREEN_SIZE);
      y = Math.floor(Math.random() * SCREEN_SIZE);
    } while (this.hasSnake(x, y));

    console.log('spawning fruit');
    this.fruits.push(fruit.create(x, y));
  },

  addScore: function (score) {
    this.score += score;

    SCORE.innerHTML = `Score: ${this.score}`;
  },

  checkPickup: function () {
    const pickedFruits = this.fruits.filter(
      (element) => element.x == this.snake.x && element.y == this.snake.y
    );
    if (pickedFruits.length > 0) {
      this.addScore(100);

      this.snake.pickFruit();
      pickedFruits.map((any) => {
        this.fruits.splice(this.fruits.indexOf(any), 1);
      });
    }
  },

  keyPush: function (e) {
    if (game.snake.dy == 0)
      switch (e.key) {
        case "ArrowUp":
          game.snake.dx = 0;
          game.snake.dy = -1;
          break;
        case 'ArrowDown':
          game.snake.dx = 0;
          game.snake.dy = 1;
          break;
      }
    if (game.snake.dx == 0)
      switch (e.key) {
        case 'ArrowLeft':
          game.snake.dy = 0;
          game.snake.dx = -1;
          break;
        case 'ArrowRight':
          game.snake.dy = 0;
          game.snake.dx = 1;
          break;
      }
  },

  gameOver: function() {
    this.snake.respaw()
    this.fruits = [];
    this.score = 0;
    this.addScore(0);
  }
}

window.onload = function () {
  document.addEventListener("keydown", game.keyPush);

  fruitTimer.create(3, function () {
    game.generateFruit();
  });
  setInterval(() => {
    game.loop();
  }, 1000 / FPS);
}
