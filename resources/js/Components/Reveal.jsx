import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll wrapper: content rises in gently the first time it
 * enters the viewport. Falls back to fully visible without
 * IntersectionObserver, after a timeout, or with reduced motion
 * (handled in CSS), so content is never trapped invisible.
 */
export default function Reveal({ children, className = '', delay = 0 }) {
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

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
