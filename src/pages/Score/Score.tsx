import { Button } from "@mui/material"
import ScoreSheet from "./ScoreSheet"

interface Props {
  setUiState: (uiState: string) => void
}

export default function Score(props: Props) {
  return (
    <div>
      <h1>スコア</h1>
      <ScoreSheet />
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
