"use client";

import { useEffect, useState } from "react";

const Banners = () => {
  const [banners, setBanners] = useState({ left: null, right: null });

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/banners/`);
        if (!res.ok) throw new Error("Failed to fetch banners");

        const data = await res.json();
        const leftBanner = data.find(b => b.position === "left");
        const rightBanner = data.find(b => b.position === "right");

        setBanners({ left: leftBanner, right: rightBanner });
      } catch (err) {
        console.error(err);
      }
    }

    fetchBanners();
  }, []);

  return (
    <section className="mx-4 lg:container mt-10 lg:mt-20 flex flex-col lg:flex-row items-center gap-5">
      {banners.left && (
        <a href={banners.left.link || "#"} className="group flex-1 max-h-40 lg:h-44 overflow-hidden rounded-xl">
          <img
            src={banners.left.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt="Left Banner"
          />
        </a>
      )}

      {banners.right && (
        <a href={banners.right.link || "#"} className="group flex-1 max-h-40  lg:h-44 overflow-hidden rounded-xl">
          <img
            src={banners.right.image}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt="Right Banner"
          />
        </a>
      )}
    </section>
  );
};

export default Banners;
