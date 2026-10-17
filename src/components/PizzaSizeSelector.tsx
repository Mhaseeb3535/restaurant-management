import { Button } from "react-bootstrap";
import type { PizzaSizeOption } from "../types/pizza";

interface PizzaSizeSelectorProps {
  options: PizzaSizeOption[];
  selectedSize: PizzaSizeOption;
  onChange: (size: PizzaSizeOption) => void;
}

function PizzaSizeSelector({
  options,
  selectedSize,
  onChange,
}: PizzaSizeSelectorProps) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.inches === selectedSize.inches;

        return (
          <Button
            key={option.inches}
            type="button"
            variant={isSelected ? "warning" : "outline-secondary"}
            className="rounded-pill px-3 py-2 fw-semibold"
            aria-pressed={isSelected}
            onClick={() => onChange(option)}
          >
            {option.inches}" · {option.cm.toFixed(2)} cm
          </Button>
        );
      })}
    </div>
  );
}

export default PizzaSizeSelector;
