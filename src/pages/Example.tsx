import { Button } from "@mui/material"
import Matter from "matter-js"
import { useEffect, useRef, useState } from "react"

const RENDERER_WIDTH = 800
const RENDERER_HEIGHT = 600
const WALL_WIDTH = 50

export default function Example() {
  const canvasRef = useRef(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const ballRef = useRef<Matter.Body | null>(null)
  const pinsRef = useRef<Matter.Body[] | null>(null)
  const obstaclesRef = useRef<Matter.Body[] | null>(null)
  const wallsRef = useRef<Matter.Body[] | null>(null)

  const [ballPositionX, setBallPositionX] = useState(400)

  const updateBallPositionX = (newPositionX: number) => {
    if (newPositionX < 0 + WALL_WIDTH || newPositionX > RENDERER_WIDTH - WALL_WIDTH) return
    setBallPositionX(newPositionX)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        updateBallPositionX(ballPositionX + 10)
      }
      if (event.key === "ArrowLeft") {
        updateBallPositionX(ballPositionX - 10)
      }
      if (event.key === " ") {
        handleThrowClick()
      }
    }

    // コンポーネントがマウントされたら、イベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown)

    // クリーンアップ関数
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [ballPositionX])

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = Matter.Engine.create()
    engine.gravity.y = -3

    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
        wireframes: false,
      },
    })

    //     const handleWallCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
    //       const pairs = event.pairs
    // )
    //     }

    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair

        // ピンとの衝突
        if (pinsRef.current?.includes(bodyA) || pinsRef.current?.includes(bodyB)) {
          if (bodyA === ball || bodyB === ball) {
            const pin = bodyA === ball ? bodyB : bodyA
            Matter.Body.setStatic(pin, false)
          }

          // ピン同士の衝突
          if (pinsRef.current?.includes(bodyA) && pinsRef.current?.includes(bodyB)) {
            Matter.Body.setStatic(bodyA, false)
            Matter.Body.setStatic(bodyB, false)
          }
        }

        // 障害物との衝突
        if (obstaclesRef.current?.includes(bodyA) || obstaclesRef.current?.includes(bodyB)) {
          if (bodyA === ball || bodyB === ball) {
            Matter.Body.setPosition(ball, { x: 400, y: 500 })
          }
        }
        // 壁との衝突
        if (wallsRef.current?.includes(bodyA) || wallsRef.current?.includes(bodyB)) {
          if (bodyA === ball || bodyB === ball) {
            Matter.Body.setPosition(ball, { x: 400, y: 500 })
          }
        }
      })
    })

    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, WALL_WIDTH, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, WALL_WIDTH, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, WALL_WIDTH, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, WALL_WIDTH, 600, { isStatic: true }),
    ]
    wallsRef.current = walls

    const ball = Matter.Bodies.circle(ballPositionX, 500, 22, {
      isStatic: true,
      frictionAir: 0.02,
      restitution: 0.3,
      render: {
        fillStyle: "blue",
      },
    })
    ballRef.current = ball

    const pinPositions = [
      { x: 400, y: 260 },
      { x: 380, y: 240 },
      { x: 420, y: 240 },
      { x: 360, y: 220 },
      { x: 400, y: 220 },
      { x: 440, y: 220 },
      { x: 340, y: 200 },
      { x: 380, y: 200 },
      { x: 420, y: 200 },
      { x: 460, y: 200 },
    ]

    const pins = pinPositions.map((position) =>
      Matter.Bodies.circle(position.x, position.y, 6, {
        isStatic: true,
        density: 1,
        render: {
          fillStyle: "white",
        },
      }),
    )
    pinsRef.current = pins

    function createRectangleObstacle(x: number, y: number) {
      return Matter.Bodies.rectangle(x, y, 200, 50, {
        isStatic: true,
        render: { fillStyle: "#ff0000" },
      })
    }

    const obstacles = [createRectangleObstacle(500, 300), createRectangleObstacle(200, 300)]
    obstaclesRef.current = obstacles

    engineRef.current = engine
    renderRef.current = render

    Matter.World.add(engine.world, [ball, ...walls, ...pins, ...obstacles])

    Matter.Engine.run(engine)
    Matter.Render.run(render)

    // コンポーネントのアンマウント時にレンダラーとエンジンを停止
    return () => {
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
      render.canvas.remove()
    }
  }, [ballPositionX])

  function handleThrowClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false)
    }
  }

  return (
    <div>
      <div ref={canvasRef} style={{ position: "relative", width: "800px", height: "600px" }}></div>
      <Button
        onClick={() => {
          updateBallPositionX(ballPositionX - 10)
        }}
      >
        ←
      </Button>
      <Button onClick={handleThrowClick} variant="contained">
        Throw!
      </Button>
      <Button
        onClick={() => {
          updateBallPositionX(ballPositionX + 10)
        }}
      >
        →
      </Button>
    </div>
  )
}
