import { Button, TextField, styled, Grid } from "@mui/material"
import logo from "../../assets/bowling_logo.png"

interface Props {
  setUiState: (uiState: string) => void
}

export default function Start(props: Props) {
  const RedButton = styled(Button)({
    backgroundColor: "#E96A64",
    "&:hover": {
      backgroundColor: "darkred",
    },
    color: "white",
    width: "30%",
  })
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <img src={logo} alt="壁よけボウリング" width={"50%"} />
      <TextField id="outlined-basic" label="ユーザー名" variant="outlined" margin="normal" style={{ width: "30%" }} />
      <RedButton onClick={() => props.setUiState("Play")}>プレイ</RedButton>
    </Grid>
  )
}
