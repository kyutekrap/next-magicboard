const IconButton = ({
    children,
    onClick,
    onEvent,
    size,
    disabled
}: {
    children: React.ReactNode,
    onClick?: () => void,
    onEvent?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    size?: "normal" | "small",
    disabled?: boolean
}) => {

    function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
        if (onClick) onClick();
        if (onEvent) onEvent(e);
    }

    return (
        <div className="w-10 h-10 flex items-center justify-center">
            <button
            onClick={(e) => disabled ? {} : clickHandler(e)}
            className={`flex items-center justify-center ${size === "small" ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-transparent ${disabled ? "cursor-not-allowed" : "hover:bg-hoverTint dark:hover:bg-hoverTintDark cursor-pointer"} focus:outline-none transition duration-200`}
            >
                {children}
            </button>
        </div>
    );
}

export default IconButton;