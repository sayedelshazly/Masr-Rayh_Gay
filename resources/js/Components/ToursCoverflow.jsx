import { useEffect, useRef } from 'react';
import TourImageCard from './TourImageCard';

/**
 * Featured tours — an endless 3D river. Same coverflow idea as
 * before (centre card flat and full-size, neighbours swung back in
 * perspective), but with every control stripped away: no arrows, no
 * dots, no stepping. The ring of cards drifts right at a calm,
 * constant speed and wraps seamlessly — a card that leaves on the
 * right re-enters on the left, so it never jumps back to the start.
 * Positions are computed on a ring (modulo the ring's circumference)
 * and painted directly in a rAF loop; hovering holds the river
 * still, and only the card in the centre is clickable.
 * Reduced-motion visitors get the same coverflow, standing still.
 */
export default function ToursCoverflow({ tours }) {
    const stageRef = useRef(null);
    const cardRefs = useRef([]);
    const pausedRef = useRef(false);

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
        const SPEED = 26; // px per second — a slow, luxurious drift
        let raf = 0;
        let last = performance.now();
        let offset = 0;

        const frame = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            if (!pausedRef.current && !reduced) {
                offset += SPEED * dt;
            }

            const stageW = stage.clientWidth;
            const cardW = stageW < 640 ? 248 : 300;
            const step = cardW * 0.74;
            const total = step * items.length;
            const half = total / 2;

            items.forEach((_, k) => {
                const el = cardRefs.current[k];
                if (!el) {
                    return;
                }
                const x = ((((k * step + offset) % total) + total) % total) - half;
                const ax = Math.abs(x);
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

    return (
        <div
            ref={stageRef}
            className="relative h-[430px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [perspective:1400px] sm:h-[490px]"
            onMouseEnter={() => {
                pausedRef.current = true;
            }}
            onMouseLeave={() => {
                pausedRef.current = false;
            }}
            onTouchStart={() => {
                pausedRef.current = true;
            }}
            onTouchEnd={() => {
                pausedRef.current = false;
            }}
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
