// pages/Stage.tsx
import { Button } from "@mui/material"
import Matter from "matter-js"
import { useEffect, useRef, useState } from "react"
import { StageElements, TypeScore } from "../App"
import { createArrowGuide, createBall, createObstacles, createPins, createWalls } from "../matterBodies"

const RENDERER_WIDTH = 800
const RENDERER_HEIGHT = 600
const WALL_WIDTH = 50

interface Props {
  stageElement: StageElements
  stageNumber: number
  handleNextStage: () => void
  setScores: (scores: TypeScore[]) => void
  score: number // スコアを受け取るプロップス
  setScore: React.Dispatch<React.SetStateAction<number>> // スコアを更新するプロップス
}

export default function Stage(props: Props) {
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const ballRef = useRef<Matter.Body | null>(null)
  const arrowGuideRef = useRef<Matter.Body | null>(null)
  const canvasRef = useRef(null)
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

    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair

        // 壁との衝突のみを検知
        if (
          (wallsRef.current?.includes(bodyA) || wallsRef.current?.includes(bodyB)) &&
          (pinsRef.current?.includes(bodyA) || pinsRef.current?.includes(bodyB))
        ) {
          const pin = pinsRef.current?.includes(bodyA) ? bodyA : bodyB
          Matter.World.remove(engine.world, pin) // 衝突したピンを削除
        }

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
            Matter.Body.setStatic(ball, true)
          }
        }
        // 壁との衝突
        if (wallsRef.current?.includes(bodyA) || wallsRef.current?.includes(bodyB)) {
          if (bodyA === ball || bodyB === ball) {
            Matter.Body.setPosition(ball, { x: 400, y: 500 })
            Matter.Body.setStatic(ball, true)
          }
        }
      })
    })

    const walls = createWalls(WALL_WIDTH)
    wallsRef.current = walls

    const ball = createBall(ballPositionX)
    ballRef.current = ball

    const arrowGuide = createArrowGuide(ballPositionX)
    arrowGuideRef.current = arrowGuide

    const pins = createPins(props.stageElement.pins)
    pinsRef.current = pins

    const obstacles = createObstacles(props.stageElement.obstacles)
    obstaclesRef.current = obstacles

    engineRef.current = engine
    renderRef.current = render

    Matter.World.add(engine.world, [ball, ...walls, ...pins, ...obstacles, arrowGuide])

    Matter.Runner.run(engine)
    Matter.Render.run(render)

    // コンポーネントのアンマウント時にレンダラーとエンジンを停止
    return () => {
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
      render.canvas.remove()
    }

  }, [ballPositionX, props.stageElement])
  const [movedPins, setMovedPins] = useState<Record<number, boolean>>({}) // 各ピンの移動状態を管理するオブジェクト

  // ピンの移動を確認し、スコアを更新する関数
  useEffect(() => {
    const checkPinMovement = () => {
      if (pinsRef.current) {
        pinsRef.current.forEach((pin, index) => {
          const originalPin = props.stageElement.pins[index]
          const moved = pin.position.x !== originalPin.x || pin.position.y !== originalPin.y
          if (moved && !movedPins[index]) {
            props.setScore((prevScore) => prevScore + 1)  // スコアを更新
            // ピンの移動状態を更新する
            setMovedPins((prevMovedPins) => ({ ...prevMovedPins, [index]: true }))
          }
        })
      }
    }
  
    const interval = setInterval(checkPinMovement, 1000)
  
    return () => clearInterval(interval)
  }, [props.stageElement.pins, props.setScore, movedPins])

  function handleThrowClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false)
    }
    if (engineRef.current && arrowGuideRef.current) {
      Matter.World.remove(engineRef.current.world, arrowGuideRef.current)
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
      <Button onClick={props.handleNextStage}>Next Stage</Button>
    </div>
  )
}
