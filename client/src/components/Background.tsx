const shapes = [
  {
    className: "w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] bg-red-400/30 dark:bg-red-600/30 rounded-full top-10 left-5 rotate-6",
    type: "circle",
  },
  {
    className: "w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[26rem] lg:h-[26rem] bg-red-300/30 dark:bg-red-700/30 top-1/4 left-1/4 sm:left-1/3 rotate-12",
    type: "square",
  },
  {
    className: "w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[26rem] lg:h-[26rem] bg-red-200/30 dark:bg-red-600/30 rounded-full top-1/3 left-1/2 md:left-2/3 -rotate-12",
    type: "circle",
  },
  {
    className: "w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] bg-red-500/30 dark:bg-red-800/30 top-[75%] left-1/4 rotate-3",
    type: "square",
  },
  {
    className:
      "w-0 h-0 border-l-[60px] sm:border-l-[70px] md:border-l-[80px] border-r-[60px] sm:border-r-[70px] md:border-r-[80px] lg:border-l-[100px] lg:border-r-[100px] lg:border-b-[200px] border-l-transparent border-r-transparent border-b-red-400/30 dark:border-b-red-600/30 top-[20%] left-[70%] sm:left-[80%] rotate-[25deg]",
    type: "triangle",
  },
];

export default function Background() {
  return (
    <div className="absolute inset-0 -z-10 min-h-screen overflow-hidden">
      {shapes.map((shape, index) => {
        const baseClasses = `absolute ${shape.className}`;
        const fullClassName =
          shape.type === "square"
            ? baseClasses
            : `${baseClasses} ${shape.type === "circle" ? "rounded-full" : ""}`;
        return <div key={index} className={fullClassName} />;
      })}
    </div>
  );
}
