export const Header = ({
    children,
    textAlign
}: {
    children: React.ReactNode,
    textAlign?: "center" | "left" | "right"
}) => {
    const textAlignClass = textAlign === "right" ? "text-right" : textAlign === "left" ? "text-left" : "text-center";

    return (
        <div className={`w-full ${textAlignClass}`}>
            <h5 className="text-xl font-semibold leading-tight">
                {children}
            </h5>
        </div>
    );
}