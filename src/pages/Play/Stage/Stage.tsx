import { Button } from "@mui/material"
import Matter from "matter-js"
import { useEffect, useRef, useState } from "react"
import { StageElements, GameScore } from "../../../App"
import { createArrowGuide, createBall, createObstacles, createPins, createWalls } from "../../../matterBodies"
import StageHeader from "./StageHeader"

const RENDERER_WIDTH = 800
const RENDERER_HEIGHT = 550
const WALL_WIDTH = 50
const INITIAL_BALL_POSITION = { x: 400, y: 500 }

interface Props {
  stageElement: StageElements
  totalStageCount: number
  stageNumber: number
  handleNextStage: () => void
  gameScores: GameScore[]
  setGameScores: React.Dispatch<React.SetStateAction<GameScore[]>>
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          moveBallPositionX(10)
          break
        case "ArrowLeft":
          moveBallPositionX(-10)
          break
        case " ":
          throwBall()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

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

        // ピンとボールの衝突
        if (
          (pinsRef.current?.includes(bodyA) || pinsRef.current?.includes(bodyB)) &&
          (bodyA === ballRef.current || bodyB === ballRef.current)
        ) {
          const pin = bodyA === ballRef.current ? bodyB : bodyA
          Matter.Body.setStatic(pin, false)
        }

        // ピン同士の衝突
        if (pinsRef.current?.includes(bodyA) && pinsRef.current?.includes(bodyB)) {
          Matter.Body.setStatic(bodyA, false)
          Matter.Body.setStatic(bodyB, false)
        }

        // 障害物とボールの衝突
        if (
          (obstaclesRef.current?.includes(bodyA) || obstaclesRef.current?.includes(bodyB)) &&
          (bodyA === ballRef.current || bodyB === ballRef.current)
        ) {
          // reset
          Matter.Body.setPosition(ballRef.current, INITIAL_BALL_POSITION)
          Matter.Body.setStatic(ballRef.current, true)
          if (arrowGuideRef.current) {
            Matter.World.add(engine.world, [arrowGuideRef.current])
            Matter.Body.setPosition(arrowGuideRef.current, {
              x: INITIAL_BALL_POSITION.x,
              y: arrowGuideRef.current.position.y,
            })
          }
        }
        // 壁との衝突
        if (
          (wallsRef.current?.includes(bodyA) || wallsRef.current?.includes(bodyB)) &&
          (bodyA === ballRef.current || bodyB === ballRef.current)
        ) {
          // reset
          Matter.Body.setPosition(ballRef.current, INITIAL_BALL_POSITION)
          Matter.Body.setStatic(ballRef.current, true)
          if (arrowGuideRef.current) {
            Matter.World.add(engine.world, [arrowGuideRef.current])
            Matter.Body.setPosition(arrowGuideRef.current, {
              x: INITIAL_BALL_POSITION.x,
              y: arrowGuideRef.current.position.y,
            })
          }
        }
      })
    })

    const walls = createWalls(WALL_WIDTH)
    wallsRef.current = walls

    const ball = createBall(INITIAL_BALL_POSITION.x)
    ballRef.current = ball

    const arrowGuide = createArrowGuide(INITIAL_BALL_POSITION.x)
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
  }, [props.stageElement])
  const [movedPins, setMovedPins] = useState<Record<number, boolean>>({}) // 各ピンの移動状態を管理するオブジェクト

  // ピンの移動を確認し、スコアを更新する関数
  useEffect(() => {
    const checkPinMovement = () => {
      if (pinsRef.current) {
        pinsRef.current.forEach((pin, index) => {
          const originalPin = props.stageElement.pins[index]
          const moved = pin.position.x !== originalPin.x || pin.position.y !== originalPin.y
          if (moved && !movedPins[index]) {
            props.setScore((prevScore) => prevScore + 1) // スコアを更新
            // ピンの移動状態を更新する
            setMovedPins((prevMovedPins) => ({ ...prevMovedPins, [index]: true }))
          }
        })
      }
    }

    const interval = setInterval(checkPinMovement, 1000)

    return () => clearInterval(interval)
  }, [movedPins, props, props.stageElement.pins])

  function moveBallPositionX(dx: number) {
    if (!ballRef.current) return
    if (!arrowGuideRef.current) return
    const newPositionX = ballRef.current.position.x + dx
    if (newPositionX < 0 + WALL_WIDTH || newPositionX > RENDERER_WIDTH - WALL_WIDTH) return
    Matter.Body.setPosition(ballRef.current, { x: newPositionX, y: ballRef.current.position.y })
    Matter.Body.setPosition(arrowGuideRef.current, { x: newPositionX, y: arrowGuideRef.current.position.y })
  }

  function throwBall() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false)
    }
    if (engineRef.current && arrowGuideRef.current) {
      Matter.World.remove(engineRef.current.world, arrowGuideRef.current)
    }
  }

  return (
    <>
      <StageHeader
        totalStageCount={props.totalStageCount}
        gameScores={props.gameScores}
        score={props.score}
        stageNumber={props.stageNumber}
      />
      <div ref={canvasRef} style={{ position: "relative", width: "800px", height: "550px" }}></div>
      <Button
        onClick={() => {
          moveBallPositionX(-10)
        }}
      >
        ←
      </Button>
      <Button onClick={throwBall} variant="contained">
        Throw!
      </Button>
      <Button
        onClick={() => {
          moveBallPositionX(10)
        }}
      >
        →
      </Button>
      <Button onClick={props.handleNextStage}>Next Stage</Button>
    </>
  )
}
