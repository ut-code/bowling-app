import { Button, TextField, styled } from "@mui/material"
import logo from "../assets/bowling_logo.png"

interface Props {
  setUiState: (uiState: string) => void
}

function Start(props: Props) {
  const RedButton = styled(Button)({
    backgroundColor: "#D25E5E",
    "&:hover": {
      backgroundColor: "darkred",
    },
    color: "white",
    width: "100%",
  })
  return (
    <>
      <img src={logo} alt="壁よけボウリング" width={"50%"} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField id="outlined-basic" label="名前" variant="outlined" />
        <RedButton onClick={() => props.setUiState("Play")}>プレイ</RedButton>
      </div>
    </>
  )
}

export default Start
