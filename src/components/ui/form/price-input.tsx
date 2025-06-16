import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

interface PriceInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function PriceInput({
  control,
  name,
  label,
  placeholder = "R$ 0,00",
}: PriceInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <NumericFormat
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              customInput={Input}
              placeholder={placeholder}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
