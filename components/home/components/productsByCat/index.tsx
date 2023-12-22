
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ProdsListSkeleton from "components/common/skeletons/prodsListSekeleton";
import { YellowButton } from "components/common/styled/buttons";
import appConfig from "config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { allura } from "utils/theme";
import { ProductsData } from "../../../allTypes/productType";
import { getLocationData } from "../../../hooks/useOrder";
import * as styles from "./style";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { appStyles } from "components/common/appColors";

interface Props {
  title?: string;
  productsData: ProductsData[] | undefined;
  loading: boolean;
}

export default function ProductsByCat({ title, productsData, loading }: Props) {
  const theme = useTheme();
  const [currIndex, setCurrIndex] = useState<number | null>(null);
  const router = useRouter();
  const isAbove600 = useMediaQuery(theme.breakpoints.up("sm"));
  const handleMouseOver = (index: number) => {
    if (isAbove600) {
      setCurrIndex(index);
    }
  };
  const handleMouseLeave = (index: number) => {
    setCurrIndex(null);
  };
  const handleSingleProdRoute = (id: string) => {
    router.push(`/product/${id}`);
    window.scroll(0, 0);
  };

  const paperStyles = {
    boxShadow: 'none', // Initial box shadow
    // border: '1px solid lightgray',
    // backgroundColor: "#E7E7E7",
    borderRadius: "10px",
    transition: 'box-shadow 0.3s', // Adding transition for smooth effect
    ':hover': {
      boxShadow: '0 6px 12px 0 rgba(0,0,0,0.2)', // Box shadow on hover
    }
  };
  return (
    <>
      <div className="full-product-card">
        {/* Why condition with title? To use another title with different styles in the parent element */}
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
        <Grid container columnSpacing={2} rowSpacing={5} className="products-wrapper">
          {!loading && productsData ? (
            productsData.map((item, index) => {
              const locationData = getLocationData(item.location_data);
              return (
                <Grid
                  item
                  key={index}
                  xs={6}
                  md={4}
                  lg={3}
                  component="div"
                  onMouseOver={() => {
                    handleMouseOver(index);
                  }}
                  onMouseLeave={() => {
                    handleMouseLeave(index);
                  }}
                  className="product-card"
                  sx={styles.prodCardStyles}
                >
                  <div className="product-card-container">
                    <Link href={`/product/${item.product_slug}`} className="product-card-desing" >
                      <Paper elevation={4} sx={paperStyles}>
                        <div className="product-card-top">
                          <Box sx={{ position: "relative", borderRadius: "15px !important" }}>
                            {appConfig.product.displayYoutubeThumbnail && item.youtube_link ? (
                              <img
                                src={`https://img.youtube.com/vi/${item.youtube_link}/sddefault.jpg`}
                                alt="video-thumb"
                                className="prod-box-img main-prod-card-img"
                              />
                            ) : (
                              <img
                                src={`${appConfig.api.imgUrl}/${item.image_name[0].name}?w=680&fit=crop&auto=format`}
                                loading="lazy"
                                className="prod-box-img main-prod-card-img"
                              />
                            )}
                          </Box>
                        </div>
                        <div className="product-card-bottom-part">
                          <Box sx={{ mx: { sm: 2, xs: 1 }, }}>
                            <Stack direction={"row"} justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={styles.prodTitle} noWrap={false}>
                                {item.product_name}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              sx={{
                                ...styles.prodPriceText,
                                color: locationData.discounted_price ? "gray" : "#222222",
                              }}
                            >
                              {appConfig.product.currency + " . "}&nbsp;
                              <Box component="span" sx={styles.prodPriceNumber}>
                                {locationData.selling_price}
                              </Box>

                            </Typography>


                          </Box>
                        </div>
                      </Paper>
                    </Link>
                  </div>
                </Grid>
              );
            })
          ) : (
            <ProdsListSkeleton />
          )}
        </Grid>
      </div>

    </>
  );
}



