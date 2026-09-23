"use client";
import { ShaderMount } from "@paper-design/shaders-react";
import { liquidMetalFragmentShader, LiquidMetalShapes, ShaderFitOptions, defaultObjectSizing, getShaderColorFromString } from "@paper-design/shaders";

/** The hero's liquid-metal cell, mounted on ShaderMount directly rather than through <LiquidMetal>.
 *  <LiquidMetal> runs the package's mask preprocessing (a 512px Poisson solve, 40 iterations) on the
 *  main thread on every page load: about 1.8 s of long tasks on a mid phone. We ran it once instead
 *  (scratch script, see README) and ship the result as `public/codehive-cell.processed.png`
 *  (R = edge gradient, G = opacity, 1024²), so the shader starts with zero main-thread work.
 *  Uniforms mirror the component's, with the Hero B parameters (addendum T7: amber-600 tint, softer,
 *  no blue fringe) so the honey is mostly dark bands and the copy reads. Regenerate the png if the mask changes. */
export default function LiquidCell({ speed }: { speed: number }) {
  return (
    <ShaderMount
      width={720}
      height={720}
      speed={speed}
      frame={0}
      fragmentShader={liquidMetalFragmentShader}
      mipmaps={["u_image"]}
      uniforms={{
        u_colorBack: getShaderColorFromString("rgba(11, 13, 16, 0)"),
        u_colorTint: getShaderColorFromString("#e0a030"),
        u_image: "/codehive-cell.processed.png",
        u_isImage: true,
        u_shape: LiquidMetalShapes.none,
        u_repetition: 2,
        u_softness: 0.3,
        u_shiftRed: 0.1,
        u_shiftBlue: 0,
        u_distortion: 0.06,
        u_contour: 0.3,
        u_angle: 70,
        u_fit: ShaderFitOptions.contain,
        u_scale: 0.9,
        u_rotation: defaultObjectSizing.rotation,
        u_offsetX: defaultObjectSizing.offsetX,
        u_offsetY: defaultObjectSizing.offsetY,
        u_originX: defaultObjectSizing.originX,
        u_originY: defaultObjectSizing.originY,
        u_worldWidth: defaultObjectSizing.worldWidth,
        u_worldHeight: defaultObjectSizing.worldHeight,
      }}
    />
  );
}
