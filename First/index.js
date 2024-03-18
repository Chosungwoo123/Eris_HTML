const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({position, velocity})
    {
        this.position = position;

        this.velocity = this.velocity;

        this.width = 30;
        this.height = 150;
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update()
    {
        this.draw();

        this.position.y += 10;
    }
}

const player = new Sprite({
    position: {
        x :0,
        y :0,
    },
   velocity: {
        x :0,
        y :0,
   }
});

const enemy = new Sprite({
    position: {
        x :400,
        y :100,
    },
   velocity: {
        x :0,
        y :0,
   }
});

console.log(player);

// player.draw();
// enemy.draw();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);

    player.update();
    enemy.update();
}

animate();