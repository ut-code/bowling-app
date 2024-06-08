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
  obstacles: Obstacle[]
  pins: Pin[]
}

export default function App() {
  const [uiState, setUiState] = useState("Start")
  const [scores, setScores] = useState<TypeScore[]>([])

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" width={"100vw"} spacing={2}>
      <Grid direction="row">
        <button onClick={() => setUiState("Start")}>Start</button>
        <button onClick={() => setUiState("Play")}>Play</button>
        <button onClick={() => setUiState("Score")}>Score</button>
      </Grid>
      {uiState === "Start" && <Start setUiState={setUiState} />}
      {uiState === "Play" && <Play />}
      {uiState === "Score" && <Score scores={scores} />}
    </Grid>
  )
}
