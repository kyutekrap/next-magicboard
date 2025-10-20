"use client";

export const ExternalLink = ({
    children,
    href,
    type,
}: {
    children: React.ReactNode,
    href?: string,
    type?: "primary" | "secondary",
}) => {
    function customFunction() {
        if (href) window.open(href, "_blank");
    }

    return (
        <a className={`${href && 'underline'} cursor-pointer ${type === "secondary" ? 'text-inherit' : 'text-primary'}`}
        onClick={() => customFunction()}>
            {children}
        </a>
    );
}