const INITIAL_SIZE_TAIL = 5;
const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

const snake = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    color: 'red',
    tail: INITIAL_SIZE_TAIL,
    trail: [],

    checkColision: function () {
    },

    move: function () {
        this.x += this.dx;
        this.y += this.dy;
    },

    update: function () {
        this.move();

        this.trail.push({ x: this.x, y: this.y });

        while (this.trail.length > this.tail) {
            this.trail.shift();
        }
    },

    render: function () {
        ctx.fillStyle = this.color;
        console.log(this.trail);
        this.trail.forEach(element => {
            ctx.fillRect(element.x, element.y, 1, 1);
        });
    }
}

const game = {
    snake: snake,
    fruits: [],

    update: function () {
        this.snake.update();
    },

    render: function () {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 400);
        this.snake.render();
    }
}

function keyPush(e) {
    game.snake.dx = game.snake.dy = 0;

    switch (e.key) {
        case 'ArrowUp':
            game.snake.dy = -1;
            break;
        case 'ArrowLeft':
            game.snake.dx = -1;
            break;
        case 'ArrowRight':
            game.snake.dx = 1;
            break;
        case 'ArrowDown':
            game.snake.dy = 1;
            break;
        default:
            break;
    }
    loop();
}

function loop() {
    game.update();
    game.render();
}

window.onload = () => {
    document.addEventListener('keydown', keyPush);
};

