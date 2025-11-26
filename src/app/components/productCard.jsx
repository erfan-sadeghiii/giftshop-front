import Swal from "sweetalert2";

const ProductCard = ({ product, isAdmin = false }) => {


  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "حذف محصول",
      text: "آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products/${product.slug}/`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("خطا در حذف محصول");

        Swal.fire("حذف شد!", "محصول با موفقیت حذف شد.", "success");
        // Optionally, refresh products list or trigger parent callback
        setTimeout(() => window.location.reload(), 200);
      } catch (error) {
        Swal.fire("خطا!", error.message, "error");
      }
    }
  };

  return (
    <div className="product-card group">
      {/* product header */}
      {product.discount > 0 ?
        <div className="product-card_header">
          <div className="flex items-center gap-x-2"></div>
          <span className="product-card_badge">{Math.floor(product.discount)}% تخفیف‌</span>
        </div> : <div className="product-card_header">
          <div className="flex items-center gap-x-2 h-5"></div>
          
        </div>}

      {/* product img */}
      <a href={`/products/${product.slug}`}>
        <img
          className="product-card_img group-hover:opacity-0 absolute"
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
          alt=""
        />
        <img
          className="product-card_img opacity-0 group-hover:opacity-100"
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[1] ? product.images[1] : product.images[0]}`}
          alt=""
        />
      </a>

      {/* product footer */}
      <div className="space-y-2 w-full">
        <a href={`/products/${product.slug}`} className="product-card_link">
          {product.title} <br /> {product.subtitle}
        </a>

        {/* Rate and Price */}
        <div className="product-card_price-wrapper">
          <div className="product-card_rate">
            
            <span className="text-gray-400 flex items-center text-sm gap-x-0.5">
              <p>{product.comments.length > 0
                ? product.comments.reduce((acc, c) => acc + (c.isLiked ? 5 : 3), 0) / product.comments.length
                : 0}</p>
              <svg className="size-4 mb-1">
                <use href="#star" />
              </svg>
            </span>
          </div>

          {product.stock_quantity > 0 ? <div className="product-card_price">
            {product.discount > 0 ? (
              <del>
                {Number(product.price).toLocaleString()} <h6>تومان</h6>
              </del>
            ) : null}
            <p>{Number(product.final_price).toLocaleString()}</p>
            <span>تومان</span>
          </div> : <div className="product-card_price"><p className="text-center mx-auto">ناموجود</p></div>
          }

          {product.stock_quantity > 0 && (<a href={`/products/${product.slug}`} disabled={product.stock_quantity <= 1} className=" w-full text-center py-2 mt-2 text-sm font-medium rounded-xl bg-blue-500 text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md active:scale-95">
            مشاهده بیشتر ...
          </a>)}

          {isAdmin && (
            <>
              <button
                onClick={handleDelete}
                className="w-full py-2 mt-2 text-sm font-medium rounded-xl bg-red-500 text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md active:scale-95"
              >
                حذف
              </button>

              <a
                href={`/admin/products/edit/${product.slug}`}
                className="w-full block text-center py-2 mt-2 text-sm font-medium rounded-xl bg-amber-500 text-white shadow-sm transition-all duration-200 hover:bg-amber-600 hover:shadow-md active:scale-95"
              >
                ویرایش
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
