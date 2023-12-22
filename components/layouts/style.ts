import { muiSxPropType } from "components/common/types";

export const homeLayout: muiSxPropType = {
  "& .navbar-with-topbanner": {
    pb: {
      xs: 0,
      // md: 22,
    },
  },
  "& .navbar": {
    pb: {
      xs: 0,
      md: 12.7,
    },
  },
};

export const homeCompWrapper: muiSxPropType = {
  px: {
    xs: 2,
    md: 5,
  },
  pt:1,
  "& .banner-img": {
    // width: "100%",
    borderRadius: {
      xs: "10px",
      sm: "20px",
    },
  },
};
