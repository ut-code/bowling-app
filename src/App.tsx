import { useState } from "react";
import Example from "./pages/Example";

function App() {
  const [uiState, setUiState] = useState("Start");
  
  return (
    <div>
      {uiState === "Start" && <p>start</p>}
      {uiState === "Score" && <p>score</p>}
      {uiState === "Example" && <Example />}
      <button onClick={() => setUiState("Example")}>Example</button>
      <button onClick={() => setUiState("Start")}>Start</button>
      <button onClick={() => setUiState("Score")}>Score</button>
    </div>
  );
}

export default App;
