import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { isValidPhoneNumber } from "react-phone-number-input";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      // Force Australia as the only country option
      const defaultCountry = "AU";
      
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          // Force country to be Australia only
          country={defaultCountry}
          // Prevent country from being changed
          countries={["AU"]}
          // Disable international format
          international={false}
          defaultCountry={defaultCountry}
          /**
           * Handles the onChange event.
           *
           * This validates that the number is an Australian number.
           * If it's not a valid Australian number, we clear the input
           * which will prevent form submission.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value: RPNInput.Value) => {
            // Handle case where user enters "61..." without the + sign
            if (value && typeof value === 'string' && value.match(/^61\d+$/) && !value.startsWith('+')) {
              const correctedValue = '+' + value as RPNInput.Value;
              onChange?.(correctedValue);
              return;
            }
            
            // Check if valid Australian number
            const isAustralianNumber = value ? 
              isValidPhoneNumber(value) && value.startsWith('+61') : 
              false;
            
            // Only pass the value through if it's a valid Australian number
            if (isAustralianNumber || value === undefined) {
              onChange?.(value);
            } else {
              // For invalid non-Australian numbers, clear the field
              // Use empty string for the UI and let the component handle conversion
              onChange?.('' as RPNInput.Value);
            }
          }}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-e-lg rounded-s-none bg-transparent border border-stone-500", className)}
      {...props}
      ref={ref}
    />
  ),
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
  options,
}: CountrySelectProps) => {
  // Filter options to only include Australia
  const filteredOptions = options.filter(option => option.value === 'AU');
  
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      // Force country to always be Australia
      onChange('AU' as RPNInput.Country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-e-none rounded-s-lg px-3 border border-stone-500 bg-transparent")}
          // Disable button to prevent country selection
          disabled={true}
        >
          <FlagComponent country={'AU' as RPNInput.Country} countryName={'Australia'} />
          {/* Hide dropdown icon since we're disabling country selection */}
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50 hidden"
            )}
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
                {filteredOptions
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
                          option.value === value ? "opacity-100" : "opacity-0",
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

const FlagComponent = (_props: RPNInput.FlagProps) => {
  // Use Australia flag regardless of passed props
  const Flag = flags['AU'];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={'Australia'} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };