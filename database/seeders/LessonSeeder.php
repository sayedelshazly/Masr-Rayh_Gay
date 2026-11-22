<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\QuizQuestion;
use Illuminate\Database\Seeder;

/**
 * Seeds the academy's four lessons, their quizzes, and the general quiz.
 * Content is mainstream Egyptology: Gardiner sign values, the Rosetta
 * Stone decipherment, and widely attested words and symbols.
 */
class LessonSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->lessons() as $index => $data) {
            $lesson = Lesson::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title_ar' => $data['title_ar'],
                    'title_en' => $data['title_en'],
                    'summary_ar' => $data['summary_ar'],
                    'summary_en' => $data['summary_en'],
                    'content_ar' => $data['content_ar'],
                    'content_en' => $data['content_en'],
                    'level' => $data['level'],
                    'estimated_minutes' => $data['minutes'],
                    'sort_order' => $index + 1,
                ],
            );

            foreach ($data['questions'] as $qIndex => $question) {
                QuizQuestion::updateOrCreate(
                    ['lesson_id' => $lesson->id, 'sort_order' => $qIndex + 1],
                    [
                        'question_ar' => $question[0],
                        'question_en' => $question[1],
                        'options_ar' => $question[2],
                        'options_en' => $question[3],
                        'correct_index' => $question[4],
                        'explanation_ar' => $question[5],
                        'explanation_en' => $question[6],
                    ],
                );
            }
        }

        foreach ($this->generalQuestions() as $qIndex => $question) {
            QuizQuestion::updateOrCreate(
                ['lesson_id' => null, 'sort_order' => $qIndex + 1],
                [
                    'question_ar' => $question[0],
                    'question_en' => $question[1],
                    'options_ar' => $question[2],
                    'options_en' => $question[3],
                    'correct_index' => $question[4],
                    'explanation_ar' => $question[5],
                    'explanation_en' => $question[6],
                ],
            );
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function lessons(): array
    {
        return [
            [
                'slug' => 'what-is-hieroglyphic-writing',
                'title_ar' => 'ما هي الكتابة الهيروغليفية؟',
                'title_en' => 'What is hieroglyphic writing?',
                'summary_ar' => 'قصة أقدم كتابة مصرية: متى ظهرت، وكيف تُقرأ، وكيف فكّ شامبليون شفرتها بحجر رشيد.',
                'summary_en' => 'The story of Egypt’s sacred script: when it appeared, how it is read, and how Champollion cracked it with the Rosetta Stone.',
                'level' => 'beginner',
                'minutes' => 6,
                'content_ar' => [
                    ['heading' => 'كتابة من الصور… لكنها ليست صورًا فقط', 'body' => 'كلمة «هيروغليفي» أصلها يوناني وتعني «النقش المقدس»، لأن هذه العلامات كانت تُنقش على جدران المعابد والمقابر. ظهرت الكتابة الهيروغليفية في مصر حوالي سنة ٣٢٠٠ قبل الميلاد، وظل المصريون يستخدمونها أكثر من ٣٠٠٠ سنة. ورغم أن العلامات مرسومة كطيور وحيوانات وأشياء من الحياة اليومية، فهي ليست رسائل مصوّرة بسيطة: أغلب العلامات تمثّل أصواتًا في اللغة المصرية القديمة، تمامًا مثل الحروف في الأبجدية.'],
                    ['heading' => 'ثلاثة أنواع من العلامات', 'body' => 'تنقسم العلامات الهيروغليفية إلى ثلاث مجموعات: علامات صوتية تنطق صوتًا واحدًا أو صوتين أو ثلاثة، وعلامات كلمات تصوّر الشيء نفسه (مثل قرص الشمس ويعني «رع/شمس»)، ومُخصِّصات صامتة لا تُنطق وتوضع في آخر الكلمة لتوضيح معناها — مثل علامة الرجل بعد أسماء الرجال. عدد العلامات الشائعة الاستخدام حوالي ٧٠٠ علامة.'],
                    ['heading' => 'في أي اتجاه نقرأ؟', 'body' => 'تُقرأ الهيروغليفية في سطور أفقية أو أعمدة رأسية، من اليمين إلى اليسار أو من اليسار إلى اليمين. والقاعدة الذهبية سهلة: اقرأ في اتجاه وجوه العلامات — أي ابدأ من الجهة التي تنظر إليها الطيور والحيوانات والبشر. إذا كانت العلامات تنظر يمينًا، ابدأ من اليمين.'],
                    ['heading' => 'حجر رشيد وفك الشفرة', 'body' => 'آخر نقش هيروغليفي معروف كُتب سنة ٣٩٤ ميلادية في معبد فيلة، وبعدها ضاع سر القراءة أكثر من ألف سنة. تغيّر كل شيء مع اكتشاف حجر رشيد سنة ١٧٩٩: نقش واحد بثلاث كتابات — الهيروغليفية والديموطيقية واليونانية. وبمقارنة النصوص، نجح الفرنسي جان فرانسوا شامبليون سنة ١٨٢٢ في فك الشفرة، فعادت مصر القديمة تتكلم من جديد.'],
                ],
                'content_en' => [
                    ['heading' => 'Picture writing… but not just pictures', 'body' => 'The word “hieroglyph” comes from Greek and means “sacred carving”, because these signs were carved on temple and tomb walls. Hieroglyphic writing appeared in Egypt around 3200 BCE and was used for more than 3,000 years. Although the signs are drawn as birds, animals and everyday objects, they are not simple picture messages: most signs stand for sounds in the ancient Egyptian language, much like letters in an alphabet.'],
                    ['heading' => 'Three kinds of signs', 'body' => 'Hieroglyphs fall into three groups: phonetic signs that spell one, two or three sounds; word signs (logograms) that picture the thing itself, such as the sun disk meaning “Ra/sun”; and determinatives — silent signs placed at the end of a word to clarify its meaning, like a seated man after men’s names. Around 700 signs were in common use.'],
                    ['heading' => 'Which way do we read?', 'body' => 'Hieroglyphs are read in horizontal lines or vertical columns, right-to-left or left-to-right. The golden rule is simple: read into the faces of the signs — start from the side the birds, animals and people are looking towards. If the signs face right, begin at the right.'],
                    ['heading' => 'The Rosetta Stone and the breakthrough', 'body' => 'The last known hieroglyphic inscription was carved in 394 CE at the temple of Philae, and the secret of reading the script was then lost for over a thousand years. Everything changed with the discovery of the Rosetta Stone in 1799: a single decree in three scripts — hieroglyphic, Demotic and Greek. By comparing them, the French scholar Jean-François Champollion cracked the code in 1822, and ancient Egypt could speak again.'],
                ],
                'questions' => [
                    ['متى ظهرت الكتابة الهيروغليفية تقريبًا؟', 'Around when did hieroglyphic writing appear?', ['حوالي ٣٢٠٠ قبل الميلاد', 'حوالي ١٥٠٠ قبل الميلاد', 'سنة ١٨٢٢ ميلادية', 'سنة ٥٠٠ ميلادية'], ['Around 3200 BCE', 'Around 1500 BCE', 'In 1822 CE', 'In 500 CE'], 0, 'ظهرت الهيروغليفية حوالي ٣٢٠٠ ق.م وظلت مستخدمة أكثر من ٣٠٠٠ سنة.', 'Hieroglyphs appeared around 3200 BCE and stayed in use for over 3,000 years.'],
                    ['كيف تعرف اتجاه قراءة أي نقش هيروغليفي؟', 'How do you know which direction to read a hieroglyphic inscription?', ['تُقرأ دائمًا من اليسار إلى اليمين', 'نقرأ في اتجاه وجوه العلامات — نبدأ من الجهة التي تنظر إليها', 'نقرأ من أكبر علامة إلى أصغر علامة', 'تُقرأ دائمًا من الأسفل إلى الأعلى'], ['Always left to right', 'Read into the faces of the signs — start from the side they look towards', 'From the biggest sign to the smallest', 'Always bottom to top'], 1, 'وجوه الطيور والحيوانات والبشر في النقش تشير إلى بداية السطر.', 'The faces of birds, animals and people point to where the line begins.'],
                    ['ما الكتابات الثلاث الموجودة على حجر رشيد؟', 'Which three scripts appear on the Rosetta Stone?', ['الهيروغليفية والمسمارية واللاتينية', 'الهيروغليفية والديموطيقية واليونانية', 'اليونانية واللاتينية والقبطية', 'الهيروغليفية والهيراطيقية والعبرية'], ['Hieroglyphic, cuneiform and Latin', 'Hieroglyphic, Demotic and Greek', 'Greek, Latin and Coptic', 'Hieroglyphic, hieratic and Hebrew'], 1, 'النقش نفسه كُتب بالهيروغليفية والديموطيقية واليونانية، فأمكنت المقارنة بينها.', 'The same decree was written in hieroglyphic, Demotic and Greek, which made comparison possible.'],
                    ['من الذي فكّ شفرة الهيروغليفية سنة ١٨٢٢؟', 'Who deciphered hieroglyphs in 1822?', ['هوارد كارتر', 'نابليون بونابرت', 'جان فرانسوا شامبليون', 'هيرودوت'], ['Howard Carter', 'Napoleon Bonaparte', 'Jean-François Champollion', 'Herodotus'], 2, 'شامبليون قارن أسماء الملوك في الخراطيش بالنص اليوناني ووصل إلى قيم العلامات الصوتية.', 'Champollion compared royal names in cartouches with the Greek text to recover the signs’ sound values.'],
                    ['أين ومتى كُتب آخر نقش هيروغليفي معروف؟', 'Where and when was the last known hieroglyphic inscription carved?', ['في الكرنك سنة ١٠٠ ق.م', 'في معبد فيلة سنة ٣٩٤ م', 'في هرم خوفو سنة ٢٥٠٠ ق.م', 'في الإسكندرية سنة ١٧٩٩ م'], ['At Karnak in 100 BCE', 'At Philae temple in 394 CE', 'In Khufu’s pyramid in 2500 BCE', 'In Alexandria in 1799 CE'], 1, 'نقش فيلة سنة ٣٩٤ م هو آخر نص هيروغليفي مؤرّخ نعرفه.', 'The Philae inscription of 394 CE is the last dated hieroglyphic text we know.'],
                ],
            ],
            [
                'slug' => 'the-alphabet-signs',
                'title_ar' => 'الأبجدية: الأصوات والعلامات',
                'title_en' => 'The alphabet: sounds and signs',
                'summary_ar' => 'تعرّف على العلامات أحادية الصوت — البومة «م» والماء «ن» والفم «ر» — ولماذا لا نجد حروفًا متحركة في النصوص القديمة.',
                'summary_en' => 'Meet the uniliteral signs — owl “m”, water “n”, mouth “r” — and learn why ancient texts have no written vowels.',
                'level' => 'beginner',
                'minutes' => 8,
                'content_ar' => [
                    ['heading' => 'علامة واحدة… صوت واحد', 'body' => 'أبسط علامات الهيروغليفية هي العلامات أحادية الصوت: كل علامة تمثّل صوتًا واحدًا مثل حروف الأبجدية. عددها حوالي ٢٤ إلى ٣٠ علامة، وهي أسهل طريق لبدء القراءة: البومة تعني «م»، وتموّجات الماء تعني «ن»، والفم يعني «ر»، وورقة البوص تعني «ي»، والنسر يعني «أ». إذا حفظت هذه المجموعة الصغيرة، تستطيع أن تهجّي أغلب الأسماء.'],
                    ['heading' => 'علامات تنطق صوتين وثلاثة', 'body' => 'ليست كل العلامات أحادية؛ فبعضها ينطق صوتين مثل علامة السلة «نب» (nb) التي تعني أيضًا «سيد/كل»، وبعضها ثلاثة أصوات مثل علامة الجعران «خبر» (ḫpr) ومعناها «يأتي إلى الوجود». هذه العلامات الأكبر تختصر الكتابة وتجعل النصوص أسرع في النقش والقراءة لمن يعرفها.'],
                    ['heading' => 'أين الحروف المتحركة؟', 'body' => 'المصريون القدماء لم يكتبوا الحروف المتحركة (a, e, i, o, u)؛ كانوا يكتبون الأصوات الساكنة فقط، والقارئ يخمّن الحركات من السياق — مثلما نقرأ نحن أحيانًا العربية بلا تشكيل. وعندما ينقل علماء المصريات الكلمات إلى الحروف اللاتينية يضيفون حرف «e» بين السواكن لتسهيل النطق، فكلمة «نفر» (nfr) تُقرأ «نِفِر» ومعناها جميل أو طيّب.'],
                    ['heading' => 'جرّب بنفسك', 'body' => 'اسم «رع» إله الشمس يُكتب بعلامة الفم «ر» ثم علامة الساعد «ع». واسمك أنت أيضًا يمكن تهجئته بالعلامات أحادية الصوت: جرّب أداة كتابة الاسم في الأكاديمية، وتذكّر أن الأسماء الحديثة تُكتب تقريبيًا لأن بعض الأصوات الحديثة لم تكن موجودة في اللغة القديمة بنفس الصورة.'],
                ],
                'content_en' => [
                    ['heading' => 'One sign… one sound', 'body' => 'The simplest hieroglyphs are the uniliteral signs: each one stands for a single sound, just like a letter of the alphabet. There are about 24 to 30 of them, and they are the easiest way to start reading: the owl is “m”, ripples of water are “n”, the mouth is “r”, the reed leaf is “i”, and the vulture is “a”. Learn this small set and you can spell most names.'],
                    ['heading' => 'Signs worth two or three sounds', 'body' => 'Not every sign is uniliteral. Some spell two sounds, like the wicker basket “nb”, which can also mean “lord” or “all”, and some spell three, like the scarab “kheper” (ḫpr), meaning “to come into being”. These bigger building blocks made writing faster for those who knew them.'],
                    ['heading' => 'Where are the vowels?', 'body' => 'The ancient Egyptians did not write vowels (a, e, i, o, u); they wrote consonants only, and readers supplied the vowels from context — much like reading unvowelled Arabic today. When Egyptologists transliterate words into Latin letters, they insert an “e” between consonants to make them pronounceable: “nfr” is read “nefer” and means beautiful or good.'],
                    ['heading' => 'Try it yourself', 'body' => 'The name of the sun god “Ra” is written with the mouth sign “r” followed by the forearm “ꜥ”. Your own name can be spelled with uniliteral signs too: try the academy’s name-writing tool, and remember that modern names are approximations, because some modern sounds did not exist in the ancient language in quite the same form.'],
                ],
                'questions' => [
                    ['ما العلامة أحادية الصوت؟', 'What is a uniliteral sign?', ['علامة تصوّر كلمة كاملة دائمًا', 'علامة تمثّل صوتًا واحدًا مثل الحرف الأبجدي', 'علامة صامتة لا تُنطق أبدًا', 'علامة تعني رقمًا'], ['A sign that always pictures a whole word', 'A sign that stands for one sound, like a letter', 'A silent sign that is never pronounced', 'A sign that means a number'], 1, 'العلامات أحادية الصوت حوالي ٢٤–٣٠ علامة، وكل واحدة منها تنطق صوتًا واحدًا.', 'There are about 24–30 uniliteral signs, each pronounced as a single sound.'],
                    ['علامة البومة تنطق أي صوت؟', 'What sound does the owl sign make?', ['ن', 'ر', 'م', 'ب'], ['n', 'r', 'm', 'b'], 2, 'البومة (G17) هي علامة الصوت «م».', 'The owl (G17) is the sign for the sound “m”.'],
                    ['ما وظيفة المُخصِّص في آخر الكلمة؟', 'What does a determinative do at the end of a word?', ['يُقرأ بصوت عالٍ دائمًا', 'علامة صامتة توضّح فئة معنى الكلمة', 'يفصل بين الجمل', 'يعني الرقم واحد'], ['It is always read aloud', 'It is a silent sign that shows the word’s meaning category', 'It separates sentences', 'It means the number one'], 1, 'المخصصات لا تُنطق؛ هي تلميح بصري لمعنى الكلمة، مثل علامة الرجل بعد أسماء الرجال.', 'Determinatives are not pronounced; they are visual hints to a word’s meaning, like a man sign after men’s names.'],
                    ['لماذا نرى حرف «e» كثيرًا في كلمات مثل «nefer»؟', 'Why do we see the letter “e” so often in words like “nefer”?', ['لأن المصريين كتبوا كل الحركات', 'لأن علماء المصريات يضيفونه بين السواكن لتسهيل النطق؛ فالحركات لم تُكتب قديمًا', 'لأنه اسم إله الشمس', 'لأنه خطأ مطبعي مشهور'], ['Because Egyptians wrote every vowel', 'Egyptologists insert it between consonants to aid pronunciation; vowels were not written', 'Because it is the sun god’s name', 'Because of a famous typo'], 1, 'النصوص القديمة كتبت السواكن فقط، وإضافة «e» اصطلاح حديث للقراءة.', 'Ancient texts wrote consonants only; the “e” is a modern reading convention.'],
                    ['تموّجات الماء تعني أي صوت؟', 'Ripples of water stand for which sound?', ['م', 'ن', 'و', 'س'], ['m', 'n', 'w', 's'], 1, 'علامة الماء (N35) تنطق «ن».', 'The water sign (N35) is pronounced “n”.'],
                ],
            ],
            [
                'slug' => 'famous-symbols-and-meanings',
                'title_ar' => 'رموز مشهورة ومعانيها',
                'title_en' => 'Famous symbols and their meanings',
                'summary_ar' => 'العنخ للحياة، وعين حورس للحماية، والجعران للبعث، وريشة ماعت للحق — حكاية أشهر رموز مصر القديمة.',
                'summary_en' => 'The ankh for life, the Eye of Horus for protection, the scarab for rebirth, and Maat’s feather for truth — the stories behind Egypt’s most famous symbols.',
                'level' => 'beginner',
                'minutes' => 7,
                'content_ar' => [
                    ['heading' => 'العنخ: مفتاح الحياة', 'body' => 'العنخ (𓋹) هو أشهر رمز مصري على الإطلاق، ويعني «الحياة» (ꜥnḫ). شكله حلقة فوق صليب، وتراه في يد الآلهة والملوك في النقوش وهم يقدّمونه إلى الأنف بمعنى نفَس الحياة. حتى اليوم يُستخدم العنخ رمزًا لمصر والهوية والحياة الأبدية.'],
                    ['heading' => 'عين حورس: الحماية والشفاء', 'body' => 'عين حورس (𓂀) وتسمى أيضًا «الوجات» أي السليمة. تحكي الأسطورة أن الصقر حورس فقد عينه اليسرى في صراعه مع عمه ست على عرش مصر، ثم أعادها الإله تحوت سليمة بسحره. لذلك صارت العين رمزًا للحماية والشفاء والاكتمال، ورُسمت على التوابيت والتمائم والقوارب.'],
                    ['heading' => 'الجعران والجد والواس', 'body' => 'الجعران (𓆣) رمز البعث والتجدد: لاحظ المصريون الجعران يدحرج كرته فشبّهوه بالإله خبري يدحرج الشمس كل صباح. وعمود الجد (𓊽) يرمز إلى الثبات والاستقرار وارتبط بأوزير. أما صولجان الواس (𓌀) برأس الحيوان وجذعه المشقوق فيرمز إلى القوة والسلطان والرخاء.'],
                    ['heading' => 'ريشة ماعت وشمس رع', 'body' => 'ماعت هي إلهة الحق والعدل والنظام، وريشتها (𓆄) هي ميزان الكون: في قاعة المحاكمة بالعالم الآخر كان يُوزن قلب الميت مقابل ريشة ماعت، فمن خفّ قلبه أو ساواها نجا. وقرص الشمس (𓇳) هو رمز رع، خالق الكون ومصدر النور، الذي يعبر السماء نهارًا في مركبه ويجوب العالم السفلي ليلًا.'],
                ],
                'content_en' => [
                    ['heading' => 'The ankh: key of life', 'body' => 'The ankh (𓋹) is the most famous Egyptian symbol of all, and it means “life” (ꜥnḫ). Shaped like a loop above a cross, it appears in the hands of gods and kings, offered to the nose as the breath of life. To this day it remains a symbol of Egypt, identity and eternal life.'],
                    ['heading' => 'The Eye of Horus: protection and healing', 'body' => 'The Eye of Horus (𓂀) is also called the Wedjat, “the sound/whole one”. Myth tells how the falcon god Horus lost his left eye fighting his uncle Seth for the throne of Egypt, and how the god Thoth restored it by magic. The eye therefore became a symbol of protection, healing and wholeness, painted on coffins, amulets and boats.'],
                    ['heading' => 'Scarab, djed and was', 'body' => 'The scarab (𓆣) symbolises rebirth and renewal: Egyptians watched the beetle roll its ball and compared it to the god Khepri rolling the sun across the sky each morning. The djed pillar (𓊽) stands for stability and endurance and was linked to Osiris. The was sceptre (𓌀), with its animal head and forked base, means power, dominion and well-being.'],
                    ['heading' => 'Maat’s feather and the sun of Ra', 'body' => 'Maat is the goddess of truth, justice and cosmic order, and her feather (𓆄) is the measure of the universe: in the judgement hall of the afterlife, the heart of the deceased was weighed against Maat’s feather, and whoever’s heart balanced it passed safely. The sun disk (𓇳) belongs to Ra, creator of the universe and source of light, who sails across the sky by day and through the underworld by night.'],
                ],
                'questions' => [
                    ['ماذا يعني رمز العنخ (𓋹)؟', 'What does the ankh (𓋹) mean?', ['الموت', 'الحياة', 'الحرب', 'النيل'], ['Death', 'Life', 'War', 'The Nile'], 1, 'العنخ يعني «الحياة» (ꜥnḫ) وهو رمز الحياة الأبدية.', 'The ankh means “life” (ꜥnḫ) and symbolises eternal life.'],
                    ['عين حورس رمز لأي شيء؟', 'The Eye of Horus is a symbol of what?', ['الخوف والظلام', 'الحماية والشفاء والسلامة', 'الفيضان', 'الحصاد'], ['Fear and darkness', 'Protection, healing and wholeness', 'The flood', 'The harvest'], 1, 'شُفيت عين حورس بعد إصابتها في صراعه مع ست، فصارت رمز الحماية والشفاء.', 'Horus’s eye was healed after his fight with Seth, making it a symbol of protection and healing.'],
                    ['لماذا ارتبط الجعران بالبعث والتجدد؟', 'Why was the scarab linked to rebirth and renewal?', ['لأنه كان يُؤكل في الأعياد', 'لأنه يدحرج كرته كما يدحرج الإله خبري الشمس كل صباح', 'لأنه يعيش في النيل', 'لأنه كان عملة مصر'], ['It was eaten at festivals', 'It rolls its ball just as the god Khepri rolls the sun each morning', 'It lives in the Nile', 'It was Egypt’s currency'], 1, 'حركة الجعران اليومية ذكّرت المصريين بشروق الشمس المتجدد كل يوم.', 'The beetle’s daily rolling reminded Egyptians of the sun rising anew each day.'],
                    ['عمود الجد (𓊽) يرمز إلى…', 'The djed pillar (𓊽) symbolises…', ['السرعة', 'الثبات والاستقرار', 'المطر', 'النسيان'], ['Speed', 'Stability and endurance', 'Rain', 'Forgetfulness'], 1, 'الجد رمز الثبات والاستمرارية وارتبط بالإله أوزير.', 'The djed stands for stability and continuity and was associated with Osiris.'],
                    ['ماذا كان يحدث لريشة ماعت في العالم الآخر؟', 'What happened with Maat’s feather in the afterlife?', ['تُحرق مع الميت', 'يُوزن قلب الميت مقابلها في محاكمة العالم الآخر', 'تُوضع في مركب الشمس', 'تُدفن عند باب الهرم'], ['It was burned with the dead', 'The heart of the deceased was weighed against it at judgement', 'It was placed in the sun boat', 'It was buried at the pyramid gate'], 1, 'إذا ساوى القلب الريشة أو خفّ عنها، عبر صاحبه إلى حياة الأبدية.', 'If the heart balanced the feather or was lighter, its owner passed into eternal life.'],
                ],
            ],
            [
                'slug' => 'words-phrases-and-cartouches',
                'title_ar' => 'كلمات وعبارات شائعة وسرّ الخراطيش',
                'title_en' => 'Common words, phrases and the secret of cartouches',
                'summary_ar' => 'اقرأ كلمات حقيقية من مصر القديمة مثل «نفر» و«حتب»، وتعرّف على الخرطوش الملكي وكيف ساعد في فك شفرة الهيروغليفية.',
                'summary_en' => 'Read real ancient words like “nefer” and “hotep”, and discover the royal cartouche — and how it helped crack the hieroglyphic code.',
                'level' => 'intermediate',
                'minutes' => 9,
                'content_ar' => [
                    ['heading' => 'كلمات تقرؤها بنفسك', 'body' => 'جرّب قراءة هذه الكلمات الحقيقية: «نفر» (nfr) وتعني جميل أو طيّب — ومنها اسم الملكة نفرتيتي أي «الجميلة أتت». و«حتب» (ḥtp) تعني السلام والرضا والقرابين. و«بر» (pr) تعني بيت، و«نتر» (nṯr) تعني إله، و«عنخ» (ꜥnḫ) تعني حياة. لاحظ أن الحركات غير مكتوبة؛ نحن نضيف «e» بين الحروف للنطق.'],
                    ['heading' => 'عبارات من الحياة اليومية', 'body' => 'من أشهر العبارات المصرية القديمة التحية «إي إم حتب» أي «تعالَ بسلام» وتُستخدم للترحيب حتى اليوم بصيغ قريبة. وبعد أسماء الملوك كان الكتبة يكتبون الدعاء الشهير «عنخ وجّا سنب» (ꜥnḫ wḏꜣ snb) أي «ليعش، ليكن مزدهرًا، ليكن معافى» — أي الحياة والازدهار والصحة.'],
                    ['heading' => 'ما الخرطوش؟', 'body' => 'الخرطوش هو إطار بيضاوي يشبه الحلقة يحيط بأسماء الملوك والملكات فقط. أصله حلقة «شن» التي ترمز إلى الأبدية والحماية والكون الذي تحيط به الشمس. الخرطوش إذن ليس زخرفة: إنه حلقة حماية سحرية حول الاسم الملكي، ولهذا تجده منقوشًا على كل معبد ومقبرة ملكية تقريبًا.'],
                    ['heading' => 'الخراطيش تفك الشفرة', 'body' => 'كانت الخراطيش مفتاح شامبليون الذهبي: عرف من النص اليوناني أن خرطوشًا معينًا يجب أن يحتوي اسم «بطليموس»، وخرطوشًا آخر اسم «كليوباترا». وبمقارنة العلامات المشتركة بين الاسمين استخرج قيمًا صوتية صحيحة لعلامات كثيرة — ومن هناك انفتح باب قراءة اللغة كلها.'],
                    ['heading' => 'اسمك في خرطوش', 'body' => 'اليوم تُرسم الأسماء الحديثة داخل خراطيش للزينة والهدايا في كل بازارات مصر. جرّب أداة كتابة الاسم في الأكاديمية وستجد اسمك متهجّى بالعلامات أحادية الصوت داخل إطار خرطوشي — تقريب جميل للطريقة التي كُتبت بها أسماء الملوك قبل آلاف السنين.'],
                ],
                'content_en' => [
                    ['heading' => 'Words you can read yourself', 'body' => 'Try reading these real words: “nfr” (nefer) means beautiful or good — the name Nefertiti means “the beautiful one has come”. “ḥtp” (hotep) means peace, contentment and offerings. “pr” means house, “nṯr” (netjer) means god, and “ꜥnḫ” (ankh) means life. Notice the vowels are not written; we add “e” between consonants to pronounce them.'],
                    ['heading' => 'Phrases from daily life', 'body' => 'One of the most famous ancient greetings is “ii m ḥtp” — “come in peace”, used as a welcome. After a king’s name, scribes wrote the classic blessing “ꜥnḫ wḏꜣ snb” (ankh, wedja, seneb): “life, prosperity, health” — a wish for the king to live, prosper and be healthy.'],
                    ['heading' => 'What is a cartouche?', 'body' => 'A cartouche is an oval, ring-like frame that encloses the names of kings and queens only. It developed from the “shen” ring, symbol of eternity, protection and everything the sun encircles. A cartouche is therefore not decoration: it is a magical ring of protection around the royal name, found on almost every royal temple and tomb.'],
                    ['heading' => 'Cartouches crack the code', 'body' => 'Cartouches were Champollion’s golden key: from the Greek text he knew one cartouche had to contain the name “Ptolemy” and another “Cleopatra”. By comparing the signs the two names shared, he recovered correct sound values for many signs — and from there, the whole language opened up.'],
                    ['heading' => 'Your name in a cartouche', 'body' => 'Today, modern names are drawn inside cartouches as jewellery and souvenirs in bazaars all over Egypt. Try the academy’s name tool and you will see your name spelled with uniliteral signs inside a cartouche frame — a charming echo of how royal names were written thousands of years ago.'],
                ],
                'questions' => [
                    ['ماذا يعني الخرطوش في النقوش الملكية؟', 'What is a cartouche in royal inscriptions?', ['إطار بيضاوي يحمي اسم الملك أو الملكة ويرمز للأبدية', 'نوع من التيجان', 'ختم للإدارة والضرائب', 'اسم نهر قديم'], ['An oval frame protecting the king’s or queen’s name, symbolising eternity', 'A type of crown', 'An administrative tax seal', 'The name of an ancient river'], 0, 'الخرطوش تطور من حلقة «شن» رمز الأبدية، وكان يحيط بأسماء الملوك للحماية.', 'The cartouche grew from the “shen” ring of eternity and protected royal names.'],
                    ['الدعاء «عنخ وجّا سنب» (ꜥnḫ wḏꜣ snb) يعني…', 'The blessing “ꜥnḫ wḏꜣ snb” (ankh, wedja, seneb) means…', ['حرب ونصر ومجد', 'حياة وازدهار وصحة', 'شمس وقمر ونجوم', 'ذهب وفضة ونحاس'], ['War, victory and glory', 'Life, prosperity and health', 'Sun, moon and stars', 'Gold, silver and copper'], 1, 'كان الدعاء يُكتب بعد أسماء الملوك: ليعش مزدهرًا معافى.', 'The blessing was written after kings’ names: may he live, prosper and be healthy.'],
                    ['كلمة «نفر» (nfr) تعني…', 'The word “nfr” (nefer) means…', ['حرب', 'جميل / طيّب', 'نهر', 'ملك'], ['War', 'Beautiful / good', 'River', 'King'], 1, '«نفر» تعني جميل أو طيّب، ومنها اسم نفرتيتي: «الجميلة أتت».', '“Nefer” means beautiful or good — Nefertiti means “the beautiful one has come”.'],
                    ['كيف ساعدت الخراطيش شامبليون في فك الشفرة؟', 'How did cartouches help Champollion decipher hieroglyphs?', ['كانت تحتوي على أرقام سرية', 'عرف من اليونانية أن خراطيش معينة تحمل اسمي بطليموس وكليوباترا فقارن علاماتهما', 'وجد قاموسًا داخل خرطوش', 'كانت مكتوبة باللاتينية'], ['They contained secret numbers', 'He knew from the Greek that certain cartouches held the names Ptolemy and Cleopatra, so he compared their signs', 'He found a dictionary inside a cartouche', 'They were written in Latin'], 1, 'مقارنة العلامات المشتركة بين الاسمين أعطته قيمًا صوتية مؤكدة لعلامات كثيرة.', 'Comparing signs shared by the two names gave him confirmed sound values for many signs.'],
                    ['كلمة «حتب» (ḥtp) تدور حول معنى…', 'The word “ḥtp” (hotep) centres on the meaning of…', ['السلام والرضا والقرابين', 'الخوف', 'السفر', 'البناء'], ['Peace, contentment and offerings', 'Fear', 'Travel', 'Building'], 0, '«حتب» تعني السلام والرضا، وتظهر في تحية «إي إم حتب»: تعالَ بسلام.', '“Hotep” means peace and contentment, as in the greeting “ii m hotep” — come in peace.'],
                ],
            ],
        ];
    }

    /** @return array<int, array<int, mixed>> */
    private function generalQuestions(): array
    {
        return [
            ['رمز العنخ (𓋹) يعني…', 'The ankh symbol (𓋹) means…', ['الحياة', 'الموت', 'الحرب', 'الفيضان'], ['Life', 'Death', 'War', 'The flood'], 0, 'العنخ هو «مفتاح الحياة» وأشهر رموز مصر القديمة.', 'The ankh is the “key of life”, ancient Egypt’s most famous symbol.'],
            ['علامة البومة تنطق…', 'The owl sign is pronounced…', ['ن (n)', 'م (m)', 'ر (r)', 'ت (t)'], ['n', 'm', 'r', 't'], 1, 'البومة (G17) علامة أحادية الصوت للنطق «م».', 'The owl (G17) is the uniliteral sign for “m”.'],
            ['كم سنة تقريبًا استُخدمت الكتابة الهيروغليفية؟', 'For roughly how long was hieroglyphic writing used?', ['حوالي ٣٠٠ سنة', 'حوالي ١٠٠٠ سنة', 'أكثر من ٣٠٠٠ سنة', 'حوالي ١٠٠ سنة'], ['About 300 years', 'About 1,000 years', 'More than 3,000 years', 'About 100 years'], 2, 'من حوالي ٣٢٠٠ ق.م حتى ٣٩٤ م — أكثر من ثلاثة آلاف سنة.', 'From about 3200 BCE to 394 CE — over three thousand years.'],
            ['الجعران يرمز إلى…', 'The scarab symbolises…', ['النوم والكسل', 'البعث والتجدد', 'الغضب', 'الجوع'], ['Sleep and laziness', 'Rebirth and renewal', 'Anger', 'Hunger'], 1, 'ارتبط الجعران بالإله خبري وشروق الشمس المتجدد كل صباح.', 'The scarab was linked to the god Khepri and the sun rising anew each morning.'],
            ['القاعدة الذهبية لاتجاه القراءة هي…', 'The golden rule for reading direction is…', ['ابدأ دائمًا من اليسار', 'اقرأ في اتجاه وجوه العلامات', 'ابدأ من أكبر علامة', 'اقرأ الأعمدة قبل السطور'], ['Always start from the left', 'Read into the faces of the signs', 'Start with the biggest sign', 'Read columns before rows'], 1, 'تنظر الطيور والحيوانات نحو بداية السطر، فابدأ من جهة نظرها.', 'Birds and animals face the beginning of the line, so start from the side they look towards.'],
        ];
    }
}
