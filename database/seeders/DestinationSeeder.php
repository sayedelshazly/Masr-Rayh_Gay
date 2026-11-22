<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'slug' => 'cairo-giza',
                'name_ar' => 'القاهرة والجيزة',
                'name_en' => 'Cairo & Giza',
                'tagline_ar' => 'الأهرامات والمتحف المصري وقلعة صلاح الدين',
                'tagline_en' => 'The Pyramids, the Egyptian Museum & the Citadel',
                'description_ar' => 'عاصمة الألف مئذنة وموطن آخر عجائب الدنيا القديمة الباقية. في القاهرة والجيزة تلتقي أهرامات خوفو وخفرع ومنقرع وأبو الهول بكنوز المتحف المصري وخانات القاهرة الإسلامية وأزقة خان الخليلي — مدينة لا تنام وتاريخ لا ينتهي.',
                'description_en' => 'The city of a thousand minarets and home to the last surviving wonder of the ancient world. In Cairo & Giza, the Pyramids of Khufu, Khafre and Menkaure and the Great Sphinx meet the treasures of the Egyptian Museum, Islamic Cairo and the alleys of Khan El Khalili — a city that never sleeps, with history that never ends.',
                'region' => 'cairo',
                'gradient' => 'from-amber-500 via-gold-500 to-gold-deep',
                'glyph' => '𓂀',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'luxor',
                'name_ar' => 'الأقصر',
                'name_en' => 'Luxor',
                'tagline_ar' => 'وادي الملوك ومعابد الكرنك والأقصر',
                'tagline_en' => 'Valley of the Kings, Karnak & Luxor temples',
                'description_ar' => 'أعظم متحف مفتوح في العالم. على الضفة الشرقية للنيل يقف معبدا الكرنك والأقصر، وعلى الغربية يرقد ملوك مصر القديمة في وادي الملوك، وبينهما ينساب النيل كما كان ينساب منذ آلاف السنين.',
                'description_en' => 'The world’s greatest open-air museum. On the Nile’s east bank stand Karnak and Luxor temples; on the west bank, the kings of ancient Egypt rest in the Valley of the Kings — and between them the Nile flows as it has for thousands of years.',
                'region' => 'nile_valley',
                'gradient' => 'from-orange-400 via-amber-600 to-yellow-800',
                'glyph' => '𓋹',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'aswan',
                'name_ar' => 'أسوان',
                'name_en' => 'Aswan',
                'tagline_ar' => 'فيلة وأبو سمبل وهدوء النيل النوبي',
                'tagline_en' => 'Philae, Abu Simbel & the calm Nubian Nile',
                'description_ar' => 'بوابة مصر الجنوبية ودرة النيل. جزر خضراء وسط مياه صافية، معبد فيلة الساحر على جزيرته، قرى نوبية ملوّنة دافئة، وعلى بُعد رحلة فجرية يقف عملاقا أبو سمبل منحوتين في الصخر منذ عهد رمسيس الثاني.',
                'description_en' => 'Egypt’s southern gateway and the jewel of the Nile. Green islands in clear water, the enchanting Temple of Philae on its island, warm colourful Nubian villages — and, a dawn drive away, the colossi of Abu Simbel carved into the rock in the age of Ramesses II.',
                'region' => 'nile_valley',
                'gradient' => 'from-nile-800 via-sky-600 to-nile-950',
                'glyph' => '𓅃',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'hurghada',
                'name_ar' => 'الغردقة',
                'name_en' => 'Hurghada',
                'tagline_ar' => 'شعاب مرجانية وجزر وشمس طوال العام',
                'tagline_en' => 'Coral reefs, islands & year-round sunshine',
                'description_ar' => 'عاصمة البحر الأحمر المصرية. مياه فيروزية وشعاب مرجانية تعج بالحياة، رحلات غوص وسنوركلينج إلى جزيرة الجفتون، وسفاري صحراوية عند الغروب — وجهة من تبحث عن البحر والمغامرة معًا.',
                'description_en' => 'Egypt’s Red Sea capital. Turquoise water and reefs teeming with life, diving and snorkeling trips to Giftun Island, and desert safaris at sunset — the destination for sea and adventure in one place.',
                'region' => 'red_sea',
                'gradient' => 'from-teal-400 via-cyan-600 to-nile-800',
                'glyph' => '𓆣',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'slug' => 'sharm-el-sheikh',
                'name_ar' => 'شرم الشيخ',
                'name_en' => 'Sharm El Sheikh',
                'tagline_ar' => 'رأس محمد وخليج نعمة وأجمل مواقع الغوص',
                'tagline_en' => 'Ras Mohammed, Naama Bay & world-class diving',
                'description_ar' => 'لؤلؤة سيناء على البحر الأحمر. محمية رأس محمد من أجمل مواقع الغوص في العالم، وخليج نعمة بنبضه الليلي، ودهب القريبة بروحها الهادئة — بحر صافٍ وجبال وردية عند الأفق.',
                'description_en' => 'The pearl of Sinai on the Red Sea. Ras Mohammed National Park offers some of the finest diving on Earth, Naama Bay hums at night, and nearby Dahab keeps a laid-back soul — clear seas with rose-coloured mountains on the horizon.',
                'region' => 'red_sea',
                'gradient' => 'from-cyan-400 via-teal-500 to-nile-800',
                'glyph' => '𓇋',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'slug' => 'siwa',
                'name_ar' => 'واحة سيوة',
                'name_en' => 'Siwa Oasis',
                'tagline_ar' => 'معبد الوحي وبحيرات الملح وبحر الرمال العظيم',
                'tagline_en' => 'The Oracle Temple, salt lakes & the Great Sand Sea',
                'description_ar' => 'واحة الأساطير في قلب الصحراء الغربية، حيث زار الإسكندر الأكبر معبد وحي آمون. عيون كبريتية دافئة، بحيرات ملح فيروزية، قلعة شالي الطينية، وغروب لا يُنسى فوق بحر الرمال العظيم.',
                'description_en' => 'The legendary oasis deep in the Western Desert, where Alexander the Great consulted the Oracle of Amun. Warm sulphur springs, turquoise salt lakes, the mud-brick Shali Fortress, and unforgettable sunsets over the Great Sand Sea.',
                'region' => 'desert',
                'gradient' => 'from-yellow-500 via-amber-500 to-orange-700',
                'glyph' => '𓇳',
                'is_featured' => true,
                'sort_order' => 6,
            ],
            [
                'slug' => 'alexandria',
                'name_ar' => 'الإسكندرية',
                'name_en' => 'Alexandria',
                'tagline_ar' => 'قلعة قايتباي والمكتبة وروح المتوسط',
                'tagline_en' => 'Qaitbay Citadel, the Library & Mediterranean soul',
                'description_ar' => 'عروس البحر المتوسط التي أسسها الإسكندر الأكبر. قلعة قايتباي على أنقاض المنارة العظيمة، مكتبة الإسكندرية الحديثة، مقابر كوم الشقافة الرومانية، وكورنيش يمتد من المنتزه إلى بحري بروح لا تشبه سواها.',
                'description_en' => 'The bride of the Mediterranean, founded by Alexander the Great. Qaitbay Citadel rises where the great Lighthouse once stood, the modern Bibliotheca Alexandrina revives its legacy, and the Corniche runs from Montaza to Bahary with a spirit all its own.',
                'region' => 'mediterranean',
                'gradient' => 'from-sky-400 via-nile-800 to-nile-950',
                'glyph' => '𓈗',
                'is_featured' => false,
                'sort_order' => 7,
            ],
            [
                'slug' => 'fayoum',
                'name_ar' => 'الفيوم',
                'name_en' => 'Fayoum',
                'tagline_ar' => 'شلالات وادي الريان ووادي الحيتان وقرية تونس',
                'tagline_en' => 'Wadi El Rayan waterfalls, Valley of the Whales & Tunis Village',
                'description_ar' => 'أقرب واحات مصر إلى القاهرة ومفاجأتها الأجمل: شلالات وادي الريان الوحيدة في مصر، حفريات وادي الحيتان المصنفة تراثًا عالميًا، بحيرة قارون، وقرية تونس الخضراء بورش الفخار الشهيرة.',
                'description_en' => 'Cairo’s closest oasis and its loveliest surprise: Egypt’s only waterfalls at Wadi El Rayan, the UNESCO-listed whale fossils of Wadi El Hitan, Lake Qarun, and the green pottery village of Tunis.',
                'region' => 'desert',
                'gradient' => 'from-emerald-400 via-teal-600 to-nile-950',
                'glyph' => '𓈖',
                'is_featured' => false,
                'sort_order' => 8,
            ],
        ];

        foreach ($destinations as $destination) {
            $destination['image'] = '/images/destinations/'.$destination['slug'].'.jpg';

            Destination::updateOrCreate(['slug' => $destination['slug']], $destination);
        }
    }
}
