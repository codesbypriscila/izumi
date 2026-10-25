"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import type { FlipDirection } from "@/hooks/usePageFlip";

/** Number of hinged strips the page is split into to fake paper bending. */
const SEGMENTS = 3;
/** Maximum bend (degrees) distributed across the strips at mid-turn. */
const MAX_BEND = 34;
/** Strips overlap by this many px so no hairline gaps appear between them. */
const SEAM = 0.75;

interface TurningLeafProps {
  progress: MotionValue<number>;
  dir: FlipDirection;
  /** Rendered page size in px (square). */
  size: number;
  /** Base size the page content is authored at; content is scaled to `size`. */
  base: number;
  front: ReactNode;
  back: ReactNode;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * A page caught mid-turn. The leaf is a chain of SEGMENTS hinged strips: the first
 * rotates around the spine, every next strip adds a little extra rotation so the
 * outer edge leads (or lags) like real paper. Each strip renders the matching slice
 * of the front and back page, with light/shadow driven by its own angle.
 */
export function TurningLeaf({ progress, dir, size, base, front, back }: TurningLeafProps) {
  const strip = size / SEGMENTS;
  const scale = size / base;

  // Base angle of the whole leaf and the bend added by each following strip.
  const bend = useTransform(progress, (p) => Math.sin(p * Math.PI) * MAX_BEND);
  const rootAngle = useTransform(() => -180 * progress.get() + (dir * bend.get()) / 2);
  const stepAngle = useTransform(() => (-dir * bend.get()) / (SEGMENTS - 1));

  const renderStrip = (i: number): ReactNode => (
    <Strip
      key={i}
      index={i}
      strip={strip}
      size={size}
      scale={scale}
      base={base}
      angle={i === 0 ? rootAngle : stepAngle}
      absoluteAngle={rootAngle}
      stepAngle={stepAngle}
      front={front}
      back={back}
      child={i + 1 < SEGMENTS ? renderStrip(i + 1) : null}
    />
  );

  return (
    <motion.div className="preserve-3d pointer-events-none absolute inset-y-0" style={{ left: 0, width: strip, z: 1 }}>
      {renderStrip(0)}
    </motion.div>
  );
}

interface StripProps {
  index: number;
  strip: number;
  size: number;
  scale: number;
  base: number;
  /** Rotation relative to the parent strip. */
  angle: MotionValue<number>;
  absoluteAngle: MotionValue<number>;
  stepAngle: MotionValue<number>;
  front: ReactNode;
  back: ReactNode;
  child: ReactNode;
}

function Strip({ index, strip, size, scale, base, angle, absoluteAngle, stepAngle, front, back, child }: StripProps) {
  // Absolute angle of this strip (0 = flat on the right, −180 = flat on the left).
  const abs = useTransform(() => absoluteAngle.get() + index * stepAngle.get());
  // Lambert-ish shading: faces darken as they turn edge-on to the viewer.
  const frontShade = useTransform(abs, (a) => (1 - Math.max(0, Math.cos(rad(a)))) * 0.55);
  const backShade = useTransform(abs, (a) => (1 - Math.max(0, -Math.cos(rad(a)))) * 0.55);
  const sheen = useTransform(abs, (a) => Math.max(0, Math.sin(rad(-a))) * 0.18);

  const content = (node: ReactNode, offset: number) => (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: base, height: base, transform: `translateX(${-offset}px) scale(${scale})` }}
    >
      {node}
    </div>
  );

  return (
    <motion.div
      className="preserve-3d absolute top-0 h-full origin-left"
      style={{ left: index === 0 ? 0 : strip, width: strip, height: size, rotateY: angle }}
    >
      {/* Front face — slice [index·strip, (index+1)·strip] of the front page */}
      <div className="backface-hidden absolute inset-y-0 overflow-hidden" style={{ left: -SEAM, right: -SEAM }}>
        {content(front, index * strip - SEAM)}
        <motion.div aria-hidden className="absolute inset-0 bg-ink" style={{ opacity: frontShade }} />
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-white/0 via-white/70 to-white/0"
          style={{ opacity: sheen }}
        />
      </div>
      {/* Back face — mirrored slice of the back page */}
      <div
        className="backface-hidden absolute inset-y-0 overflow-hidden"
        style={{ left: -SEAM, right: -SEAM, transform: "rotateY(180deg)" }}
      >
        {content(back, size - (index + 1) * strip - SEAM)}
        <motion.div aria-hidden className="absolute inset-0 bg-ink" style={{ opacity: backShade }} />
      </div>
      {child}
    </motion.div>
  );
}
