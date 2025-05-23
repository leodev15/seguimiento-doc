import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

interface ToastContextProps {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toasts.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`px-6 py-4 rounded-2xl shadow text-white animate-slide-in-right transition-all duration-300 ${type === 'success'
                                ? 'bg-green-500'
                                : type === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                            }`}
                    >
                        {message}
                    </div>
                ))}
            </div>
            {/*<div className="fixed inset-0 z-50 flex justify-center top-4 pointer-events-none">
                <div className="flex flex-col items-center space-y-4">
                    {toasts.map(({ id, message,type }) => (
                        <div
                            key={id}
                            className="relative flex w-full max-w-[460px] items-center rounded-lg border border-red-500 bg-red-500/5 px-5 py-[18px] pointer-events-auto"
                        >
                            <span className="mr-4 flex h-[30px] w-full max-w-[30px] items-center justify-center rounded-full bg-primary">
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.15 3.34999C14.925 3.12499 14.575 3.12499 14.35 3.34999L5.85 11.6L1.65 7.47499C1.425 7.24999 1.075 7.27499 0.850003 7.47499C0.625003 7.69999 0.650003 8.04999 0.850003 8.27499L5.275 12.575C5.425 12.725 5.625 12.8 5.85 12.8C6.075 12.8 6.25 12.725 6.425 12.575L15.15 4.09999C15.375 3.92499 15.375 3.57499 15.15 3.34999Z"
                                        fill="white"
                                    />
                                </svg>
                            </span>
                            <p className="text-base font-semibold text-red-500 sm:text-lg">
                                {message}
                            </p>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
                                className="bg-none absolute right-5 top-1/2 -translate-y-1/2 text-dark-5 hover:text-primary dark:text-dark-6"
                            >
                                <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="fill-current"
                                >
                                    <g clipPath="url(#clip0)">
                                        <path d="M8.8 8L14.9 1.9C15.125 1.675 15.125 1.325 14.9 1.1C14.675 0.875 14.325 0.875 14.1 1.1L8 7.2L1.9 1.1C1.675 0.875 1.325 0.875 1.1 1.1C0.875 1.325 0.875 1.675 1.1 1.9L7.2 8L1.1 14.1C0.875 14.325 0.875 14.675 1.1 14.9C1.2 15 1.35 15.075 1.5 15.075C1.65 15.075 1.8 15.025 1.9 14.9L8 8.8L14.1 14.9C14.2 15 14.35 15.075 14.5 15.075C14.65 15.075 14.8 15.025 14.9 14.9C15.125 14.675 15.125 14.325 14.9 14.1L8.8 8Z" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>*/}

        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de un ToastProvider');
    return context;
};