"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface Header {
    value: string;
    ref: React.RefObject<HTMLDivElement>;
    label: string;
}

export const ReactiveTable: React.FC<{ 
    headers: string[]; 
    children: React.ReactNode;
    onSort: (key: string, direction: 'asc' | 'desc') => void;
    hasBulk: boolean;
    handleCheckAll: Function;
    currentPage: number;
    defaultKey: string;
    defaultSorting: 'asc' | 'desc';
}> = ({ 
    headers, 
    children, 
    onSort, 
    hasBulk,
    handleCheckAll,
    currentPage,
    defaultKey,
    defaultSorting
}) => {
    const tableElement = useRef<HTMLDivElement | null>(null);
    const [columns, setColumns] = useState<Header[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [columnWidths, setColumnWidths] = useState<string[]>([]);
    const [filterCol, setFilterCol] = useState(defaultKey);
    const [sorting, setSorting] = useState<'asc' | 'desc'>(defaultSorting);
    const [checked, setChecked] = useState<Record<number, boolean>>();

    function handleCheckChange(c: boolean) {
        handleCheckAll(c);
        setChecked({...checked, [currentPage]: c});
    }

    useEffect(() => {
        if (columns.length !== headers.length) {
            const dividedWidth = Math.round(window.innerWidth / headers.length);
            const actualWidth = dividedWidth < 150 ? 150 : dividedWidth;
            if (hasBulk) setColumnWidths(['50px', ...Array(headers.length).fill(`${actualWidth}px`)]);
            else setColumnWidths(Array(headers.length).fill(`${actualWidth}px`));
        }

        setColumns(headers.map((header) => ({
            value: header,
            ref: React.createRef<HTMLDivElement>(),
            label: header
        })));
    }, [headers]);

    const mouseDown = (index: number) => {
        setActiveIndex(index);
    };

    const mouseMove = useCallback(
        (e: MouseEvent) => {
            if (activeIndex !== null && columns[activeIndex].ref.current) {
                const newWidth = e.clientX - columns[activeIndex].ref.current.getBoundingClientRect().left;
                setColumnWidths((prevWidths) => 
                    prevWidths.map((width, i) => (i === activeIndex ? `${Math.max(newWidth, 50)}px` : width))
                );
            }
        },
        [activeIndex, columns]
    );

    const mouseUp = () => {
        setActiveIndex(null);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
    };

    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
        };
    }, [activeIndex, mouseMove]);

    function handleSorting(key: string) {
        let newSorting: 'asc' | 'desc' = 'desc';
        if (filterCol !== key) {
            setFilterCol(key);
        } else {
            newSorting = sorting === 'asc' ? 'desc' : 'asc';
        }
        setSorting(newSorting);
        onSort(key, newSorting);
    }

    return (
        <div className="overflow-hidden">
            <div
            ref={tableElement}
            className="grid w-full overflow-x-auto"
            style={{
                gridTemplateColumns: columnWidths.join(" "),
            }}
            >
                <div className="contents border-b border-neutral bg-background">
                    {columns.map((c, i) => (
                        <>
                        { i === 0 && hasBulk && (
                            <div className="p-4 border-b flex items-center">
                                <input checked={checked?.[currentPage] ?? false} type="checkbox" onChange={(e) => handleCheckChange(e.target.checked)} />
                            </div>
                        ) }
                        <div ref={c.ref} key={i} className="relative text-left p-4 border-b flex items-center space-x-2">
                            <a
                            className={`cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis block ${filterCol === c.value ? "text-primary font-semibold" : "text-foreground dark:text-background"}`}
                            onClick={() => handleSorting(c.value)}>
                                {c.label}
                            </a>
                            { filterCol === c.value && (
                                sorting === "asc" ? (
                                    <img src='/icons/arrow-up.svg' width="18px" height="18px" className='dark:invert' />
                                ) : (
                                    <img src='/icons/arrow-down.svg' width="18px" height="18px" className='dark:invert' />
                                )
                            ) }
                            <div
                            onMouseDown={() => mouseDown(i)}
                            className="absolute right-0 top-0 h-full w-[7px] cursor-col-resize z-10"
                            />
                        </div>
                        </>
                    ))}
                </div>
                <div className="contents">
                    {children}
                </div>
            </div>
        </div>
    );
};
