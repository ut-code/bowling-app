import { Button } from "@mui/material"
import ScoreSheet from "./ScoreSheet"

interface Props {
  setUiState: (uiState: string) => void
}

const currentScore = 100

export default function Score(props: Props) {
  // const gameScores: GameScore[] =
  //   props.gameScores.length > 0
  //     ? props.gameScores
  //     : [
  //         { stageNumber: 1, firstThrow: 3, secondThrow: 4, sumScore: 150, totalScore: 111 },
  //         { stageNumber: 2, firstThrow: 5, secondThrow: 5, sumScore: 200, totalScore: 111 },
  //         { stageNumber: 3, firstThrow: 10, secondThrow: null, sumScore: 240, totalScore: 111 },
  //       ]

  return (
    <div>
      <h1>スコア</h1>
      <h1>{currentScore}点</h1>
      <ScoreSheet />
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
