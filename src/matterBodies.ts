import Matter from "matter-js"
import { Obstacle, Pin } from "./App"
import ballImg from "./assets/bowling_ball.png"
import blockImg from "./assets/block.jpg"

export function createArrowGuide(ballPositionX: number) {
  return Matter.Body.create({
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0002 },
    parts: [
      Matter.Bodies.fromVertices(
        ballPositionX,
        100,
        [
          [
            { x: 400, y: 280 },
            { x: 450, y: 350 },
            { x: 350, y: 350 },
          ],
        ],
        {
          isStatic: true,
          collisionFilter: { category: 0x0001, mask: 0x0002 },
          render: {
            fillStyle: "rgba(255, 0, 0, 0.5)",
          },
        },
      ),
      Matter.Bodies.fromVertices(
        ballPositionX,
        273,
        [
          [
            { x: 20, y: 0 },
            { x: -20, y: 0 },
            { x: 20, y: 300 },
            { x: -20, y: 300 },
          ],
        ],
        {
          isStatic: true,
          collisionFilter: { category: 0x0002, mask: 0x0002 },
          render: {
            fillStyle: "rgba(255, 0, 0, 0.5)",
          },
        },
      ),
    ],
  })
}

export function createWalls(wallWidth: number) {
  return [
    Matter.Bodies.rectangle(800, 300, wallWidth, 600, { isStatic: true, render: { fillStyle: "#6B593E" } }),
    Matter.Bodies.rectangle(0, 300, wallWidth, 600, { isStatic: true, render: { fillStyle: "#6B593E" } }), // 左
    Matter.Bodies.rectangle(400, 0, 800, wallWidth, { isStatic: true, render: { fillStyle: "white" } }),
  ]
}

export function createBall(ballPositionX: number) {
  return Matter.Bodies.circle(ballPositionX, 500, 22, {
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0001 },
    frictionAir: 0.02,
    restitution: 0.3,
    render: {
      sprite: {
        texture: ballImg,
        xScale: 0.3,
        yScale: 0.3,
      },
    },
  })
}

export function createPins(pins: Pin[]) {
  return pins.map((position) =>
    Matter.Bodies.circle(position.x, position.y, 6, {
      isStatic: true,
      density: 1,
      render: {
        fillStyle: "white",
      },
    }),
  )
}

export function createObstacles(obstacles: Obstacle[]) {
  return obstacles.map((position) =>
    Matter.Bodies.rectangle(position.x, position.y, 50, 50, {
      isStatic: true,
      render: {
        fillStyle: "blue",
        sprite: {
          texture: blockImg,
          xScale: 0.01,
          yScale: 0.01,
        },
      },
    }),
  )
}
