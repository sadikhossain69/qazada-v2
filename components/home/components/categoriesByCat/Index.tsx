

import {

  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import { allura } from "utils/theme";

import * as styles from "../productsByCat/style";

import { CategoryType } from "components/allTypes/categoriesType";
import CategoriesFirstProduct from "./CategoriesFirstProduct";
import ProdsListSkeleton from "components/common/skeletons/prodsListSekeleton";

interface Props {
  title?: string;
  categoriesData: CategoryType[] | undefined;
  // loading: boolean;
}

export default function CategoriesByCat({ title, categoriesData }: Props) {
  const theme = useTheme();
  const [currIndex, setCurrIndex] = useState<number | null>(null);
  const router = useRouter();
  const isAbove600 = useMediaQuery(theme.breakpoints.up("sm"));
  const handleMouseOver = (index: number) => {
    if (isAbove600) {
      setCurrIndex(index);
    }
  };
  // console.log("categoriessData",categoriesData)
  return (
    <Fragment>

      {title && (
        <Typography
          variant="h2"
          fontSize={{ sm: "3.75rem", xs: "2.2rem", }}
          textAlign="center"
          className={allura.className}
          color={grey[800]}
          sx={styles.prodCatTitle}
        >
          {title}
        </Typography>
      )}
      <Grid sx={{borderRadius: `0px !important`,mb:2}} container columnSpacing={2} rowSpacing={5} className="products-wrapper">
        {
          !categoriesData ? (
            <ProdsListSkeleton />
          ) :
            categoriesData?.slice(1, 6)?.map((item, index) => {

              return (
                  <CategoriesFirstProduct key={index} categoriesId={item._id} />
              )
            })
        }
      </Grid>
    </Fragment>
  );
}


