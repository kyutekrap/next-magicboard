export const Paragraph = ({
    children,
    textAlign
}: {
    children: React.ReactNode,
    textAlign?: "center" | "left" | "right"
}) => {
    const textAlignClass = textAlign === "right" ? "text-right" : textAlign === "center" ? "text-center" : "text-left";

    return (
        <p className={`py-2 text-foreground dark:text-background ${textAlignClass}`}>
            {children}
        </p>
    )
}