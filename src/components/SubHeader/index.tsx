export const SubHeader = ({
    children,
    textAlign
}: {
    children: React.ReactNode,
    textAlign?: "center" | "left" | "right"
}) => {
    const textAlignClass = textAlign === "right" ? "text-right" : textAlign === "left" ? "text-left" : "text-center";

    return (
        <div className={`w-full ${textAlignClass}`}>
            <p className="font-semibold leading-tight">
                {children}
            </p>
        </div>
    );
}