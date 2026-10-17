export type PizzaSizeInches = 8 | 10 | 12 | 14 | 16;

export interface PizzaSizeOption {
  inches: PizzaSizeInches;
  cm: number;
  metres: number;
  scaleFactor: number;
}

export const PIZZA_REFERENCE_DIAMETER_INCHES = 12 as const;

export const PIZZA_SIZE_OPTIONS: PizzaSizeOption[] = [
  { inches: 8, cm: 20.32, metres: 0.2032, scaleFactor: 8 / PIZZA_REFERENCE_DIAMETER_INCHES },
  { inches: 10, cm: 25.4, metres: 0.254, scaleFactor: 10 / PIZZA_REFERENCE_DIAMETER_INCHES },
  { inches: 12, cm: 30.48, metres: 0.3048, scaleFactor: 12 / PIZZA_REFERENCE_DIAMETER_INCHES },
  { inches: 14, cm: 35.56, metres: 0.3556, scaleFactor: 14 / PIZZA_REFERENCE_DIAMETER_INCHES },
  { inches: 16, cm: 40.64, metres: 0.4064, scaleFactor: 16 / PIZZA_REFERENCE_DIAMETER_INCHES },
];

export function getPizzaSizeOptionsForPizza(
  pizzaName?: string,
  pizzaCategory?: string,
): PizzaSizeOption[] {
  const combined = `${pizzaName ?? ""} ${pizzaCategory ?? ""}`.toLowerCase();
  const isPizza = combined.includes("pizza");

  if (!isPizza) {
    return [PIZZA_SIZE_OPTIONS[2]];
  }

  return PIZZA_SIZE_OPTIONS;
}

export function getPizzaSizeOption(size: number): PizzaSizeOption {
  return (
    PIZZA_SIZE_OPTIONS.find((option) => option.inches === size) ??
    PIZZA_SIZE_OPTIONS[2]
  );
}
