export const Drawer = ({
    children,
    drawerOpen
}: {
    children: React.ReactNode,
    drawerOpen: boolean
}) => {
    return (
        <div className={`
        fixed shadow-lg top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform duration-300 
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-background dark:bg-foreground dark:border-r dark:border-neutral
        `}>
            {children}
        </div>
    );
}