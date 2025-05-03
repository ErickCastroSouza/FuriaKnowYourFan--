import React from "react";
import furiaLogo from "../../assets/furia-header.png";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <img 
      src={furiaLogo} 
      alt="FURIA Logo" 
      className={className}
    />
  );
};

export default Logo;
