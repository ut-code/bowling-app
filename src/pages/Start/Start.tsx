import { TextField, Grid } from "@mui/material"
import logo from "../../assets/bowling_logo.png"
import { RedButton } from "../../RedButton"
import { useContext } from "react"
import { GameScoreContext } from "../../App"

interface Props {
  setUiState: (uiState: string) => void
}

export default function Start(props: Props) {
  const { setGameScores } = useContext(GameScoreContext)

  function handleClick() {
    setGameScores([])
    props.setUiState("Play")
  }
  
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <img src={logo} alt="壁よけボウリング" width={"50%"} />
      <div style={{ width: "30%" }}>
        <TextField id="outlined-basic" label="ユーザー名" variant="outlined" margin="normal" style={{ width: "100%" }} />
        <RedButton onClick={handleClick} style={{ width: "100%" }}>プレイ</RedButton>
      </div>
    </Grid>
  )
}
