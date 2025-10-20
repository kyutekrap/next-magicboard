export const TRow = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="contents bg-background border-b hover:bg-neutral">
            {children}
        </div>
    )
}