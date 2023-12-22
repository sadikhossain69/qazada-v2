import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Stack } from "@mui/material";
import appConfig from "config";
import { find, findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedSubSKUAtom } from "atoms/atoms";
import SwiperCore, { Controller, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import ReactImageMagnify from 'easy-magnify';
// import ReactImageMagnify from "react-image-magnify";
import * as styles from "./style";
import { useWindowWidth } from "@react-hook/window-size";

interface Props {
  images: string[];
  youtubeLink?: string;
}

export const Slider: React.FC<Props> = ({ images, youtubeLink }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();
  const selectedSubSku = useRecoilValue(selectedSubSKUAtom);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore | undefined>();
  const [open, setOpen] = React.useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const onlyWidth = useWindowWidth();

  const handleOpen = (event: React.MouseEvent<HTMLImageElement, MouseEvent>, name: string) => {
    setSelectedImg(name);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedImg(null);
    setOpen(false);
  };

  useEffect(() => {
    if (selectedSubSku && controlledSwiper) {
      const swiperElWithSelectedSubSkuImg = find(controlledSwiper.slides, (slide) => {
        return slide.ariaValueText === selectedSubSku.image_url;
      });

      if (swiperElWithSelectedSubSkuImg) {
        const swiperIndex = findIndex(controlledSwiper.slides, swiperElWithSelectedSubSkuImg);
        controlledSwiper.slideTo(swiperIndex);
        thumbsSwiper?.slideTo(swiperIndex);
      }
    }
  }, [selectedSubSku]);

  return (
    <>
      {
        onlyWidth < 900 &&
        <>
          <Box className="pd-details">
            <Swiper
              slidesPerView={1}
              modules={[Navigation, Thumbs, Controller]}
              navigation={images && images.length > 1 ? true : false}
              onSwiper={setControlledSwiper}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="swiper-view"
              controller={{
                control: controlledSwiper && !controlledSwiper.destroyed ? controlledSwiper : undefined,
              }}
            >
              {youtubeLink && (
                <SwiperSlide>
                  <div className="iframe-container-div">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeLink}`}
                      frameBorder="0"
                    ></iframe>
                  </div>
                </SwiperSlide>
              )}
              <Stack component="span" sx={{ display: { xs: "flex", md: "none" } }}>
                {images?.map((name, index) => (
                  <SwiperSlide aria-valuetext={name} key={index}>
                    <ReactImageMagnify
                      {...{

                        smallImage: {
                          alt: `prodcut-${name}`,
                          isFluidWidth: true,
                          src: `${appConfig.api.imgUrl}/${name}`,
                          // width: 140,
                          // height: 162,
                        },
                        largeImage: {
                          src: `${appConfig.api.imgUrl}/${name}`,
                          width: 1800,
                          height: 1800,
                        },
                        enlargedImagePortalId: "myPortal",
                        onClick: (event: any) => handleOpen(event, name),
                        loading: "lazy",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Stack>
              {/* <Stack component="span" sx={{ display: { xs: "none", md: "flex" } }}>
          {images?.map((name, index) => (
            <SwiperSlide aria-valuetext={name} key={index}>
              <img
                src={`${appConfig.api.imgUrl}/${name}`}
                alt={`product-${name}`}
                onClick={(event) => handleOpen(event, name)}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
          </Stack> */}

            </Swiper>
            <div>
              <Swiper
                modules={[Navigation, Thumbs, Controller]}
                onSwiper={setThumbsSwiper}
                spaceBetween={30}
                slidesPerView={3}
                freeMode={true}
                watchSlidesProgress={true}
                className="swiper-preview"
              >
                {youtubeLink && (
                  <SwiperSlide>
                    <img
                      src={`https://img.youtube.com/vi/${youtubeLink}/sddefault.jpg`}
                      alt="video-thumb"
                    />
                  </SwiperSlide>
                )}
                {images?.map((name, index) => (
                  <SwiperSlide key={index}>
                    <img src={`${appConfig.api.imgUrl}/${name}`} alt="product-thumb" loading="lazy" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <Modal open={open} onClose={handleClose}>
              <Box sx={styles.imageModalStyle}>
                <IconButton sx={styles.imageModalCloseButton} onClick={handleClose}>
                  {" "}
                  <CloseIcon />
                </IconButton>
                <div className="modal-slider-container">
                  <Swiper
                    modules={[Navigation, Thumbs, Controller]}
                    initialSlide={controlledSwiper?.activeIndex}
                    navigation={images && images.length > 1 ? true : false}
                    slidesPerView={1}
                    // className="swiper-view"
                    onSlideChange={(swiper) => controlledSwiper?.slideTo(swiper.activeIndex)}
                  >
                    {images?.map((name, index) => (
                      <SwiperSlide aria-valuetext={name} key={index}>
                        <img
                          src={`${appConfig.api.imgUrl}/${name}`}
                          alt={`product-${name}`}
                          loading="lazy"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Box>
            </Modal>
          </Box>
        </>
      }
      { 
        onlyWidth >= 900 &&
        <>
          <Box className="pd-details-big-device">
            <div className="div_raper">
              <Swiper
                slidesPerView={1}
                modules={[Navigation, Thumbs, Controller]}
                navigation={images && images.length > 1 ? true : false}
                onSwiper={setControlledSwiper}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="swiper-view-big-image"
                controller={{
                  control:
                    controlledSwiper && !controlledSwiper.destroyed ? controlledSwiper : undefined,
                }}
              >
                {youtubeLink && (
                  <SwiperSlide>
                    <div className="iframe-container-div">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeLink}`}
                        frameBorder="0"
                      ></iframe>
                    </div>
                  </SwiperSlide>
                )}
                <Stack component="span" sx={{ display: { xs: "flex", md: "none" } }}>
                  {images?.map((name, index) => (
                    <SwiperSlide aria-valuetext={name} key={index}>
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: `prodcut-${name}`,
                            isFluidWidth: true,
                            src: `${appConfig.api.imgUrl}/${name}`,
                            // width: 140,
                            // height: 162,
                          },
                          largeImage: {
                            src: `${appConfig.api.imgUrl}/${name}`,
                            width: 1800,
                            height: 1800,
                          },
                          enlargedImagePortalId: "myPortal",
                          onClick: (event: any) => handleOpen(event, name),
                          loading: "lazy",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Stack>
                {/* <Stack component="span" sx={{ display: { xs: "none", md: "flex" } }}>
          {images?.map((name, index) => (
            <SwiperSlide aria-valuetext={name} key={index}>
              <img
                src={`${appConfig.api.imgUrl}/${name}`}
                alt={`product-${name}`}
                onClick={(event) => handleOpen(event, name)}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
          </Stack> */}
              </Swiper>
              <div className="blow_dot">
                <Swiper
                  modules={[Navigation, Thumbs, Controller]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={30}
                  slidesPerView={3}
                  freeMode={true}
                  navigation={{ nextEl: null, prevEl: null }}
                  className="swiper-preview"
                >
                  {youtubeLink && (
                    <SwiperSlide>
                      <img
                        src={`https://img.youtube.com/vi/${youtubeLink}/sddefault.jpg`}
                        alt="video-thumb"
                      />
                    </SwiperSlide>
                  )}
                  {images?.map((name, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-view-img-flex">
                        <img
                          src={`${appConfig.api.imgUrl}/${name}`}
                          alt="product-thumb"
                          loading="lazy"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <Modal open={open} onClose={handleClose}>
              <Box sx={styles.imageModalStyle}>
                <IconButton sx={styles.imageModalCloseButton} onClick={handleClose}>
                  {" "}
                  <CloseIcon />
                </IconButton>
                <div className="modal-slider-container">
                  <Swiper
                    modules={[Navigation, Thumbs, Controller]}
                    initialSlide={controlledSwiper?.activeIndex}
                    navigation={images && images.length > 1 ? true : false}
                    slidesPerView={1}
                    // className="swiper-view"
                    onSlideChange={(swiper) => controlledSwiper?.slideTo(swiper.activeIndex)}
                  >
                    {images?.map((name, index) => (
                      <SwiperSlide aria-valuetext={name} key={index}>
                        <img
                          src={`${appConfig.api.imgUrl}/${name}`}
                          alt={`product-${name}`}
                          loading="lazy"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Box>
            </Modal>
          </Box>
        </>
      }
    </>
  );
};
