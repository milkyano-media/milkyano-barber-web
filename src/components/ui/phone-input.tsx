import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange" | "value"> & {
    onChange?: (value: RPNInput.Value) => void;
    value?: RPNInput.Value;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          // Default to Australia but allow changes
          defaultCountry="AU"
          // Use national format to allow full editing of the number
          international={false}
          // Pass the value directly
          value={value}
          /**
           * Handles the onChange event.
           * 
           * UX considerations:
           * - With international={false}, users can type/delete freely
           * - Backspace works naturally through the entire number
           * - Copy/paste of +61... numbers will be parsed correctly
           * - Copy/paste of 04... numbers work as expected
           * - The library handles number formatting based on selected country
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value: RPNInput.Value) => {
            onChange?.(value);
          }}
          placeholder="+61 4XX XXX XXX"
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const value = input.value;
      const cursorPos = input.selectionStart || 0;
      
      // Handle backspace on "+61" to become "+6"
      if (e.key === 'Backspace' && value === '+61' && cursorPos === 3) {
        e.preventDefault();
        // Manually set the value to "+6"
        input.value = '+6';
        // Trigger change event
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        // Set cursor position
        setTimeout(() => {
          input.setSelectionRange(2, 2);
        }, 0);
      }
      
      // Call original onKeyDown if exists
      onKeyDown?.(e);
    };
    
    return (
      <Input
        className={cn("rounded-e-md rounded-s-none h-10", className)}
        {...props}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        ref={ref}
      />
    );
  }
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "flex gap-1 rounded-e-none rounded-s-md px-3 h-10 border border-stone-600 bg-stone-950/50 hover:bg-stone-900/70 hover:border-stone-500 transition-colors"
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn("-mr-2 h-4 w-4 opacity-50", disabled && "hidden")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country] || flags["AU"];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
