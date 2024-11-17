"use client";
import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from './badge';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface FilterProps {
    onFilterChange: (filters: { category?: string; date?: DateRange }) => void;
}

const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'tech', label: 'Tech' },
    { value: 'arts', label: 'Arts' },
];

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        const category = searchParams.get('category');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        if (category) {
            setSelectedCategory(category);
            setActiveFilters(prev => [...prev, 'category']);
        }

        if (dateFrom && dateTo) {
            setSelectedDate({
                from: new Date(dateFrom),
                to: new Date(dateTo)
            });
            setActiveFilters(prev => [...prev, 'date']);
        }
    }, [searchParams]);

    const applyFilters = () => {
        const newFilters: string[] = [];
        if (selectedCategory) newFilters.push('category');
        if (selectedDate) newFilters.push('date');
        setActiveFilters(newFilters);
        onFilterChange({ category: selectedCategory, date: selectedDate });
    };

    const clearFilter = (filterType: 'category' | 'date') => {
        if (filterType === 'category') {
            setSelectedCategory('');
        } else {
            setSelectedDate(undefined);
        }
        setActiveFilters(prev => prev.filter(f => f !== filterType));
        onFilterChange({
            category: filterType === 'category' ? '' : selectedCategory,
            date: filterType === 'date' ? undefined : selectedDate
        });
    };

    const clearAllFilters = () => {
        setSelectedCategory('');
        setSelectedDate(undefined);
        setActiveFilters([]);
        onFilterChange({ category: '', date: undefined });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="sticky top-24">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Filters</CardTitle>
                        {activeFilters.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {activeFilters.includes('category') && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    {categories.find(c => c.value === selectedCategory)?.label}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => clearFilter('category')}
                                    />
                                </Badge>
                            )}
                            {activeFilters.includes('date') && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Date Range
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => clearFilter('date')}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <DatePickerWithRange
                            onChange={(value) => setSelectedDate(value)}
                        />
                    </div>

                    <Button
                        onClick={applyFilters}
                        className="w-full bg-[#24AE7C] hover:bg-[#329c75] text-white"
                    >
                        Apply Filters
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Filter;