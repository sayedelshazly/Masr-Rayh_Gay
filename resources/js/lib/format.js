/**
 * Helpers for DB-driven (bilingual) content.
 * Models store fields per locale: title_ar / title_en, includes_ar / includes_en…
 */

/** Pick the localized variant of a field, falling back to Arabic. */
export function localized(entity, field, locale) {
    if (!entity) {
        return '';
    }

    return entity[`${field}_${locale}`] ?? entity[`${field}_ar`] ?? '';
}

/** Format a price number for the active locale (digits + grouping). */
export function formatPrice(value, locale) {
    return Number(value ?? 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
}

/** Short localized date for a YYYY-MM-DD value, e.g. "السبت، ٢٨ نوفمبر" / "Sat, 28 Nov". */
export function formatShortDate(isoDate, locale) {
    if (!isoDate) {
        return '';
    }
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date);
}

/** Localized clock label for an HH:MM value. */
export function formatTimeLabel(time, locale) {
    if (!time) {
        return '';
    }
    const date = new Date(`2000-01-01T${time}:00`);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}
