export default function PrimusLoader() {
  return (
    <div className="fixed left-50 top-17 right-0 z-70 flex items-center text-center h-screen justify-center">
          <svg
      width="200"
      height="50"
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue box */}
      <rect x="0" y="5" width="40" height="40" rx="8" fill="#2563EB">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Vertical lines */}
      {[13, 26].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="5"
          x2={x}
          y2="45"
          stroke="white"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin={`${i * 0.2}s`}
            fill="freeze"
          />
        </line>
      ))}

      {/* Horizontal lines */}
      {[18, 31].map((y, i) => (
        <line
          key={i}
          x1="0"
          y1={y}
          x2="40"
          y2={y}
          stroke="white"
          strokeWidth="2"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin={`${0.4 + i * 0.2}s`}
            fill="freeze"
          />
        </line>
      ))}

      {/* Text */}
      <text
          x="55"
          y="35"
        fontFamily="Lucida Console, Courier New, monospace"
        fontSize="30"
        fontWeight="bold"
        fill="#1F2937"
      >
        PayLert
        <animate
          attributeName="opacity"
          values="0;1"
          dur="0.8s"
          begin="0.6s"
          fill="freeze"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-10 0"
          to="0 0"
          dur="0.8s"
          begin="0.6s"
          fill="freeze"
        />
      </text>
    </svg>
    </div>
  );
}
