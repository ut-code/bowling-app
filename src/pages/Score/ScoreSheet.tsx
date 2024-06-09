import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { Fragment, useContext, useMemo } from "react"
import { GameScore } from "../../App"
import { GameScoreContext } from "../../App"

export default function ScoreSheet() {
  const { gameScores } = useContext(GameScoreContext)
  
  const calculatedGameScores = useMemo(() => calculate(gameScores), [gameScores])
  const totalScore = calculatedGameScores[calculatedGameScores.length - 1]?.sumScore ?? 0

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>

            {calculatedGameScores.map((_, index) => (
              <TableCell key={index} align="center" colSpan={2} sx={{ border: "2px solid rgb(30, 30, 30)", backgroundColor: "rgb(30, 30, 30)", color: "white" }}>
                <b>{index + 1}</b>
              </TableCell>
            ))}
            <TableCell align="center" colSpan={2}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {calculatedGameScores.map((score) => (
              <Fragment key={score.stageNumber}>
                <TableCell align="center" sx={{ border: "2px solid rgb(30, 30, 30)" }}>
                  {score.firstThrow === null ? "" : score.firstThrow === 10 ? "X" : score.firstThrow ?? "-"}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid rgb(30, 30, 30)" }}>
                  {score.firstThrow === null || score.secondThrow === null
                    ? ""
                    : score.firstThrow + score.secondThrow === 10
                      ? "/"
                      : score.secondThrow ?? "-"}
                </TableCell>
              </Fragment>
            ))}
            <TableCell align="center" colSpan={2}>
              {totalScore}
            </TableCell>
          </TableRow>
          <TableRow>

            {calculatedGameScores.map((score) => (
							<Fragment key={score.stageNumber}>
								<TableCell align="center" colSpan={2} sx={{ border: "2px solid rgb(30, 30, 30)" }}>
									{score.totalScore ?? "-"}
								</TableCell>
							</Fragment>
            ))}
            <TableCell align="center" colSpan={2}>
              {totalScore}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function calculate(gameScores: GameScore[]) {
  const sumScores = []
  let cumulativeScore = 0

  for (let i = 0; i < gameScores.length; i++) {
    const frame = gameScores[i]
    let frameScore = 0

    if (frame.firstThrow === 10) {
      // Strike
      frameScore =
        10 +
        (gameScores[i + 1]?.firstThrow || 0) +
        (gameScores[i + 1]?.secondThrow || gameScores[i + 2]?.firstThrow || 0)
    } else if (frame.firstThrow! + frame.secondThrow! === 10) {
      // Spare
      frameScore = 10 + (gameScores[i + 1]?.firstThrow || 0)
    } else {
      // Open frame
      frameScore = frame.firstThrow! + frame.secondThrow!
    }

    cumulativeScore += frameScore
    sumScores.push({
      ...frame,
      sumScore: cumulativeScore,
    })
  }

  return sumScores
}
