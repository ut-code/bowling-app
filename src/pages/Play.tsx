// pages/Play.tsx
import { useState } from "react"
import { StageElements, TypeScore } from "../App"
import Stage from "./Stage"
import Score from "../components/Score"

const stageElements: StageElements[] = [
  {
    stageNumber: 0,
    obstacles: [{ x: 200, y: 300 }],
    pins: [
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
    ],
  },
  {
    stageNumber: 1,
    obstacles: [{ x: 400, y: 300 }],
    pins: [
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
    ],
  },
  {
    stageNumber: 2,
    obstacles: [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
    ],
    pins: [
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

  return (
    <div>
      <Stage
        stageElement={stageElement}
        stageNumber={stageNumber}
        setStageNumber={setStageNumber}
        setScores={props.setScores}
        score={score} // スコアをStageコンポーネントに渡す
        setScore={setScore} // スコアを更新する関数をStageコンポーネントに渡す
      />
      <Score score={score} /> // スコアを表示するコンポーネント
    </div>
  )


  const handleNextStage = () => {
    if (stageNumber === stageElements.length - 1) {
      props.setUiState("Score")
      return
    }
    setStageNumber((number) => number + 1)
  }

  const stageElement = stageElements.find((element) => element.stageNumber === stageNumber)

  if (!stageElement) {
    return <div>Stage Not Found</div>
  }
  return <Stage stageElement={stageElement} stageNumber={stageNumber} handleNextStage={handleNextStage} setScores={props.setScores} />
}
