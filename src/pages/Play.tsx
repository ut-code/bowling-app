import { useState } from "react"
import { StageElements, TypeScore } from "../App"
import Stage from "./Stage"

interface Props {
  setScores: (scores: TypeScore[]) => void
}

export default function Play(props: Props) {
  const [stageNumber, setStageNumber] = useState(0)
  const stageElements: StageElements[] = [
    {
      stageNumber: 0,
      obstacles: [{ x: 200, y: 300 }],
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
  ]

  const stageElement = stageElements.find((element) => element.stageNumber === stageNumber)

  return <Stage stageElement={stageElement} stageNumber={stageNumber} setStageNumber={setStageNumber} setScores={props.setScores} />
}
