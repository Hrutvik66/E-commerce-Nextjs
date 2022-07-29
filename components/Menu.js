import React, { useEffect, useState } from "react";
import Link from "next/link";

const Tooltip = ({ children, List }) => {
  const [isClicked, setIsClicked] = useState(false);
  const tipRef = React.createRef(null);
  useEffect(() => {
    if (isClicked) {
      tipRef.current.style.opacity = 1;
      tipRef.current.style.marginLeft = "20px";
    } else {
      tipRef.current.style.opacity = 0;
      tipRef.current.style.marginLeft = "10px";
    }
  }, [isClicked]);

  return (
    <div className="relative flex items-center">
      <div
        className="origin-top-right absolute top-[105%] w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-icon"
        tabIndex="-1"
        ref={tipRef}
      >
              <div className="py-1" role="none">
                  
          <Link
            href="#"
            class="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
          >
            Account settings
          </Link>
        </div>
      </div>
      <div onClick={setIsClicked(!isClicked)}>{children}</div>
    </div>
  );
};

export default Tooltip;
