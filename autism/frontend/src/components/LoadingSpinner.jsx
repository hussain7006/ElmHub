import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className="relative">
                <div className={`${sizeClasses[size]} animate-spin`}>
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
            {text && (
                <p className="text-sm font-medium text-gray-600 text-center">
                    {text}
                </p>
            )}
        </div>
    );
};


const MultiRingLoadingSpinner = ({ text = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className="relative">
                <div className="h-12 w-12 animate-spin">
                    <div className="absolute inset-0 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-1 border-3 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-2 border-3 border-transparent border-t-blue-300 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
            </div>
            {text && (
                <p className="text-sm font-medium text-gray-600 text-center">
                    {text}
                </p>
            )}
        </div>
    );
};


const DotsLoadingSpinner = ({ text = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            {text && (
                <p className="text-sm font-medium text-gray-600 text-center">
                    {text}
                </p>
            )}
        </div>
    );
};


export { LoadingSpinner, MultiRingLoadingSpinner, DotsLoadingSpinner };
