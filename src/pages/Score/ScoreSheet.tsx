import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { Fragment } from "react"
import { GameScore } from "../../App"

interface Props {
  gameScores: GameScore[]
}

export default function ScoreSheet(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {props.gameScores.map((_, index) => (
              <TableCell key={index} align="center" colSpan={2} sx={{ border: "2px solid rgb(30, 30, 30)", backgroundColor: "rgb(30, 30, 30)", color: "white" }}>
                <b>{index + 1}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {props.gameScores.map((score) => (
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
          </TableRow>
          <TableRow>
            {props.gameScores.map((score) => (
							<Fragment key={score.stageNumber}>
								<TableCell align="center" colSpan={2} sx={{ border: "2px solid rgb(30, 30, 30)" }}>
									{score.totalScore ?? "-"}
								</TableCell>
							</Fragment>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
