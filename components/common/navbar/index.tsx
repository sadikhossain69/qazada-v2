

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryType } from "components/allTypes/categoriesType";
import { AllCartProds } from "components/allTypes/dto/CartDTO";
import appConfig from "config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { cartDrawerElAtom, customerContactInfo, topBannerAtom } from "../../../atoms/atoms";
import { appStyles } from "../appColors";
import { removeCustomerDetailsFromStorage, removeSessionId } from "../functions";
import CartDrawer from "./cartDrawer";
import NavLeftSideMenuDrawer from "./leftMenuDrawer";
import { SearchBar } from "./searchBar";
import * as styles from "./styles";
import CancelIcon from "@mui/icons-material/Cancel";
import { AddBox, ExpandMore } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import axios from "axios";

interface Country {
  country: string;
  // Other properties...
}

export default function Navbar() {
  const queryClient = useQueryClient();
  const [cartDrawerEl, setCartDrawerEl] = useRecoilState(cartDrawerElAtom);
  const [displayTopBanner, setDisplayTopBanner] = useRecoilState(topBannerAtom);
  const [anchorLeftMenuEl, setAnchorLeftMenuEl] = useState<boolean>(false);
  const [customerContInfo, setCustomerContInfo] = useRecoilState(customerContactInfo);
  const [mobileSearchBarShow, setMobileSearchBarShow] = useState(false)
  const cartProducts = queryClient.getQueryData<AllCartProds>(["cartProducts"]);
  const categories = queryClient.getQueryData<CategoryType[]>([appConfig.queryKeys.categories]);
  const [countries, setCountries] = useState<Country[]>([]);

  const router = useRouter();
  const { catId } = router.query;
  // console.log("categories: ", categories);
  const toggleCartDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setCartDrawerEl(open);
  };

  const toggleLeftMenuDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setAnchorLeftMenuEl(open);
    };

  const handleLogout = () => {
    removeCustomerDetailsFromStorage();
    removeSessionId();
    setCustomerContInfo(null);
    queryClient.resetQueries(["cartProducts"]);
  };

  const openTheqaUrl = () => {
    window.open(appConfig.siteInfo.certificateURL, "_blank");
  };

  const [fixedSearchbar, setFixedSearchbar] = React.useState(false);

  const handleScroll = () => {
    const position = window.pageYOffset || document.documentElement.scrollTop;
    console.log(position);
    if (position > 210) {
      setFixedSearchbar(true);
    } else {
      setFixedSearchbar(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  const handleWhatsAppClick = () => {
    const message = "Your custom message here"; // Replace with your desired message
    const phoneNumber = "1234567890"; // Replace with the recipient's phone number including the country code

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL);
  };


  const fetchCountries = async () => {
    let country = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );

    setCountries(country.data.data);
  };

  useEffect(() => {
    fetchCountries();
  }, []);



  let googleTranslateInitialized = false;

  const googleTranslateElementInit = () => {
    if (!googleTranslateInitialized) {
      const googleTranslate = (window as any).google.translate;

      new googleTranslate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ar,hi',
          layout: googleTranslate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
      googleTranslateInitialized = true;
    }
  };


  useEffect(() => {
    if (!(window as any).google || !(window as any).google.translate) {
      const addScript = document.createElement('script');
      addScript.setAttribute(
        'src',
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      );
      document.body.appendChild(addScript);
      (window as any).googleTranslateElementInit = googleTranslateElementInit;
    } else {
      googleTranslateElementInit(); // If already loaded, initialize directly
    }
  }, []);


  const toggleVisibilityMobileSearchBar = () => {
    setMobileSearchBarShow(!mobileSearchBarShow); // Toggles the state between true and false
  };



  return (
    <Box sx={styles.navbarStyles} className={displayTopBanner ? "navbar-with-topbanner" : "navbar"}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={styles.appbarStyles}>
        {displayTopBanner && (
          <Box sx={styles.topBanner}>
            <Container maxWidth="lg" disableGutters>
              <Grid2 container alignItems={"center"} wrap="nowrap" sx={styles.topBanner}>
                <Grid2>
                  <img
                    onClick={openTheqaUrl}
                    src="/images/theqa_logo.png"
                    className="theqa-logo"
                    alt="theqa logo"
                  />
                </Grid2>
                <Grid2 xs={9}>
                  <Typography color={"#ffffff"} className="top-banner-text" onClick={openTheqaUrl}>
                    <i>
                      Buy with Confidence. We are <strong>certified by THEQA</strong> - Qatar
                      Ministry of Communication & Transport
                    </i>
                  </Typography>
                </Grid2>
                <Grid2 xsOffset={"auto"}>
                  <IconButton sx={{ color: "#ffffff" }} onClick={() => setDisplayTopBanner(false)}>
                    <CancelIcon />
                  </IconButton>
                </Grid2>
              </Grid2>
            </Container>
          </Box>
        )}

        <Box sx={{ ...styles.actionNavStyles, pb: 1 }} >
          <Container maxWidth="lg">
            <Grid2
              container
              component="nav"
              alignItems={"center"}
              sx={{ display: { xs: "none", md: "flex" } }}
              spacing={{ xs: 2, sm: 3 }}
            >
              <Grid2 md={6} sx={{ textAlign: "left" }}>
                <Typography sx={{ fontSize: 14 }}>
                  Whatsapp <SmartphoneIcon sx={{ fontSize: 14, paddingTop: 0.11 }} />
                  <Box
                    onClick={handleWhatsAppClick}
                    component="span"
                    style={{ textDecoration: "underline" }}
                  >
                    +971525291077
                  </Box>
                </Typography>
              </Grid2>
              <Grid2 md={6} sx={{ textAlign: "right" }}>
                {countries.length > 0 && (
                  <Box sx={{ paddingX: 0.5 }} component="span">
                    <select id="SelectDropdown" style={{ border: "none", background: "none", minWidth: "120px", maxWidth: "120px" }}>
                      <option selected value="Select_Country" disabled>Select Country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                    </select>
                  </Box>
                )}
                <Box component="span" sx={{ display: " contents" }} id="google_translate_element"></Box>
                <Box
                  sx={{ paddingX: 0.5 }}
                  component="span"
                >
                  <Button disabled>SING UP</Button>
                </Box>
                <Box
                  sx={{ paddingX: 0.5 }}
                  component="span"
                >
                  <Button disabled>SING IN</Button>
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>

        <Box sx={{ ...styles.actionNavStyles, pb: 2 }}>
          <Container maxWidth="lg">
            <Grid2 container component="nav" alignItems={"center"} spacing={{ xs: 2, sm: 3 }}>
              <Grid2 sx={{ display: { xs: "flex", md: "none" } }}>
                {/* Left menu icon only for Mobile View */}
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleLeftMenuDrawer(true)}
                  sx={{ pr: 0, pb: 0, pt: 0 }}
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
              </Grid2>
              <Grid2 sx={{ display: { xs: "flex", md: "none" } }}>
                <SearchIcon sx={{ pr: 0, pb: 0, pt: 0 }} onClick={toggleVisibilityMobileSearchBar} />
              </Grid2>

              <Grid2 md={4} sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
                <SearchBar />
              </Grid2>
              <Grid2 md={4} sx={{ display: { xs: "none", md: "block", textAlign: "center" } }}>
                <Link href="/" className="logo-link">
                  <img src={`/images/qazada-logo.png`} alt="logo" className="header-logo" />
                </Link>
              </Grid2>
              <Grid2
                sx={{
                  display: { xs: "flex", md: "none" },
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* <SearchBar /> */}
                <Link style={{ textAlign: "center" }} href="/" className="logo-link">
                  <img
                    src={`/images/qazada-logo.png`}
                    alt="logo"
                    className="header-logo"
                    style={{ maxHeight: "25px", padding: 0, textAlign: "center" }}
                  />
                </Link>
              </Grid2>
              <Grid2 md={4} sx={{ textAlign: "right" }}>
                <Tooltip title="Cart">
                  <IconButton onClick={toggleCartDrawer(true)} className="nav-icon">
                    <Badge
                      badgeContent={cartProducts ? cartProducts.data?.length : 0}
                      color="primary"
                    >
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Grid2>
              {/* {customerContInfo && (
                <Grid2>
                  <Button
                    className="nav-icon"
                    sx={{
                      color: "var(--dark-grey)",
                      fontWeight: appStyles.w600,
                      fontSize: 16,
                    }}
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </Grid2>
              )} */}
            </Grid2>
          </Container>
        </Box>
        <Box sx={styles.catNavStyles} bgcolor={"#C8C7B5"}>
          <Container maxWidth="lg" sx={{ bgcolor: "#C8C7B5" }}>
            <Grid2
              container
              wrap="nowrap"
              spacing={4}
              alignItems="center"
              justifyContent={"space-between"}
              sx={{ mx: 1, my: 0.5, mb: 0 }}
            >
              <Grid2
                color={"black"}
                component="li"
                className={`nav-cat-container ${router.asPath === "/" ? "nav-item-active" : ""}`}
              >
                <Link href="/" className="nav-item">
                  HOME
                </Link>
              </Grid2>
              {categories &&
                categories.map((category) => (
                  <Grid2
                    component="li"
                    key={category._id}
                    className={`nav-cat-container ${catId === category._id ? "nav-item-active" : ""
                      }`}
                    style={{ position: "relative" }}
                  >
                    <Link
                      href={`/category/${category._id}/${category.category_name}`}
                      className="nav-item"
                    >
                      {category.category_name.toUpperCase()}
                      {category.items.length ? <ExpandMore /> : null}
                    </Link>

                    {category.items.length ? (
                      <ul className="sub-menu-container">
                        {category.items.map((v: any) => (
                          <Grid2
                            component="li"
                            key={v._id}
                            className={`nav-cat-container ${catId === v._id ? "nav-item-active" : ""
                              }`}
                            style={{ position: "relative" }}
                          >
                            <Link
                              href={`/category/${v._id}/${v.category_name}`}
                              className="nav-item"
                            >
                              {v.category_name.toUpperCase()}
                            </Link>
                          </Grid2>
                        ))}
                      </ul>
                    ) : null}

                    {category.category_name.toUpperCase() == "CLEARANCE SALE" ? (
                      <img
                        style={{
                          position: "absolute",
                          top: "-4px",
                          right: "10px",
                          width: "32px",
                          animation: "png-animatide 2s infinite",
                        }}
                        src="/images/sale.png"
                      />
                    ) : null}
                    {category.category_name.toUpperCase() == "NEW ARRIVAL" ? (
                      <img
                        style={{
                          position: "absolute",
                          top: "-4px",
                          right: "10px",
                          width: "32px",
                          animation: "png-animatide 2s infinite",
                        }}
                        src="/images/new.png"
                      />
                    ) : null}
                  </Grid2>
                ))}
            </Grid2>
          </Container>
        </Box>
        <Box sx={{
          display: {
            xs: mobileSearchBarShow === false ? "none" : "flex",
            md: "none"
          }
        }}
          mx={2}
          pb={1}>
          <SearchBar />
        </Box>
      </AppBar>

      {fixedSearchbar && (
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={styles.appbarStyles}
          style={{ position: "fixed", boxShadow: "0 0 10px #3333336b" }}
        >
          <Box sx={{ display: { xs: "flex", md: "none" } }} mx={2} py={1.5}>
            <SearchBar />
          </Box>
        </AppBar>
      )}

      <CartDrawer open={cartDrawerEl} toggleDrawer={toggleCartDrawer} />
      <NavLeftSideMenuDrawer open={anchorLeftMenuEl} toggleDrawer={toggleLeftMenuDrawer} />
    </Box>
  );
}



























