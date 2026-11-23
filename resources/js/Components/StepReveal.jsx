import { useEffect, useRef, useState } from 'react';

/**
 * Pyramid-steps entrance for card grids: cards rise in along a
 * diagonal — the delay grows with (row + column), like climbing
 * pyramid steps — and alternate rows sit shifted a step sideways
 * on wide screens (see .step-card in app.css). Falls back to fully
 * visible without IntersectionObserver, after a timeout, or with
 * reduced motion (handled in CSS), so content is never trapped
 * invisible.
 */
export default function StepReveal({ children, index = 0, cols = 3, className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 },
        );
        observer.observe(node);
        const fallback = setTimeout(() => setVisible(true), 2500);
        return () => {
            observer.disconnect();
            clearTimeout(fallback);
        };
    }, []);

    const row = Math.floor(index / cols);
    const col = index % cols;
    const delay = Math.min((row + col) * 90, 810);

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
                '--row-shift': row % 2 === 1 ? '1.25rem' : '0px',
            }}
            className={`step-card ${visible ? 'is-visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
