<!DOCTYPE html>
<html lang="ar" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Masr Rayh Gay — مصر رايح جاي</title>

        {{-- Search & sharing: per-page values arrive via the `seo` prop --}}
        @php($seo = $page['props']['seo'] ?? [])
        <meta name="description" content="{{ $seo['description'] ?? 'رحلات مصممة بعناية في مصر — الأهرامات، الأقصر، أسوان، والبحر الأحمر — بمرشدين مصريين خبراء وتجربة فاخرة من أول خطوة. Tours across 7,000 years of Egyptian civilisation.' }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Masr Rayh Gay — مصر رايح جاي">
        <meta property="og:title" content="{{ $seo['title'] ?? 'Masr Rayh Gay — مصر رايح جاي' }}">
        <meta property="og:description" content="{{ $seo['description'] ?? 'رحلات مصممة بعناية في مصر — الأهرامات، الأقصر، أسوان، والبحر الأحمر. Tours across 7,000 years of Egyptian civilisation.' }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ $seo['image'] ?? url('/images/destinations/cairo-giza.jpg') }}">
        <meta name="twitter:card" content="summary_large_image">
        @if(!empty($seo['jsonLd']))
        <script type="application/ld+json">{!! json_encode($seo['jsonLd'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) !!}</script>
        @endif

        {{-- Brand favicon: the Eye of Horus --}}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        {{-- Masr Rayh Gay type system (Design System v0.1): Reem Kufi (AR display) + Cormorant Garamond (EN display), Marcellus (subheads), IBM Plex Sans Arabic (AR body) + Inter (EN body), Noto Sans Egyptian Hieroglyphs (glyphs) --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Inter:wght@400;500;600&family=Marcellus&family=Noto+Sans+Egyptian+Hieroglyphs&family=Reem+Kufi:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        >

        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
