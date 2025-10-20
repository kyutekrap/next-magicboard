export const Paper = ({
    children
}: {
    children: React.ReactNode
}) => (
    <div className="w-full bg-background text-foreground dark:bg-foreground dark:text-background dark:border dark:border-neutral shadow-md rounded-lg">
        {children}
    </div>
);