import React from "react";

const Tooltip = ({ children, tooltipText }) => {
  const tipRef = React.createRef(null);
  const handleMouseEnter = () => {
    tipRef.current.style.opacity = 1;
    tipRef.current.style.marginLeft = "20px";
  }
  const handleMouseLeave = () => {
    tipRef.current.style.opacity = 0;
    tipRef.current.style.marginLeft = "10px";
  }
  return (
    <div className="relative flex items-center">
      <div
        className="absolute whitespace-no-wrap bg-gradient-to-b from-black to-gray-700 text-white px-4 py-2 rounded flex items-center transition-all duration-150"
        style={{ top: "105%",left: "-40px", opacity: 0 }}
        ref={tipRef}
      >
        <div
          style={{ top: "-6px", right:"45%", transform: "rotate(45deg)" }}
        />
        {tooltipText}
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </div>
  );
}

export default Tooltip;
