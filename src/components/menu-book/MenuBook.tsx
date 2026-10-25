"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { bookPages, chapterPageIndex } from "@/data/menu";
import { useElementWidth } from "@/hooks/useElementWidth";
import { usePageFlip, type FlipDirection } from "@/hooks/usePageFlip";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { MenuChapterId } from "@/types/menu";
import { BookControls } from "./BookControls";
import { ChapterTabs } from "./ChapterTabs";
import { BookContext, PAGE_BASE, type BookActions } from "./pages/BookContext";
import { BlankPage, BookPageView } from "./pages/BookPageView";
import { TurningLeaf } from "./TurningLeaf";

/** Below this stage width the book shows one page at a time. */
const SPREAD_MIN_WIDTH = 860;
const TOTAL_PAGES = bookPages.length;

interface Leaf {
  front: number | null;
  back: number | null;
}

/** Desktop: leaf n = pages (2n, 2n+1). Mobile: every page is its own leaf. */
function buildLeaves(compact: boolean): Leaf[] {
  if (compact) return bookPages.map((_, i) => ({ front: i, back: null }));
  return Array.from({ length: Math.ceil(TOTAL_PAGES / 2) }, (_, n) => ({
    front: 2 * n,
    back: 2 * n + 1 < TOTAL_PAGES ? 2 * n + 1 : null,
  }));
}

export function MenuBook() {
  const measureRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(measureRef);
  const compact = width > 0 && width < SPREAD_MIN_WIDTH;

  return (
    <div ref={measureRef} className="flex w-full flex-col items-center gap-10 sm:gap-12">
      {width > 0 ? (
        <Book key={compact ? "single" : "spread"} compact={compact} width={width} />
      ) : (
        <div className="aspect-[2/1] w-full max-w-[1040px]" />
      )}
    </div>
  );
}

interface PointerState {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastT: number;
  vx: number;
  side: "left" | "right";
  dir: FlipDirection | null;
  dragging: boolean;
}

function Book({ compact, width }: { compact: boolean; width: number }) {
  const base = compact ? PAGE_BASE.compact : PAGE_BASE.regular;
  const size = compact ? Math.min(width - 8, 440) : Math.min(520, Math.floor((width - 48) / 2));
  const leaves = useMemo(() => buildLeaves(compact), [compact]);
  // On a single-page book the back cover is the last page shown, so it never turns.
  const turnable = compact ? leaves.length - 1 : leaves.length;
  const flip = usePageFlip({ leafCount: turnable });
  const scrollTo = useScrollTo();
  const { dict } = useI18n();

  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState | null>(null);
  const interacted = useRef(false);

  // ---- Which page is on screen ------------------------------------------------
  const visiblePage = compact ? flip.current : Math.min(TOTAL_PAGES - 1, flip.current * 2);
  const visibleContent = bookPages[visiblePage]?.content;
  const activeChapter =
    visibleContent && (visibleContent.kind === "chapter" || visibleContent.kind === "items")
      ? visibleContent.chapter.id
      : (() => {
          const prev = bookPages[visiblePage - 1]?.content;
          return !compact && prev?.kind === "chapter" ? prev.chapter.id : null;
        })();

  const counter = (() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const last = turnable;
    if (flip.current === 0) return `${dict.book.cover}  /  ${TOTAL_PAGES}`;
    if (flip.current === last) return `${dict.book.back}  /  ${TOTAL_PAGES}`;
    if (compact) return `${pad(flip.current)}  /  ${TOTAL_PAGES}`;
    return `${pad(flip.current * 2 - 1)} — ${pad(flip.current * 2)}  /  ${TOTAL_PAGES}`;
  })();

  // ---- Navigation ------------------------------------------------------------
  const goToChapter = useCallback(
    (id: MenuChapterId) => {
      interacted.current = true;
      const pageIndex = chapterPageIndex[id];
      flip.goTo(compact ? pageIndex : (pageIndex + 1) / 2);
    },
    [compact, flip],
  );

  const actions = useMemo<BookActions>(
    () => ({ compact, goToChapter, reserve: () => scrollTo("contact") }),
    [compact, goToChapter, scrollTo],
  );

  const next = () => {
    interacted.current = true;
    flip.next();
  };
  const prev = () => {
    interacted.current = true;
    flip.prev();
  };

  // ---- Closed book sits centred; open book is centred on its spine -----------
  const bookX = useMotionValue(0);
  const closedOffset = compact ? 0 : -size / 2;
  const settled = flip.turn ? flip.current + flip.turn.dir : flip.current;
  const centredX = settled === 0 ? closedOffset : settled === turnable ? -closedOffset : 0;
  const placed = useRef(false);
  useEffect(() => {
    const controls = animate(bookX, centredX, { duration: placed.current ? 1 : 0, ease: easeExpo });
    placed.current = true;
    return () => controls.stop();
  }, [bookX, centredX]);

  // ---- Entrance: book tilts up as it scrolls in, then opens itself -----------
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "center center"] });
  const tilt = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const inView = useInView(stageRef, { amount: 0.6, once: true });
  const flipRef = useRef(flip);
  useEffect(() => {
    flipRef.current = flip;
  });
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => {
      if (!interacted.current && flipRef.current.current === 0) flipRef.current.next();
    }, 700);
    return () => window.clearTimeout(t);
  }, [inView]);

  // ---- Pointer: click to turn, drag to bend the page -------------------------
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-no-flip]")) return;
    const rect = bookRef.current?.getBoundingClientRect();
    const spineX = rect ? (compact ? rect.left + rect.width / 2 : rect.left + size) : e.clientX;
    pointer.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastT: e.timeStamp,
      vx: 0,
      side: e.clientX >= spineX ? "right" : "left",
      dir: null,
      dragging: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;

    if (!p.dragging) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      const dir: FlipDirection = compact ? (dx < 0 ? 1 : -1) : p.side === "right" ? 1 : -1;
      if ((dir === 1 && dx > 0) || (dir === -1 && dx < 0) || !flip.drag.start(dir)) {
        pointer.current = null;
        return;
      }
      interacted.current = true;
      p.dir = dir;
      p.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const dt = Math.max(1, e.timeStamp - p.lastT);
    p.vx = 0.8 * ((e.clientX - p.lastX) / dt) + 0.2 * p.vx;
    p.lastX = e.clientX;
    p.lastT = e.timeStamp;

    const travel = compact ? size * 1.1 : size * 1.6;
    flip.drag.move(p.dir === 1 ? -dx / travel : 1 - dx / travel);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p || p.id !== e.pointerId) return;

    if (p.dragging && p.dir) {
      const progress = flip.progress.get();
      const shouldCommit = p.dir === 1 ? progress > 0.35 || p.vx < -0.45 : progress < 0.65 || p.vx > 0.45;
      flip.drag.end(shouldCommit);
      return;
    }
    // Plain click / tap
    if (Math.abs(e.clientX - p.startX) > 8) return;
    if (flip.current === 0) return next();
    if (flip.current === turnable) return prev();
    if (p.side === "right") next();
    else prev();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // ---- What lies where --------------------------------------------------------
  const { turn, current } = flip;
  const leftLeaf = turn ? (turn.dir === 1 ? current - 1 : current - 2) : current - 1;
  const rightLeaf = turn ? (turn.dir === 1 ? current + 1 : current) : current;
  const turning = turn ? leaves[turn.leaf] : undefined;

  const page = (index: number | null | undefined): ReactNode =>
    index === null || index === undefined ? <BlankPage /> : <BookPageView page={bookPages[index]!} />;

  const scaled = (node: ReactNode) => (
    <div className="absolute left-0 top-0 origin-top-left" style={{ width: base, height: base, transform: `scale(${size / base})` }}>
      {node}
    </div>
  );

  const leftCount = Math.max(0, leftLeaf + 1);
  const rightCount = Math.max(0, leaves.length - rightLeaf);

  // Shadows the turning leaf casts on the pages beneath it.
  const edge = useTransform(flip.progress, (p) => Math.cos(p * Math.PI));
  const castOpacity = useTransform(flip.progress, (p) => Math.sin(p * Math.PI) * 0.7);
  const rightCastLeft = useTransform(edge, (e) => `${Math.max(0, e) * 100}%`);
  const leftCastRight = useTransform(edge, (e) => `${Math.max(0, -e) * 100}%`);

  const bookWidth = compact ? size : size * 2;
  const spineLeft = compact ? 0 : size;

  return (
    <BookContext.Provider value={actions}>
      <ChapterTabs active={activeChapter} onSelect={goToChapter} />

      <div
        ref={stageRef}
        className="relative flex w-full justify-center"
        style={{ perspective: compact ? 1600 : 2600, height: size + 60 }}
      >
        {/* Floor shadow */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-16 -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl"
          style={{ width: bookWidth * 0.85 }}
        />

        <motion.div
          className="preserve-3d relative"
          style={{ width: bookWidth, height: size, rotateX: tilt, y: lift, transformOrigin: "50% 100%" }}
        >
          <motion.div
            ref={bookRef}
            role="region"
            aria-roledescription="book"
            aria-label={dict.book.aria}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={cn(
              "preserve-3d group/book absolute inset-0 cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing",
              "focus-visible:ring-2 focus-visible:ring-red-glow/70 focus-visible:ring-offset-8 focus-visible:ring-offset-ink",
            )}
            style={{ x: bookX }}
          >
            {/* Page-edge stacks: thickness grows with the pages on each side */}
            {Array.from({ length: Math.min(4, Math.ceil(rightCount / 2)) }, (_, i) => (
              <div
                key={`r${i}`}
                aria-hidden
                className={cn("absolute rounded-r-[3px]", i % 2 ? "bg-[#d6ccbf]" : "bg-[#e4dcd1]")}
                style={{ left: spineLeft, top: (i + 1) * 2, width: size + (i + 1) * 2.5, height: size, transform: `translateZ(${-(i + 1)}px)` }}
              />
            ))}
            {!compact &&
              Array.from({ length: Math.min(4, Math.ceil(leftCount / 2)) }, (_, i) => (
                <div
                  key={`l${i}`}
                  aria-hidden
                  className={cn("absolute rounded-l-[3px]", i % 2 ? "bg-[#d6ccbf]" : "bg-[#e4dcd1]")}
                  style={{ left: -(i + 1) * 2.5, top: (i + 1) * 2, width: size + (i + 1) * 2.5, height: size, transform: `translateZ(${-(i + 1)}px)` }}
                />
              ))}

            {/* Static left page */}
            {!compact && leftLeaf >= 0 && (
              <div className="absolute top-0 overflow-hidden rounded-l-[3px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]" style={{ left: 0, width: size, height: size }}>
                {scaled(page(leaves[leftLeaf]?.back))}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-l from-black/60 to-transparent"
                  style={{ right: leftCastRight, opacity: turn ? castOpacity : 0 }}
                />
              </div>
            )}

            {/* Static right page */}
            {rightLeaf < leaves.length && (
              <div
                className={cn("absolute top-0 overflow-hidden shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]", compact ? "rounded-[3px]" : "rounded-r-[3px]")}
                style={{ left: spineLeft, width: size, height: size }}
              >
                {scaled(page(leaves[rightLeaf]?.front))}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-black/60 to-transparent"
                  style={{ left: rightCastLeft, opacity: turn ? castOpacity : 0 }}
                />
                {/* Corner peel hint */}
                {!turn && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 size-7 origin-bottom-right bg-linear-to-tl from-transparent from-50% to-[#fffdf8] to-50% shadow-[-3px_-3px_8px_rgb(0_0_0/0.25)] transition-transform duration-500 ease-expo group-hover/book:scale-[1.9]"
                  />
                )}
              </div>
            )}

            {/* The leaf in motion */}
            {turn && turning && (
              <div className="preserve-3d absolute top-0" style={{ left: spineLeft, width: size, height: size }}>
                <TurningLeaf
                  progress={flip.progress}
                  dir={turn.dir}
                  size={size}
                  base={base}
                  front={page(turning.front)}
                  back={compact ? <BlankPage /> : page(turning.back)}
                />
              </div>
            )}

            {/* Gutter */}
            {!compact && (leftLeaf >= 0 || turn) && (
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 w-20 bg-linear-to-r from-transparent via-black/35 to-transparent"
                style={{ left: size, height: size, transform: "translateX(-50%) translateZ(2px)" }}
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      <BookControls
        label={counter}
        ratio={flip.current / turnable}
        canPrev={flip.canPrev}
        canNext={flip.canNext}
        onPrev={prev}
        onNext={next}
      />
    </BookContext.Provider>
  );
}
