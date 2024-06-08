import { useState } from "react"
import Start from "./pages/Start/Start"
import Play from "./pages/Play/Play"
import Score from "./pages/Score/Score"
import { Grid } from "@mui/material"

export type GameScore = {
  stageNumber: number
  firstScore: number | null
  secondScore: number | null
  score: number | null
}

export type Pin = {
  x: number
  y: number
}

export type Obstacle = {
  x: number
  y: number
}

export type StageElements = {
  stageNumber: number
  obstacles: Obstacle[]
  pins: Pin[]
}

export default function App() {
  const [uiState, setUiState] = useState("Start")
  const [scores, setScores] = useState<GameScore[]>([])

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" width={"100vw"} spacing={2} style={{ margin: "8px" }}>
      {uiState === "Start" && <Start setUiState={setUiState} />}
      {uiState === "Play" && <Play setUiState={setUiState} setScores={setScores} />}
      {uiState === "Score" && <Score setUiState={setUiState} scores={scores} />}
    </Grid>
  )
}
