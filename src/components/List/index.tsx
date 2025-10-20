const List = ({
    children
}: {
    children: React.ReactNode
}) => (
    <ul>{children}</ul>
);

List.Title = ({
    children
}: {
    children: React.ReactNode
}) => (
    <div className="py-3 px-2">
        <span className="text-md font-semibold">{children}</span>
    </div>
);

List.Item = ({
    children
}: {
    children: React.ReactNode
}) => (
    <li className="p-2 rounded flex flex-row space-x-2 items-center hover:bg-neutralLight dark:hover:bg-transparent border border-transparent dark:hover:border dark:hover:border-neutralLight hover:text-primary cursor-pointer transition duration-300 ease-in-out">
        {children}
    </li>
);

List.ItemText = ({
    children,
    onClick
}: {
    children: React.ReactNode,
    onClick: () => void;
}) => (
    <span className="flex flex-row space-x-2 items-center" onClick={onClick}>
        {children}
    </span>
)

export default List;