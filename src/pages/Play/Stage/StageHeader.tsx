import { Grid } from "@mui/material"
import ScoreSheet from "../../Score/ScoreSheet"
import { GameScore } from "../../../App"

interface Props {
  totalStageCount: number
  gameScores: GameScore[]
  score: number
  stageNumber: number
}

export default function StageHeader(props: Props) {
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <h3>ステージ{props.stageNumber}</h3>
      <h3>スコア: {props.score}</h3>
      <ScoreSheet gameScores={props.gameScores} />
    </Grid>
  )
}
