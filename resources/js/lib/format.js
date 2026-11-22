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
