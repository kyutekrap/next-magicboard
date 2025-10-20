export const CircularProgress = () => (
    <div className="flex items-center justify-center w-full" role="status">
        <div className="animate-spin">
            <svg
            className="w-16 h-16 text-primary"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            >
                <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray="100, 200"
                strokeDashoffset="0"
                />
            </svg>
        </div>
    </div>
);