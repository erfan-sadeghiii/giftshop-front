
"use client";
import { useState, useEffect } from "react";

const MegaMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/megamenu/`);
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setMenuData(data);
      } catch (error) {
        console.error("❌ Error loading MegaMenu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">در حال بارگذاری...</div>;
  }

  if (!menuData.length) {
    return <div className="text-center py-8 text-red-400">منو پیدا نشد</div>;
  }

  return (
    <div className="megamenu shadow-2xl">
      {/* RIGHT MENU */}
      <ul className="megamenu_category">
        {menuData.map((category, idx) => (
          <li
            key={idx}
            className={`megamenu_category-item ${activeCategory === idx ? "active" : ""}`}
            onMouseEnter={() => setActiveCategory(idx)}
          >
            {category.icon && (
              <svg className="w-5 h-5">
                <use href={`#${category.icon}`}></use>
              </svg>
            )}
            <a href={category.link}>{category.name}</a>
          </li>
        ))}
      </ul>

      {/* LEFT MENU */}
      <div className="megamenu_left">
        <a
          href="/products"
          className="text-blue-400 flex items-center gap-x-0.5 text-sm mb-4"
        >
          مشاهده همه
          <svg className="size-4 rotate-90">
            <use href="#chevron" />
          </svg>
        </a>

        {menuData.map((category, idx) => (
          <ul
            key={idx}
            className={`megamenu_left-item ${activeCategory === idx ? "active" : ""}`}
          >
            {category.sections.map((section, sIdx) => (
              <div key={sIdx} className="megamenu_left-menu">
                <h2 className="megamenu_left-title">{section.title}</h2>
                {section.items.map((item, iIdx) => (
                  <li key={iIdx}>
                    <a href={`${item.link}?${item.query}`}>{item.name}</a>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
