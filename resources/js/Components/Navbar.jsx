import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useLocale } from '../i18n/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Inline SVG brand mark: the Eye of Horus in gold inside a nile ring.
 *
 * With `alive` (the navbar's logo) the eye lives: it blinks every
 * few seconds, and its iris leans toward `gaze` (-1 … 1) — the side
 * of the link the travelling cartouche is visiting.
 */
export function BrandMark({ className = 'h-11 w-11', alive = false, gaze = 0 }) {
    const [blinking, setBlinking] = useState(false);

    useEffect(() => {
        if (!alive) {
            return undefined;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }
        let cancelled = false;
        let t1;
        let t2;
        const loop = () => {
            t1 = window.setTimeout(
                () => {
                    if (cancelled) return;
                    setBlinking(true);
                    t2 = window.setTimeout(() => {
                        if (cancelled) return;
                        setBlinking(false);
                        loop();
                    }, 140);
                },
                2400 + Math.random() * 3400,
            );
        };
        loop();
        return () => {
            cancelled = true;
            window.clearTimeout(t1);
            window.clearTimeout(t2);
        };
    }, [alive]);

    return (
        <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Masr Rayh Gay">
            <circle cx="24" cy="24" r="22" fill="#0B1F2E" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
            <g
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: blinking ? 'scaleY(0.08)' : 'scaleY(1)',
                    transition: 'transform 120ms ease-in-out',
                }}
            >
                <g stroke="#C9A24B" strokeWidth="2.3" strokeLinecap="round" fill="none">
                    {/* Brow */}
                    <path d="M7.5 15.5 Q24 6.5 40.5 15.5" />
                    {/* Eye outline */}
                    <path d="M8.5 24.5 Q24 13.5 39.5 24.5 Q24 33.5 8.5 24.5 Z" />
                    {/* Teardrop */}
                    <path d="M17 30.5 L17 38.5" />
                    {/* Cheek curl */}
                    <path d="M28.5 30 Q38 30.5 37 35.5 Q36.2 39 32.5 38" />
                </g>
                {/* Iris — leans toward the visited link when alive */}
                <g
                    style={{
                        transform: `translateX(${(alive ? gaze : 0) * 2.4}px)`,
                        transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                >
                    <circle cx="24" cy="24" r="4.4" fill="#C9A24B" />
                </g>
            </g>
        </svg>
    );
}

/**
 * Routes whose top band is genuinely dark (video/photo hero or nile band),
 * so the fixed navbar can start transparent over it. Light-topped pages
 * (tours/destinations indexes, academy glyphs/quiz, auth, and the calm
 * booking checkout at /tours/{slug}/book) are deliberately excluded —
 * AppLayout gives them a spacer under the solid navbar instead.
 */
export function isOverlayRoute(url) {
    return (
        url === '/' ||
        url === '/academy' ||
        url.startsWith('/academy/lessons/') ||
        url.startsWith('/academy/name') ||
        url.startsWith('/destinations/') ||
        (url.startsWith('/tours/') && !url.endsWith('/book'))
    );
}

/** The entrance choreography (frame draw + staggered links) plays
 *  once per full page load, not on every Inertia navigation. */
let navHasEntered = false;

export default function Navbar() {
    const { t, locale } = useLocale();
    const { props, url } = usePage();
    const user = props.auth?.user ?? null;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [entered] = useState(() => navHasEntered);

    useEffect(() => {
        navHasEntered = true;
    }, []);

    const handleLogout = () => {
        setUserOpen(false);
        router.post('/logout');
    };
    const userMenuRef = useRef(null);

    const overlay = isOverlayRoute(url);
    const solid = !overlay || scrolled || open;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Account dropdown: close on outside click or Escape.
    useEffect(() => {
        if (!userOpen) return;
        const onPointerDown = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setUserOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [userOpen]);

    const links = [
        { label: t('nav.home'), href: '/' },
        { label: t('nav.tours'), href: '/tours' },
        { label: t('nav.destinations'), href: '/destinations' },
        { label: t('nav.academy'), href: '/academy' },
        { label: t('nav.about'), href: '#' },
        { label: t('nav.contact'), href: '#contact' },
    ];

    const isActive = (href) => {
        if (href === '/') {
            return url === '/';
        }
        if (href.startsWith('#')) {
            return false;
        }
        return url === href || url.startsWith(`${href}/`);
    };

    // The travelling cartouche: a gold ring that rests on the active
    // link and glides to whichever link the pointer is visiting.
    const rowRef = useRef(null);
    const linkRefs = useRef([]);
    const [hoverIdx, setHoverIdx] = useState(null);
    const [cartouche, setCartouche] = useState({ x: 0, w: 0, visible: false });
    const [gaze, setGaze] = useState(0);
    const activeIdx = links.findIndex((link) => isActive(link.href));
    const targetIdx = hoverIdx !== null ? hoverIdx : activeIdx;
    const targetRef = useRef(targetIdx);
    targetRef.current = targetIdx;

    const measure = useCallback(() => {
        const idx = targetRef.current;
        const el = idx >= 0 ? linkRefs.current[idx] : null;
        const row = rowRef.current;
        if (!el || !row) {
            setCartouche((prev) => ({ ...prev, visible: false }));
            setGaze(0);
            return;
        }
        setCartouche({ x: el.offsetLeft, w: el.offsetWidth, visible: true });
        // The logo's eye leans toward the visited link's side.
        const center = el.offsetLeft + el.offsetWidth / 2;
        const half = row.offsetWidth / 2;
        setGaze(half > 0 ? Math.max(-1, Math.min(1, (center - half) / half)) : 0);
    }, []);

    useLayoutEffect(() => {
        measure();
    }, [measure, targetIdx, locale, url]);

    useEffect(() => {
        window.addEventListener('resize', measure);
        if (document.fonts?.ready) {
            document.fonts.ready.then(() => measure());
        }
        const late = window.setTimeout(measure, 350);
        return () => {
            window.removeEventListener('resize', measure);
            window.clearTimeout(late);
        };
    }, [measure]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-stone ${
                solid ? 'bg-nile-950/95 shadow-md shadow-ink-900/10 backdrop-blur' : 'bg-transparent'
            }`}
        >
            <nav className="relative">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <a href="/" className={`flex items-center gap-2.5 ${entered ? '' : 'nav-in'}`}>
                        <BrandMark className="h-9 w-9" alive gaze={gaze} />
                        <span className="leading-tight">
                            <span className="font-display block text-lg font-bold text-sand-100">
                                {t('brand.name')}
                            </span>
                            <span className="block text-[10px] tracking-wide text-gold-300">
                                {t('brand.nameLatin')}
                            </span>
                        </span>
                    </a>

                    <ul
                        ref={rowRef}
                        onMouseLeave={() => setHoverIdx(null)}
                        className="relative hidden items-center gap-1 lg:flex"
                    >
                        {links.map((link, i) => (
                            <li
                                key={link.label}
                                ref={(el) => {
                                    linkRefs.current[i] = el;
                                }}
                                className={entered ? '' : 'nav-in'}
                                style={entered ? undefined : { animationDelay: `${70 + i * 55}ms` }}
                            >
                                <a
                                    href={link.href}
                                    onMouseEnter={() => setHoverIdx(i)}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                    className={`relative z-10 block rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                                        isActive(link.href)
                                            ? 'font-bold text-gold-300'
                                            : 'font-medium text-sand-100/80 hover:text-gold-300'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        {/* The travelling cartouche */}
                        <li
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 top-1/2 h-[30px] transition-all duration-500 ease-stone will-change-transform"
                            style={{
                                transform: `translate(${cartouche.x - 5}px, -50%)`,
                                width: cartouche.w + 10,
                                opacity: cartouche.visible ? 1 : 0,
                            }}
                        >
                            <span className="block h-full w-full rounded-full border border-gold-500/80 shadow-[0_0_18px_rgba(201,162,75,0.28)]" />
                            <span className="absolute end-[-2px] top-[-3px] h-[36px] w-[3px] rounded-full bg-gold-500" />
                            {/* A small sun rides the cartouche, turning slowly */}
                            <span className="absolute -top-[8px] left-1/2 -translate-x-1/2">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="sun-spin h-[15px] w-[15px] text-gold-500 drop-shadow-[0_0_6px_rgba(201,162,75,0.7)]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
                                </svg>
                            </span>
                        </li>
                    </ul>

                    <div
                        className={`flex items-center gap-2.5 ${entered ? '' : 'nav-in'}`}
                        style={entered ? undefined : { animationDelay: '420ms' }}
                    >
                        <LanguageSwitcher dark />
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setUserOpen((value) => !value)}
                                    aria-expanded={userOpen}
                                    aria-haspopup="menu"
                                    aria-label={t('auth.account')}
                                    title={user.name}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/50 bg-nile-800 text-gold-300 transition-colors duration-150 ease-stone hover:text-gold-500"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        className="h-[18px] w-[18px]"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="8" r="3.6" />
                                        <path d="M5 19.4c1.2-3.1 3.9-4.7 7-4.7s5.8 1.6 7 4.7" />
                                    </svg>
                                </button>
                                {userOpen && (
                                    <div
                                        role="menu"
                                        className="absolute end-0 top-[calc(100%+8px)] w-52 rounded-lg border border-gold-500/25 bg-nile-950 p-1.5 shadow-xl shadow-ink-900/30"
                                    >
                                        <div className="mb-1 border-b border-sand-100/10 px-3 py-2">
                                            <p className="truncate text-[13px] font-bold text-sand-100">{user.name}</p>
                                            <p className="truncate text-[11px] text-sand-100/55" dir="ltr">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/my-bookings"
                                            role="menuitem"
                                            onClick={() => setUserOpen(false)}
                                            className="block rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800"
                                        >
                                            {t('auth.myBookings')}
                                        </Link>
                                        {user.is_admin && (
                                            <Link
                                                href="/admin"
                                                role="menuitem"
                                                onClick={() => setUserOpen(false)}
                                                className="block rounded-md px-3 py-2 text-[13px] font-medium text-sand-100/85 transition-colors hover:bg-nile-800"
                                            >
                                                {t('admin.panel')}
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={handleLogout}
                                            className="block w-full rounded-md px-3 py-2 text-start text-[13px] font-bold text-gold-300 transition-colors hover:bg-nile-800"
                                        >
                                            {t('auth.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden items-center gap-3 md:flex">
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-sand-100/80 transition-colors hover:text-gold-300"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md border border-gold-500/60 px-3 py-1.5 text-[13px] font-bold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-900"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            aria-expanded={open}
                            aria-label={t('nav.menu')}
                            className="rounded-md border border-gold-500/50 px-2 py-1.5 text-base leading-none text-gold-300 lg:hidden"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {open && (
                    <ul className="space-y-1 border-t border-nile-800 px-4 py-2.5 lg:hidden">
                        {links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                    className={`block px-3 py-1.5 text-[13px] ${
                                        isActive(link.href)
                                            ? 'rounded-full border border-gold-500/70 font-bold text-gold-300'
                                            : 'rounded-md font-medium text-sand-100/85 hover:bg-nile-800'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="border-t border-nile-800 pt-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/my-bookings"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.myBookings')}
                                    </Link>
                                    {user.is_admin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setOpen(false)}
                                            className="block rounded-md px-3 py-1.5 text-[13px] font-bold text-gold-300 hover:bg-nile-800"
                                        >
                                            {t('admin.panel')}
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-medium text-sand-100/85 hover:bg-nile-800"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-md px-3 py-1.5 text-[13px] font-bold text-gold-300 hover:bg-nile-800"
                                    >
                                        {t('auth.register')}
                                    </Link>
                                </>
                            )}
                        </li>
                    </ul>
                )}

                {/* The navbar's gold frame line — draws itself across
                    the bar the first time the site opens. */}
                <span
                    aria-hidden="true"
                    className={`absolute bottom-0 start-0 h-[2px] w-full bg-gold-500 transition-opacity duration-300 ${
                        solid ? 'opacity-70' : 'opacity-30'
                    } ${entered ? '' : 'nav-frame'}`}
                />
            </nav>
        </header>
    );
}
