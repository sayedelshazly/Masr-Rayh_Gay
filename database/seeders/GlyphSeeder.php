<?php

namespace Database\Seeders;

use App\Models\Glyph;
use Illuminate\Database\Seeder;

/**
 * Seeds the hieroglyph reference chart.
 *
 * Alphabet signs are the standard Gardiner uniliterals (one sign = one
 * sound). Symbols are written as \u{...} escapes so the exact codepoint
 * is unambiguous in source (several signs look nearly identical).
 */
class GlyphSeeder extends Seeder
{
    public function run(): void
    {
        $sort = 0;
        $seed = function (string $transliteration, string $symbol, string $nameAr, string $nameEn, string $meaningAr, string $meaningEn, string $category, ?string $pronunciation = null) use (&$sort) {
            Glyph::updateOrCreate(
                ['transliteration' => $transliteration, 'category' => $category],
                [
                    'symbol' => $symbol,
                    'name_ar' => $nameAr,
                    'name_en' => $nameEn,
                    'meaning_ar' => $meaningAr,
                    'meaning_en' => $meaningEn,
                    'category' => $category,
                    'pronunciation' => $pronunciation,
                    'sort_order' => ++$sort,
                ],
            );
        };

        // ——— Uniliteral alphabet (Gardiner) ———
        $seed('a', "\u{1313F}", 'النسر المصري', 'Egyptian vulture', 'علامة أحادية الصوت للنطق «أ».', 'Uniliteral sign for the sound “a”.', 'alphabet', 'a as in “father”');
        $seed('i', "\u{131CB}", 'ورقة البوص', 'Reed leaf', 'علامة أحادية الصوت للنطق «ي / إي».', 'Uniliteral sign for the sound “i”.', 'alphabet', 'i as in “machine”');
        $seed('y', "\u{131CC}", 'ورقتا بوص', 'Two reed leaves', 'علامة أحادية الصوت للنطق «ي» المشدّدة.', 'Uniliteral sign for the sound “y”.', 'alphabet', 'y as in “yes”');
        $seed('aa', "\u{1309D}", 'الساعد', 'Forearm', 'صوت حلقي «ع» (ꜥ) لا يوجد له مقابل في الإنجليزية.', 'The throaty “ꜥ” (ayin) sound, with no English equivalent.', 'alphabet', 'a deep “a” from the throat');
        $seed('w', "\u{13171}", 'فرخ السمان', 'Quail chick', 'علامة أحادية الصوت للنطق «و».', 'Uniliteral sign for the sound “w”.', 'alphabet', 'w as in “water”');
        $seed('b', "\u{130C0}", 'الساق والقدم', 'Leg and foot', 'علامة أحادية الصوت للنطق «ب».', 'Uniliteral sign for the sound “b”.', 'alphabet', 'b as in “boat”');
        $seed('p', "\u{132AA}", 'مقعد من الغاب', 'Reed stool', 'علامة أحادية الصوت للنطق «پ» (P).', 'Uniliteral sign for the sound “p”.', 'alphabet', 'p as in “pyramid”');
        $seed('f', "\u{13191}", 'الأفعى ذات القرنين', 'Horned viper', 'علامة أحادية الصوت للنطق «ف».', 'Uniliteral sign for the sound “f”.', 'alphabet', 'f as in “pharaoh”');
        $seed('m', "\u{13153}", 'البومة', 'Owl', 'علامة أحادية الصوت للنطق «م» — من أشهر العلامات وأسهلها تمييزًا.', 'Uniliteral sign for the sound “m” — one of the most recognisable signs.', 'alphabet', 'm as in “mummy”');
        $seed('n', "\u{13216}", 'تموّجات الماء', 'Ripples of water', 'علامة أحادية الصوت للنطق «ن».', 'Uniliteral sign for the sound “n”.', 'alphabet', 'n as in “Nile”');
        $seed('r', "\u{1308B}", 'الفم', 'Mouth', 'علامة أحادية الصوت للنطق «ر».', 'Uniliteral sign for the sound “r”.', 'alphabet', 'r as in “Ra”');
        $seed('h', "\u{1339B}", 'فتيل ملتوي', 'Twisted wick', 'صوت «ح» (ḥ) من الحلق — أقوى من الهاء العادية.', 'The emphatic “ḥ” sound, made deep in the throat.', 'alphabet', 'a breathy, deep “h”');
        $seed('kh', "\u{1340D}", 'المنخل', 'Sieve', 'صوت «خ» (ḫ) كما في كلمة «خير».', 'Uniliteral sign for the “kh” (ḫ) sound.', 'alphabet', 'kh as in Scottish “loch”');
        $seed('s', "\u{132F4}", 'قماش مطوي', 'Folded cloth', 'علامة أحادية الصوت للنطق «س».', 'Uniliteral sign for the sound “s”.', 'alphabet', 's as in “sun”');
        $seed('sh', "\u{13219}", 'بركة ماء', 'Garden pool', 'علامة أحادية الصوت للنطق «ش».', 'Uniliteral sign for the sound “sh”.', 'alphabet', 'sh as in “sheikh”');
        $seed('q', "\u{1320E}", 'تل رملي', 'Sandy hill', 'صوت «ق» (ḳ) عميق من آخر الحلق.', 'The deep “q” (ḳ) sound, from the back of the throat.', 'alphabet', 'q as in “Qatar”, but deeper');
        $seed('k', "\u{133A1}", 'سلة من الخوص', 'Wicker basket', 'علامة أحادية الصوت للنطق «ك».', 'Uniliteral sign for the sound “k”.', 'alphabet', 'k as in “Karnak”');
        $seed('g', "\u{133BC}", 'حامل جرّة', 'Jar stand', 'علامة أحادية الصوت للنطق «ج» القاهرية (G).', 'Uniliteral sign for the hard sound “g”.', 'alphabet', 'g as in “Giza”');
        $seed('t', "\u{133CF}", 'رغيف خبز', 'Bread loaf', 'علامة أحادية الصوت للنطق «ت».', 'Uniliteral sign for the sound “t”.', 'alphabet', 't as in “temple”');
        $seed('tj', "\u{1337F}", 'حبل ربط', 'Tethering rope', 'صوت «تش» المركّب (ṯ) كما في بداية كلمة «تشيخوف».', 'Uniliteral sign for the combined “tj” (ṯ) sound.', 'alphabet', 'tj as in “tune” (British)');
        $seed('d', "\u{130A7}", 'اليد', 'Hand', 'علامة أحادية الصوت للنطق «د».', 'Uniliteral sign for the sound “d”.', 'alphabet', 'd as in “delta”');
        $seed('dj', "\u{13193}", 'الكوبرا', 'Cobra', 'صوت «ج» المركّب (ḏ) كما في «جمل» بالفصحى.', 'Uniliteral sign for the combined “dj” (ḏ) sound.', 'alphabet', 'dj as in “jump”');
        $seed('l', "\u{130ED}", 'الأسد', 'Lion', 'لا يوجد صوت «ل» مستقل في أقدم مراحل اللغة؛ استُخدم الأسد الرابض للنطق «ل» خاصة في العصور المتأخرة والأسماء الأجنبية.', 'There was no separate “l” in the earliest language; the recumbent lion was used for “l”, especially in later periods and foreign names.', 'alphabet', 'l as in “Luxor”');
        $seed('e', "\u{131CB}", 'ورقة البوص (للأسماء الحديثة)', 'Reed leaf (modern names)', 'نفس علامة البوص؛ تستخدمها جداول كتابة الأسماء الحديثة للنطق «إي» (E).', 'The same reed-leaf sign; modern name charts use it for the sound “e”.', 'alphabet', 'e as in “Egypt”');
        $seed('z', "\u{13283}", 'مزلاج الباب', 'Door bolt', 'في مصر القديمة كان يُنطق «ز»، ثم صار يُنطق «س» في العصور اللاحقة.', 'In Old Egyptian this was the sound “z”; later it merged into “s”.', 'alphabet', 'z as in “zoo” (early), later “s”');

        // ——— Famous symbols ———
        $seed('ankh', "\u{132F9}", 'العنخ — مفتاح الحياة', 'Ankh, key of life', 'أشهر رمز مصري قديم: يعني «الحياة»، وكان رمزًا للحياة الأبدية تحمله الآلهة والملوك.', 'The most famous ancient Egyptian symbol: it means “life” and stood for eternal life, held by gods and kings.', 'symbol');
        $seed('wedjat', "\u{13080}", 'عين حورس (الوجات)', 'Eye of Horus (Wedjat)', 'رمز الحماية والشفاء والسلامة؛ تروي الأسطورة أن حورس فقد عينه في صراعه مع ست ثم شُفيت.', 'Symbol of protection, healing and wholeness; in myth, Horus lost his eye fighting Seth and it was magically restored.', 'symbol');
        $seed('khepri', "\u{131A3}", 'الجعران (خبري)', 'Scarab (Khepri)', 'رمز البعث والتجدّد؛ ارتبط بالإله خبري الذي يدحرج الشمس عبر السماء كما يدحرج الجعران كرته.', 'Symbol of rebirth and renewal, linked to the god Khepri who rolled the sun across the sky as the beetle rolls its ball.', 'symbol');
        $seed('maat', "\u{13184}", 'ريشة ماعت', 'Feather of Maat', 'رمز الحق والعدل والنظام الكوني؛ في العالم الآخر كان يُوزن قلب الميت مقابل هذه الريشة.', 'Symbol of truth, justice and cosmic order; in the afterlife, the heart of the deceased was weighed against this feather.', 'symbol');
        $seed('was', "\u{13300}", 'صولجان الواس', 'Was sceptre', 'رمز القوة والسلطان والرخاء؛ صولجان برأس حيوان وجذع مشقوق تحمله الآلهة والملوك.', 'Symbol of power, dominion and well-being; a staff with an animal head and forked base carried by gods and kings.', 'symbol');
        $seed('djed', "\u{132BD}", 'عمود الجد', 'Djed pillar', 'رمز الثبات والاستقرار والاستمرارية، وارتبط بالإله أوزير وعموده الفقري.', 'Symbol of stability, endurance and continuity, associated with the god Osiris and his backbone.', 'symbol');
        $seed('ra', "\u{131F3}", 'قرص الشمس (رع)', 'Sun disk (Ra)', 'قرص الشمس، رمز الإله رع خالق الكون في المعتقد المصري، ومصدر النور والحياة.', 'The sun disk, emblem of Ra, creator god and source of light and life.', 'symbol');
        $seed('anubis', "\u{130E5}", 'ابن آوى (أنوبيس)', 'Jackal (Anubis)', 'ابن آوى رمز أنوبيس، إله التحنيط وحارس الجبانات الذي يرشد الأرواح في العالم الآخر.', 'The jackal, animal of Anubis, god of mummification and guardian of cemeteries who guided souls in the afterlife.', 'symbol');

        // ——— Numbers ———
        $seed('1', "\u{133E4}", 'واحد — عصا واحدة', 'One — single stroke', 'شرطة واحدة عمودية تعني الرقم ١، وتُكرَّر العصي للأرقام من ٢ إلى ٩.', 'A single vertical stroke means 1; strokes were repeated for 2 to 9.', 'number');
        $seed('10', "\u{13386}", 'عشرة — عظمة الكعب', 'Ten — heel bone', 'علامة على شكل حدوة/عظمة كعب تعني الرقم ١٠.', 'A hobble or heel-bone sign meaning 10.', 'number');
        $seed('100', "\u{13362}", 'مائة — حبل ملفوف', 'One hundred — coiled rope', 'لفة حبل تعني الرقم ١٠٠.', 'A coil of rope meaning 100.', 'number');
        $seed('1000', "\u{131BC}", 'ألف — نبات اللوتس', 'One thousand — lotus plant', 'نبات لوتس بساق وأوراق يعني الرقم ١٠٠٠.', 'A lotus plant meaning 1,000.', 'number');
    }
}
