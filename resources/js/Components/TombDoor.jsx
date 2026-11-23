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
 * The tomb — a Pharaonic transition for auth moments.
 *
 * OPENING (login / register success): a first-person scene INSIDE
 * the tomb. Darkness. A torch flares to life at the bottom of the
 * frame and its glow wakes the chamber; hieroglyphs carved on both
 * walls light up gold one after another; the chamber rumbles, dust
 * and small stones fall, and the stone door ahead grinds open —
 * golden light floods in as the view pushes forward through the
 * doorway, washing into the page underneath (the navigation already
 * happened behind the scene).
 *
 * CLOSING (logout): two engraved stone doors sweep shut over the
 * page, the logout posts behind them, and the opening scene replays
 * on arrival.
 *
 * Mounted once at the app root (app.jsx) so it persists across
 * Inertia visits. Clicking skips to the end. Reduced motion
 * collapses the timelines to a quick fade.
 */

const WALL_GLYPHS = [
    '𓂀', '𓋹', '𓆣', '𓅃', '𓇳', '𓊵', '𓏏', '𓊹',
    '𓆑', '𓇋', '𓀀', '𓅓', '𓈖', '𓂋', '𓎟', '𓊪',
    '𓏙', '𓇯', '𓆖', '𓅱', '𓊹', '𓏏', '𓋹', '𓂀',
];

function GlyphWall({ side, lit }) {
    const isStart = side === 'start';
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
                clipPath: isStart
                    ? 'polygon(0 0, 35% 13%, 35% 87%, 0 100%)'
                    : 'polygon(100% 0, 65% 13%, 65% 87%, 100% 100%)',
                background: isStart
                    ? 'linear-gradient(90deg, #080604 0%, #150E07 62%, #2A1B0D 100%)'
                    : 'linear-gradient(270deg, #080604 0%, #150E07 62%, #2A1B0D 100%)',
            }}
        >
            <div
                className={`absolute top-[17%] grid w-[26%] grid-cols-4 gap-x-2 gap-y-5 ${
                    isStart ? 'start-[4%]' : 'end-[4%]'
                }`}
                dir="ltr"
            >
                {WALL_GLYPHS.map((glyph, i) => (
                    <span
                        key={i}
                        className="font-glyph text-center text-xl transition-all duration-700 sm:text-3xl"
                        style={{
                            transitionDelay: `${(isStart ? i : WALL_GLYPHS.length - i) * 55}ms`,
                            color: lit ? 'rgba(227, 201, 138, 0.95)' : 'rgba(201, 162, 75, 0.10)',
                            textShadow: lit ? '0 0 16px rgba(201, 162, 75, 0.55)' : 'none',
                        }}
                    >
                        {glyph}
                    </span>
                ))}
            </div>
        </div>
    );
}

function SceneDoorPanel({ side, open }) {
    const isStart = side === 'start';
    return (
        <div
            aria-hidden="true"
            className="relative h-full w-1/2 overflow-hidden transition-transform duration-[1500ms] ease-stone will-change-transform"
            style={{
                transform: open ? `translateX(${isStart ? '-108%' : '108%'})` : 'translateX(0)',
                background: isStart
                    ? 'linear-gradient(100deg, #17100A 0%, #2B1E11 60%, #3A2A16 100%)'
                    : 'linear-gradient(260deg, #17100A 0%, #2B1E11 60%, #3A2A16 100%)',
            }}
        >
            <div
                className={`font-glyph absolute inset-y-0 flex flex-col items-center justify-center gap-6 text-3xl text-gold-500/15 ${
                    isStart ? 'end-3' : 'start-3'
                }`}
            >
                {['𓂀', '𓋹', '𓆣', '𓊹'].map((glyph, i) => (
                    <span key={i}>{glyph}</span>
                ))}
            </div>
            <div className="absolute inset-2 border border-gold-500/20" />
        </div>
    );
}

function TombScene({ stage, brandName }) {
    const lit = stage >= 2;
    const doorOpen = stage >= 4;

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#060504]" dir="ltr">
            {/* The chamber (rumbles at stage 3-4, pushes forward at 5) */}
            <div
                className={`absolute inset-0 transition-transform duration-[1100ms] ease-stone ${
                    stage >= 3 && stage < 5 ? 'animate-tomb-rumble' : ''
                }`}
                style={{ transform: stage >= 5 ? 'scale(1.65)' : 'scale(1)' }}
            >
                {/* Ceiling + floor */}
                <div
                    className="absolute inset-0 bg-[#0A0806]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 65% 13%, 35% 13%)' }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        clipPath: 'polygon(0 100%, 35% 87%, 65% 87%, 100% 100%)',
                        background: 'linear-gradient(180deg, #241809 0%, #0D0906 90%)',
                    }}
                />
                {/* Floor light reflection when the door opens */}
                <div
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                        clipPath: 'polygon(0 100%, 35% 87%, 65% 87%, 100% 100%)',
                        background:
                            'radial-gradient(ellipse 34% 16% at 50% 92%, rgba(227,201,138,0.5), transparent 70%)',
                        opacity: doorOpen ? 1 : 0,
                    }}
                />

                <GlyphWall side="start" lit={lit} />
                <GlyphWall side="end" lit={lit} />

                {/* Back wall */}
                <div className="absolute bottom-[13%] start-[35%] end-[35%] top-[13%] bg-gradient-to-b from-[#140D07] via-[#100B06] to-[#0A0705] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />

                {/* Lintel with the carved brand name */}
                <p
                    className="font-display absolute start-1/2 top-[16.5%] -translate-x-1/2 whitespace-nowrap text-lg font-bold transition-all delay-500 duration-1000 sm:text-2xl"
                    style={{
                        color: lit ? 'rgba(227, 201, 138, 0.95)' : 'rgba(120, 96, 58, 0.5)',
                        textShadow: lit ? '0 0 22px rgba(201, 162, 75, 0.5)' : 'none',
                    }}
                    dir="rtl"
                >
                    {brandName}
                </p>

                {/* The stone door ahead */}
                <div className="absolute bottom-[13%] start-1/2 top-[27%] w-[min(320px,32%)] -translate-x-1/2">
                    <div className="absolute -inset-x-3 -top-3 h-3 bg-[#2E2113] shadow-md" />
                    <div className="relative flex h-full overflow-hidden ring-1 ring-gold-500/25">
                        <SceneDoorPanel side="start" open={doorOpen} />
                        <SceneDoorPanel side="end" open={doorOpen} />
                        {/* Seam of light */}
                        <div
                            className="absolute start-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-300 to-transparent transition-opacity duration-700"
                            style={{ opacity: stage >= 3 ? 0.95 : 0.12 }}
                        />
                    </div>
                </div>

                {/* Falling dust + stones once the chamber rumbles */}
                {stage >= 3 && (
                    <div className="pointer-events-none absolute inset-0">
                        {[8, 22, 36, 47, 55, 63, 74, 88].map((left, i) => (
                            <span
                                key={`dust-${i}`}
                                className="animate-dust-fall absolute top-0 h-1 w-1 rounded-full bg-sand-100/60"
                                style={{ left: `${left}%`, animationDelay: `${i * 0.22}s` }}
                            />
                        ))}
                        {[45, 50, 54].map((left, i) => (
                            <span
                                key={`stone-${i}`}
                                className="animate-stone-fall absolute top-[24%] h-2 w-2 bg-[#3A2C1C]"
                                style={{ left: `${left}%`, animationDelay: `${0.15 + i * 0.28}s` }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Torch glow (the viewer's own torch, held low) */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{
                    opacity: stage >= 1 ? 1 : 0,
                    background:
                        'radial-gradient(circle at 46% 92%, rgba(245, 192, 74, 0.28), rgba(245, 192, 74, 0.07) 42%, transparent 68%)',
                }}
            >
                <div className="animate-glow-flicker absolute inset-0 bg-[radial-gradient(circle_at_46%_92%,rgba(245,192,74,0.16),transparent_55%)]" />
            </div>
            {/* The flame + torch handle */}
            <div
                className="absolute -bottom-2 start-[44%] transition-all delay-100 duration-500"
                style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(30px)' }}
            >
                <div className="animate-torch-flicker mx-auto h-20 w-12 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_78%,#FFF3C4_0%,#F5C04A_38%,#E07B2A_64%,rgba(224,123,42,0)_80%)] blur-[2px] sm:h-24 sm:w-14" />
                <div className="mx-auto h-24 w-2.5 rotate-3 rounded bg-gradient-to-b from-[#4A3420] to-[#1D130B]" />
            </div>

            {/* Darkness veil: lifts as the torch catches */}
            <div
                className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-1000"
                style={{ opacity: stage === 0 ? 0.9 : stage === 1 ? 0.42 : 0.1 }}
            />

            {/* Golden light flooding through the opened door */}
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-[1300ms] ease-stone"
                style={{
                    opacity: doorOpen ? 1 : 0,
                    transform: stage >= 5 ? 'scale(1.5)' : 'scale(1)',
                }}
            >
                <div className="h-[95%] w-[46rem] max-w-[96vw] bg-[radial-gradient(ellipse_at_center,rgba(255,244,214,0.95),rgba(227,201,138,0.45)_42%,transparent_72%)] blur-md" />
            </div>

            {/* Final wash into the page */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FFFBEC_0%,#F3DFAC_55%,#E3C98A_100%)] transition-opacity duration-500"
                style={{ opacity: stage >= 5 ? 1 : 0 }}
            />
        </div>
    );
}

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
            <span
                className={`font-glyph absolute top-1/2 -translate-y-1/2 text-[11rem] leading-none text-gold-500/[0.07] ${
                    isStart ? '-end-10' : '-start-10'
                }`}
            >
                𓂀
            </span>
            <div className="absolute inset-3 border border-gold-500/25" />
            <div className="absolute inset-5 border border-gold-500/10" />
        </div>
    );
}

export default function TombDoor() {
    const { t } = useLocale();
    const [phase, setPhase] = useState('idle'); // idle | scene | closing | shut
    const [stage, setStage] = useState(0);
    const [doorsOpen, setDoorsOpen] = useState(false);
    const timers = useRef([]);
    const phaseRef = useRef('idle');
    const closeThen = useRef(null);

    const reduced =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const T = reduced ? 0.1 : 1; // time scale

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
        setStage(0);
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
        setStage(0);
        setPhaseBoth('scene');
        later(() => setStage(1), 140); // the torch catches
        later(() => setStage(2), 620); // glyphs light up, one by one
        later(() => setStage(3), 2050); // rumble, dust and stones fall
        later(() => setStage(4), 2500); // the door grinds open
        later(() => setStage(5), 3350); // push forward into the light
        later(() => finish(), 3980);
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
        if (phase === 'scene') {
            setStage(5);
            later(() => finish(), 260);
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
            // The logout visit itself also fires playDoorOpen on
            // success; startOpen is guarded, so a double trigger is
            // harmless.
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

    if (phase === 'scene') {
        return (
            <div aria-hidden="true" onClick={skip} className="fixed inset-0 z-[130] cursor-pointer">
                <TombScene stage={stage} brandName={t('brand.name')} />
            </div>
        );
    }

    // Closing / shut: the two engraved doors with the seal.
    const sealing = phase === 'closing' || phase === 'shut';
    return (
        <div aria-hidden="true" onClick={skip} className="fixed inset-0 z-[130] cursor-pointer">
            <div className="absolute inset-0 flex" dir="ltr">
                <DoorPanel side="start" open={doorsOpen} />
                <DoorPanel side="end" open={doorsOpen} />
            </div>
            <div
                className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
                style={{ opacity: sealing ? 1 : 0, pointerEvents: 'none' }}
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
