// components/Score.tsx
import React from "react"

interface Props {
  score: number
}

const Score: React.FC<Props> = ({ score }) => {
  console.log("こんにちは")
  console.log(score)
  return (
    <div>
      <h2>スコア: {score}</h2>
    </div>
  )
}

export default Score
