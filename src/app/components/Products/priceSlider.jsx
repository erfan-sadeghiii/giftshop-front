import { useState, useRef, useEffect } from "react";

const PriceAccordion = ({ min,max, onChange }) => {
    
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: min || 0,
    priceMax: max || 30_000_000,
  });

  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "min" or "max"

  const toggleAccordion = () => setAccordionOpen((prev) => !prev);

  const startDrag = (e, handle) => {
    e.preventDefault();
    setDragging(handle);
  };

  const stopDrag = () => {
    setDragging(null);
    onChange(filters); // Notify parent on release
  };

  const handleMouseMove = (e) => {
    if (!dragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;

    // RTL logic — move handles from right to left
    const total = 30_000_000;
    let newValue = Math.round(((rect.width - offsetX) / rect.width) * total);

    if (dragging === "min") {
      newValue = Math.round(Math.min(newValue, filters.priceMax - 1000));
      newValue = Math.round(Math.max(newValue, 0));
      setFilters((prev) => ({ ...prev, priceMin: newValue }));
    } else if (dragging === "max") {
      newValue = Math.round(Math.max(newValue, filters.priceMin + 1000));
      newValue = Math.round(Math.min(newValue, total));
      setFilters((prev) => ({ ...prev, priceMax: newValue }));
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, filters]);

  // Format number (e.g. 1,000,000)
  const formatPrice = (val) =>
    val.toLocaleString("fa-IR", { maximumFractionDigits: 0 });

  return (
    <div className="border rounded shadow-sm">
      {/* Accordion Header */}
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center px-4 py-3 text-gray-800 dark:text-gray-100"
      >
        <span>محدوده قیمت</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            accordionOpen ? "rotate-90" : ""
          }`}
        >
          <use href="#chevron-left"></use>
        </svg>
      </button>

      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          accordionOpen ? "max-h-[200px] pb-4 px-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-y-4 mt-2">
          {/* Current Values */}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{formatPrice(filters.priceMin)} تومان</span>
            <span>{formatPrice(filters.priceMax)} تومان</span>
          </div>

          {/* Slider */}
          <div ref={sliderRef} className="relative h-6 w-full">
            {/* Track */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 dark:bg-gray-700 -translate-y-1/2 rounded"></div>

            {/* Active Range */}
            <div
              className="absolute top-1/2 h-1 bg-blue-500 -translate-y-1/2 rounded"
              style={{
                left: `${100 - (filters.priceMax / 30_000_000) * 100}%`,
                width: `${((filters.priceMax - filters.priceMin) / 30_000_000) * 100}%`,
              }}
            ></div>

            {/* Max Handle */}
            <div
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full -translate-y-1/2 cursor-pointer"
              style={{
                left: `calc(${100 - (filters.priceMax / 30_000_000) * 100}% - 0.5rem)`,
              }}
              onMouseDown={(e) => startDrag(e, "max")}
            ></div>

            {/* Min Handle */}
            <div
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full -translate-y-1/2 cursor-pointer"
              style={{
                left: `calc(${100 - (filters.priceMin / 30_000_000) * 100}% - 0.5rem)`,
              }}
              onMouseDown={(e) => startDrag(e, "min")}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAccordion;
