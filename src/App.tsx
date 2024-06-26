import { useState, createContext } from "react"
import Start from "./pages/Start/Start"
import Play from "./pages/Play/Play"
import Score from "./pages/Score/Score"
import { Grid } from "@mui/material"

export type GameScore = {
  stageNumber: number
  firstThrow: number | null
  secondThrow: number | null
  sumScore: number | null
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

export const GameScoreContext = createContext<{
  gameScores: GameScore[]
  setGameScores: React.Dispatch<React.SetStateAction<GameScore[]>>
}>({
  gameScores: [],
  setGameScores: () => {},
})

export default function App() {
  const [uiState, setUiState] = useState("Start")
  const [gameScores, setGameScores] = useState<GameScore[]>([])

  return (
    <GameScoreContext.Provider value={{ gameScores, setGameScores }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={"100vw"}
        spacing={2}
        style={{ margin: "8px" }}
      >
        {uiState === "Start" && <Start setUiState={setUiState} />}
        {uiState === "Play" && <Play setUiState={setUiState} />}
        {uiState === "Score" && <Score setUiState={setUiState} />}
      </Grid>
    </GameScoreContext.Provider>
  )
}
