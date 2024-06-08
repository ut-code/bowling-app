import { useState } from "react"
import { StageElements, TypeScore } from "../../App"
import Stage from "./Stage/Stage"
import StageHeader from "./Stage/StageHeader"

const stageElements: StageElements[] = [
  {
    stageNumber: 0,
    obstacles: [{ x: 200, y: 300 }],
    pins: [
      { x: 400, y: 110 },
      { x: 380, y: 90 },
      { x: 420, y: 90 },
      { x: 360, y: 70 },
      { x: 400, y: 70 },
      { x: 440, y: 70 },
      { x: 340, y: 50 },
      { x: 380, y: 50 },
      { x: 420, y: 50 },
      { x: 460, y: 50 },
    ],
  },
  {
    stageNumber: 1,
    obstacles: [{ x: 400, y: 300 }],
    pins: [
      { x: 400, y: 110 },
      { x: 380, y: 90 },
      { x: 420, y: 90 },
      { x: 360, y: 70 },
      { x: 400, y: 70 },
      { x: 440, y: 70 },
      { x: 340, y: 50 },
      { x: 380, y: 50 },
      { x: 420, y: 50 },
      { x: 460, y: 50 },
    ],
  },
  {
    stageNumber: 2,
    obstacles: [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
    ],
    pins: [
      { x: 400, y: 10 },
      { x: 380, y: 90 },
      { x: 420, y: 90 },
      { x: 360, y: 70 },
      { x: 400, y: 70 },
      { x: 440, y: 70 },
      { x: 340, y: 50 },
      { x: 380, y: 50 },
      { x: 420, y: 50 },
      { x: 460, y: 50 },
    ],
  }
]

interface Props {
  setUiState: (uiState: string) => void
  setScores: (scores: TypeScore[]) => void
}

export default function Play(props: Props) {
  const [stageNumber, setStageNumber] = useState(0)

  const [score, setScore] = useState(0) // スコアの状態を管理


  const stageElement = stageElements.find((element) => element.stageNumber === stageNumber)
  if (!stageElement) {
    return <div>ステージが見つかりません</div>
  }

  const handleNextStage = () => {
    if (stageNumber === stageElements.length - 1) {
      props.setUiState("Score")
      return
    }
    setStageNumber((number) => number + 1)
  }
  return (
    <div>
      <StageHeader score={score} stageNumber={stageNumber} />
      <Stage
        stageElement={stageElement}
        stageNumber={stageNumber}
        handleNextStage={handleNextStage}
        setScores={props.setScores}
        score={score} // スコアをStageコンポーネントに渡す
        setScore={setScore} // スコアを更新する関数をStageコンポーネントに渡す
      />
    </div>
  )
}
