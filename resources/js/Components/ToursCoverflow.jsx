import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import TourImageCard from './TourImageCard';

/**
 * Featured tours — the endless 3D river, moved by hand. Same look
 * as the auto-drifting version (centre card flat and full-size,
 * neighbours swung back in perspective, edges fading out), but
 * nothing moves on its own: you drag with mouse or finger and the
 * ring follows your hand 1:1, with a short glide of momentum when
 * you let go. The ring is closed (positions wrap modulo its
 * circumference), so you can pull it right — or left — forever; it
 * never reaches an end and never snaps back to the start.
 * Only the card in the centre is clickable, and a drag that ends
 * on it does not count as a click.
 */
export default function ToursCoverflow({ tours }) {
    const stageRef = useRef(null);
    const cardRefs = useRef([]);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);
    const dragRef = useRef(null);
    const draggedRef = useRef(false);
    // Live card positions from the render loop, so a click that
    // lands on the inert duplicate sitting in the centre can be
    // routed to that card's tour by the stage itself.
    const positionsRef = useRef([]);
    const stepRef = useRef(0);

    const count = tours.length;
    // The set is doubled on the ring so the stage stays full even
    // when there are only a few featured tours.
    const items = count ? [...tours, ...tours] : [];

    useEffect(() => {
        if (count < 2) {
            return undefined;
        }
        const stage = stageRef.current;
        if (!stage) {
            return undefined;
        }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let last = performance.now();

        const frame = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            // momentum glide after the hand lets go
            if (!dragRef.current && Math.abs(velocityRef.current) > 4) {
                offsetRef.current += velocityRef.current * dt;
                velocityRef.current *= reduced ? 0 : Math.pow(0.06, dt); // fast decay
                if (Math.abs(velocityRef.current) <= 4) {
                    velocityRef.current = 0;
                }
            }

            const offset = offsetRef.current;
            const stageW = stage.clientWidth;
            const cardW = stageW < 640 ? 248 : 300;
            const step = cardW * 0.74;
            stepRef.current = step;
            const total = step * items.length;
            const half = total / 2;

            items.forEach((_, k) => {
                const el = cardRefs.current[k];
                if (!el) {
                    return;
                }
                const x = ((((k * step + offset) % total) + total) % total) - half;
                const ax = Math.abs(x);
                positionsRef.current[k] = { x, ax, slug: items[k].slug };
                if (ax > stageW / 2 + cardW) {
                    el.style.visibility = 'hidden';
                    return;
                }
                el.style.visibility = 'visible';
                const rotate = Math.max(-40, Math.min(40, -x * 0.075));
                const scale = 1 - Math.min(ax / 2600, 0.22);
                el.style.transform =
                    `translate(-50%, -50%) translateX(${x}px) translateZ(${-ax * 0.55}px) ` +
                    `rotateY(${rotate}deg) scale(${scale})`;
                el.style.zIndex = String(200 - Math.round(ax));
                el.style.opacity = String(1 - Math.min(ax / (stageW * 0.8), 0.55));
                el.style.pointerEvents = ax < step * 0.5 ? 'auto' : 'none';
            });

            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    if (!count) {
        return null;
    }

    const onPointerDown = (event) => {
        dragRef.current = { x: event.clientX, offset: offsetRef.current, lastX: event.clientX, lastT: performance.now() };
        draggedRef.current = false;
        velocityRef.current = 0;
        stageRef.current?.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag) {
            return;
        }
        const dx = event.clientX - drag.x;
        if (Math.abs(dx) > 6) {
            draggedRef.current = true;
        }
        offsetRef.current = drag.offset + dx;

        const now = performance.now();
        const dt = (now - drag.lastT) / 1000;
        if (dt > 0.016) {
            velocityRef.current = (event.clientX - drag.lastX) / dt;
            drag.lastX = event.clientX;
            drag.lastT = now;
        }
    };

    const endDrag = () => {
        dragRef.current = null;
    };

    return (
        <div
            ref={stageRef}
            className="relative h-[430px] cursor-grab touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [perspective:1400px] active:cursor-grabbing sm:h-[490px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={(event) => {
                // A real link under the cursor handles itself. But the
                // card in the centre may be the inert duplicate copy —
                // clicks pass through it to the stage, so navigate to
                // whichever card is centred under the click ourselves.
                if (event.target.closest('a')) {
                    return;
                }
                const stage = stageRef.current;
                if (!stage) {
                    return;
                }
                const rect = stage.getBoundingClientRect();
                const clickX = event.clientX - rect.left - rect.width / 2;
                let best = null;
                positionsRef.current.forEach((pos) => {
                    if (pos && (!best || Math.abs(pos.x - clickX) < Math.abs(best.x - clickX))) {
                        best = pos;
                    }
                });
                if (best && best.ax < stepRef.current * 0.5) {
                    router.visit(`/tours/${best.slug}`);
                }
            }}
            onClickCapture={(event) => {
                if (draggedRef.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    draggedRef.current = false;
                }
            }}
            onDragStart={(event) => event.preventDefault()}
        >
            {items.map((tour, k) => (
                <div
                    key={`${tour.id}-${k}`}
                    ref={(el) => {
                        cardRefs.current[k] = el;
                    }}
                    aria-hidden={k >= count}
                    inert={k >= count}
                    className="absolute left-1/2 top-1/2 h-[378px] w-[248px] will-change-transform sm:h-[438px] sm:w-[300px]"
                >
                    <TourImageCard tour={tour} />
                </div>
            ))}
        </div>
    );
}
