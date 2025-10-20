import React from "react";

export const LoadingList: React.FC<{ itemCount?: number }> = ({ itemCount = 5 }) => {
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: itemCount }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 animate-pulse">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-hoverTint rounded w-3/4"></div>
                        <div className="h-4 bg-hoverTint rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};