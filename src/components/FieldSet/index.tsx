export const FieldSet = ({
    children,
    direction
}: {
    children: React.ReactNode,
    direction?: "column" | "row"
}) => {
    return (
        <div className={`flex ${direction === 'row' ? 'flex-row sm:space-x-1 sm:space-x-0' : 'flex-col space-y-1 sm:space-y-0'}`}>
            {children}
        </div>
    )
}