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
  stageNumber: number
  handleNextStage: () => void
  setScores: React.Dispatch<React.SetStateAction<GameScore[]>>
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

  const [ballPositionX, setBallPositionX] = useState(INITIAL_BALL_POSITION.x)

  const updateBallPositionX = (newPositionX: number) => {
    if (newPositionX < 0 + WALL_WIDTH || newPositionX > RENDERER_WIDTH - WALL_WIDTH) return
    setBallPositionX(newPositionX)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          updateBallPositionX(ballPositionX + 10)
          break
        case "ArrowLeft":
          updateBallPositionX(ballPositionX - 10)
          break
        case " ":
          handleThrowClick()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)

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

  useEffect(() => {
    if (engineRef.current && ballRef.current && arrowGuideRef.current) {
      Matter.Body.setPosition(ballRef.current, { x: ballPositionX, y: ballRef.current.position.y })
      Matter.Body.setPosition(arrowGuideRef.current, { x: ballPositionX, y: arrowGuideRef.current.position.y })
    }
  }, [ballPositionX])

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
  }, [movedPins, props, props.stageElement.pins])

  function handleThrowClick() {
    if (ballRef.current) {
      Matter.Body.setStatic(ballRef.current, false)
    }
    if (engineRef.current && arrowGuideRef.current) {
      Matter.World.remove(engineRef.current.world, arrowGuideRef.current)
    }
  }

  return (
    <>
      <StageHeader score={props.score} stageNumber={props.stageNumber} />
      <div ref={canvasRef} style={{ position: "relative", width: "800px", height: "550px" }}></div>
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
    </>
  )
}
