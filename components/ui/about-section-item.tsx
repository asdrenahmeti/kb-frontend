import React from "react";

type AboutSectionItemProps = {
  textOne?: string;
  textTwo?: string;
  image: string;
  color: "light" | "dark";
  children?: React.ReactNode;
};

const AboutSectionItem = ({
  textOne,
  textTwo,
  image,
  color,
  children,
}: AboutSectionItemProps) => {
  return (
    <div
      className="py-8 relative flex items-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          color === "light" ? "bg-kb-pink" : "bg-kb-dark-violette"
        } opacity-60`}
        style={{ zIndex: 1 }}
      />

      <div className="container max-w-[1200px] flex flex-col justify-center relative font-normal h-screen" style={{ zIndex: 2 }}>
        {children && <div className="relative z-10">{children}</div>}

        <div className="flex flex-col gap-8">
          {textOne && (
            <h1 className="text-md sm:text-[26px] md:text-[34px] text-white text-center">
              {textOne}
            </h1>
          )}

          {textTwo && (
            <h1 className="text-md sm:text-[26px] md:text-[34px] text-white text-center">
              {textTwo}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSectionItem;
