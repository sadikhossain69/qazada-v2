import { styled } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { grey, yellow } from "@mui/material/colors";
import { appColors, appStyles } from "../appColors";


export const LinkButton = styled(Button)<ButtonProps>(() => ({
  color: "#1769aa",
}));

export const YellowButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor:appColors.nudeBlack, 
  border: "1px solid #222222",
  color: grey[900],
  borderRadius:"0px !important",
  // padding:"8px 120px ",
  fontWeight: appStyles.w600,
  ":hover": {
    color:"#fff",
    backgroundColor: "#C8C6B6",
    "& .MuiCircularProgress-root": {
      color: "#fff",
    },
  },
}));

export const WhatsAppButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor:appColors.nudeBlack, 
  border: "1px solid #222222",
  color: grey[900],
  borderRadius:"0px !important",
  // padding:"8px 120px ",
  fontWeight: appStyles.w600,
  ":hover": {
    color:"#fff",
    backgroundColor: "#C8C6B6",
    "& .MuiCircularProgress-root": {
      color: "#fff",
    },
  },

}));

export const BlackButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor:appColors.nudeBlack, 
  border: "1px solid #222222",
  color: grey[900],
  borderRadius:"0px !important",
  // padding:"8px 120px ",
  fontWeight: appStyles.w600,
  ":hover": {
    color:"#fff",
    backgroundColor: "#C8C6B6",
    "& .MuiCircularProgress-root": {
      color: "#fff",
    },
  },

}));

