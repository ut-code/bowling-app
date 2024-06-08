import { Button } from "@mui/material";
import styled from "styled-components";

function Start() {
  const RedButton = styled(Button)({
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkred',
    },
    width: 436,
    height: 77
  });
  return (
    <>
    <RedButton>こんにちは</RedButton>
    </>
  );
}

export default Start