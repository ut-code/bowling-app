import { useState } from "react"
import { StageElements } from "../App"
// import { Example } from "../components/Example";

export default function Play() {
  const [stageNumber, setStageNumber] = useState(0)
  const [stageElements] = useState<StageElements[]>([
    {
      obstacles: [{ x: 400, y: 300 }],
      pins: [
        { x: 400, y: 260 },
        { x: 380, y: 240 },
        { x: 420, y: 240 },
        { x: 360, y: 220 },
        { x: 400, y: 220 },
        { x: 440, y: 220 },
        { x: 340, y: 200 },
        { x: 380, y: 200 },
        { x: 420, y: 200 },
        { x: 460, y: 200 },
      ],
    },
  ])

  return <div>Play</div>
}
