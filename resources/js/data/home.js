/**
 * Static placeholder content for the home page.
 * Real tours/destinations will come from the database in a later step —
 * names are stored per-locale here so components stay translation-driven.
 */
export const destinations = [
    {
        id: 'cairo',
        name: { ar: 'القاهرة والجيزة', en: 'Cairo & Giza' },
        tagline: {
            ar: 'الأهرامات والمتحف المصري وقلعة صلاح الدين',
            en: 'The Pyramids, the Egyptian Museum & the Citadel',
        },
        price: 1800,
        gradient: 'from-amber-500 via-gold-500 to-gold-deep',
        glyph: '𓂀',
    },
    {
        id: 'luxor',
        name: { ar: 'الأقصر', en: 'Luxor' },
        tagline: {
            ar: 'وادي الملوك ومعابد الكرنك والأقصر',
            en: 'Valley of the Kings, Karnak & Luxor temples',
        },
        price: 3400,
        gradient: 'from-orange-400 via-amber-600 to-yellow-800',
        glyph: '𓋹',
    },
    {
        id: 'aswan',
        name: { ar: 'أسوان', en: 'Aswan' },
        tagline: {
            ar: 'فيلة وأبو سمبل وهدوء النيل النوبي',
            en: 'Philae, Abu Simbel & the calm Nubian Nile',
        },
        price: 3900,
        gradient: 'from-nile-800 via-sky-600 to-nile-950',
        glyph: '𓅃',
    },
    {
        id: 'red-sea',
        name: { ar: 'البحر الأحمر', en: 'Red Sea' },
        tagline: {
            ar: 'الغردقة وشرم الشيخ وشعاب مرجانية ساحرة',
            en: 'Hurghada, Sharm El Sheikh & stunning coral reefs',
        },
        price: 2600,
        gradient: 'from-teal-400 via-cyan-600 to-nile-800',
        glyph: '𓆣',
    },
];

export const stats = [
    { value: '+25', key: 'destinations' },
    { value: '+500', key: 'tours' },
    { value: '+15', key: 'years' },
    { value: '4.9/5', key: 'rating' },
];

/**
 * Simple A–Z → hieroglyph transliteration map for the Academy teaser demo.
 * Approximate single-sign phonetics used by most "write your name" charts —
 * the full, accurate academy arrives in a later step.
 */
export const hieroglyphMap = {
    a: '𓄿',
    b: '𓃀',
    c: '𓍿',
    d: '𓂧',
    e: '𓇋',
    f: '𓆑',
    g: '𓎼',
    h: '𓎛',
    i: '𓇋',
    j: '𓆓',
    k: '𓎟',
    l: '𓃭',
    m: '𓅓',
    n: '𓈖',
    o: '𓅱',
    p: '𓊵',
    q: '𓏘',
    r: '𓂋',
    s: '𓋴',
    t: '𓏏',
    u: '𓅱',
    v: '𓆑',
    w: '𓅱',
    x: '𓐍',
    y: '𓇋',
    z: '𓊵',
};

export function toHieroglyphs(text) {
    return [...(text ?? '')]
        .map((char) => {
            if (char === ' ') {
                return '  ';
            }

            return hieroglyphMap[char.toLowerCase()] ?? '';
        })
        .join(' ');
}
