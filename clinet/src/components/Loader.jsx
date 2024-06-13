// src/components/Loader.js
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Loader.css"; // Import any additional CSS if needed

const Loader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const loaderElement = loaderRef.current;

    // Your GSAP animation code here
    gsap.to(loaderElement, {
      duration: 2,
      repeat: -1,
      ease: "linear",
    });

    return () => {
      // Clean up animation if needed
      gsap.killTweensOf(loaderElement);
    };
  }, []);

  return (
    <div className="loader" ref={loaderRef}>
      <svg width="169" height="169" viewBox="0 0 169 169" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-loader">
        <path className="path" fill-rule="evenodd" clip-rule="evenodd" stroke="#000000" stroke-width="2" d="M14.0625 63.2812L84.375 14.0625L154.688 63.2812H14.0625ZM21.0938 140.625V133.594H147.656V140.625H21.0938ZM21.0938 147.656V154.688H147.656V147.656H21.0938ZM84.375 22.4999L132.187 56.2499H36.5624L84.375 22.4999ZM42.1875 126.562V70.3125H35.1562V126.562H42.1875ZM70.3125 70.3125V126.562H63.2812V70.3125H70.3125ZM105.469 126.562V70.3125H98.4375V126.562H105.469ZM133.594 70.3125V126.562H126.562V70.3125H133.594Z" />
      </svg>
    </div>
  );
};

export default Loader;
