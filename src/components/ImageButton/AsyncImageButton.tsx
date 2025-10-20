"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageButtonProps } from "./ImageButtonProps";

interface AsyncImageButtonProps extends ImageButtonProps {
    onClick: () => Promise<void>;
}

export const AsyncImageButton: React.FC<AsyncImageButtonProps> = ({
    children,
    onClick,
    shadow
}) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const original = useRef(false);

    async function handleClick() {
        original.current = true;
        if (isDisabled) return;
        setIsDisabled(true);
        setIsRunning(!isRunning);
    }

    useEffect(() => {
        if (original.current === false) return;
        onClick().then(_ => setIsDisabled(false));
    }, [isRunning]);

    return (
        <div onClick={handleClick} className={`cursor-pointer flex items-center justify-center rounded-full bg-transparent focus:outline-none transition duration-200 ${shadow ? 'hover:bg-neutral w-10 h-10' : ''}`}>
            {children}
        </div>
    );
}