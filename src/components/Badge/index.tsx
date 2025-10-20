export const Badge = ({ badgeContent, children }: {
    badgeContent: number,
    children: React.ReactNode
}) => {
    return (
        <div className="relative inline-block">
            {children}
            { badgeContent > 0 && (
                <span className={`absolute -top-0 -right-0 text-background text-xs w-5 h-5 rounded-full flex items-center justify-center bg-primary`}>
                    {badgeContent > 9 ? `9+` : badgeContent}
                </span>
            )}
        </div>
    );
};