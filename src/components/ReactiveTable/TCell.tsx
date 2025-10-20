export const TCell = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="p-4 border-b">
            {children}
        </div>
    )
}

TCell.Span = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <span className="whitespace-nowrap overflow-hidden text-ellipsis block">{children}</span>
    );
}