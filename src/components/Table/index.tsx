export interface TableProps {
    header: any[];
    data: Record<string, any>;
}

export const Table: React.FC<TableProps> = (
    { header, data }
) => (
    <table className="w-full table-fixed table-auto border-collapse border border-neutralDark">
        <thead>
            <tr className="bg-neutral dark:bg-transparent">
                {
                    header.map(h => (
                        <th className="border border-neutralDark px-4 py-2 text-left">{h}</th>
                    ))
                }
            </tr>
        </thead>
        <tbody>
            { data.map((d: Record<string, any>, i: number) => (
                <tr key={i} className="hover:bg-neutralLight dark:hover:bg-transparent">
                    {
                        header.map((h: any, j: number) => (
                            <td key={j} className="border border-neutralDark px-4 py-2">{d[h]}</td>
                        ))
                    }
                </tr>
            )) }
        </tbody>
    </table>
);

export default Table;