import { Grid } from "@mui/material"

interface Props {
  score: number
  stageNumber: number
}

export default function StageHeader(props: Props) {
  console.log(props.score)
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <h3>ステージ{props.stageNumber}</h3>
      <h3>スコア: {props.score}</h3>
    </Grid>
  )
}
