import { ConfigsType } from "config";

const qtdealz: ConfigsType = {
  name: "Qazada",
  api: {
    baseUrl: "https://office21.dealizzle.com",
    imgUrl: "https://office21-prod.s3.me-south-1.amazonaws.com/uploads/productImages",
    reviewImgUrl: "https://office21-prod.s3.me-south-1.amazonaws.com/uploads/reviewImages",
    locationId: "615aa1a81818ec3f60583303",
    location_name: "www.qtdealz.com",
    favIconFileName: "qtdealz-icon.png",
  },
  contact: {
    whatsapp:
      "https://wa.me/message/FKMB7WT5ZHLIJ1",
    email: "Info@Qazada.com",
    address:
      "Dee Vinci International FZE LLC . Media City. United Arab Emirates",
    phone: "+971564259474",
  },
  product: {
    currency: "AED",
    // prettier-ignore
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al khaimah", "Al Ain","Umm Al Quwain"],
    whatsappShare:
      "https://wa.me/message/FKMB7WT5ZHLIJ1",
    invoiceLink: "https://office21.dealizzle.com/api/store/customer/order/pdf?order_number=",
    vat: false,
    displayYoutubeThumbnail: false,
  },
  featureFlags: {
    whatsappFab: true,
    categorySorting: false,
  },
  customer: {
    rememberContactInfo: true,
    rmContInfoAfterOrder: true,
  },
  queryKeys: {
    categories: "allCategories",
    productReviews: "product-reviews",
  },
  apiRoutes: {
    productInventoryBulkRoute: "/api/store/product/inventory/parent/query/get",
  },
  head: {
    home: {
      title: "Qazada - Online shopping in Middle East. Fashion , Apparel, Shoes, Tops,  & More . 80 % OFF. High Quality Low Prices",
      description:
        "Discount online shopping in Middle East. Dubai UAE QATAR OMAN KSA",
      keywords: "Qazada, Qatar online shopping, women fashion, discount, fashion, new",
      url: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}`,
      imgURL: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}/images/qazada-meta-logo.jpg`,
    },
    newArrivalCat: {
      title: "Buy Best Women Online At Cheap Price, Women & Qatar Shopping",
      description:
        "Qazada big discount sale in Qatar, women clothes, women shoes, women fashion Qatar",
      keywords: "big discount women fashion, women clothes, online shopping Qatar",
      url: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}`,
      imgURL: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}/images/qazada-meta-logo.jpg`,
    },
    clearanceCat: {
      title: "Big discount Qatar, women clothes Qatar, free shipping Qatar, women fashion Qatar",
      description:
        "Qazada big discount sale in Qatar, women clothes, women shoes, women fashion Qatar",
      keywords: "women shoes, women fashion, women clothes, online shopping Qatar",
      url: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}`,
      imgURL: `${process.env.NEXT_PUBLIC_URL && 'https://qazada-com-new.vercel.app'}/images/qazada-meta-logo.jpg`,
    },
  },
  siteInfo: {
    certificateURL: "https://theqa.qa/certificates/details/e2090aed-f966-440f-895c-00a88c388489",
  },
};

export default qtdealz;
