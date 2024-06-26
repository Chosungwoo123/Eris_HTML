const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;
 
const background = new Sprite({
    position : {
        x : 0,
        y : 0,
    },
    imageSrc : "/First/img/background.png",
})

const shop = new Sprite({
    position : {
        x : 600,
        y : 128,
    },
    imageSrc : "/First/img/shop.png",
    scale : 2.75,
    framesMax : 6,
})

c.fillRect(0, 0, canvas.width, canvas.height);

const player = new Fighter({
    position:
    {
        x :0,
        y :0,
    },
   velocity: 
   {
        x :0,
        y :10,
   },
   offset:{
        x : 0,
        y : 0,
   },
   imageSrc: "/First/img/1p/Idle.png",
   framesMax : 8,
   scale : 2.5,

   offset : {
    x : 215,
    y : 157,
   },
   sprites : {
    idle : {
        imageSrc : "/First/img/1p/Idle.png",
        framesMax : 8,
    },
    run : {
        imageSrc : "/First/img/1p/Run.png",
        framesMax : 8,
    },
    jump : {
        imageSrc : "/First/img/1p/Jump.png",
        framesMax : 2,
    },
    fall : {
        imageSrc : "/First/img/1p/Fall.png",
        framesMax : 2,
    },
    attack1 : {
        imageSrc : "/First/img/1p/Attack1.png",
        framesMax : 6,
    }
   }
});

const enemy = new Fighter({
    position: 
    {
        x :400,
        y :100,
    },
   velocity: 
   {
        x :0,
        y :0,
   },
   color : "blue",
   offset:
   {
        x : -50,
        y : 0,
    },
    imageSrc: "/First/img/2p/Idle.png",
   framesMax : 4,
   scale : 2.5,

   offset : {
    x : 215,
    y : 167,
   },
   sprites : {
    idle : {
        imageSrc : "/First/img/2p/Idle.png",
        framesMax : 4,
    },
    run : {
        imageSrc : "/First/img/2p/Run.png",
        framesMax : 8,
    },
    jump : {
        imageSrc : "/First/img/2p/Jump.png",
        framesMax : 2,
    },
    fall : {
        imageSrc : "/First/img/2p/Fall.png",
        framesMax : 2,
    },
    attack1 : {
        imageSrc : "/First/img/2p/Attack1.png",
        framesMax : 4,
    }
   }
});

console.log(player);

const keys = 
{
    a:
    {
        pressed : false,
    },
    d:
    {
        pressed : false,
    },
    w:
    {
        pressed : false,
    },

    ArrowRight:
    {
        pressed : false,
    },
    ArrowLeft:
    {
        pressed : false,
    },
    ArrowUp:
    {
        pressed : false,
    },
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);

    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // if(keys.a.pressed)
    // {
    //     player.velocity.x = -1;
    // }
    // else if(keys.d.pressed)
    // {
    //     player.velocity.x = 1;
    // }

    //player.image = player.sprites.idle.image;

    // player.switchSprite('idle');

    if(keys.a.pressed && player.lastKey === 'a')
    {
        // player.image = player.sprites.run.image;
        player.switchSprite('run');
        player.velocity.x = -2;
    }
    else if(keys.d.pressed && player.lastKey  === 'd')
    {
        // player.image = player.sprites.run.image;
        player.switchSprite('run');
        player.velocity.x = 2;
    }
    else
    {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0)
    {
        player.switchSprite('jump');
    }
    else if(player.velocity.y > 0)
    {
        player.switchSprite('fall');
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
    {
        enemy.switchSprite('run');
        enemy.velocity.x = -2;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
    {
        enemy.switchSprite('run');
        enemy.velocity.x = 2;
    }
    else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall');
    }

    // 충돌체크
    if( rectangularColision({rectangle1 : player, rectangle2 : enemy}) && player.isAttacking)
    {
        console.log("hit");
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }
    if(rectangularColision({rectangle2 : player, rectangle1 : enemy}) && enemy.isAttacking)
    {
        console.log("enemy hit");
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

    if(enemy.health <= 0)
    {
        console.log("적 죽음");
        determineWinner({player, enemy, timerID})
    }
    if(player.health <= 0)
    {
        console.log("플레이어 죽음");
        determineWinner({player, enemy, timerID})
    }
}

animate();

window.addEventListener("keydown", (event) => 
{
    console.log(event.key);

    switch(event.key)
    {
        case "d":
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        
        case "a":
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case "w":
            player.velocity.y = -10;
            break;
        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -10;
            break
        case "ArrowDown":
            enemy.attack();
            break
    }
})

window.addEventListener("keyup", (event) => 
{
    console.log(event.key);

    switch(event.key)
    {
        case "d":
            keys.d.pressed = false;
            break;

        case "a":
            keys.a.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
})