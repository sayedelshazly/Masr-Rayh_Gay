<!DOCTYPE html>
<html lang="ar" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Masr Rayh Gay — مصر رايح جاي</title>

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
