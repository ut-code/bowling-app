import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { Fragment } from "react"
import { GameScore } from "../../App"

interface Props {
  gameScores: GameScore[]
}

export default function ScoreSheet(props: Props) {
  const gameScores: GameScore[] =
    props.gameScores.length > 0
      ? props.gameScores
      : [
          { stageNumber: 1, firstThrow: null, secondThrow: 4, totalScore: 150 },
          { stageNumber: 2, firstThrow: 5, secondThrow: 5, totalScore: 200 },
          { stageNumber: 3, firstThrow: 10, secondThrow: null, totalScore: 240 },
      ]

  return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{gameScores.map((_, index) => (
							<TableCell key={index} align="center" colSpan={2}>
								{index + 1}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						{gameScores.map((score) => (
							<Fragment key={score.stageNumber}>
								<TableCell align="center">
									{score.firstThrow === null
										? ""
										: score.firstThrow === 10
										? "X"
										: score.firstThrow ?? "-"}
								</TableCell>
								<TableCell align="center">
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
						{gameScores.map((score) => (
							<TableCell align="center" colSpan={2}>{score.totalScore ?? "-"}</TableCell>
						))}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
  )
}
