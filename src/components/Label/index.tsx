export const Label = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <span className="flex-1 py-1 text-sm font-medium">
            {children}
        </span>
    );
}