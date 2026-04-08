export default function LoadingSpinner() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-5 border-gray-300 border-t-blue-700" />
        </div>
    );
}

