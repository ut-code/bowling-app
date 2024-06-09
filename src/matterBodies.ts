import Matter from "matter-js"
import { Obstacle, Pin } from "./App"
import ballImg from "./assets/bowling_ball.png"
import blockImg from "./assets/block.jpg"

export function createArrowGuide(ballPosition: { x: number; y: number }, arrowOffset: number) {
  // 先端の三角形の**重心**。手動で計算。
  const TRIANGLE_CENTER = -320

  // 長方形の中心。手動で計算。
  const RECTANGLE_CENTER = -150

  // 先端の三角形
  const triangle = Matter.Bodies.fromVertices(
    ballPosition.x,
    ballPosition.y + arrowOffset + TRIANGLE_CENTER,
    [
      [
        { x: 0, y: -360 },
        { x: -50, y: -300 },
        { x: 50, y: -300 },
      ],
    ],
    {
      isStatic: true,
      collisionFilter: { category: 0x0001, mask: 0x0002 },
      render: {
        fillStyle: "rgba(255, 0, 0, 0.5)",
      },
    },
  )

  // 三角形の後ろの赤い四角形
  const coloredRectangle = Matter.Bodies.fromVertices(
    ballPosition.x,
    ballPosition.y + arrowOffset + RECTANGLE_CENTER,
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
  )

  return Matter.Body.create({
    isStatic: true,
    collisionFilter: { category: 0x0001, mask: 0x0002 },
    parts: [triangle, coloredRectangle],
  })
}

export function rotateArrowGuide(arrowGuide: Matter.Body | null, angle: number, pivotX: number, pivotY: number) {
  if (!arrowGuide) return

  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  // 重心から回転中心への相対位置を求める
  const dx = arrowGuide.position.x - pivotX
  const dy = arrowGuide.position.y - pivotY

  // 回転後の新しい位置
  const newX = pivotX + (dx * cos - dy * sin)
  const newY = pivotY + (dx * sin + dy * cos)

  // 物体の位置と角度を設定
  Matter.Body.setPosition(arrowGuide, { x: newX, y: newY })
  Matter.Body.setAngle(arrowGuide, arrowGuide.angle + angle)
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
      density: 0.1,
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
