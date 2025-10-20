"use client";

import React, { useState } from 'react';

interface SearchbarProps {
    placeholder?: string;
    value?: string;
    onEnter?: (e: any) => void;
    onChange?: (e: any) => void;
}

export const Searchbar: React.FC<SearchbarProps> = (
    { placeholder, value, onEnter, onChange }
) => {
    const [searchTerm, setSearchTerm] = useState(value ?? "");

    function handleSearchChange(e: any) {
        setSearchTerm(e.target.value);
        if (onChange) onChange(e);
    };

    function handleOnKeyDown(e: any) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (onEnter) onEnter(e);
        }
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e)}
                className="w-full pl-10 pr-4 py-2 border border-neutral rounded"
                placeholder={placeholder}
                onKeyDown={(e) => handleOnKeyDown(e)}
            />
            <span className="absolute left-3 top-2.5">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-darkGray"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M16.5 10.5A6 6 0 1110.5 4.5a6 6 0 016 6z"
                />
                </svg>
            </span>
        </div>
    );
};