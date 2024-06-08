import { useState } from "react"
import { StageElements, GameScore } from "../../App"
import { Grid } from "@mui/material"
import Stage from "./Stage/Stage"

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
  gameScores: GameScore[]
  setGameScores: React.Dispatch<React.SetStateAction<GameScore[]>>
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
    <Grid>
      <Stage
        stageElement={stageElement}
        totalStageCount={stageElements.length}
        stageNumber={stageNumber}
        handleNextStage={handleNextStage}
        gameScores={props.gameScores}
        setGameScores={props.setGameScores}
        score={score} // スコアをStageコンポーネントに渡す
        setScore={setScore} // スコアを更新する関数をStageコンポーネントに渡す
      />
    </Grid>
  )
}
