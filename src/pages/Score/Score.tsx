import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material"

import { GameScore } from "../../App"

interface Props {
  setUiState: (uiState: string) => void
  scores: GameScore[]
}

const currentScore = 100

export default function Score(props: Props) {
  const scores =
    props.scores.length > 0
      ? props.scores
      : [
          { stage: 1, score: 150 },
          { stage: 2, score: 200 },
          { stage: 3, score: 180 },
        ]

  return (
    <div>
      <h1>スコア</h1>
      <h1>{currentScore}点</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ステージ</TableCell>
              <TableCell>点数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.stageNumber}>
                <TableCell>{score.stageNumber}</TableCell>
                <TableCell>{score.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => props.setUiState("Start")}>タイトルに戻る</Button>
    </div>
  )
}
