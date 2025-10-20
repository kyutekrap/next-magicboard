import React from "react";
import { ImageButtonProps } from "./ImageButtonProps";

interface StaticImageButtonProps extends ImageButtonProps {
    onClick: () => void;
}

export const StaticImageButton: React.FC<StaticImageButtonProps> = ({
    children, onClick, shadow
}) => (
    <div 
    onClick={onClick} 
    className={`cursor-pointer flex items-center justify-center rounded-full bg-transparent focus:outline-none transition duration-200 ${shadow ? 'hover:bg-hoverTint dark:hover:bg-hoverTintDark w-10 h-10' : ''}`}
    >
        {children}
    </div>
);
