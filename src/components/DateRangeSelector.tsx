'use client';
import { Calendar, ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';

type FooterButtonsProps = {
    onClear: () => void;
    onApply: () => void;
}

const FooterButtons = ({ onClear, onApply }: FooterButtonsProps) => {
    return (
        <div className="flex gap-2 pt-2">
            <button
                onClick={onClear}
                className="flex-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
                Clear
            </button>
            <button
                onClick={onApply}
                className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Apply
            </button>
        </div>
    )
}

const DateRangeSelector = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const clearDates = useCallback(() => {
        setStartDate('');
        setEndDate('');
        setIsOpen(false);
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDisplayText = () => {
        if (!startDate && !endDate) return 'Select date range';
        if (startDate && !endDate) return `${formatDate(startDate)} - End date`;
        if (!startDate && endDate) return `Start date - ${formatDate(endDate)}`;
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full min-w-64 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={startDate || endDate ? 'text-gray-900' : 'text-gray-500'}>
                        {getDisplayText()}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || undefined}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <FooterButtons
                            onClear={clearDates}
                            onApply={() => {
                                setIsOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateRangeSelector;