import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  ImageList,
  Link,
  Modal,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { AllCartProds } from "components/allTypes/dto/CartDTO";
import { NewOrderResponse } from "components/allTypes/dto/newOrder.dto";
import { SubSku } from "components/allTypes/productType";
import { appColors, appStyles } from "components/common/appColors";
import { BlackButton, YellowButton } from "components/common/styled/buttons";
import { muiSxPropType } from "components/common/types";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import * as styles from "./style";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  CreateReviewRequest,
  ReviewImageData,
  UploadReviewImagesResponse,
} from "components/allTypes/reviewType";
import appConfig from "config";
import { useRecoilValue } from "recoil";
import { currentProductIdAtom } from "atoms/atoms";




import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { styled } from '@mui/material/styles';


import SizeGuide from '../../images/size-guide.png'




export const ProductOutOfStockModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.outOfStock}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography sx={{ color: "red" }} id="modal-modal-title" variant="h6" component="h2">
            Sold out ☹️
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Sorry, this option is sold out. Please Select another option
        </Typography>
      </Box>
    </Modal>
  );
};

export const NegativeInventoryModal = ({
  open,
  handleClose,
  handleConfirm,
}: {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" PaperProps={{ sx: { m: 1 } }}>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText
          color="inherit"
          component="div"
          sx={styles.negativeInventoryModalContent}
        >
          <img
            src="/images/important-notice.jpg"
            alt="Important Notice before Adding product to cart"
            width="50%"
          />
          <Typography component={"div"}>
            <Typography>Dear Customer,</Typography>
            <Typography component={"ul"}>
              <Typography component={"li"}>
                This product can be delivered in <span className="red-text">7 to 9 days</span>.
              </Typography>
              <Typography component={"li"}>
                If you refuse the order at the time of delivery we will have a{" "}
                <span className="red-text">LOSS</span>.
              </Typography>
            </Typography>
            <Typography textAlign={"center"} fontStyle={"italic"}>
              Good things are worth waiting for <span className="smily">☺</span>
            </Typography>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mb: 2, mr: { sm: 2 }, justifyContent: "space-evenly" }}>
        <BlackButton variant="contained" onClick={handleClose} sx={{ fontWeight: appStyles.w600 }}>
          NO cannot wait
        </BlackButton>
        <YellowButton
          variant="contained"
          onClick={handleConfirm}
          autoFocus
          sx={{ fontWeight: appStyles.w600 }}
        >
          YES i can wait
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};

export const ConfirmOrderModal = ({
  open,
  handleAddMore,
  handleConfirmOrder,
  newOrderMutation,
}: {
  newOrderMutation: UseMutationResult<
    AxiosResponse<NewOrderResponse, any>,
    unknown,
    {
      cartProducts: AllCartProds;
      selectedSubSku: SubSku | null;
    },
    unknown
  >;
  open: boolean;
  handleConfirmOrder: () => void;
  handleAddMore: () => void;
}) => {
  return (
    <Modal
      open={open}
      // onClose={handleOrderModalClose}
      aria-labelledby="confirm-order-modal"
      aria-describedby="checkout-the-delivary-or-add-more"
      disableAutoFocus={true}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box sx={styles.orderModalStyle}>
        <Box sx={styles.orderModalCheckBox}>
          <CheckIcon fontSize="large" />
        </Box>
        <Typography variant="subtitle2" fontWeight="700" sx={styles.orderModalHeader}>
          Your Order Processed Succesfully
        </Typography>
        <Box sx={styles.orderModalActions}>
          <Grid container direction="row" justifyContent="center">
            <Grid item>
              <Typography fontWeight={appStyles.w600} fontSize={13}>
                Add more to your order with no&nbsp;
                <span style={{ color: "red", textAlign: "center" }}>
                  EXTRA delivery charge&nbsp;
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <LocalShippingIcon fontSize="small" htmlColor="SaddleBrown" />
            </Grid>
          </Grid>
          <Grid container spacing={1} direction="column" py={3}>
            <Grid item>
              <BlackButton
                disableElevation
                variant="contained"
                sx={styles.orderModalActionsButton}
                onClick={handleConfirmOrder}
                startIcon={
                  newOrderMutation.isLoading && <CircularProgress size={16} color="inherit" />
                }
                disabled={newOrderMutation.isLoading}
              >
                Confirm Order
              </BlackButton>
            </Grid>
            <Grid item>
              <YellowButton
                disableElevation
                variant="contained"
                sx={styles.orderModalActionsButton}
                onClick={handleAddMore}
              >
                Add More Deals
              </YellowButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

interface CreateReviewValues {
  name: string;
  message: string;
  rating: number;
  files?: FileList;
}
export const AddReviewModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const productId = useRecoilValue(currentProductIdAtom) as string; // because id will be set on [id].tsx
  const [images, setImages] = useState<string[]>([]); // base64 image string[] type
  const prodImgWidth = 64;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelectFiles = () => {
    fileInputRef.current!.click();
  };

  const createReviewMutation = useMutation({
    mutationFn: async (newReview: {
      name: string;
      message: string;
      rating: number;
      images: ReviewImageData[];
    }) => {
      const body: CreateReviewRequest = {
        models: {
          parent_id: productId,
          location_id: appConfig.api.locationId,
          location_name: appConfig.api.location_name,
          posted_user: newReview.name,
          product_rating: newReview.rating,
          product_review: newReview.message,
          review_images: newReview.images,
        },
      };
      return axios.post("/api/store/product/review/create", body);
    },
    // onSuccess used in .mutate() method
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("files", file);
      const { data } = await axios.post("/api/store/product/review/s3/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data as UploadReviewImagesResponse;
    },
  });

  const validationSchema = yup.object({
    name: yup.string().required("Full Name is required"),
    message: yup.string().required("Description is required"),
    rating: yup.number().min(1, "Review is required"),
    files: yup.mixed().test("files-count", "Can't upload more than 3 images", (values) => {
      if (values && values.length > 3) {
        return false;
      } else return true;
    }),
  });

  const formik = useFormik<CreateReviewValues>({
    initialValues: {
      name: "",
      message: "",
      rating: 0,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { name, message, rating, files } = values;
      await new Promise(async (resolve, reject) => {
        // todo this should be array. and will push values afer uploading each image
        let uploadedData: ReviewImageData[] = [];
        if (files) {
          const filesList = Array.from(files);
          for (const file of filesList) {
            const { data } = await uploadImagesMutation.mutateAsync(file);
            uploadedData.push(data);
          }
        }
        createReviewMutation.mutate(
          {
            name,
            message,
            rating,
            images: uploadedData ? uploadedData : [],
          },
          {
            onSuccess(data, variables, context) {
              resolve(data);
              queryClient.refetchQueries({
                queryKey: [appConfig.queryKeys.productReviews, productId],
              });
              resetForm();
              handleClose();
            },
          }
        );
      });
    },
  });

  useEffect(() => {
    // https://blog.logrocket.com/using-filereader-api-preview-images-react/
    const imageUrls: string[] = [],
      fileReaders: FileReader[] = [];
    let isCancel = false;
    if (formik.values.files && formik.values.files.length) {
      const imageFiles = Array.from(formik.values.files);
      imageFiles.forEach((file) => {
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        fileReader.onload = (e) => {
          const { result } = e.target as any;
          if (result) {
            imageUrls.push(result);
          }
          if (imageUrls.length === imageFiles.length && !isCancel) {
            setImages(imageUrls);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [formik.values.files]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Stack
              spacing={2}
              direction={"row"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Stack spacing={1}>
                <Typography variant="h6">Full Name</Typography>
                <TextField
                  id="name"
                  name="name"
                  variant="filled"
                  hiddenLabel
                  placeholder="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Stack>
              <Stack spacing={1} alignItems="center">
                <Typography variant="h6">Rate your overall experience</Typography>
                <Rating
                  id="rating"
                  name="rating"
                  size="large"
                  value={formik.values.rating}
                  onChange={(event, value) => {
                    formik.setFieldValue("rating", value);
                  }}
                />
                <Typography variant="body2" color={"red"}>
                  {formik.touched.rating && formik.errors.rating}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="h6">Write Review</Typography>
              <TextField
                id="message"
                name="message"
                variant="filled"
                hiddenLabel
                placeholder="Write you review here..."
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
            </Stack>
            <Stack direction={"row"} alignItems="end" justifyContent={"space-between"}>
              <Stack spacing={1}>
                <Typography variant="h6">Upload Image</Typography>
                <Stack direction={"row"} spacing={2}>
                  <Box sx={{ border: `1px dashed ${appColors.lightGrey}` }}>
                    <IconButton
                      onClick={handleSelectFiles}
                      disableTouchRipple
                      sx={{
                        height: `${prodImgWidth}px`,
                        width: `${prodImgWidth}px`,
                        borderRadius: 0,
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                    <input
                      type="file"
                      name="files"
                      id="files"
                      multiple
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files?.length < 4) {
                          formik.setFieldValue("files", e.target.files);
                        } else
                          formik.setErrors({
                            files: "Can't select more than 3 images",
                          });
                      }}
                    />
                  </Box>

                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="product review captures"
                      width={prodImgWidth}
                      height={prodImgWidth}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ))}
                  {/* <Image
                      src={"/temp/prod_img.jpg"}
                    alt="product review captures"
                    width={prodImgWidth}
                    height={prodImgWidth}
                  /> */}
                </Stack>
                <Typography variant="caption" color={"red"}>
                  {formik.errors.files}
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={2}>
                <BlackButton variant="contained" disableElevation onClick={handleClose}>
                  Cancel Review
                </BlackButton>
                <YellowButton
                  variant="contained"
                  type="submit"
                  disableElevation
                  disabled={formik.isSubmitting}
                  startIcon={formik.isSubmitting && <CircularProgress color="inherit" size={20} />}
                >
                  Submit Review
                </YellowButton>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
};

export const AddCustomizeSizeModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {

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

  const measurementList = [
    {
      id: "sleeve_from_neck",
      name: "Sleeve From Neck",
    },
    {
      id: "sleeve_from_shoulder",
      name: "Sleeve From Shoulder",
    },
    {
      id: "upper_round_sleeve",
      name: "Upper Round Sleeve",
    },
    {
      id: "bust_size",
      name: "Bust Size",
    },
    {
      id: "waist_size",
      name: "Waist Size",
    },
    {
      id: "hips_size",
      name: "Hips Size",
    },
    {
      id: "shoulder",
      name: "Shoulder",
    },
    {
      id: "body_length",
      name: "Body Length",
    },
    {
      id: "front_style",
      name: "Front Style",
    },
  ];

  const [measurementData, setMeasurementData] = useState(measurementList.reduce((acc, measurement) => ({ ...acc, [measurement.id]: "" }), {}));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ overflow: 'scroll' }}
    >
      <Paper sx={style}>
        <Stack spacing={3}>
          <Stack spacing={2} direction={"row"} justifyContent="space-between" alignItems={"center"}>
            <Stack spacing={1} alignItems="center">
              <img src={"/images/measurement.jpeg"} style={{ width: "100%" }} />
            </Stack>
            <Stack spacing={1} alignItems="center" flex={1} >
              <Typography variant="h6" style={{ width: "300px" }}>Fill Your Measurement is CM:</Typography>

              {measurementList.map((v) => (
                <Stack
                  spacing={1}
                  direction={"row"}
                  justifyContent="space-between"
                  alignItems={"center"}
                  key={v.id}
                  style={{
                    marginBottom: '5px',
                    border: '1px solid #f2f2f2b3',
                    padding: '2px',
                    borderRadius: '5px'
                  }}
                >
                  <Typography style={{ width: "180px" }}>{v.name}:</Typography>
                  <TextField
                    id={v.id}
                    name={v.id}
                    type="number"
                    variant="filled"
                    hiddenLabel
                    style={{ width: "80px", }}
                    sx={{
                      '& input': {
                        height: '5px'
                      }
                    }}
                    onChange={e => setMeasurementData({ ...measurementData, [v.id]: e.target.value })}
                  />
                </Stack>
              ))}
              <TextField
                id="message"
                name="message"
                variant="filled"
                hiddenLabel
                placeholder="Special Instructions"
                multiline
                rows={2}
                style={{ width: '100%' }}
                onChange={e => setMeasurementData({ ...measurementData, message: e.target.value })}
              />
              <Stack direction={"row"} spacing={2} style={{ marginTop: '30px' }}>
                <BlackButton variant="contained" disableElevation onClick={handleClose}>
                  Cancel
                </BlackButton>
                <YellowButton
                  variant="contained"
                  disableElevation
                  onClick={() => console.log(measurementData)}
                >
                  Submit
                </YellowButton>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
};

export const AddSizeGuideModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {

  const style: muiSxPropType = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 750,
    width: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    "& .MuiFilledInput-root": {
      ":before": {
        borderBottom: "none",
      },
      borderRadius: appStyles.textFieldShape,
    },
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));




  interface Column {
    id: 'Size' | 'UK' | 'US' | 'EU' | 'Chest' | 'Waist' | 'Hips';
    label: string;
    minWidth?: number;
    align?: 'center';
  }
  const columns: Column[] = [
    { id: 'Size', label: 'Size', minWidth: 100, align: 'center' },
    { id: 'UK', label: 'UK', minWidth: 100, align: 'center' },
    { id: 'US', label: 'US', minWidth: 100, align: 'center' },
    { id: 'EU', label: 'EU', minWidth: 100, align: 'center' },
    { id: 'Chest', label: 'Chest', minWidth: 100, align: 'center' },
    { id: 'Waist', label: 'Waist', minWidth: 100, align: 'center' },
    { id: 'Hips', label: 'Hips', minWidth: 100, align: 'center' },
  ];
  interface Data {
    size: string;
    uk: string;
    us: string;
    eu: string;
    chest: string;
    waist: string;
    hips: string;
  }
  function createData(
    size: string,
    uk: string,
    us: string,
    eu: string,
    chest: string,
    waist: string,
    hips: string,
  ): Data {
    return { size, uk, us, eu, chest, waist, hips };
  }
  const rows = [
    createData("XS", "4-6", "0-2", "32-34", "31-32", "24-25", "33-34"),
    createData('S', '8-10', '4-6', '36-38', '33-35', '26-28', '35-37'),
    createData('M', '	12-14', '8-10', '40-42', '37-39', '30-31', '39-41'),
    createData('L', '16-18', '12-14', '44-46', '41-43', '33-36', '43-46'),
    createData('XL', '20-22', '16-18', '48-50', '46-48', '39-41', '	49-51'),
    createData('XXL', '24-26', '20-22', '52-54', '51-54', '44-47', '54-57'),
    createData('XXXL', '28-30', '24-26', '56-58', '57-59', '50-52', '60-62'),
    createData('4XL', '32-34', '28-30', '60-62', '61-64', '55-58', '63.5-65.5'),

  ];


  interface Column01 {
    id: 'Person Height' | 'Recommended Item Length(inch)' | 'Sleeves form Neck(inch)';
    label: string;
    minWidth?: number;
    align?: 'center';
    colSpan?: number;
  }
  const columns01: Column01[] = [
    { id: 'Person Height', label: 'Person Height', minWidth: 200, align: 'center', colSpan: 2 },
    { id: 'Recommended Item Length(inch)', label: 'Recommended Item Length(inch)', minWidth: 100, align: 'center', colSpan: 1 },
    { id: 'Sleeves form Neck(inch)', label: 'Sleeves form Neck(inch)', minWidth: 100, align: 'center', colSpan: 1 },

  ];
  interface Data01 {
    phCm: string;
    phFeed: string;
    ril: string;
    sfn: string;
  }
  function createData01(
    phCm: string,
    phFeed: string,
    ril: string,
    sfn: string,

  ): Data01 {
    return { phCm, phFeed, ril, sfn };
  }
  const rows01 = [
    createData01('147cm', '4.8feet', '50"', '26"'),
    createData01('150cm', '4.9feet	', '50"/52"', '26"'),
    createData01('153cm', '5.0feet', '52"', '26.5"'),
    createData01('156cm', '5.1feet', '52"/54"', '26.5"'),
    createData01('158cm', '5.2feet', '54"', '	27"'),
    createData01('161cm', '5.3feet', '54"/56"', '27"'),
    createData01('164cm', '5.4feet', '56"', '27.5"'),
    createData01('167cm', '5.5feet', '56"/58"', '27.5"'),
    createData01('170cm', '5.6feet', '58"', '28"'),
    createData01('173cm', '5.7feet', '58"/60"', '28"'),
    createData01('176cm', '5.8feet', '60"', '28,5"'),
    createData01('179cm', '5.9feet', '60"/62"', '28,5"'),
    createData01('182cm', '6.0feet', '62"', '29"'),

  ];


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
          <Grid xs={6} sx={{ textAlign: 'left', fontSize: "20px", fontWeight: "600" }}>
            SIZE GUIDE
          </Grid>
          <Grid xs={6} sx={{ textAlign: 'right' }}>

            <Button disableElevation onClick={handleClose}>
              <CloseIcon sx={{ color: "black", width: "25px", height: "25px", background: "white", borderRadius: "50%" }} />
            </Button>
          </Grid>
          <Divider variant="fullWidth" sx={{ border: "1px solid lightGray", width: "100%" }} />
          <Grid style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "600px", paddingTop: 6 }}>


            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>Use the below guideline to determine your best size.</Typography>
            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>Please use the comment box for any additional notes you want to make to the designer.</Typography>
            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>If you are still unsure about what size you are, contact us on and we would be more than happy to assist.</Typography>

            <Typography sx={{ fontSize: "20px", fontWeight: "500", paddingY: 2 }}>WOMEN WEAR</Typography>
            <ButtonGroup sx={{ borderRadius: "0px !important",border:"none !important", }}>
              <Button sx={{ borderRadius: "0px !important" ,background:"#F2D2BD"}}>INCH</Button>
              <Button sx={{ borderRadius: "0px !important" }}>CM</Button>
            </ButtonGroup>
            <Grid sx={{xm:{overflowX:"scroll",width:"100%"}}}>
            <Typography sx={{background:"#F2D2BD",color:"black",padding:"4px 8px",fontSize:"14px",marginTop:"10px"}}>ِSize Chart (Travel wear , Kaftan & Dresses)</Typography>
            <TableContainer >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ padding: "4px 0px",border:"0.1px solid #F5F5F5" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows && rows.map((item, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.size}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.uk}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.us}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.eu}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.chest}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.waist}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 0px !important" ,border:"0.1px solid #F5F5F5"}}>{item.hips}</TableCell>

                      </StyledTableRow>
                    )
                  })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            </Grid>
            <Typography sx={{ fontSize: "20px", fontWeight: "500", paddingY: 2 }}>ABAYAS </Typography>
            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>Use the below chart to help determine your recommended size for Abayas, which due to their looser fitting have a distinct size guide.</Typography>
            
           <Grid sx={{sm:{overflowX:"scroll"}}}>
           <Typography sx={{background:"#F2D2BD",color:"black",padding:"4px 8px",fontSize:"14px",marginTop:"10px"}}>Abaya Size Guide</Typography>
            <TableContainer >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns01.map((column) => (
                      <TableCell
                        colSpan={column.colSpan}
                        key={column.id}
                        align={column.align}
                        sx={{ padding: "4px 0px" ,border:"0.1px solid #F5F5F5"}}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows01 && rows01.map((item, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <TableCell sx={{ textAlign: "center", padding: "4px 20px !important",border:"0.1px solid #F5F5F5" }}>{item.phCm}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 20px !important" ,border:"0.1px solid #F5F5F5"}}>{item.phFeed}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 20px !important" ,border:"0.1px solid #F5F5F5"}}>{item.ril}</TableCell>
                        <TableCell sx={{ textAlign: "center", padding: "4px 20px !important" ,border:"0.1px solid #F5F5F5"}}>{item.sfn}</TableCell>

                      </StyledTableRow>
                    )
                  })
                  }
                </TableBody>
              </Table>
            </TableContainer>
           </Grid>

            <Typography sx={{ fontSize: "13px", paddingTop: 2 }}>Your height will help determine which approximately is your best size fitting. For example, if your body height is 150 cm, then the recommended item length is either 50” or 52”, with the recommended sleeve length of 26”. Note the measurements are for the Abaya itself, NOT BODY MEASUREMENTS.</Typography>
            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>If you are planning to wear the Abaya with long heels, we recommend adding one or two inches extra.</Typography>
            <Typography sx={{ fontSize: "13px", paddingTop: 1 }}>For any other required size fields, you will have to take those measurements yourself. Please refer to the measurement guide below for how to best to so.</Typography>
            <Typography sx={{ fontSize: "20px", fontWeight: "500", paddingY: 2 }}>Abaya Measurement Guide</Typography>

            <Grid>
              <Image src={SizeGuide} alt="size-guide" style={{ maxWidth: '100%', height: '100%', padding: "50px 100px" }} />
            </Grid>

          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export const AddTamaraModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {

  const style: muiSxPropType = {
    background: "linear-gradient(180deg, rgba(242,210,189,1) 0%, rgba(255,255,255,1) 100%);",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 700,
    width: "100%",
    boxShadow: 24,
    p: 2,
    "& .MuiFilledInput-root": {
      ":before": {
        borderBottom: "none",
      },
      borderRadius: appStyles.textFieldShape,
    },
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ overflow: 'scroll' }}

    >
      <Paper sx={style}>
        <Grid container rowSpacing={1}  columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
          <Grid xs={6} sx={{ textAlign: 'right', fontSize: "20px", fontWeight: "600" }}>
            Tomara
          </Grid>
          <Grid xs={6} sx={{ textAlign: 'right' }}>

            <Button disableElevation onClick={handleClose}>
              <CloseIcon sx={{ color: "black", width: "25px", height: "25px", background: "#C8C6B6", borderRadius: "50%" }} />
            </Button>
          </Grid>
        </Grid>
        <Box>
          <Typography sx={{ fontSize: "30px", textAlign: "center", padding: "10px 30px", fontWeight: "500" }}>Split your bill into 4 payments of AED 150 interest-free</Typography>
        </Box>
        <Grid container rowSpacing={1} sx={{ textAlign: "center" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3} sm={3} md={3} >
            <ShoppingCartSharpIcon sx={{ color: "black", height: "50px", width: "50px", padding: "10px", background: "#C8C6B6", borderRadius: "50%", sm: { display: "contents" } }} />
            <Typography sx={{ fontSize: "13px" }}>Add the item to your cart</Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <ShoppingBasketIcon sx={{ color: "black", height: "50px", width: "50px", padding: "10px", background: "#C8C6B6", borderRadius: "50%" }} />
            <Typography sx={{ fontSize: "13px" }}>Select Tamara at checkout</Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <PersonAddAltIcon sx={{ color: "black", height: "50px", width: "50px", padding: "10px", background: "#C8C6B6", borderRadius: "50%" }} />
            <Typography sx={{ fontSize: "13px" }}>Fill in your details</Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <PaymentIcon sx={{ color: "black", height: "50px", width: "50px", padding: "10px", background: "#C8C6B6", borderRadius: "50%" }} />
            <Typography sx={{ fontSize: "13px" }}>Complete your first payment</Typography>
          </Grid>
        </Grid>


        <Typography sx={{ fontSize: "10px", textAlign: "center", padding: "10px 40px" }}>and pay the remaining in 3 months or according to the payment plan you selected</Typography>
        <Typography sx={{ fontSize: "20px", fontWeight: "500", textAlign: "center", padding: "30px 40px" }}>Why Tomara?</Typography>
        <Grid container rowSpacing={1} sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3} sm={3} md={3} >
            <PaymentsTwoToneIcon sx={{ color: "black", }} />
            <Typography sx={{ fontSize: "13px" }}>Interest free</Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <VisibilityOffOutlinedIcon sx={{ color: "black", }} />
            <Typography sx={{ fontSize: "13px" }}>No hidden fees</Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <SentimentSatisfiedOutlinedIcon sx={{ color: "black", }} />
            <Typography sx={{ fontSize: "13px" }}>Quick and easy</Typography>
          </Grid>
          <Link href="https://tamara.co/en/index#how-it-works" color="inherit" sx={{ textAlign: "center", paddingY: 6 }}>
            Learn more about Tamara
          </Link>
          <Typography sx={{ fontSize: "12px", marginX: "50px", paddingBottom: 3, sx: { marginX: "10px" } }}>
            (1) {" "}<Link href="https://www.tamara.co/en/terms-and-conditions" color="inherit">
              Terms and conditions apply
            </Link>{" "} , (2) Tamara is {" "}<Link href="https://www.tamara.co/en/shariah-compliance" color="inherit" >
              Sharia-compliant
            </Link>{" "} , (3) Eligible for customers in Saudi Arabia and United Arab Emirates, (4) Your final payment plan may vary depending on your credit history.
          </Typography>

        </Grid>

      </Paper>
    </Modal>
  );
};


export const AddToCardMoreInfoModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {

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
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Grid container rowSpacing={1}  columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
          <Grid xs={10} sx={{ textAlign: 'right', fontSize: "20px", fontWeight: "600" }}>
            Full your all nesscerry information
          </Grid>

        </Grid>





      </Paper>
    </Modal>
  );};