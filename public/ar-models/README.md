# Preparing the pizza AR models

The viewer expects a real, centered 12-inch pizza model at `pizza-12.glb`.
An optional `pizza-12.usdz` file enables the iPhone Quick Look path directly.
Do not rename a regular photo to either extension; these files must be exported
3D assets.

## Prepare a top-down photo

1. Use a sharp, evenly lit photo taken directly above the pizza, with the whole
   crust visible and no perspective angle.
2. Keep the pizza centered in the frame. A plain, contrasting background makes
   it easier to remove the background and avoid a visible rectangular edge.
3. Crop to a square image and remove the background to transparency where
   possible. Save a high-resolution PNG (or another image format supported by
   Blender) for the texture.
4. Avoid baked-in shadows around the edge if the model will also cast a real
   AR shadow.

## Make `pizza-12.glb` in Blender

1. Create a circle mesh and fill it as a flat disk. Add a small thickness/beveled
   crust if desired; keep the top surface flat so the photo texture remains
   legible.
2. Set Blender's scene units to Metric. Make the disk's outside diameter exactly
   `0.3048 m` (12 inches), with its geometric center at world `X=0`, `Y=0`.
   Place its bottom at `Z=0` and apply object scale before export.
3. Unwrap the top face to a square UV area, then create a material and connect
   the top-down image to its Base Color. Pack the image into the Blender file.
   Keep a simple material and avoid unsupported shader nodes.
4. Export the selected pizza mesh as glTF 2.0 Binary (`.glb`). Enable image
   embedding and include the material and texture. Save it here as
   `public/ar-models/pizza-12.glb`.
5. Reopen the exported GLB in a clean Blender file (or a GLB viewer) and check
   the texture, orientation, origin, and dimensions. Confirm the measured
   outside diameter is `0.3048 m`; the model must not merely look the right
   size.

The web viewer multiplies the reference model's scale uniformly by
`selectedDiameterInches / 12`. For the displayed diameters to be physically
meaningful, the base GLB itself must really be 12 inches across. AR uses fixed
model scale so users cannot accidentally resize the pizza after placement.

## Create the optional iPhone USDZ

Convert the verified GLB to USDZ with Apple's Reality Converter or Reality
Composer Pro on macOS. Preserve the material/texture, centered origin, and
0.3048 m reference diameter; inspect the converted asset in Quick Look before
publishing it as `public/ar-models/pizza-12.usdz`. This provided USDZ is used
for the 12-inch selection only. For other sizes the viewer relies on its GLB
conversion path; test each selected size on an iPhone. If Quick Look does not
preserve the selected scale for your target device/browser, create one USDZ per
size with its actual diameter and select the matching asset in the viewer
instead. Never use the 12-inch USDZ for other fixed-size selections.

USDZ is an optional iPhone companion; the GLB is required for the web preview
and Android model-viewer flow.

## Verify the assets

After adding the files, start the Vite app and open a pizza's AR page. The page
should load the GLB preview; on a supported Android browser, use WebXR or Scene
Viewer, and on iPhone Safari use Quick Look. If either model file is replaced,
reload the page to recheck it. Test actual placement and scale on physical
devices; desktop preview does not validate AR.

Real-world size accuracy still depends on the model export, AR tracking,
calibration, lighting, device/browser support, and horizontal-surface detection.
