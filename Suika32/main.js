import { FRUITS } from "./fruits.js";


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    // 과일 조작을 위해 선언 
    Body = Matter.Body,
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options : {
        wireframes : false,
        background : '#F7F4C8',
        width : 620,
        height : 850,
    },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true,
    // 고정시켜주는 옵션
    render : {fillStyle : '#E6B143'}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic : true,
    // 고정시켜주는 옵션
    render : {fillStyle : '#E6B143'}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic : true,
    // 고정시켜주는 옵션
    render : {fillStyle : '#E6B143'}
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic : true,
    isSensor : true,
    // 고정시켜주는 옵션
    render : {fillStyle : '#E6B143'}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

// 키 조작을 제어하는 변수
let diasbleAction = false;

function addFruit() {
    const index = Math.floor(Math.random() * 5);
    console.log(index);
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true,
        render : {
            sprite : { texture : `${fruit.name}.png`},
            //sprite : { texture : fruit.name + '.png'},
        },
        // 튀어오르는 강도
        restitution : 0.4,
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body);
}

window.onkeydown = (event) => {
    if(diasbleAction)
    return;

    switch(event.code)
    {
        case "KeyA":
            if(currentBody.position.x  - currentFruit.radius > 30)
            Body.setPosition(currentBody, {
                x : currentBody.position.x - 10,
                y : currentBody.position.y,
            });
            break;
            
        case "KeyD":
            if(currentBody.position.x  + currentFruit.radius < 590)
            Body.setPosition(currentBody, {
                x : currentBody.position.x + 10,
                y : currentBody.position.y,
            });
            break;

        case "KeyS":
            currentBody.isSleeping = false;
            diasbleAction = true;
            setTimeout(() => {
                addFruit();
                diasbleAction = false;
            }, 1000)
            break;
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        // 같은 과일일 경우
        if(collision.bodyA.index == collision.bodyB.index)
        {
            // 기존 과일값 저장
            const index = collision.bodyA.index

            // 수박끼리 부딪힐 경우 예외처리
            if(index === FRUITS.length - 1)
                return;
            
            // 과일 제거
            World.remove(world, [collision.bodyA, collision.bodyB])

            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                // 부딪힌 지점의 x, y값을 가져온다.
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    index : index + 1,
                    render : {sprite : {texture : `${newFruit.name}.png`}},
                }
            );

            World.add(world, newBody);
        }        
    });
})

addFruit();