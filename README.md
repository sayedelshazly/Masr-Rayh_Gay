# مصر رايح جاي — Masr Rayh Gay

موقع شركة سياحة مصرية بهوية فرعونية أصيلة — حضارة وفخامة. رحلات سياحية في مصر مع حجز إلكتروني، وأكاديمية لتعلم اللغة الهيروغليفية.

A bilingual (Arabic + English) tourism website for Egypt tours — browse destinations and trips, book online, and learn hieroglyphs in the Hieroglyph Academy.

## المميزات | Features

- **الرحلات والوجهات:** 8 وجهات (القاهرة والجيزة، الأقصر، أسوان، الغردقة، شرم الشيخ، سيوة، الإسكندرية، الفيوم) و12 رحلة كاملة ببرنامج يوم بيوم وأسعار بالجنيه، مع بحث وفلترة وترتيب.
- **الحجز:** اختيار التاريخ وعدد الأفراد (الأطفال بنصف السعر)، وحساب السعر النهائي في السيرفر، ورقم حجز مثل `MRG-XXXXXX`.
- **الحسابات:** تسجيل ودخول، وصفحة "حجوزاتي" (تشمل حجوزات الزائر بنفس الإيميل)، وإلغاء الحجز قيد الانتظار قبل موعده.
- **أكاديمية الهيروغليفية:** 37 رمزًا، 4 دروس، 25 سؤال اختبار، وأداة "اكتب اسمك في خرطوشة فرعونية".
- **لوحة الأدمن (`/admin`):** إحصائيات وإيراد مؤكد، إدارة الحجوزات والرحلات والوجهات.
- **ثنائي اللغة:** عربي (افتراضي، RTL) وإنجليزي، مع تبديل فوري للغة والاتجاه والخطوط.

## التقنية | Stack

- Laravel 13 (PHP 8.3) + React 19 عبر Inertia.js + Vite 8 + Tailwind CSS 4
- قاعدة البيانات: MySQL في الإنتاج، SQLite للتطوير المحلي
- الاختبارات: 66 اختبارًا ناجحًا (PHPUnit)

## التشغيل محليًا | Local setup

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run build   # أو npm run dev للتطوير
php artisan serve
```

افتح http://localhost:8000

## أوامر مفيدة | Useful commands

```bash
php artisan test                         # تشغيل الاختبارات
php artisan admin:promote you@email.com  # ترقية حساب مسجل إلى أدمن
```

## النشر | Deployment

قرار الاستضافة لم يُحسم بعد (Laravel Cloud أو VPS). قبل النشر: ضبط `APP_NAME` و`APP_URL` وإيقاف `APP_DEBUG` في بيئة الإنتاج، ثم `migrate --seed`.

## المشروع | Project

- Repo: https://github.com/sayedelshazly/Masr-Rayh_Gay
- خطة البناء خطوة بخطوة: `MASR-PLAN.md`
