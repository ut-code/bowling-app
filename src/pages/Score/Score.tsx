import { Button } from "@mui/material"
import { GameScore } from "../../App"
import ScoreSheet from "./ScoreSheet"

interface Props {
  setUiState: (uiState: string) => void
  gameScores: GameScore[]
}

const currentScore = 100

// ScoreSheetにリネームしたほうがいいかも
export default function Score(props: Props) {
  const gameScores: GameScore[] =
    props.gameScores.length > 0
      ? props.gameScores
      : [
          { stageNumber: 1, firstThrow: 3, secondThrow: 4, totalScore: 150 },
          { stageNumber: 2, firstThrow: 5, secondThrow: 5, totalScore: 200 },
          { stageNumber: 3, firstThrow: 10, secondThrow: null, totalScore: 240 },
        ]

  return (
    <div>
      <h1>スコア</h1>
      <h1>{currentScore}点</h1>
      <ScoreSheet gameScores={gameScores} />
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
