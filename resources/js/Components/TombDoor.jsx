import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { BrandMark } from './Navbar';
import { useLocale } from '../i18n/LocaleContext';
import {
    DOOR_CLOSE_EVENT,
    DOOR_OPEN_EVENT,
    consumeDoorOpenOnArrival,
} from '../lib/door';

/**
 * The tomb door — a Pharaonic transition for auth moments.
 *
 * On login / register success the screen is covered by two closed
 * stone doors, sealed with the Eye of Horus. The seal glows, breaks,
 * golden light spills through the widening seam, and the doors grind
 * apart to reveal the page underneath (the navigation already
 * happened behind them). On logout the doors sweep shut first, the
 * logout posts behind them, and they open again on arrival.
 *
 * Mounted once at the app root (app.jsx) so it persists across
 * Inertia visits. Clicking skips to the end. Reduced motion
 * collapses the whole thing to a quick fade.
 */

const GLYPH_COLUMNS = ['𓂀 𓋹 𓆣 𓅃 𓇳 𓊵 𓏏 𓊹', '𓆑 𓇋 𓏏 𓊹 𓂀 𓋹 𓆣 𓅃'];

function DoorPanel({ side, open }) {
    const isStart = side === 'start';
    return (
        <div
            aria-hidden="true"
            className="relative h-full w-1/2 overflow-hidden transition-transform duration-[1600ms] ease-stone will-change-transform"
            style={{
                transform: open ? `translateX(${isStart ? '-103%' : '103%'})` : 'translateX(0)',
                background: isStart
                    ? 'linear-gradient(100deg, #0B0A08 0%, #1A120A 55%, #2E2113 100%)'
                    : 'linear-gradient(260deg, #0B0A08 0%, #1A120A 55%, #2E2113 100%)',
            }}
        >
            {/* Engraved glyph columns */}
            <div
                className={`absolute inset-y-0 flex items-center gap-10 px-8 ${
                    isStart ? 'end-4 flex-row' : 'start-4 flex-row-reverse'
                }`}
            >
                {GLYPH_COLUMNS.map((column, i) => (
                    <div
                        key={i}
                        className="font-glyph flex flex-col items-center gap-7 text-4xl text-gold-500/10 sm:text-5xl"
                    >
                        {column.split(' ').map((glyph, j) => (
                            <span key={j}>{glyph}</span>
                        ))}
                    </div>
                ))}
            </div>
            {/* Giant watermark eye near the seam */}
            <span
                className={`font-glyph absolute top-1/2 -translate-y-1/2 text-[11rem] leading-none text-gold-500/[0.07] ${
                    isStart ? '-end-10' : '-start-10'
                }`}
            >
                𓂀
            </span>
            {/* Gold-trimmed inner frame */}
            <div className="absolute inset-3 border border-gold-500/25" />
            <div className="absolute inset-5 border border-gold-500/10" />
            {/* Stone shading at the outer edge */}
            <div
                className={`absolute inset-y-0 w-24 from-black/50 to-transparent ${
                    isStart ? 'start-0 bg-gradient-to-r rtl:bg-gradient-to-l' : 'end-0 bg-gradient-to-l rtl:bg-gradient-to-r'
                }`}
            />
        </div>
    );
}

export default function TombDoor() {
    const { t } = useLocale();
    const [phase, setPhase] = useState('idle'); // idle | sealed | opening | fading | closing | shut
    const [doorsOpen, setDoorsOpen] = useState(false);
    const timers = useRef([]);
    const phaseRef = useRef('idle');
    const closeThen = useRef(null);

    const reduced =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const T = reduced ? 0.12 : 1; // time scale

    const setPhaseBoth = (next) => {
        phaseRef.current = next;
        setPhase(next);
    };

    const later = (fn, ms) => {
        timers.current.push(window.setTimeout(fn, ms * T));
    };

    const clearTimers = () => {
        timers.current.forEach((id) => window.clearTimeout(id));
        timers.current = [];
    };

    const finish = useCallback(() => {
        clearTimers();
        setDoorsOpen(false);
        setPhaseBoth('idle');
        document.documentElement.style.overflow = '';
    }, []);

    const startOpen = useCallback(() => {
        // 'shut' is a valid start: the doors are being held closed
        // after a logout and this is their opening.
        if (phaseRef.current !== 'idle' && phaseRef.current !== 'shut') {
            return;
        }
        clearTimers();
        document.documentElement.style.overflow = 'hidden';
        setDoorsOpen(false);
        setPhaseBoth('sealed');
        later(() => setPhaseBoth('opening'), 420);
        later(() => setDoorsOpen(true), 470);
        later(() => setPhaseBoth('fading'), 2250);
        later(() => finish(), 2820);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finish]);

    const startClose = useCallback(
        (then) => {
            if (phaseRef.current !== 'idle') {
                then?.();
                return;
            }
            clearTimers();
            closeThen.current = then;
            document.documentElement.style.overflow = 'hidden';
            setDoorsOpen(true); // panels start off-screen, then sweep in
            setPhaseBoth('closing');
            // Next frame: slide shut
            requestAnimationFrame(() => requestAnimationFrame(() => setDoorsOpen(false)));
            later(() => setPhaseBoth('shut'), 1000);
            later(() => {
                const fn = closeThen.current;
                closeThen.current = null;
                fn?.();
                // Stay shut until the arrival opening takes over; a
                // safety net reopens after 6s if no navigation came.
                later(() => {
                    if (phaseRef.current === 'shut') {
                        startOpen();
                    }
                }, 6000);
            }, 1120);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [startOpen],
    );

    // Skip: a click hurries the current sequence to its end.
    const skip = () => {
        if (phase === 'opening' || phase === 'sealed') {
            setPhaseBoth('fading');
            later(() => finish(), 200);
        } else if (phase === 'closing') {
            setDoorsOpen(false);
            setPhaseBoth('shut');
            const fn = closeThen.current;
            closeThen.current = null;
            fn?.();
        }
    };

    useEffect(() => {
        const onOpen = () => startOpen();
        const onClose = (event) => startClose(event.detail?.then);
        window.addEventListener(DOOR_OPEN_EVENT, onOpen);
        window.addEventListener(DOOR_CLOSE_EVENT, onClose);

        // Arrival opening (logout flow, or a full reload after auth)
        if (consumeDoorOpenOnArrival()) {
            startOpen();
        }
        const removeNavigate = router.on('navigate', () => {
            // Arrival opening for any flow that armed the flag (the
            // logout visit itself also fires playDoorOpen on success;
            // startOpen is guarded, so a double trigger is harmless).
            if (consumeDoorOpenOnArrival()) {
                startOpen();
            }
        });

        return () => {
            window.removeEventListener(DOOR_OPEN_EVENT, onOpen);
            window.removeEventListener(DOOR_CLOSE_EVENT, onClose);
            removeNavigate();
            clearTimers();
            document.documentElement.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (phase === 'idle') {
        return null;
    }

    const sealing = phase === 'sealed' || phase === 'closing' || phase === 'shut';
    const opening = phase === 'opening' || phase === 'fading';

    return (
        <div
            aria-hidden="true"
            onClick={skip}
            className={`fixed inset-0 z-[130] cursor-pointer transition-opacity duration-500 ${
                phase === 'fading' ? 'opacity-0' : 'opacity-100'
            }`}
        >
            {/* Golden light spilling through the seam */}
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-stone"
                style={{ opacity: opening ? 1 : 0 }}
            >
                <div className="h-[130%] w-[42rem] max-w-[95vw] bg-[radial-gradient(ellipse_at_center,rgba(227,201,138,0.5),rgba(201,162,75,0.16)_45%,transparent_70%)] blur-xl" />
            </div>

            <div className="absolute inset-0 flex" dir="ltr">
                <DoorPanel side="start" open={doorsOpen} />
                <DoorPanel side="end" open={doorsOpen} />
            </div>

            {/* The seam of light */}
            <div
                className="absolute start-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-300 to-transparent transition-opacity duration-700"
                style={{ opacity: phase === 'sealed' ? 0.25 : opening ? 0.9 : 0.15 }}
            />

            {/* Dust motes in the light */}
            {opening && (
                <div className="pointer-events-none absolute inset-0">
                    {[18, 34, 47, 58, 71, 84].map((left, i) => (
                        <span
                            key={i}
                            className="animate-float-mote absolute top-1/2 h-1.5 w-1.5 rounded-full bg-gold-300/80"
                            style={{ left: `${left}%`, animationDelay: `${i * 0.45}s` }}
                        />
                    ))}
                </div>
            )}

            {/* The seal: Eye of Horus + brand, centred on the seam */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
                style={{
                    opacity: sealing ? 1 : 0,
                    transform: sealing ? 'scale(1)' : 'scale(1.25)',
                    pointerEvents: 'none',
                }}
            >
                <div className="animate-door-seal rounded-full bg-nile-950/85 p-3 ring-1 ring-gold-500/50 backdrop-blur">
                    <BrandMark className="h-20 w-20 sm:h-24 sm:w-24" />
                </div>
                <p className="font-display mt-5 text-xl font-bold text-gold-300 drop-shadow sm:text-2xl">
                    {t('brand.name')}
                </p>
                <p className="font-subhead mt-1 text-[11px] uppercase tracking-[0.35em] text-sand-100/60">
                    {t('brand.nameLatin')}
                </p>
            </div>
        </div>
    );
}
