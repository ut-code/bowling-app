import ScoreSheet from "./ScoreSheet"
import { RedButton } from "../../RedButton"

interface Props {
  setUiState: (uiState: string) => void
}

export default function Score(props: Props) {
  return (
    <div>
      <h1>スコア</h1>
      <ScoreSheet />
      <div style={{ width: "30%", marginTop: "8px" }}>
        <RedButton onClick={() => props.setUiState("Start")} style={{ width: "100%" }}>タイトルに戻る</RedButton>
      </div>
    </div>
  )
}
