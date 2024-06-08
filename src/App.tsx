import { useState } from "react";
import Example from "./pages/Example";
import Score from "./pages/Score";

export type TypeScore = {stage: number, score: number};
import Start from "./pages/Start";

function App() {
  const [uiState, setUiState] = useState("Start");
  const [scores, setScores] = useState<TypeScore[]>([]);

  return (
    <div>
      {uiState === "Start" && <p>start</p>}
      {uiState === "Score" && <Score scores={scores} />}
      {uiState === "Start" && <Start setUiState={setUiState}/>}
      {uiState === "Example" && <Example />}
      <button onClick={() => setUiState("Example")}>Example</button>
      <button onClick={() => setUiState("Start")}>Start</button>
      <button onClick={() => setUiState("Score")}>Score</button>
    </div>
  );
}

export default App;
