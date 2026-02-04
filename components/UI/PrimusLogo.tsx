"use cleint";

export default function PrimusLogo () {

  return (
    <div className="flex text-center justify-center items-center">
      <svg
        width="200"
        height="50"
        viewBox="0 0 200 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="5" width="40" height="40" rx="8" fill="#2563EB" />
        <line x1="13" y1="5" x2="13" y2="45" stroke="white" strokeWidth="2" />
        <line x1="26" y1="5" x2="26" y2="45" stroke="white" strokeWidth="2" />
        <line x1="0" y1="18" x2="40" y2="18" stroke="white" strokeWidth="2" />
        <line x1="0" y1="31" x2="40" y2="31" stroke="white" strokeWidth="2" />
        <text
          x="55"
          y="35"
          fontFamily="Lucida Console, Courier New, monospace"
          fontSize="25"
          fontWeight="bold"
          fill="#1F2937"
        >
          TableLert
        </text>
      </svg>
    </div>
  );
}
