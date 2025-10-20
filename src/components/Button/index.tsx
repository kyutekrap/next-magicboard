"use client";

import { useEffect, useState } from "react";

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'outlined' | 'contained' | 'text';
    value?: string;
    type?: "button" | "submit";
    name?: string;
    onClick?: Function;
    color?: "success" | "error" | "info";
    size?: 'small' | 'big';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = (
    { children, variant = 'outlined', onClick, color = "info", value, type = "button", name, size, disabled = false }
) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!disabled) setLoading(false);
    }, [disabled]);

    function handleClick() {
        setLoading(true);
        if (onClick) onClick();
    }

    const variantStyle =
        variant === "contained"
            ? color === "success"
            ? `border border-success text-background ${disabled && loading ? 'bg-green-700' : 'bg-success hover:bg-green-700'}`
            : color === "error"
            ? `border border-error text-background ${disabled && loading ? 'bg-red-700' : 'bg-error hover:bg-red-700'}`
            : `border border-primary text-background ${disabled && loading ? 'bg-blue-700' : 'bg-primary hover:bg-blue-700'}`
        : variant === "outlined"
            ? color === "success"
            ? `border border-success text-success ${disabled && loading ? 'bg-green-100' : 'hover:bg-green-100'}`
            : color === "error"
            ? `border border-error text-error ${disabled && loading ? 'bg-red-100' : 'hover:bg-red-100'}`
            : `border border-primary text-primary ${disabled && loading ? 'bg-primaryLight' : 'hover:bg-primaryLight'}`
        : color === "success"
        ? `text-success border border-transparent ${disabled && loading ? 'bg-green-700 border-green-700' : 'hover:bg-green-700 hover:border-green-700'}`
        : color === "error"
        ? `text-error border border-transparent ${disabled && loading ? 'border-red-700 bg-red-700' : 'hover:border-red-700 hover:bg-red-700'}`
        : `text-primary border border-transparent ${disabled && loading ? 'bg-primaryLight' : 'hover:bg-primaryLight'}`;

    return (
        <button
        className={`w-full font-bold rounded transition-colors duration-200 text-center
            ${size === "small" ? "py-1 px-2" : "py-2 px-4"}
            ${variantStyle}
            ${disabled ? loading ? 'cursor-wait' : 'cursor-not-allowed' : 'default'}`}
        onClick={() => handleClick()}
        type={type}
        value={value}
        name={name}>
            {children}
        </button>
    );
}