import { Button, TextField, styled } from "@mui/material";
interface Props {
  setUiState: ( uiState: string) => void
}

function Start(props: Props) {
  const RedButton = styled(Button)({
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: "darkred",
    },
    color: "white",
    width: 436,
    height: 77,
  });
  return (
    <>
      <h1>ボーリング.js</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField id="outlined-basic" label="名前" variant="outlined" />
        <RedButton onClick={() => props.setUiState("Example")}>プレイ</RedButton>
      </div>
    </>
  );
}

export default Start;
