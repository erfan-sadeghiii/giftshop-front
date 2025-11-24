import { useState } from "react";
import ProductModalSlider from "./ProductModalSlider";

const ProductImageSlider = ({ images, title }) => {


  const [mainImage, setMainImage] = useState(images[0]);
  const [modalOpen, setActive] = useState(false);

  return (
    <div className="w-2/4 hidden md:flex flex-col justify-center items-center gap-y-4">
      {/* MAIN IMAGE */}
      <span
        className="open-sliderModal cursor-pointer"
        onClick={() => setActive(true)}
      >
        <img
          src={process.env.NEXT_PUBLIC_API_URL + mainImage}
          className="object-cover"
          alt="Product"
        />
      </span>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-12 child:col-span-3 child:app-border gap-x-4 child:size-16 child:rounded-lg child:cursor-pointer">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`p-1 open-sliderModal ${idx === images.length - 1 ? "relative overflow-hidden" : ""}`}
            onClick={() => setMainImage(img)}
          >
            {idx === images.length - 1 && (
              <svg
                onClick={() => setActive((pre) => !pre)}
                className="absolute size-8 text-gray-100 top-4 left-4 z-10"
              >
                <use href="#ellipsis" />
              </svg>
            )}
            <img
              src={process.env.NEXT_PUBLIC_API_URL + img}
              className={`object-cover rounded-lg ${idx === images.length - 1 ? "blur-sm" : ""}`}
              alt={`Thumbnail ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <ProductModalSlider
          active={modalOpen}
          title={title}
          images={images}
          setActive={setActive}
        />
      )}
    </div>
  );
};

export default ProductImageSlider;
