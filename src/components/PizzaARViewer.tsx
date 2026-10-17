import { useEffect, useRef, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import type { ModelViewerElement } from "@google/model-viewer";
import type { PizzaSizeOption } from "../types/pizza";
import PizzaARFallback from "./PizzaARFallback";

interface PizzaARViewerProps {
  productName: string;
  selectedSize: PizzaSizeOption;
  productImage?: string;
  onAddToCart?: () => void;
  onReturnToMenu?: () => void;
}

const MODEL_PATH = "/ar-models/pizza-12.glb";
const USDZ_PATH = "/ar-models/pizza-12.usdz";

function PizzaARViewer({
  productName,
  selectedSize,
  productImage,
  onAddToCart,
  onReturnToMenu,
}: PizzaARViewerProps) {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [referenceUsdzAvailable, setReferenceUsdzAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [modelError, setModelError] = useState("");
  const supportsAR =
    /Android/i.test(navigator.userAgent) ||
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    let isActive = true;

    const checkAssets = async () => {
      try {
        await import("@google/model-viewer");
        const glbResponse = await fetch(MODEL_PATH, { method: "HEAD" });
        if (!isActive) {
          return;
        }
        setModelAvailable(glbResponse.ok);

        if (glbResponse.ok) {
          try {
            const usdzResponse = await fetch(USDZ_PATH, { method: "HEAD" });
            if (isActive) {
              setReferenceUsdzAvailable(usdzResponse.ok);
            }
          } catch {
            if (isActive) {
              setReferenceUsdzAvailable(false);
            }
          }
        }
      } catch {
        if (isActive) {
          setModelAvailable(false);
          setModelError("Unable to initialize the 3D viewer or check the model asset. Please try again later.");
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    void checkAssets();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    const scale = selectedSize.scaleFactor;
    viewer.scale = `${scale} ${scale} ${scale}`;
  }, [selectedSize]);

  const openAr = async () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.canActivateAR) {
      setModelError("This browser does not support the AR activation API. Use a supported Android or iPhone device to launch AR.");
      return;
    }

    try {
      await viewer.activateAR();
      setModelError("");
    } catch {
      setModelError("AR could not start. Check that this device and browser support the selected AR mode.");
    }
  };

  const resetView = () => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = "0deg 75deg 105%";
      viewer.cameraTarget = "auto";
      viewer.jumpCameraToGoal();
    }
  };

  if (isChecking) {
    return (
      <div className="rounded-4 border bg-light p-4 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 mb-0">Checking AR model availability...</p>
      </div>
    );
  }

  if (!modelAvailable) {
    return (
      <>
        {modelError ? (
          <Alert variant="danger" className="mb-3">
            {modelError}
          </Alert>
        ) : null}
        <PizzaARFallback
          productName={productName}
          selectedSize={selectedSize}
          onAddToCart={onAddToCart}
          onReturnToMenu={onReturnToMenu}
        />
      </>
    );
  }

  return (
    <div className="rounded-4 border border-warning-subtle overflow-hidden">
      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom">
        <span className="fw-semibold">AR preview</span>
        <span className="text-muted small">
          {selectedSize.inches}" / {selectedSize.cm.toFixed(2)} cm
        </span>
      </div>

      <model-viewer
        ref={viewerRef}
        src={MODEL_PATH}
        ios-src={
          referenceUsdzAvailable && selectedSize.inches === 12
            ? USDZ_PATH
            : undefined
        }
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        camera-controls
        shadow-intensity="1"
        exposure="1.1"
        alt={`${productName} pizza preview`}
        poster={productImage}
        style={{
          width: "100%",
          height: "360px",
          display: "block",
          background: "linear-gradient(135deg, #f7f3ef 0%, #efe5dc 100%)",
        }}
        onError={() => setModelError("The 3D model failed to load. Check the AR asset path and the browser's model support.")}
        onLoad={() => setModelError("")}
      />

      {modelError ? (
        <Alert variant="warning" className="m-3 mb-0">
          {modelError}
        </Alert>
      ) : null}

      {!supportsAR ? (
        <Alert variant="info" className="m-3 mb-0">
          Desktop preview is active. Open this page on an Android or iPhone to use WebXR or Quick Look AR.
        </Alert>
      ) : null}

      <div className="d-flex flex-wrap gap-2 p-3">
        <Button type="button" variant="warning" onClick={openAr}>
          Open in AR
        </Button>
        <Button type="button" variant="outline-secondary" onClick={resetView}>
          Reset view
        </Button>
        {onAddToCart ? (
          <Button type="button" variant="dark" onClick={onAddToCart}>
            Add to cart
          </Button>
        ) : null}
        {onReturnToMenu ? (
          <Button type="button" variant="outline-dark" onClick={onReturnToMenu}>
            Return to menu
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default PizzaARViewer;
