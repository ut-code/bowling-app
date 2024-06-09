import { Button } from "@mui/material"
import { GameScore } from "../../App"
import ScoreSheet from "./ScoreSheet"
import { calculate } from "./ScoreSheet"

interface Props {
  setUiState: (uiState: string) => void
  gameScores: GameScore[]
}

export default function Score(props: Props) {
  const gameScores: GameScore[] =
    props.gameScores.length > 0
      ? props.gameScores
      : [
          { stageNumber: 1, firstThrow: 3, secondThrow: 4, sumScore: 150 },
          { stageNumber: 2, firstThrow: 5, secondThrow: 5, sumScore: 200 },
          { stageNumber: 3, firstThrow: 10, secondThrow: null, sumScore: 240 },
        ]

  const calculatedGameScores = calculate(gameScores)
  const sumScore = calculatedGameScores[calculatedGameScores.length - 1]?.sumScore ?? 0

  return (
    <div>
      <h1>スコア</h1>
      <h1>{sumScore}点</h1>
      <ScoreSheet gameScores={gameScores} />
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
