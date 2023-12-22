import React, { Fragment, useEffect } from "react";
import axios from "axios";
import appConfig from "config";

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
import EastIcon from '@mui/icons-material/East';
import { grey } from "@mui/material/colors";
import ProdsListSkeleton from "components/common/skeletons/prodsListSekeleton";
import { YellowButton } from "components/common/styled/buttons";
import * as styles from "../productsByCat/style";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { allura } from "utils/theme";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { appStyles } from "components/common/appColors";
import { getLocationData } from "../../../hooks/useOrder";
import { ProductsData } from "components/allTypes/productType";
import { useInfiniteQuery } from "@tanstack/react-query";

import { findKey } from "lodash";



const cateSortingReqObj = {
    default: { modified_date: -1 },
    lowToHigh: {
        "location_data.discounted_price": 1,
        "location_data.selling_price": 1,
        _id: -1,
    },
    highToLow: {
        "location_data.discounted_price": -1,
        "location_data.selling_price": -1,
        _id: -1,
    },
    aToZ: { product_name: 1, _id: -1 },
    zToA: { product_name: -1, _id: -1 },
};



const CategoriesFirstProduct = (props: any) => {


    const categoriesId = props.categoriesId;
    const [currPage, setCurrPage] = React.useState(0);
    const [sortBy, setSortBy] = React.useState<string>(JSON.stringify(cateSortingReqObj.default));
    const selectedSortingKey = findKey(cateSortingReqObj, JSON.parse(sortBy));
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


    const fetchProductsByCatId = async () => {
        return (
            await axios.post("/api/store/product/catalog/query/get", {
                models: {
                    "location_data.website_remarks": `${appConfig.api.locationId}_Live`,
                    "category.value": `${categoriesId}`,
                },
                // skip: pageParam,
                limit: 1,
                // sort: JSON.parse(sortBy),
            })
        ).data.data as ProductsData[];
    };
    const useProdsInfiniteQuery = useInfiniteQuery(
        [`catProducts-${categoriesId}-${selectedSortingKey}`],
        fetchProductsByCatId,

    );
    const flattenedProductsData = useProdsInfiniteQuery.data?.pages.flat();

    return (
        <Fragment>
            {flattenedProductsData && flattenedProductsData?.map((item, index) => {
                const locationData = getLocationData(item?.location_data);

                return (
                    <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={3}
                        component="div"
                        onMouseOver={() => {
                            handleMouseOver(index);
                        }}
                        onMouseLeave={() => {
                            handleMouseLeave(index);
                        }}
                        className="category-card"
                    // sx={{ ...styles.categorieCardStyles, borderRadius: `0px !important`, }}
                    >
                        <Link className="card-container" href={`/category/${categoriesId}/${item.category[0].text}`}>

                            {/* Go to the bottom of global.css file to change category card design */}
                            <section id="carsds">
                                <div className="container">
                                    <div className="row">
                                        <div className="card_main">
                                            <div className="card_pos">
                                                {appConfig.product.displayYoutubeThumbnail && item.youtube_link ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${item.youtube_link}/sddefault.jpg`}
                                                        alt="video-thumb"
                                                        // className="cate-box-img main-cate-card-img"
                                                    />
                                                ) : (
                                                    <img
                                                        src={`${appConfig.api.imgUrl}/${item.image_name[0].name}?w=680&fit=crop&auto=format`}
                                                        loading="lazy"
                                                        // className="cate-box-img main-cate-card-img"
                                                    />
                                                )}
                                                <div className="catergory_line"></div>
                                                <p>
                                                    <span className="catergory_name">{item.category[0].text}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <Paper elevation={4} sx={{ borderRadius: `0px !important`, boxShadow: `none !important`, }}>
                                <Box sx={{ position: "relative", borderRadius: `0px !important`, backgroundColor: "#E7E7E7", padding: "7px", paddingBottom: "0px"}}>
                                    {appConfig.product.displayYoutubeThumbnail && item.youtube_link ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${item.youtube_link}/sddefault.jpg`}
                                            alt="video-thumb"
                                            className="cate-box-img main-cate-card-img"
                                        />
                                    ) : (
                                        <img
                                            src={`${appConfig.api.imgUrl}/${item.image_name[0].name}?w=680&fit=crop&auto=format`}
                                            loading="lazy"
                                            className="cate-box-img main-cate-card-img"
                                        />
                                    )}
                                </Box>
                                <Box sx={{ mx: { md: 3, sm: 2, xs: 1 },  }}>
                                    <Box sx={{ ...styles.prodPriceNumber, paddingBottom: "5px" }}>
                                        {item.category[0].text} <EastIcon sx={{ marginLeft: 1, fontSize: "23px", paddingTop: "10px" }} />
                                    </Box >

                                </Box>
                            </Paper> */}
                        </Link>
                    </Grid>
                );
            }
            )}
        </Fragment>
    );

}

export default CategoriesFirstProduct