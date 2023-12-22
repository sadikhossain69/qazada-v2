
import EmailIcon from "@mui/icons-material/Email";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  GridSize,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import appConfig from "../../../config";
import { appColors, appStyles } from "../appColors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/router";
// category list
import FacebookSharpIcon from '@mui/icons-material/FacebookSharp';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import { ExpandMore } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryType } from "components/allTypes/categoriesType";
import Image from "next/image";
import IosStoreImage from "../../../images/ios-store.webp"
import AndroidImage from "../../../images/android-store.webp"
import PaymentImg from "../../../images/payment_icon1.jpg"
// const TagButtonsStyle = {
//   margin: 0,
//   marginLeft: '0px !important',
//   textTransform: "capitalize",
//   borderRadius: "0",
//   borderColor: "#444444",
//   color: "#fff",
//   ":hover": {
//     backgroundColor: appColors.nudeBlack,
//     color: appColors.darkGrey,
//     borderColor: "transparent",
//   },
// };

interface panels {
  [key: string]: boolean;
}

const Footer = () => {
  // category list
  const router = useRouter();
  const { catId } = router.query;
  const queryClient = useQueryClient();
  const categories = queryClient.getQueryData<CategoryType[]>([appConfig.queryKeys.categories]);

  const [expanded, setExpanded] = React.useState<panels>({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
    panel5: false,
  });
  const [accordionDisabled, setAccordionDisabled] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const mdUpMatches = useMediaQuery("(min-width:900px)");
  const down1000pxMatches = useMediaQuery("(max-width:1000px)");

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (down1000pxMatches) {
      setExpanded({
        ...expanded,
        [panel]: isExpanded,
      });
    }
  };

  useEffect(() => {
    if (mdUpMatches) {
      setAccordionDisabled(true);
      setAllExpanded(true);
    } else {
      setAccordionDisabled(false);
      setAllExpanded(false);
    }
  }, [mdUpMatches]);

  const accordionProps = {
    disableGutters: true,
    elevation: 0,
    sx: {
      backgroundColor: "transparent",
      color: "#fff",
      ":before": {
        display: "none",
      },
    },
    className: "footer-accordion",
    TransitionProps: { timeout: 700 },
  };
  const accordionSummaryProps = {
    expandIcon: !allExpanded && (
      <img src={"/images/caret-down-square.svg"} className="expand-icon" />
    ),
    sx: {
      "& 	.MuiAccordionSummary-content": {
        xs: {
          margin: 0,
        },
      },
    },
  };

  const accordionSummaryTitleProps = {
    sx: {
      fontSize: {
        xs: "15px",
        sm: "17px",
        md: "19px",
      },
    },
  };

  const mediaIconsProps = {
    sx: {
      fontSize: {
        xs: "25px",
        sm: "28px",
        md: "30px",
      },
      marginRight: "8px",
      marginTop: "20px",



    },
  };

  // category list

  return (
    <footer>
      <Stack
        spacing={{ md: 10, xs: 5 }}
        direction={{ xs: "column", md: "row" }}
        // className="footer-credit"
        // justifyContent="center"
        alignItems={{ xs: "center", md: "flex-start" }}
      >
        {/* <Typography color={appColors.lightGreyText}>
          {appConfig.name} is a registered company in Qatar. Contact us - +971 56 425 9474

        </Typography> */}
      </Stack>

      {/* expanded and disabled will be true for higher device widths to follow the design. */}
      <div className="footer-div">
        <Grid
          container
          // sx={{backgroundColor:"black",padding:"50px 100px 40px 100px"}}
          className="footer-content"

        >
          <Grid item xs={12} md={6} lg={2}>
            <Accordion
              {...accordionProps}
              expanded={!allExpanded ? !accordionDisabled && expanded.panel1 === true : true}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary {...accordionSummaryProps}>
                <Typography variant="h6" {...accordionSummaryTitleProps} style={{ color: "black" }}>
                  SHOP
                </Typography>
              </AccordionSummary>
              <AccordionDetails>

                <Grid
                >
                  <Link href="/" className="footer-navbar">
                    HOME
                  </Link>
                </Grid>
                {categories &&
                  categories.map((category) => (
                    <Grid
                      key={category._id}
                    >
                      <Link
                        href={`/category/${category._id}/${category.category_name}`}
                        className="footer-navbar"
                      >
                        {category.category_name.toUpperCase()}
                      </Link>

                    </Grid>
                  ))}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <Accordion
              {...accordionProps}
              expanded={!allExpanded ? !accordionDisabled && expanded.panel2 === true : true}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary {...accordionSummaryProps}>
                <Typography variant="h6" {...accordionSummaryTitleProps} style={{ color: "black" }}>
                  BOUTIQUES
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack sx={{ color: "white" }} >
                  <Link href="#" className="footer-navbar">
                    Women Shoes
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Handbags
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Clothes
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Accessories
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Lingerie
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Home Décor
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Kids Wear
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Automotive
                  </Link>
                  <Link href="#" className="footer-navbar">
                    Jewelry
                  </Link>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={6} lg={2} >
            <Accordion
              {...accordionProps}
              expanded={!allExpanded ? !accordionDisabled && expanded.panel3 === true : true}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary {...accordionSummaryProps}>
                <Typography variant="h6" {...accordionSummaryTitleProps} style={{ color: "black" }}>
                  COMMUNITY              </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack sx={{ color: "white" }}>
                  <Link href="/" className="footer-navbar">Designer Dresses</Link>
                  <Link href="/" className="footer-navbar">New Products</Link>
                  <Link href="/" className="footer-navbar">Our Lookbook</Link>
                  <Link href="/about-us" className="footer-navbar">About Us</Link>
                  <Link href="/" className="footer-navbar">Careers</Link>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={6} lg={2.3} >
            <Accordion
              {...accordionProps}
              expanded={!allExpanded ? !accordionDisabled && expanded.panel4 === true : true}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary {...accordionSummaryProps}>
                <Typography variant="h6" {...accordionSummaryTitleProps} style={{ color: "black" }}>
                  CUSTOMER SERVICE
                </Typography>
              </AccordionSummary>
              <AccordionDetails>

                <Stack sx={{ color: "white" }}>
                  <Link href="/privacy-and-cookie-policy" className="footer-navbar">Privacy and Cookie Policy</Link>
                  <Link href="/terms-and-conditions" className="footer-navbar">Terms & Conditions</Link>
                  <Link href="/" className="footer-navbar">Advanced Search</Link>
                  <Link href="/contact-us" className="footer-navbar">Contact Us</Link>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={6} lg={3.7}>
            <Stack sx={{ marginLeft: 2, marginTop: 1 }}>
              <Typography variant="h6" {...accordionSummaryTitleProps} style={{ color: "#" }}>
                FOLLOW US
              </Typography>
              <Grid container spacing={1} justifyContent="flex-start">
                <Grid item>
                  <Link href='#' style={{ color: "black" }}><FacebookSharpIcon {...mediaIconsProps} /></Link>
                </Grid>
                <Grid item>
                  <Link href='#' style={{ color: "black" }}><InstagramIcon {...mediaIconsProps} /></Link>
                </Grid>
                <Grid item>
                  <Link href='#' style={{ color: "black" }}><TwitterIcon {...mediaIconsProps} /></Link>
                </Grid>
                <Grid item>
                  <Link href='#' style={{ color: "black" }}><WhatsAppIcon {...mediaIconsProps} /></Link>
                </Grid>
              </Grid>
              <Typography style={{ color: "black", padding: "20px 0px" }}>GET OUR LATEST STYLE UPDATES</Typography>
              <Box component="form" sx={{ position: 'relative', width: "100%" }}>
                <TextField
                  style={{
                    color: 'black',
                    border: '1px solid black',
                    background: '#E7CDBA',
                    borderRadius: '0 !important',
                    width: '100%', // Fill the width of the parent container
                    maxWidth: '100%', // Set a maximum width for better responsiveness
                  }}
                  placeholder="Enter your email address"
                  id="email"
                  name="email"
                  margin="dense"
                  size="small"
                  type="email"
                />
                <Button
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: 'black',
                    height: '100%', // Fill the height of the TextField
                    borderRadius: '0 !important',
                  }}
                >
                  SUBSCRIBE
                </Button>
              </Box>

              <Typography style={{ color: "black", paddingTop:4 }} sx={{ display: { xs: "none", md: "none", lg: "block" } }}>100% SECURE</Typography>
              <Grid
                sx={{
                  flex:"block",
                  justifyContent: {
                    xs:"space-between",
                    md: "space-between",
                    lg: "space-between"
                  },
                  paddingTop:3,

                }}
              >
                <Image src={IosStoreImage} alt="ios store image" />
                <Image src={AndroidImage} style={{ marginLeft: 10 }} alt="android image" />
              </Grid>

            </Stack>
          </Grid>
        </Grid>
      </div>
      <div className="footer-pages">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <Typography variant="body1" mt={1} className="footer-copyright" sx={{ textAlign: "center" }}>
              Copyright © {new Date().getFullYear()}-{appConfig.name}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={6} sx={{ display: { xs: "none", md: "block", lg: "block" } }}>
            <Image src={PaymentImg} style={{ width: "80%" }} alt="paymet image" />
          </Grid>


        </Grid>

      </div>
    </footer>
  );
};

export default Footer;































// import EmailIcon from "@mui/icons-material/Email";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Button,
//   Divider,
//   Grid,
//   GridSize,
//   Stack,
//   TextField,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import appConfig from "../../../config";
// import { appColors, appStyles } from "../appColors";

// const TagButtonsStyle = {
//   margin:0,
//   marginLeft:'0px !important',
//   textTransform: "capitalize",
//   borderRadius: "0",
//   borderColor: "#444444",
//   color: "#7f7f7f",
//   ":hover": {
//     backgroundColor: appColors.nudeBlack,
//     color: appColors.darkGrey,
//     borderColor: "transparent",
//   },
// };

// interface panels {
//   [key: string]: boolean;
// }

// const Footer = () => {
//   const [expanded, setExpanded] = React.useState<panels>({
//     panel1: false,
//     panel2: false,
//     panel3: false,
//     panel4: false,
//   });
//   const [accordionDisabled, setAccordionDisabled] = useState(false);
//   const [allExpanded, setAllExpanded] = useState(false);
//   const mdUpMatches = useMediaQuery("(min-width:900px)");
//   const down1000pxMatches = useMediaQuery("(max-width:1000px)");

//   const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
//     if (down1000pxMatches) {
//       setExpanded({
//         ...expanded,
//         [panel]: isExpanded,
//       });
//     }
//   };

//   useEffect(() => {
//     if (mdUpMatches) {
//       setAccordionDisabled(true);
//       setAllExpanded(true);
//     } else {
//       setAccordionDisabled(false);
//       setAllExpanded(false);
//     }
//   }, [mdUpMatches]);

//   const accordionProps = {
//     disableGutters: true,
//     elevation: 0,
//     sx: {
//       backgroundColor: "transparent",
//       color: "#fff",
//       ":before": {
//         display: "none",
//       },
//     },
//     className: "footer-accordion",
//     TransitionProps: { timeout: 700 },
//   };
//   const accordionSummaryProps = {
//     expandIcon: !allExpanded && (
//       <img src={"/images/caret-down-square.svg"} className="expand-icon" />
//     ),
//     sx: {
//       "& 	.MuiAccordionSummary-content": {
//         xs: {
//           margin: 0,
//         },
//       },
//     },
//   };
//   const gridAccordionProps = {
//     item: true,
//     md: 6 as GridSize,
//     lg: 3 as GridSize,
//     xs: 12 as GridSize,
//   };
//   const accordionSummaryTitleProps = {
//     sx: {
//       fontSize: {
//         xs: "18px",
//         sm: "22px",
//         md: "24px",
//       },
//     },
//   };
//   return (
//     <footer>
//       <Stack
//         spacing={{ md: 10, xs: 5 }}
//         direction={{ xs: "column", md: "row" }}
//         mb={2}
//         className="footer-credit"
//         // justifyContent="center"
//         alignItems={{ xs: "center", md: "flex-start" }}
//       >
//         <Typography color={appColors.lightGreyText}>
//           {appConfig.name} is a registered company in Qatar. Contact us - 00974 50303100
//         </Typography>
//       </Stack>

//       {/* expanded and disabled will be true for higher device widths to follow the design. */}
//       <Grid
//         container
//         columnSpacing={2}
//         sx={{
//           "& .MuiGrid-item": {
//             paddingLeft: "0 !important",
//           },
//         }}
//       >
//         <Grid {...gridAccordionProps}>
//           <Accordion
//             {...accordionProps}
//             expanded={!allExpanded ? !accordionDisabled && expanded.panel1 === true : true}
//             onChange={handleChange("panel1")}
//           >
//             <AccordionSummary {...accordionSummaryProps}>
//               <Typography variant="h6" {...accordionSummaryTitleProps}>
//                 Address
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <div className="accordion-details footer-address">
//                 <span>{appConfig.contact.address}</span>
//                 <Divider sx={{ backgroundColor: "#444444", marginY: "10px" }} />
//                 <Stack spacing={1}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <EmailIcon />
//                     <a href={`mailto:${appConfig.contact.email}`}>{appConfig.contact.email}</a>
//                   </Stack>
//                   {/* <Stack direction="row" spacing={1} alignItems="center">
//                     <WhatsAppIcon />
//                     <a href={`${configs.contact.whatsapp}`} rel="nofollow noopener" target="_blank">
//                       00974 50303100
//                     </a>
//                   </Stack> */}
//                 </Stack>
//               </div>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>
//         <Grid {...gridAccordionProps}>
//           <Accordion
//             {...accordionProps}
//             expanded={!allExpanded ? !accordionDisabled && expanded.panel2 === true : true}
//             onChange={handleChange("panel2")}
//           >
//             <AccordionSummary {...accordionSummaryProps}>
//               <Typography variant="h6" {...accordionSummaryTitleProps}>
//                 Tag
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <div className="accordion-details footer-tags">
//                 <Stack spacing={2} direction="row" style={{flexWrap:'wrap',gap:'10px'}}>
//                   {/* , ,  ,  ,  , ,  ,  ,
//                    */}
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Women Shoes
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Handbags
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Clothes
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Accessories
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Lingerie
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Home Décor
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Kids Wear
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Automotive
//                   </Button>
//                   <Button variant="outlined" sx={TagButtonsStyle}>
//                     Jewelry
//                   </Button>
//                 </Stack>
//               </div>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>
//         <Grid {...gridAccordionProps}>
//           <Accordion
//             {...accordionProps}
//             expanded={!allExpanded ? !accordionDisabled && expanded.panel3 === true : true}
//             onChange={handleChange("panel3")}
//           >
//             <AccordionSummary {...accordionSummaryProps}>
//               <Typography variant="h6" {...accordionSummaryTitleProps}>
//                 Services
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <div className="accordion-details">
//                 <nav className="footer-services-list">
//                   <Stack direction="column" spacing={1} component="ul">
//                     <li>
//                       <Link href="/">Designer Dresses</Link>
//                     </li>
//                     <li>
//                       <Link href="/">New Products</Link>
//                     </li>
//                     <li>
//                       <Link href="/">Our Lookbook</Link>
//                     </li>
//                     <li>
//                       <Link href="/about-us">About Us</Link>
//                     </li>
//                     <li>
//                       <Link href="/">Careers</Link>
//                     </li>
//                   </Stack>
//                 </nav>
//               </div>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>
//         <Grid {...gridAccordionProps}>
//           <Accordion
//             {...accordionProps}
//             expanded={!allExpanded ? !accordionDisabled && expanded.panel4 === true : true}
//             onChange={handleChange("panel4")}
//           >
//             <AccordionSummary {...accordionSummaryProps}>
//               <Typography variant="h6" {...accordionSummaryTitleProps}>
//                 Contact Us
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <div className="accordion-details">
//                 <Box component="form">
//                   <TextField id="name" name="name" fullWidth margin="dense" size="small" />
//                   <TextField
//                     id="email"
//                     name="email"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="email"
//                   />
//                   <TextField
//                     id="email"
//                     name="email"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="text"
//                     multiline={true}
//                     rows={2}
//                   />
//                   <Button
//                     disableElevation
//                     variant="contained"
//                     sx={{
//                       mt: 1,
//                       textTransform: "capitalize",
//                       borderRadius: 0,
//                       bgcolor: appColors.nudeBlack,
//                       fontWeight: appStyles.w600,
//                       color: "#222222 !important",
//                       fontSize: "15px",
//                       ":hover": {
//                         bgcolor: appColors.nudeBlack,
//                         color: "#fff !important",
//                       },
//                     }}
//                   >
//                     Submit
//                   </Button>
//                 </Box>
//               </div>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>
//       </Grid>
//       <Divider sx={{ backgroundColor: "#444444", mt: 4, mb: 3 }} />
//       <div className="footer-pages">
//         <nav>
//           <Grid container component="ul" justifyContent="center" alignItems="center">
//             <Grid item component="li">
//               <Link href="/privacy-and-cookie-policy">Privacy and Cookie Policy</Link>
//             </Grid>
//             <Grid item component="li">
//               <Link href="/terms-and-conditions">Terms & Conditions</Link>
//             </Grid>
//             <Grid item component="li">
//               <Link href="/">Advanced Search</Link>
//             </Grid>
//             <Grid item component="li">
//               <Link href="/contact-us">Contact Us</Link>
//             </Grid>
//           </Grid>
//         </nav>
//         <Typography variant="body1" mt={1} className="footer-copyright">
//           Copyright © {new Date().getFullYear()}-{appConfig.name}. All rights reserved.
//         </Typography>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
