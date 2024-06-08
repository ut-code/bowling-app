import { useState } from "react"
import Start from "./pages/Start"
import Play from "./pages/Play"
import Score from "./pages/Score"
import { Grid } from "@mui/material"

export type TypeScore = {
  stage: number
  score: number
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
  const [scores, setScores] = useState<TypeScore[]>([])

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" width={"100vw"} spacing={2} style={{ margin: "8px" }}>
      {uiState === "Start" && <Start setUiState={setUiState} />}
      {uiState === "Play" && <Play setUiState={setUiState} setScores={setScores} />}
      {uiState === "Score" && <Score setUiState={setUiState} scores={scores} />}
    </Grid>
  )
}
