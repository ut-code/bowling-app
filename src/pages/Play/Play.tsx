import { useState } from "react"
import { StageElements } from "../../App"
import { Grid } from "@mui/material"
import Stage from "./Stage/Stage"

const stageElements: StageElements[] = [
  {
    stageNumber: 1,
    obstacles: [{ x: 375, y: 300 }],
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
      { x: 250, y: 125 },
      { x: 500, y: 150 },
      { x: 450, y: 250 },
      { x: 350, y: 200 },
    ],
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
    stageNumber: 3,
    obstacles: [
      { x: 350, y: 400 },
      { x: 500, y: 300 },
      { x: 370, y: 200 },
      { x: 470, y: 180 },
    ],
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
    stageNumber: 4,
    obstacles: [
      { x: 250, y: 100 },
      { x: 360, y: 150 },
      { x: 550, y: 200 },
      { x: 340, y: 250 },
      { x: 434, y: 300 },
      { x: 600, y: 350 },
      { x: 350, y: 400 },
      { x: 460, y: 450 },
      { x: 650, y: 500 },
    ],

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
    stageNumber: 5,
    obstacles: [
      { x: 250, y: 100 },
      { x: 450, y: 150 },
      { x: 300, y: 200 },
      { x: 500, y: 250 },
      { x: 350, y: 300 },
      { x: 550, y: 350 },
      { x: 400, y: 400 },
      { x: 600, y: 450 },
      { x: 650, y: 100 },
      { x: 250, y: 250 },
      { x: 450, y: 400 },
    ],
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
]

interface Props {
  setUiState: (uiState: string) => void
}

export default function Play(props: Props) {
  const [stageNumber, setStageNumber] = useState(1)
  const [score, setScore] = useState(0) // スコアの状態を管理

  const stageElement = stageElements.find((element) => element.stageNumber === stageNumber)
  if (!stageElement) {
    return <div>ステージが見つかりません</div>
  }

  const handleNextStage = () => {
    if (stageNumber === stageElements.length) {
      props.setUiState("Score")
      return
    }
    setStageNumber((number) => number + 1)
  }
  return (
    <Grid>
      <Stage
        stageElement={stageElement}
        totalStageCount={stageElements.length}
        stageNumber={stageNumber}
        handleNextStage={handleNextStage}
        score={score} // スコアをStageコンポーネントに渡す
        setScore={setScore} // スコアを更新する関数をStageコンポーネントに渡す
      />
    </Grid>
  )
}
