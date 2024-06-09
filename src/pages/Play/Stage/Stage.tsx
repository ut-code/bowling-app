import { IconButton } from "@mui/material"
import { RotateLeft, RotateRight, ArrowRight, ArrowLeft } from "@mui/icons-material"
import Matter from "matter-js"
import { useEffect, useRef, useContext } from "react"
import { StageElements } from "../../../App"
import {
  createArrowGuide,
  createBall,
  createObstacles,
  createPins,
  createWalls,
  rotateArrowGuide,
} from "../../../matterBodies"
import StageHeader from "./StageHeader"
import bowlingField from "../../../assets/bowling_field.jpg"
import { GameScoreContext } from "../../../App"
import { RedButton } from "../../../RedButton"

const RENDERER_WIDTH = 800
const RENDERER_HEIGHT = 550
const WALL_WIDTH = 50
const INITIAL_BALL_POSITION = { x: 400, y: 500 }
const INITIAL_GRAVITY = { x: 0, y: -3 }
const ARROW_OFFSET = -24

interface Props {
  stageElement: StageElements
  totalStageCount: number
  stageNumber: number
  handleNextStage: () => void
  score: number // スコアを受け取るプロップス
  setScore: React.Dispatch<React.SetStateAction<number>> // スコアを更新するプロップス
}

export default function Stage(props: Props) {
  const { gameScores, setGameScores } = useContext(GameScoreContext)

  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const ballRef = useRef<Matter.Body | null>(null)
  const arrowGuideRef = useRef<Matter.Body | null>(null)
  const canvasRef = useRef(null)
  const pinsRef = useRef<Matter.Body[] | null>(null)
  const obstaclesRef = useRef<Matter.Body[] | null>(null)
  const wallsRef = useRef<Matter.Body[] | null>(null)
  const currentAngleRef = useRef<number>(0)

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = Matter.Engine.create()
    engine.gravity.x = INITIAL_GRAVITY.x
    engine.gravity.y = INITIAL_GRAVITY.y

    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: RENDERER_WIDTH,
        height: RENDERER_HEIGHT,
        wireframes: false,
        background: `url(${bowlingField})`,
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
        // if (
        //   (obstaclesRef.current?.includes(bodyA) || obstaclesRef.current?.includes(bodyB)) &&
        //   (bodyA === ballRef.current || bodyB === ballRef.current)
        // ) {
        //   // reset
        //   Matter.Body.setPosition(ballRef.current, INITIAL_BALL_POSITION)
        //   Matter.Body.setStatic(ballRef.current, true)
        //   if (arrowGuideRef.current) {
        //     Matter.World.add(engine.world, [arrowGuideRef.current])
        //     Matter.Body.setPosition(arrowGuideRef.current, {
        //       x: INITIAL_BALL_POSITION.x,
        //       y: 241,
        //     })
        //     Matter.Body.setAngle(arrowGuide, 0)
        //   }
        // }
        // 壁との衝突
        if (
          (wallsRef.current?.includes(bodyA) || wallsRef.current?.includes(bodyB)) &&
          (bodyA === ballRef.current || bodyB === ballRef.current)
        ) {
          countPins()
          // reset
          Matter.Body.setPosition(ballRef.current, INITIAL_BALL_POSITION)
          Matter.Body.setStatic(ballRef.current, true)
          if (arrowGuideRef.current) {
            Matter.World.add(engine.world, [arrowGuideRef.current])
            Matter.Body.setPosition(arrowGuideRef.current, {
              x: INITIAL_BALL_POSITION.x,
              y: 241,
            })
            Matter.Body.setAngle(arrowGuide, 0)
          }
        }

        // 重力方向は常にリセット
        if (engineRef.current) {
          engineRef.current.gravity.x = INITIAL_GRAVITY.x
          engineRef.current.gravity.y = INITIAL_GRAVITY.y
        }
        currentAngleRef.current = 180
      })
    })

    const walls = createWalls(WALL_WIDTH)
    wallsRef.current = walls

    const ball = createBall(INITIAL_BALL_POSITION.x)
    ballRef.current = ball

    const arrowGuide = createArrowGuide(INITIAL_BALL_POSITION, ARROW_OFFSET)
    arrowGuideRef.current = arrowGuide

    const pins = createPins(props.stageElement.pins)
    pinsRef.current = pins

    const obstacles = createObstacles(props.stageElement.obstacles)
    obstaclesRef.current = obstacles

    currentAngleRef.current = 180

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

  async function countPins() {
    // 0.2秒待つ
    await new Promise((resolve) => setTimeout(resolve, 200))

    // ピンの数をカウントする
    const pinsCount = pinsRef.current?.filter((pin) => !pin.isStatic).length ?? 0
    // スコアを更新する
    props.setScore(pinsCount)

    setGameScores((prevGameScores) => {
      if (prevGameScores.length === 0 || prevGameScores[prevGameScores.length - 1].stageNumber !== props.stageNumber) {
        console.log("1st throw")
        return [
          ...prevGameScores,
          {
            stageNumber: props.stageNumber,
            firstThrow: pinsCount,
            secondThrow: null,
            sumScore: null,
            totalScore: null,
          },
        ]
      }
      console.log("2nd throw")
      return prevGameScores.map((gameScore) => {
        if (gameScore.stageNumber === props.stageNumber && gameScore.firstThrow !== null) {
          return { ...gameScore, secondThrow: pinsCount - gameScore.firstThrow! }
        }
        return gameScore
      })
    })
  }

  useEffect(() => {
    if (!gameScores.length) return
    // 1投目ストライクもしくは2投目終了後にステージ変更
    const lastGameScore = gameScores[gameScores.length - 1]
    if (lastGameScore.firstThrow === 10 || lastGameScore.secondThrow !== null) {
      props.handleNextStage()
    }
  }, [gameScores])

  function moveBallPositionX(dx: number) {
    if (!ballRef.current) return
    if (!arrowGuideRef.current) return
    const newPositionX = ballRef.current.position.x + dx
    if (newPositionX < 0 + WALL_WIDTH || newPositionX > RENDERER_WIDTH - WALL_WIDTH) return
    Matter.Body.setPosition(ballRef.current, { x: newPositionX, y: ballRef.current.position.y })
    Matter.Body.setPosition(arrowGuideRef.current, { x: newPositionX, y: arrowGuideRef.current.position.y })
  }

  /**
   * 重力の方向を変更する関数。ボールの方向コントロールに使用。
   * @param angle 角度の変化量 (度数法) 反時計回りが正
   */
  function changeGravityAngle(angle: number) {
    if (!engineRef.current) return
    currentAngleRef.current += angle
    const radian = currentAngleRef.current * (Math.PI / 180)

    console.log("radians", Math.sin(radian), Math.cos(radian))
    engineRef.current.gravity.x = Math.sin(radian)
    engineRef.current.gravity.y = Math.cos(radian)
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
      <StageHeader totalStageCount={props.totalStageCount} score={props.score} stageNumber={props.stageNumber} />
      <div ref={canvasRef} style={{ position: "relative", width: "800px", height: "550px" }}></div>
			<div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
				<IconButton
					onClick={() => {
						moveBallPositionX(-10)
					}}
				>
					<ArrowLeft />
				</IconButton>
				<RedButton onClick={throwBall} variant="contained">
					Throw!
				</RedButton>
				<IconButton
					onClick={() => {
						moveBallPositionX(10)
					}}
				>
					<ArrowRight />
				</IconButton>
			</div>
			<div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
				<IconButton
					onClick={() => {
						changeGravityAngle(10)
						if (!ballRef.current?.position.x) return
						if (!ballRef.current?.position.y) return
						rotateArrowGuide(
							arrowGuideRef.current,
							(-10 * Math.PI) / 180,
							ballRef.current.position.x,
							ballRef.current.position.y,
						)
					}}
				>
					<RotateLeft />
				</IconButton>
				<IconButton
					onClick={() => {
						changeGravityAngle(-10)
						if (!ballRef.current?.position.x) return
						if (!ballRef.current?.position.y) return
						rotateArrowGuide(
							arrowGuideRef.current,
							(10 * Math.PI) / 180,
							ballRef.current.position.x,
							ballRef.current.position.y,
						)
					}}
				>
					<RotateRight />
				</IconButton>
			</div>
    </>
  )
}
