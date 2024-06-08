import { useState } from "react";
import Example from "./pages/Example";
import Score from "./pages/Score";
import Start from "./pages/Start";
import { Grid } from "@mui/material";

export type TypeScore = {
  stage: number,
  score: number
};

function App() {
  const [uiState, setUiState] = useState("Start");
  const [scores, setScores] = useState<TypeScore[]>([]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      width={"100vw"}
      spacing={2}
    >
      <Grid direction="row">
        <button onClick={() => setUiState("Example")}>Example</button>
        <button onClick={() => setUiState("Start")}>Start</button>
        <button onClick={() => setUiState("Score")}>Score</button>
      </Grid>
      {uiState === "Score" && <Score scores={scores} />}
      {uiState === "Start" && <Start setUiState={setUiState}/>}
      {uiState === "Example" && <Example />}
    </Grid>
  );
}

export default App;
