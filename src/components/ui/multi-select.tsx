
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  value: OptionType[];
  onChange: (value: OptionType[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: OptionType) => {
    const selected = value.find((item) => item.value === option.value);
    
    if (selected) {
      onChange(value.filter((item) => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option: OptionType) => {
    onChange(value.filter((item) => item.value !== option.value));
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className={cn(
            'w-full border border-input rounded-md min-h-10',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {value.length === 0 ? (
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal text-muted-foreground"
              disabled={disabled}
            >
              {placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          ) : (
            <div className="flex flex-wrap gap-1 p-1">
              {value.map((item) => (
                <Badge 
                  key={item.value} 
                  variant="secondary"
                  className="flex items-center gap-1 px-2"
                >
                  {item.label}
                  <button
                    type="button"
                    className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                className="h-8 px-2"
                onClick={() => setOpen(!open)}
                disabled={disabled}
              >
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = value.some(item => item.value === option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
