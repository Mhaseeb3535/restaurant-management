import { Alert, Button } from "react-bootstrap";
import type { PizzaSizeOption } from "../types/pizza";

interface PizzaARFallbackProps {
  productName: string;
  selectedSize: PizzaSizeOption;
  onAddToCart?: () => void;
  onReturnToMenu?: () => void;
}

function PizzaARFallback({
  productName,
  selectedSize,
  onAddToCart,
  onReturnToMenu,
}: PizzaARFallbackProps) {
  return (
    <div className="rounded-4 border border-warning-subtle bg-light p-4">
      <Alert variant="warning" className="mb-3">
        AR model not yet available for this pizza.
      </Alert>

      <p className="mb-2 fw-semibold">{productName} — {selectedSize.inches}"</p>
      <p className="text-muted mb-3">
        The AR flow is ready, but the 3D model assets are not in the public folder yet.
        Place the pizza model at <code>/public/ar-models/pizza-12.glb</code> and the Quick
        Look asset at <code>/public/ar-models/pizza-12.usdz</code> to enable device AR.
      </p>

      <ol className="text-muted mb-4 ps-3">
        <li>Use a top-down pizza photo as the texture source.</li>
        <li>Create a flat circular mesh with the pizza image mapped to it.</li>
        <li>Export the finished model as a GLB and keep the origin centered.</li>
        <li>Convert the same model to USDZ for iPhone Quick Look support.</li>
      </ol>

      <div className="d-flex flex-wrap gap-2">
        {onAddToCart ? (
          <Button type="button" variant="warning" onClick={onAddToCart}>
            Add {selectedSize.inches}" pizza to cart
          </Button>
        ) : null}
        {onReturnToMenu ? (
          <Button type="button" variant="outline-secondary" onClick={onReturnToMenu}>
            Return to menu
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default PizzaARFallback;
