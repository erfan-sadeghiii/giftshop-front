
import { useState } from "react";


const ColorSelection = ({}) => {
      const [color,setColor] = useState("green")
  const colors=["yellow","gray","blue","green"]

  return (
      <div className="flex flex-col gap-y-4">
                <h1 className="font-DanaDemiBold text-lg color-title dark:text-gray-200">رنگ : سبز</h1>
                <div className="flex items-center gap-x-3 child:rounded-full child:size-9 child:p-1">
                  {colors.map((c,idx)=>{ return  <button key={idx} onClick={()=>{setColor(c)}} className={`color-select-btn  ${c==color?'ring-blue-400 ring-4':'ring-gray-400 ring-1'} transition-all duration-300 ease-in-out`}>
                    <span  style={{ backgroundColor: c }} className={` w-full h-full rounded-full flex`}></span>
                  </button>

                  })}
                 
                </div>
              </div>
  );
}

export default ColorSelection