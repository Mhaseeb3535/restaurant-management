import type { HTMLAttributes, DetailedHTMLProps } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<ModelViewerElement>,
        ModelViewerElement
      > & {
        src?: string;
        "ios-src"?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "ar-scale"?: string;
        "camera-controls"?: boolean;
        alt?: string;
        poster?: string;
        "shadow-intensity"?: string;
        exposure?: string;
      };
    }
  }
}
