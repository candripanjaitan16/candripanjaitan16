import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/chanthecno.svg";

function TextArc({ text, diameter }) {
  const characters = text.split("");
  const radius = diameter / 2;
  const angleStep = 360 / characters.length;

  return (
    <div className="relative" style={{ width: diameter, height: diameter }}>
      {characters.map((char, index) => {
        const angle = angleStep * index;
        return (
          <div
            key={index}
            className="absolute left-1/2 top-0"
            style={{
              height: radius,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "bottom center",
              marginLeft: "-0.35em",
            }}
          >
            <span className="font-pixelated text-sm font-bold text-white md:text-base">
              {char}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TextArcEffect() {
  const [diameter, setDiameter] = useState(270);

  useEffect(() => {
    const resize = () => {
      setDiameter(window.innerWidth < 768 ? 220 : 270);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <TextArc
          text=" CHANTHECNO • KLIK TO START • AUTOMATION COMPANY • "
          diameter={diameter}
        />
      </motion.div>

      <a
        href="https://www.chanthecno.com"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-28 w-28 items-center justify-center cursor-pointer md:h-32 md:w-32"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />
          <img
            src={logo}
            alt="ChanThecno"
            className="relative h-20 w-20 object-contain md:h-24 md:w-24"
          />
        </motion.div>
      </a>
    </div>
  );
}
