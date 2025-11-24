"use client";

import dynamic from "next/dynamic";
// import AmazingSlider from "./components/home/AmazingSlider"; 
// import LatestProducts from "./components/home/LatestProduct"; 
// import Articles from "./components/home/Articles"; 
// import HeaderSlider from "./components/Header/HeaderSlider"; 
// import RelatedProducts from "./components/Products/RelatedProducts";
//  import Banners from "./components/home/banners";
const HeaderSlider = dynamic(() => import("../Header/HeaderSlider"), { ssr: false });
const AmazingSlider = dynamic(() => import("../home/AmazingSlider"), { ssr: false });
const LatestProducts = dynamic(() => import("../home/LatestProduct"), { ssr: false });
const Banners = dynamic(() => import("../home/banners"), { ssr: false });
const RelatedProducts = dynamic(() => import("../Products/RelatedProducts"), { ssr: false });
const Articles = dynamic(() => import("../home/Articles"), { ssr: false });

export default function LazyHomeSections() {
  return (
    <>
      <HeaderSlider />
      <AmazingSlider />
      <LatestProducts />
      <Banners />
      <RelatedProducts />
      <Articles />
    </>
  );
}
