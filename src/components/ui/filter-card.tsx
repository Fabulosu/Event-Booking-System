import React, { useState } from 'react';
import { Button } from './button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from './date-picker';
import { Label } from './label';
import { DateRange } from 'react-day-picker';

interface FilterProps {
    onFilterChange: (filters: { category?: string; date?: DateRange }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();

    const applyFilters = () => {
        onFilterChange({ category: selectedCategory, date: selectedDate });
    };

    return (
        <div className="flex flex-col h-64 mt-20 gap-2 p-2 mx-6 w-80 shadow-lg rounded-lg">
            <h2 className="font-bold text-lg mb-4 text-center">Filter Events</h2>
            <div>
                <Label>Pick a category</Label>
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Pick a date range</Label>
                <DatePickerWithRange onChange={(value) => setSelectedDate(value)} />
            </div>

            <Button onClick={applyFilters} className="bg-[#24AE7C] text-white">Apply Filters</Button>
        </div>
    );
};

export default Filter;