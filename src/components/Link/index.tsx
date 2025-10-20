export const Link = ({
    type,
    id,
    item,
    value
}: {
    type?: "primary" | "secondary",
    id: string,
    item?: string,
    value: string
}) => {
    function customFunction() {
        window.location.href = `?id=${id}&item=${item}`;
    }

    return (
        <a className={`underline cursor-pointer ${type === "secondary" ? 'text-inherit' : 'text-primary'}`}
        onClick={() => customFunction()}>
            {value}
        </a>
    );
}