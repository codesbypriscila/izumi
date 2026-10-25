"use client";

import { animate, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type FlipDirection = 1 | -1;

export interface Turn {
  /** Index of the leaf being turned. */
  leaf: number;
  dir: FlipDirection;
}

interface Options {
  leafCount: number;
  /** Full page-turn duration in seconds. */
  duration?: number;
  onSettle?: (current: number) => void;
}

export interface PageFlip {
  /** Number of leaves already turned to the left side. */
  current: number;
  turn: Turn | null;
  /** 0 = leaf lying on the right, 1 = leaf turned to the left. */
  progress: MotionValue<number>;
  canNext: boolean;
  canPrev: boolean;
  next: () => void;
  prev: () => void;
  goTo: (target: number) => void;
  drag: {
    start: (dir: FlipDirection) => boolean;
    move: (progress: number) => void;
    end: (commit: boolean) => void;
  };
}

const TURN_EASE = [0.5, 0.05, 0.2, 1] as const;

/**
 * State machine behind the menu book. A "leaf" is a sheet with a front and a back
 * face; turning leaf `n` forward rotates it from the right side (progress 0) to the
 * left side (progress 1). Supports click/keyboard turns, drag-to-turn and
 * multi-page jumps (riffled as a quick sequence of turns).
 */
export function usePageFlip({ leafCount, duration = 1.15, onSettle }: Options): PageFlip {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);

  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const jobRef = useRef(0);
  const dragDirRef = useRef<FlipDirection | null>(null);
  const onSettleRef = useRef(onSettle);

  useEffect(() => {
    onSettleRef.current = onSettle;
  }, [onSettle]);

  const commit = useCallback((value: number) => {
    currentRef.current = value;
    setCurrent(value);
    setTurn(null);
    onSettleRef.current?.(value);
  }, []);

  /** Animates one leaf turn. Resolves when the leaf has landed. */
  const runTurn = useCallback(
    async (dir: FlipDirection, seconds: number, fromDrag = false) => {
      const c = currentRef.current;
      const leaf = dir === 1 ? c : c - 1;
      const target = dir === 1 ? 1 : 0;
      if (!fromDrag) {
        progress.jump(dir === 1 ? 0 : 1);
        setTurn({ leaf, dir });
      }
      const remaining = Math.abs(target - progress.get());
      await animate(progress, target, {
        duration: reduceMotion ? 0 : Math.max(0.25, seconds * (fromDrag ? remaining + 0.15 : 1)),
        ease: TURN_EASE,
      }).finished;
      commit(c + dir);
    },
    [commit, progress, reduceMotion],
  );

  const step = useCallback(
    (dir: FlipDirection) => {
      const c = currentRef.current;
      if (busyRef.current || (dir === 1 ? c >= leafCount : c <= 0)) return;
      busyRef.current = true;
      jobRef.current++;
      void runTurn(dir, duration).finally(() => {
        busyRef.current = false;
      });
    },
    [duration, leafCount, runTurn],
  );

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(leafCount, target));
      if (busyRef.current || clamped === currentRef.current) return;
      busyRef.current = true;
      const job = ++jobRef.current;
      const distance = Math.abs(clamped - currentRef.current);
      const perTurn = distance === 1 ? duration : Math.max(0.38, duration / (distance * 0.75));

      void (async () => {
        while (currentRef.current !== clamped && job === jobRef.current) {
          await runTurn(clamped > currentRef.current ? 1 : -1, perTurn);
        }
      })().finally(() => {
        busyRef.current = false;
      });
    },
    [duration, leafCount, runTurn],
  );

  const drag = {
    start: (dir: FlipDirection) => {
      const c = currentRef.current;
      if (busyRef.current || (dir === 1 ? c >= leafCount : c <= 0)) return false;
      busyRef.current = true;
      dragDirRef.current = dir;
      progress.jump(dir === 1 ? 0 : 1);
      setTurn({ leaf: dir === 1 ? c : c - 1, dir });
      return true;
    },
    move: (value: number) => {
      progress.set(Math.max(0, Math.min(1, value)));
    },
    end: (shouldCommit: boolean) => {
      const dir = dragDirRef.current;
      if (!dir) return;
      dragDirRef.current = null;
      void (async () => {
        if (shouldCommit) {
          await runTurn(dir, duration * 0.8, true);
        } else {
          await animate(progress, dir === 1 ? 0 : 1, {
            duration: reduceMotion ? 0 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }).finished;
          setTurn(null);
        }
      })().finally(() => {
        busyRef.current = false;
      });
    },
  };

  return {
    current,
    turn,
    progress,
    canNext: current < leafCount,
    canPrev: current > 0,
    next: () => step(1),
    prev: () => step(-1),
    goTo,
    drag,
  };
}
