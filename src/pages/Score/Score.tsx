import { Button } from "@mui/material"
import ScoreSheet from "./ScoreSheet"

interface Props {
  setUiState: (uiState: string) => void
}

const currentScore = 100

export default function Score(props: Props) {
  return (
    <div>
      <h1>スコア</h1>
      <h1>{currentScore}点</h1>
      <ScoreSheet />
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
