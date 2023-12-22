

import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  Stack,
  Modal,
  Paper,
  StyledComponentProps,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  ListItemText,
  List,
  ListItem,
  Link,
  SnackbarContent,
  TextareaAutosize,
  InputLabel

} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IosShareIcon from '@mui/icons-material/IosShare';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import axios, { AxiosResponse } from "axios";
import { AllCartProds } from "components/allTypes/dto/CartDTO";
import { NewOrderResponse } from "components/allTypes/dto/newOrder.dto";
import { getCustomerInfo, saveCustomerInfoToStorage } from "components/common/functions";
import { addNewCart } from "components/hooks/useCart";
import appConfig from "config";
import { useFormik } from "formik";
import { concat, find, map } from "lodash";
import React, { useEffect, useState } from "react";
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as yup from "yup";
import {
  cartDrawerElAtom,
  customerContactInfo,
  selectedSubSKUAtom,
  notificationDrawerElAtom,
  currentProductIdAtom,
} from "../../atoms/atoms";
import {
  LocationDatum,
  LocationDetails,
  ProdAttrDataType,
  ProductInventoryBulkData,
  ProductInventoryType,
  Products,
  SubSku,
} from "../allTypes/productType";
import {
  getLocationData,
  getProdAttrDataByValue,
  getProdDiscountPercentage,
  postNewOrder,
} from "../hooks/useOrder";
import {
  ConfirmOrderModal,
  NegativeInventoryModal,
  ProductOutOfStockModal,
  AddCustomizeSizeModal,
  AddSizeGuideModal,
  AddTamaraModal,
  AddToCardMoreInfoModal,
} from "./modals";
import { Slider } from "./slider";
import * as styles from "./style";
import { useRouter } from "next/router";
import { appColors, appStyles } from "components/common/appColors";
import { ProductBreadcrumbs } from "./breadcrums";
import { BlackButton, YellowButton, WhatsAppButton } from "components/common/styled/buttons";
import { RelatedProducts } from "./relatedProducts";
import { NotificationDrawer } from "./notificationDrawer";
import { ProductFeedback } from "./feedback";
import { ReviewsResponse } from "components/allTypes/reviewType";
import Image from "next/image";
import TamaraIamge from '../../images/icons/tamara-logo.svg'
import { muiSxPropType } from "components/common/types";
import { useWindowWidth } from "@react-hook/window-size";
interface ProductFormValues {
  colorValue: string;
  sizeValue: string;
  designValue: string;
  qty: number | any;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  special_instruction: string;
}

enum CartFormBtnType {
  ADD_TO_CART = "ADD_TO_CART",
  QUICK_CHECKOUT = "QUICK_CHECKOUT",
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Product = ({ id }: { id: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const setCartDrawerEl = useSetRecoilState(cartDrawerElAtom);

  const [currentProdId, setCurrProdId] = useRecoilState(currentProductIdAtom);
  const [notificationDrawerEl, setNotificationDrawerEl] = useRecoilState(notificationDrawerElAtom);
  const [selectedSubSku, setSelectedSubSku] = useRecoilState(selectedSubSKUAtom);
  const [customerContInfo, setCustomerContInfo] = useRecoilState(customerContactInfo);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openMeasurement, setopenMeasurement] = useState(false);
  const [openSizeGuideModel, setOpenSizeGuideModel] = useState(false);
  const [openAddToCardMoreInfoModal, setOpenAddToCardMoreInfoModal] = useState(false);
  const [openTamaraModel, setOpenTamaraModel] = useState(false);
  const [userInfoExist, setUserInfoExist] = useState<boolean>(Boolean(customerContInfo));
  const [outOfStockModalOpen, setOutOfStockModalOpen] = useState<boolean>(false);
  const [negativeInventoryModalOpen, setNegativeInventoryModalOpen] = useState<boolean>(false);
  const [sliderImages, setSliderImages] = useState<string[] | null>();
  const cartProducts = queryClient.getQueryData<AllCartProds>(["cartProducts"]);
  const isCartFetching = useIsFetching(["cartProducts"]) > 0;
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const onlyWidth = useWindowWidth()
  console.log("width" + onlyWidth);

  const toggleNotificaitonDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setNotificationDrawerEl(open);
    };

  const formikInitialValues = {
    colorValue: "",
    sizeValue: "",
    designValue: "",
    qty: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    special_instruction: "",
  };

  const newOrderMutation = useMutation(postNewOrder, {
    onSuccess: (data: AxiosResponse<NewOrderResponse, any>) => {
      router.push(`/order-confirmed/${data.data.order_number}/${data.data.delivery_date}`);
    },
  });

  const addProdToCartMutation = useMutation(addNewCart);
  const useLocationDetails: LocationDetails | undefined = queryClient.getQueryData([
    "locationDetails",
  ]);

  const { data } = useQuery(
    ["product", id],
    async () => {
      if (id) {
        const { data } = await axios.post("/api/store/product/catalog/query/get", {
          models: {
            "location_data.website_remarks": `${appConfig.api.locationId}_Live`,
            product_slug: id,
          },
        });
        return data as Products;
      } else return null;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const productData = data?.data[0];
  console.log(productData, "pd")


  const productInventoryMutation = useMutation(
    async (subskuId: string) => {
      const { data } = await axios.post("/api/store/product/inventory/query/get", {
        models: {
          "product_quantity.value": `${appConfig.api.locationId}`,
          product_id: `${subskuId}`,
        },
      });
      return data as ProductInventoryType;
    },
    {
      onSuccess: (data: ProductInventoryType, pid) => {
        if (data.allowOrder === false) {
          setOutOfStockModalOpen(true);
          // resetting all color/design values by default will also remove soldout/available status from options
          if (selectedColor || selectedDesign) {
            formik.setFieldValue("sizeValue", formikInitialValues.sizeValue);
          } else {
            formik.setFieldValue("sizeValue", formikInitialValues.sizeValue);
            formik.setFieldValue("colorValue", formikInitialValues.colorValue);
            formik.setFieldValue("designValue", formikInitialValues.designValue);
          }
        }
      },
    }
  );

  const productInventoryBulkMutation = useMutation(
    async () => {
      const { data } = await axios.post<ProductInventoryBulkData[]>(
        appConfig.apiRoutes.productInventoryBulkRoute,
        {
          models: {
            parent_id: productData?._id,
            "product_quantity.value": `${appConfig.api.locationId}`,
          },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        //
      },
    }
  );

  let locationData: LocationDatum | undefined;
  if (productData) {
    locationData = getLocationData(productData.location_data);
  }

  useEffect(() => {
    if (productData) {
      setCurrProdId(productData._id as string);
      const subSkuImages = map(productData.sub_sku, "image_url");
      const productImages = map(productData.image_name, "name");
      const allImages = concat(subSkuImages, productImages);
      setNotificationDrawerEl(false);
      const uniqueSubSkuImgs: string[] = [];
      allImages.forEach((value) => {
        if (!uniqueSubSkuImgs.includes(value)) {
          uniqueSubSkuImgs.push(value);
        }
      });

      setSliderImages(uniqueSubSkuImgs);
      formik.setValues({ ...formikInitialValues, ...getCustomerInfo() }, false);
    }
  }, [productData]);

  const schema = yup.object().shape({
    colorValue: productData?.color.length
      ? yup.string().min(1).required("Color is required")
      : yup.string(),
    sizeValue: productData?.size.length
      ? yup.string().min(1).required("Size is required")
      : yup.string(),
    designValue: productData?.design.length
      ? yup.string().min(1).required("Design is required")
      : yup.string(),
    qty: yup.number().min(1).required("Quantity is required"),
    city: yup.string().min(2).required("City is required"),
    name: yup.string().min(2, "Enter a valid Name").required("Name is required"),
    phone: yup.string().length(9, "Enter a valid Number").required("Number is required"),
    address: yup.string().min(1).required("Address is required"),
    special_instruction: yup.string(),

  });

  const formik = useFormik<ProductFormValues>({
    initialValues: formikInitialValues,
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, submitForm }) => {
      if (productData && productData.allowNegativeInventory) {
        setNegativeInventoryModalOpen(true);
      } else {
        await addToCart(values);
        setOpenAddToCardMoreInfoModal(false);
      }
    },

  });
  console.log(formik.values, "formik 326")

  useEffect(() => {
    const formikValues = formik.values;

    if (productData && productData.product_attributes.length) {
      let subSkuName = productData.product_sku;
      for (const attr of productData.product_attributes) {
        const formikAttrValue = formikValues[`${attr}Value`];
        if (formikAttrValue) {
          subSkuName = subSkuName.concat(
            "-",
            getProdAttrDataByValue(productData[attr], formikAttrValue)!.text
          );
        } else {
          subSkuName = productData.product_sku;
          break;
        }
      }
      if (subSkuName !== productData.product_sku) {
        const subSKU = find(productData.sub_sku, {
          sku_number: subSkuName,
        });
        if (subSKU) {
          setSelectedSubSku(subSKU);
          productInventoryMutation.mutate(subSKU._id);
          if (!productInventoryBulkMutation.data && productData) {
            productInventoryBulkMutation.mutate();
          }
        }
      } else {
        let subSKU: SubSku | undefined;
        // only for for sliding to selected design/color image. inventory api will be used on the above if statement.
        if (formikValues.colorValue) {
          subSKU = find(productData.sub_sku, {
            color_name: getProdAttrDataByValue(productData["color"], formikValues.colorValue)!.text,
          });
        } else if (formikValues.designValue) {
          subSKU = find(productData.sub_sku, {
            design_name: getProdAttrDataByValue(productData["design"], formikValues.designValue)!
              .text,
          });
        }
        if (subSKU) setSelectedSubSku(subSKU);
      }
    } else if (productData) {
      productInventoryMutation.mutate(productData._id);
    }

    return () => {
      productInventoryMutation.reset();
    };
  }, [formik.values.colorValue, formik.values.sizeValue, formik.values.designValue]);

  const getAllProdAttrData = ({
    colorValue,
    sizeValue,
    designValue,
    address,
    phone,
    email,
    name,
    city,
  }: ProductFormValues) => {
    let color: ProdAttrDataType | null | undefined = null;
    let size: ProdAttrDataType | null | undefined = null;
    let design: ProdAttrDataType | null | undefined = null;
    if (colorValue) {
      color = getProdAttrDataByValue(productData!.color, colorValue);
    }
    if (sizeValue) {
      size = getProdAttrDataByValue(productData!.size, sizeValue);
    }
    if (designValue) {
      design = getProdAttrDataByValue(productData!.design, designValue);
    }
    if (address && phone && name && city) {
      // setUserContactInfo({ address, phone, name, city });
      saveCustomerInfoToStorage(name, phone, email, city, address);
      setCustomerContInfo({ name, phone, email, city, address });
    }
    return { color, size, design };
  };

  useEffect(() => {
    if (customerContInfo) setUserInfoExist(appConfig.customer.rememberContactInfo);
    else if (appConfig.customer.rmContInfoAfterOrder) setUserInfoExist(false);
  }, [customerContInfo]);

  const addToCart = async (values: ProductFormValues) => {
    if (useLocationDetails && productInventoryMutation.data && productData) {
      const { qty, city, special_instruction } = values;
      const { color, size, design } = getAllProdAttrData(values);
      addProdToCartMutation.mutate(
        {
          productData,
          color,
          size,
          design,
          qty,
          selectedSubSku,
          inventoryData: productInventoryMutation.data,
          special_instruction,
        },
        {
          onSettled: async () => {
            await queryClient.refetchQueries(["cartProducts"]);
            setNotificationDrawerEl(true);
          },
        }
      );
    }
  };

  const handleConfirmOrder = async () => {
    if (cartProducts) {
      await newOrderMutation.mutateAsync({
        cartProducts,
        selectedSubSku,
      });
      await queryClient.refetchQueries(["cartProducts"]);
      setOpenOrderModal(false);

    }
  };

  const handleAddMore = () => {
    setOpenOrderModal(false);
  };

  // const getRandomInt = () => {
  //   return Math.floor(Math.random() * (9 - 6) + 6); // The maximum is exclusive and the minimum is inclusive
  // };

  const [getRandomInt] = React.useState(Math.floor(Math.random() * (9 - 6) + 6));

  const isCartMutating = (): boolean => {
    return addProdToCartMutation.isLoading || isCartFetching ? true : false;

  };

  const isStockAvailable = (): boolean => {
    if (productInventoryMutation.data) {
      return productInventoryMutation.data.allowOrder;
    } else return false;
  };

  const handleOutOfStockModalClose = () => {
    setOutOfStockModalOpen(false);
  };
  const handleCloseNegativeInventoryModal = () => {
    setNegativeInventoryModalOpen(false);
  };
  const handleConfirmNegativeInventoryModal = () => {
    addToCart(formik.values);
    setNegativeInventoryModalOpen(false);
  };

  const productCategory =
    productData && productData.category.length ? productData.category[0] : undefined;
  const selectedColor: ProdAttrDataType | undefined =
    productData && formik.values.colorValue
      ? productData.color.find((clr) => clr.value === formik.values.colorValue)
      : undefined;
  const selectedDesign: ProdAttrDataType | undefined =
    productData && formik.values.designValue
      ? productData.design.find((dsgn) => dsgn.value === formik.values.designValue)
      : undefined;



  // CONTACT WHATSAPP 
  const handleWhatsAppClick = () => {
    const message = "Your custom message here"; // Replace with your desired message
    const phoneNumber = "1234567890"; // Replace with the recipient's phone number including the country code

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL);
  };



  // SINGLE PRODUCT PAGE SHARE 
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API is not supported');
    }
  };



  const divStyles = {
    padding: '1px',
    objectFit: 'contain',
    // filter: 'drop-shadow(0 0 10px gray) drop-shadow(0 0 10px gray)',
    position: 'absolute',
    zIndex: '999',
    top: "190px",
  };
  const style: muiSxPropType = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 700,
    width: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    "& .MuiFilledInput-root": {
      ":before": {
        borderBottom: "none",
      },
      borderRadius: appStyles.textFieldShape,
    },
  };

  return (
    <>  
      <Stack sx={{ mx: 5 }}>
        <Grid container mb={3} justifyContent="space-evenly">
          <Grid item md={4} xs={12} sm={10}>
            {sliderImages && (
              <Slider images={sliderImages} youtubeLink={productData?.youtube_link} />
            )}
          </Grid>
          {productData && (
            <Grid item md={6} xs={12} sm={10}>
              <Stack id="myPortal" sx={divStyles} />

              {productData?.product_slug &&
                <Typography my={0.5} fontSize={{ sm: "1.8rem", xs: "1rem" }}>
                  {productData?.product_slug}
                </Typography>
              }
              {
                productData?.product_name &&
                <Stack>
                  {productData?.product_name}
                </Stack>
              }
              <Grid container spacing={0} sx={{ marginTop: 2 }}>
                <Grid xs sx={{ textAlign: "left" }}>
                  {productData && !productData.special_offer_text && (
                    <Typography sx={{ ...styles.regularPrice, fontSize: 25 }}>
                      {locationData && locationData.discounted_price > 0 ? (
                        <span>
                          {appConfig.product.currency}&nbsp;
                          {locationData.discounted_price}
                        </span>
                      ) : (
                        <span>
                          {appConfig.product.currency}&nbsp;
                          {locationData?.selling_price}
                        </span>
                      )}
                    </Typography>
                  )}
                </Grid>
                <Grid xs sx={{ textAlign: "right", marginTop: 1.5 }}>
                  <Typography onClick={() => setOpenSizeGuideModel(true)}>Size Guide</Typography>
                </Grid>
              </Grid>
              <Box sx={{ width: "100%", border: "1px solid lightGray", paddingLeft: 2, borderRadius: "10px", fontSize: "15px" }}>
                <Typography sx={{}}> or Split it into 4 payments of <Link underline="none" color="inherit" sx={{ fontSize: 17, fontWeight: "500" }} onClick={() => setOpenTamaraModel(true)}>AED 150.00</Link> interest-free with  <Image src={TamaraIamge} onClick={() => setOpenTamaraModel(true)} alt="size-guide" style={{ maxWidth: '100%', height: '28px', paddingTop: "6px", }} /> <Link href="#" onClick={() => setOpenTamaraModel(true)} color="inherit">
                  Learn more
                </Link></Typography>
              </Box>

              <Grid container spacing={2} sx={{ justifyContent: "center", marginTop: "-8px" }}>
                <Grid item xs={12} sm={12} md={4} >
                  {productData && productData.size.length > 0 && (
                    <Grid item xs={12} sm={12} md={12}
                    // sx={{borderRadius:"0px !important",padding:"-10px 0px !important",background:"red"}}
                    >
                      <FormControl
                        fullWidth
                        error={formik.touched.sizeValue && Boolean(formik.errors.sizeValue)}

                      >
                        <Select
                          sx={{ borderRadius: "0px !important", padding: "-2px 0px !important" }}

                          name="sizeValue"
                          displayEmpty
                          value={formik.values.sizeValue}
                          onChange={(e) => {
                            if (e.target.value === "customized_size") {
                              setOpenAddToCardMoreInfoModal(true)
                            } else {
                              setOpenAddToCardMoreInfoModal(false);
                            }
                            formik.handleChange(e);
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: styles.sizeSelectOption,
                            },
                          }}
                        >
                          <MenuItem


                            value="">
                            <span>Select Size</span>
                          </MenuItem>
                          {productData.size.map(({ _id, text, value }) => {
                            const possibleSubSku = `${productData.product_sku}-${text}`;
                            const sizeSubSkuData =
                              productInventoryBulkMutation.data &&
                              productInventoryBulkMutation.data.find(
                                (subsku) => subsku.product_sku === possibleSubSku
                              );
                            const allowOrder = sizeSubSkuData?.allowOrder;

                            return (
                              <MenuItem
                                value={value}
                                key={_id}
                                disabled={allowOrder === false ? true : false}
                              >
                                {text}
                                {typeof allowOrder === "boolean" && (
                                  <Box
                                    component={"span"}
                                    className="sold-out"
                                    sx={styles.soldOutMenuText}
                                    style={{
                                      color: allowOrder === false ? appColors.red : appColors.green,
                                    }}
                                  >
                                    {allowOrder === false ? "Sold Out" : "Available"}
                                  </Box>
                                )}
                              </MenuItem>
                            );
                          })}
                          <MenuItem
                            value="customized_size"
                            // onClick={() => setopenMeasurement(true)}
                            onClick={() => setOpenAddToCardMoreInfoModal(true)}
                          >
                            <span>Customized Size</span>
                          </MenuItem>
                        </Select>
                        {formik.touched.sizeValue && (
                          <FormHelperText>{formik.errors.sizeValue}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={4} >
                  <TextField

                    name="qty"
                    variant="outlined"
                    type="number"
                    placeholder="Qty"

                    fullWidth
                    value={formik.values.qty}
                    onChange={formik.handleChange}
                    error={formik.touched.qty && Boolean(formik.errors.qty)}
                    helperText={formik.touched.qty && (formik.errors.qty as string)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} >
                  {productData && productData.color.length > 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl
                        fullWidth
                        error={formik.touched.colorValue && Boolean(formik.errors.colorValue)}
                      >
                        <Select
                          sx={{ borderRadius: "0px !important", padding: "0px !important" }}
                          name="colorValue"
                          displayEmpty
                          value={formik.values.colorValue}
                          onChange={formik.handleChange}
                        >
                          <MenuItem disabled value="">
                            <span>Select Color</span>
                          </MenuItem>
                          {productData.color.map(({ _id, text, value }) => {
                            const possibleSubSku = `${productData.product_sku}-${text}`;
                            const colorSubSkuData =
                              productInventoryBulkMutation.data &&
                              productInventoryBulkMutation.data.find(
                                (subsku) => subsku.product_sku === possibleSubSku
                              );
                            const allowOrder = colorSubSkuData?.allowOrder;

                            return (
                              <MenuItem
                                value={value}
                                key={_id}
                                disabled={allowOrder === false ? true : false}
                              >
                                {text}
                                {typeof allowOrder === "boolean" && (
                                  <Box
                                    component={"span"}
                                    className="sold-out"
                                    sx={styles.soldOutMenuText}
                                    style={{
                                      color: allowOrder === false ? appColors.red : appColors.green,
                                    }}
                                  >
                                    {allowOrder === false ? "Sold Out" : "Available"}
                                  </Box>
                                )}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.errors.colorValue && (
                          <FormHelperText>{formik.errors.colorValue}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {/* 
                      <Box sx={{ maxWidth: "100%", marginTop: 1 }}>
                        <TextareaAutosize minRows={4} placeholder="Additional Comments" className="w-full" style={{ maxWidth: '100%', minWidth: "100%" }}  />
                      </Box> */}
              <Grid item xs={12} sm={8} md={12} sx={{ paddingTop: 0, borderRadius: "none !important" }}>
                <TextField
                  sx={{ paddingTop: 1, borderRadius: "none !important" }}
                  name="special_instruction"
                  variant="outlined"
                  multiline={true}
                  type="text"
                  placeholder="Special Instructions Here"
                  fullWidth

                  onBlur={formik.handleChange}
                  error={
                    formik.touched.special_instruction &&
                    Boolean(formik.errors.special_instruction)
                  }
                  helperText={
                    formik.touched.special_instruction && formik.errors.special_instruction
                  }
                />
              </Grid>

              <Stack sx={{
                justifyContent: "center",
                alignItems: "center",
                mt: {
                  xs: 3,
                  md: 2,
                },
                mb: {
                  xs: 2,
                  md: 1,
                }
              }}
                direction="row"
                spacing={{ xs: 2, sm: 4, md: 8 }}>
                {
                  onlyWidth > 500 &&
                  <>
                    <BlackButton
                      type="submit"
                      disabled={isCartMutating()}
                      disableElevation
                      variant="contained"
                      onClick={() => setOpenAddToCardMoreInfoModal(true)}
                      sx={styles.addMoreBtn}
                    >
                      BUY NOW
                    </BlackButton>
                    <WhatsAppButton
                      type="button"
                      onClick={handleWhatsAppClick}
                      // disabled={isCartMutating()}
                      sx={styles.placeOrderButton}
                      disableElevation
                      variant="contained"
                    >
                      <WhatsAppIcon sx={{ marginRight: 1 }} />
                      Chat with Stylist
                    </WhatsAppButton>
                  </>
                }

              </Stack>


              <Grid container spacing={1} sx={{ mt: { md: 3, sm: 2 } }}>
                <Grid item xs={12} sm={8.5}>
                  <Accordion sx={styles.productAccordionStyle}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{ padding: "0px 0px !important" }}
                    >
                      <ModeEditIcon /><Typography sx={{ ml: 1, }}>Dimensions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>SIZE 52: bust: 38" and shoulder: 14.5"</Typography>
                      <Typography>SIZE 54: bust: 40" and shoulder 15"</Typography>
                      <Typography>SIZE 56: bust: 42" and shoulder 16"</Typography>
                      <Typography>SIZE 58: bust 44" and shoulder 17"</Typography>
                      <Typography>Please choose your measurements carefully in the photos provided - we offer 3 sizes at the moment 56, 58, and 60.</Typography>

                    </AccordionDetails>
                  </Accordion>
                  <Accordion sx={styles.productAccordionStyle}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                      sx={{ padding: "0px 0px !important" }}
                    >
                      <FavoriteBorderIcon /><Typography sx={{ ml: 1 }}> Care Instructions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion sx={styles.productAccordionStyle}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                      sx={{ padding: "0px 0px !important" }}
                    >
                      <LocalShippingIcon /> <Typography sx={{ ml: 1 }}>Shipping & Returns</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Please note that for some international orders, taxes and duties may apply, and these fees will be the responsibility of the customer to pay.

                        For more information see our Shipping and Returns policy
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Button variant="text" sx={{ paddingY: 2, paddingX: 0 }} onClick={handleShareClick}><IosShareIcon sx={{ color: "black" }} /><Typography sx={{ color: "black", ml: 1 }}>Share</Typography></Button>
                </Grid>
                <Grid item xs={12} sm={3.5} sx={{ paddingTop: "0px !important" }}>
                  <List sx={{ paddingTop: "0 !important" }}>
                    <ListItem sx={{ paddingTop: "0 !important", paddingBottom: "0 !important" }}>
                      <FiberManualRecordSharpIcon sx={{ fontSize: 5, marginRight: '8px' }} />
                      <ListItemText primary="Free Delivery on 150 AED purchase" />
                    </ListItem>
                    <ListItem sx={{ paddingTop: "0 !important", paddingBottom: "0 !important" }}>
                      <FiberManualRecordSharpIcon sx={{ fontSize: 5, marginRight: '8px' }} />
                      <ListItemText primary="Easy Returns" />
                    </ListItem>
                    <ListItem sx={{ paddingTop: "0 !important", paddingBottom: "0 !important" }}>
                      <FiberManualRecordSharpIcon sx={{ fontSize: 5, marginRight: '8px' }} />
                      <ListItemText primary="worldwide shipping " />
                    </ListItem>

                  </List>
                  <Stack sx={{ paddingLeft: "16px" }}>
                    <Typography sx={{ color: "red" }}>Want customized? </Typography>
                    <Link href="#" underline="none" sx={{ color: "black" }}>
                      Talk to our stylish on WA.
                      <Button
                        type="button"
                        onClick={handleWhatsAppClick}
                        sx={{ color: "red", fontWeight: "bold" }}>Click Here</Button>

                    </Link>
                  </Stack>




                </Grid>
              </Grid>
            </Grid>
          )}

        </Grid>
        <Box>
          {currentProdId && <ProductFeedback productId={currentProdId} />}
          {productCategory && (
            <RelatedProducts
              categoryId={productCategory.value}
              categoryName={productCategory.text}
            />
          )}
        </Box>
        {productCategory && (
          <NotificationDrawer
            open={notificationDrawerEl}
            categoryId={productCategory.value}
            categoryName={productCategory.text}
            toggleDrawer={toggleNotificaitonDrawer}
          />
        )}
        <ProductOutOfStockModal open={outOfStockModalOpen} onClose={handleOutOfStockModalClose} />
        <NegativeInventoryModal
          open={negativeInventoryModalOpen}
          handleConfirm={handleConfirmNegativeInventoryModal}
          handleClose={handleCloseNegativeInventoryModal}
        />
        <ConfirmOrderModal
          open={openOrderModal}
          handleAddMore={handleAddMore}
          handleConfirmOrder={handleConfirmOrder}
          newOrderMutation={newOrderMutation}
        />
        <AddSizeGuideModal
          open={openSizeGuideModel}
          handleClose={() => setOpenSizeGuideModel(false)}
        />
        <AddTamaraModal
          open={openTamaraModel}
          handleClose={() => setOpenTamaraModel(false)}
        />
        <Modal
          open={openAddToCardMoreInfoModal}
          // Corrected to set to false
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={style}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
              <Grid xs={10} sx={{ textAlign: 'center', fontSize: "20px", fontWeight: "600" }}>
                Fill in all necessary information
              </Grid>
            </Grid>

            <form className="order-form" onSubmit={formik.handleSubmit}>

              {productData && productData.size.length > 0 && (
                <Grid item xs={12} sm={12} md={12} pb={1}
                // sx={{borderRadius:"0px !important",padding:"-10px 0px !important",background:"red"}}
                >
                  <FormControl
                    fullWidth
                    error={formik.touched.sizeValue && Boolean(formik.errors.sizeValue)}

                  >
                    <Select
                      sx={{ borderRadius: "0px !important", padding: "0px 0px !important" }}
                      name="sizeValue"
                      displayEmpty
                      value={formik.values.sizeValue}
                      onChange={(e) => {
                        if (e.target.value === "customized_size") {
                          setOpenAddToCardMoreInfoModal(true)
                        } else {
                          setOpenAddToCardMoreInfoModal(true)
                        }
                        formik.handleChange(e);
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: styles.sizeSelectOption,
                        },
                      }}
                    >
                      <MenuItem

                        value="">
                        <span>Select Size</span>
                      </MenuItem>
                      {productData.size.map(({ _id, text, value }) => {
                        const possibleSubSku = `${productData.product_sku}-${text}`;
                        const sizeSubSkuData =
                          productInventoryBulkMutation.data &&
                          productInventoryBulkMutation.data.find(
                            (subsku) => subsku.product_sku === possibleSubSku
                          );
                        const allowOrder = sizeSubSkuData?.allowOrder;

                        return (
                          <MenuItem
                            value={value}
                            key={_id}
                            disabled={allowOrder === false ? true : false}
                          >
                            {text}
                            {typeof allowOrder === "boolean" && (
                              <Box
                                component={"span"}
                                className="sold-out"
                                sx={styles.soldOutMenuText}
                                style={{
                                  color: allowOrder === false ? appColors.red : appColors.green,
                                }}
                              >
                                {allowOrder === false ? "Sold Out" : "Available"}
                              </Box>
                            )}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {formik.touched.sizeValue && (
                      <FormHelperText>{formik.errors.sizeValue}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              <Grid container spacing={1} sx={styles.formGrid} justifyContent="center">
                {productData && productData.color.length > 0 && (
                  <Grid item xs={12} sm={8} md={12}>
                    <FormControl
                      fullWidth
                      error={formik.touched.colorValue && Boolean(formik.errors.colorValue)}
                    >
                      <Select
                        sx={{ borderRadius: "0px !important", padding: "2px 0px !important" }}
                        name="colorValue"
                        displayEmpty
                        value={formik.values.colorValue}
                        onChange={formik.handleChange}
                      >
                        <MenuItem disabled value="">
                          <span>Select Color</span>
                        </MenuItem>
                        {productData.color.map(({ _id, text, value }) => {
                          const possibleSubSku = `${productData.product_sku}-${text}`;
                          const colorSubSkuData =
                            productInventoryBulkMutation.data &&
                            productInventoryBulkMutation.data.find(
                              (subsku) => subsku.product_sku === possibleSubSku
                            );
                          const allowOrder = colorSubSkuData?.allowOrder;

                          return (
                            <MenuItem
                              value={value}
                              key={_id}
                              disabled={allowOrder === false ? true : false}
                            >
                              {text}
                              {typeof allowOrder === "boolean" && (
                                <Box
                                  component={"span"}
                                  className="sold-out"
                                  sx={styles.soldOutMenuText}
                                  style={{
                                    color: allowOrder === false ? appColors.red : appColors.green,
                                  }}
                                >
                                  {allowOrder === false ? "Sold Out" : "Available"}
                                </Box>
                              )}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.errors.colorValue && (
                        <FormHelperText>{formik.errors.colorValue}</FormHelperText>
                      )}
                      <Grid item xs={12} sm={12} md={12} pt={1} >
                        <TextField
                          name="qty"
                          variant="outlined"
                          type="number"
                          placeholder="Qty"
                          fullWidth
                          value={formik.values.qty}
                          onChange={formik.handleChange}
                          error={formik.touched.qty && Boolean(formik.errors.qty)}
                          helperText={formik.touched.qty && (formik.errors.qty as string)}
                        />
                      </Grid>
                    </FormControl>
                  </Grid>
                )}
                {productData && productData.design.length > 0 && (
                  <Grid item xs={12} sm={8} md={12}>
                    <FormControl
                      fullWidth
                      error={formik.touched.designValue && Boolean(formik.errors.designValue)}
                    >
                      <Select
                        name="designValue"
                        displayEmpty
                        value={formik.values.designValue}
                        onChange={formik.handleChange}
                      >
                        <MenuItem disabled value="">
                          <span>Select Design</span>
                        </MenuItem>
                        {productData.design.map(({ _id, text, value }) => {
                          const possibleSubSku = `${productData.product_sku}-${text}`;
                          const desginSubSkuData =
                            productInventoryBulkMutation.data &&
                            productInventoryBulkMutation.data.find(
                              (subsku) => subsku.product_sku === possibleSubSku
                            );
                          const allowOrder = desginSubSkuData?.allowOrder;
                          return (
                            <MenuItem
                              value={value}
                              key={_id}
                              disabled={allowOrder === false ? true : false}
                            >
                              {text}
                              {typeof allowOrder === "boolean" && (
                                <Box
                                  component={"span"}
                                  className="sold-out"
                                  sx={styles.soldOutMenuText}
                                  style={{
                                    color: allowOrder === false ? appColors.red : appColors.green,
                                  }}
                                >
                                  {allowOrder === false ? "Sold Out" : "Available"}
                                </Box>
                              )}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.errors.designValue && (
                        <FormHelperText>{formik.errors.designValue}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                )}
                {!userInfoExist && (
                  <>
                    <Grid item xs={12} sm={8} md={12}>
                      <TextField
                        name="name"
                        type="text"
                        variant="outlined"
                        placeholder="Enter Name"
                        fullWidth
                        onBlur={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={12}>
                      <TextField
                        name="email"
                        type="text"
                        variant="outlined"
                        placeholder="Enter Email"
                        fullWidth
                        onBlur={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={12}>
                      <TextField
                        name="phone"
                        className="phone-text-field"
                        placeholder="Eg. 55xxxxxxx or 50xxxxxxx"
                        variant="outlined"
                        type="tel"
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start">+971</InputAdornment>,
                        }}
                        onBlur={formik.handleChange}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={12}>
                      <FormControl
                        fullWidth
                        error={formik.touched.city && Boolean(formik.errors.city)}
                      >
                        <Select
                          sx={{ borderRadius: "0px !important", padding: "2px 0px !important" }}
                          displayEmpty
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                        >
                          <MenuItem disabled value="">
                            <span>Select City</span>
                          </MenuItem>
                          {appConfig.product.cities.sort().map((city, index) => (
                            <MenuItem value={city} key={index}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.city && (
                          <FormHelperText>{formik.errors.city}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8} md={12}

                    >
                      <TextField

                        name="address"
                        variant="outlined"
                        type="text"
                        placeholder="Delivery Address"
                        fullWidth
                        onBlur={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                      />
                    </Grid>
                  </>
                )}

                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ my: 2 }}
                >
                  <Grid></Grid>
                  <Grid item style={{ paddingTop: 0 }}>
                    <YellowButton
                      type="submit"
                      onClick={() => setOpenAddToCardMoreInfoModal(false)}
                      disabled={isCartMutating()}
                      sx={styles.placeOrderButton}
                      disableElevation
                      variant="contained"
                    >
                      Cancel
                    </YellowButton>
                  </Grid>
                  <Grid item style={{ paddingTop: 0 }}>
                    <BlackButton
                      type="submit"

                      disabled={isCartMutating()}
                      disableElevation
                      variant="contained"
                      color="secondary"
                      sx={styles.addMoreBtn}

                    >
                      Add to cart
                    </BlackButton>
                  </Grid>
                </Grid>

              </Grid>
            </form>
          </Paper>
        </Modal>
      </Stack>
      {
        onlyWidth <= 500 &&
        <div style={{
          position: "fixed",
          bottom: "0",
          zIndex: 9999999,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <BlackButton
            type="submit"
            disabled={isCartMutating()}
            disableElevation
            variant="contained"
            onClick={() => setOpenAddToCardMoreInfoModal(true)}
            sx={styles.mobileAddMoreBtn}
          >
            BUY NOW
          </BlackButton>
          <WhatsAppButton
            type="button"
            onClick={handleWhatsAppClick}
            // disabled={isCartMutating()}
            sx={styles.mobilePlaceOrderButton}
            disableElevation
            variant="contained"
          >
            <WhatsAppIcon sx={{ marginRight: 1 }} />
            Chat with Stylist
          </WhatsAppButton>
        </div>
      }
    </>
  );
};




















