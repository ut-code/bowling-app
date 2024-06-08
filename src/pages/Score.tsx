import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material"
import { TypeScore } from "../App"

interface Props {
  scores: TypeScore[]
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
              <TableRow key={score.stage}>
                <TableCell>{score.stage}</TableCell>
                <TableCell>{score.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
