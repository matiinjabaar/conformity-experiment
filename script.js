/* THE CONFORMITY EXPERIMENT — script.js
   Asch conformity paradigm — educational interactive experiment.
   8 stages: intro → calibration → 3× pressure trials → debrief → science → final
*/

'use strict';

/* ─── Security: refuse to run inside a frame ─────────────────────────── */
(function () {
  if (window.self !== window.top) {
    document.documentElement.classList.add('is-framed');
    return;
  }
  document.documentElement.classList.add('is-ready');
})();

/* ─── i18n strings ───────────────────────────────────────────────────── */
const T = {
  en: {
    dir: 'ltr',
    stepOf: (n, t) => `Step ${n} of ${t}`,
    /* stages */
    introKicker: 'A Psychology Experiment',
    introTitle: ['THE', 'CONFORMITY', 'EXPERIMENT'],
    introLead: 'A one-minute interactive experience based on the classic Asch conformity studies.',
    introMeta: 'Anonymous · No data stored · ~1 minute',
    introBtn: 'Begin',
    /* calibration */
    calKicker: 'Calibration',
    calTitle: 'Which line matches the reference?',
    calLead: 'Look at the line on the left. Which of the three lines on the right (A, B, or C) is the same length?',
    calNote: 'This is straightforward — there is one clearly correct answer.',
    calSubmit: 'Confirm',
    /* pressure */
    pressKicker: (n) => `Trial ${n}`,
    pressTitle: 'Which line matches?',
    pressGroupLabel: 'OTHER PARTICIPANTS',
    pressGroupNote: (a) => `${a} out of 5 other participants chose this answer.`,
    pressChoose: 'Your answer:',
    pressSubmit: 'Confirm my answer',
    /* debrief */
    debriefKicker: 'What just happened?',
    debriefTitle: 'You experienced the Asch Effect.',
    debriefLead: 'In each trial, the other "participants" unanimously chose a wrong answer. That pressure is real — and it affects most people.',
    debriefStat1v: '75%',
    debriefStat1d: 'of real participants conformed at least once',
    debriefStat2v: '32%',
    debriefStat2d: 'average conformity rate across all trials',
    debriefCard1h: 'What is conformity?',
    debriefCard1p: 'Conformity is adjusting your beliefs or behaviour to match a group — even when the group is wrong.',
    debriefCard2h: 'Why does it happen?',
    debriefCard2p1: 'Normative influence: wanting to fit in and avoid rejection.',
    debriefCard2p2: 'Informational influence: assuming the group might know something you don\'t.',
    debriefNext: 'See the science',
    /* science */
    sciKicker: 'The Research',
    sciTitle: 'Solomon Asch, 1951–1956',
    sciLead: 'Asch ran 18 trials with one real participant and 7 confederates — trained actors — who all gave the same wrong answer.',
    sciApps: [
      { h: 'Group size matters', d: 'Conformity peaks with 3–4 confederates; adding more has little extra effect.' },
      { h: 'One ally helps', d: 'If even one confederate gave the correct answer, conformity dropped by ~80%.' },
      { h: 'Written answers resist', d: 'When participants wrote their answer privately, conformity almost disappeared.' },
    ],
    sciCite: 'Asch, S. E. (1956). Studies of independence and conformity: A minority of one against a unanimous majority. Psychological Monographs, 70(9), 1–70.',
    sciNext: 'See your result',
    /* final */
    finalKicker: 'Your Result',
    finalConformTitle: 'You conformed',
    finalResistTitle: 'You resisted',
    finalConformBody: 'You chose the group\'s wrong answer at least once. That\'s completely normal — 75% of people do. What matters is knowing why.',
    finalResistBody: 'You picked the correct answer every time, even under group pressure. Knowing the effect can help you resist it.',
    finalConformVerdict: 'You conformed',
    finalResistVerdict: 'You resisted',
    finalRestartBtn: 'Try again',
    finalTimesLabel: (n) => n === 1 ? '1 time' : `${n} times`,
    finalConformedOut: (n, t) => `Conformed ${n} of ${t} trials`,
  },

  ar: {
    dir: 'rtl',
    stepOf: (n, t) => `الخطوة ${n} من ${t}`,
    introKicker: 'تجربة نفسية',
    introTitle: ['تجربة', 'المطابقة', 'الاجتماعية'],
    introLead: 'تجربة تفاعلية مدتها دقيقة واحدة، مستوحاة من دراسات آش الكلاسيكية حول المطابقة الاجتماعية.',
    introMeta: 'مجهول الهوية · لا تُحفظ أي بيانات · ~دقيقة واحدة',
    introBtn: 'ابدأ',
    calKicker: 'معايرة',
    calTitle: 'أي خط يطابق الخط المرجعي؟',
    calLead: 'انظر إلى الخط على اليسار. أيّ من الخطوط الثلاثة على اليمين (A أو B أو C) يساويه طولاً؟',
    calNote: 'هذا السؤال مباشر — هناك إجابة صحيحة واضحة.',
    calSubmit: 'تأكيد',
    pressKicker: (n) => `جولة ${n}`,
    pressTitle: 'أي خط يطابق؟',
    pressGroupLabel: 'المشاركون الآخرون',
    pressGroupNote: (a) => `اختار ${a} من أصل 5 مشاركين آخرين هذه الإجابة.`,
    pressChoose: 'إجابتك:',
    pressSubmit: 'تأكيد إجابتي',
    debriefKicker: 'ماذا حدث للتو؟',
    debriefTitle: 'لقد عشتَ تأثير آش.',
    debriefLead: 'في كل جولة، اختار المشاركون الآخرون "بالإجماع" إجابةً خاطئة. هذا الضغط حقيقي — ويؤثر في معظم الناس.',
    debriefStat1v: '٧٥٪',
    debriefStat1d: 'من المشاركين الحقيقيين طابقوا المجموعة مرةً على الأقل',
    debriefStat2v: '٣٢٪',
    debriefStat2d: 'معدل المطابقة عبر جميع الجولات',
    debriefCard1h: 'ما المطابقة الاجتماعية؟',
    debriefCard1p: 'المطابقة هي تعديل معتقداتك أو سلوكك لتتوافق مع المجموعة — حتى حين تكون المجموعة مخطئة.',
    debriefCard2h: 'لماذا تحدث؟',
    debriefCard2p1: 'التأثير المعياري: الرغبة في الانتماء وتجنّب الرفض.',
    debriefCard2p2: 'التأثير المعلوماتي: الافتراض بأن المجموعة قد تعرف ما لا تعرفه.',
    debriefNext: 'اطّلع على الأبحاث',
    sciKicker: 'البحث العلمي',
    sciTitle: 'سولومون آش، ١٩٥١–١٩٥٦',
    sciLead: 'أجرى آش ١٨ جولة مع مشارك حقيقي واحد و٧ متواطئين — ممثلين مدرَّبين — قدّموا جميعاً الإجابة الخاطئة ذاتها.',
    sciApps: [
      { h: 'حجم المجموعة مهم', d: 'تبلغ المطابقة ذروتها مع ٣–٤ متواطئين؛ وإضافة المزيد لا تُحدث فرقاً يُذكر.' },
      { h: 'حليف واحد يكفي', d: 'إذا أعطى متواطئ واحد الإجابة الصحيحة، انخفضت المطابقة بنسبة ~٨٠٪.' },
      { h: 'الإجابات المكتوبة أكثر مقاومة', d: 'حين كتب المشاركون إجاباتهم بصمت، اختفت المطابقة تقريباً.' },
    ],
    sciCite: 'Asch, S. E. (1956). Studies of independence and conformity. Psychological Monographs, 70(9), 1–70.',
    sciNext: 'اعرض نتيجتك',
    finalKicker: 'نتيجتك',
    finalConformTitle: 'طابقتَ المجموعة',
    finalResistTitle: 'قاومتَ الضغط',
    finalConformBody: 'اخترتَ إجابة المجموعة الخاطئة مرةً على الأقل. هذا طبيعي تماماً — ٧٥٪ من الناس يفعلون ذلك. الأهم هو أن تعرف السبب.',
    finalResistBody: 'اخترتَ الإجابة الصحيحة في كل مرة، حتى تحت ضغط المجموعة. معرفة هذا التأثير تساعدك على مقاومته.',
    finalConformVerdict: 'طابقتَ المجموعة',
    finalResistVerdict: 'قاومتَ الضغط',
    finalRestartBtn: 'أعد التجربة',
    finalTimesLabel: (n) => n === 1 ? 'مرة واحدة' : `${n} مرات`,
    finalConformedOut: (n, t) => `طابقتَ المجموعة ${n} من أصل ${t} جولات`,
  },

  ckb: {
    dir: 'rtl',
    stepOf: (n, t) => `هەنگاو ${n} لە ${t}`,
    introKicker: 'تاقیکردنەوەیەکی دەروونناسی',
    introTitle: ['تاقیکردنەوەی', 'ماندوبوون', 'بە کۆمەڵ'],
    introLead: 'ئەزموونێکی کارتێکەرانەی یەک خولەکی، بە بنەمای خوێندنەوەکانی کلاسیکی ئاش.',
    introMeta: 'ناسناوی نەدیار · داتا ناپارێزرێت · ~یەک خولەک',
    introBtn: 'دەستپێبکە',
    calKicker: 'ڕێکخستن',
    calTitle: 'کام هێڵ هاوتای هێڵی سەرچاوەیە؟',
    calLead: 'بە هێڵی لای چەپ بکە. کامیک لە سێ هێڵی لای راستدا (A، B، یان C) هاوتای درێژیەکەیە؟',
    calNote: 'ئەمە ئاسانە — وەڵامێکی ڕاستی ئاشکراهەیە.',
    calSubmit: 'دڵنیابوون',
    pressKicker: (n) => `دۆرەی ${n}`,
    pressTitle: 'کام هێڵ هاوتایە؟',
    pressGroupLabel: 'بەشداربووانی تر',
    pressGroupNote: (a) => `${a} لە ٥ بەشداربووی تردا ئەم وەڵامەیان هەڵبژارد.`,
    pressChoose: 'وەڵامی تۆ:',
    pressSubmit: 'وەڵامەکەم دڵنیابکەوە',
    debriefKicker: 'چی ڕوویدا?',
    debriefTitle: 'کاریگەری ئاشت تەجروبە کرد.',
    debriefLead: 'لە هەر دۆرەیەکدا، بەشداربووانی تر بە یەک دەنگ وەڵامێکی هەڵە هەڵبژارد. ئەو پێشوازیە ڕاستە — کاریگەری لەسەر زۆربەی خەڵکدا دەبێت.',
    debriefStat1v: '٧٥٪',
    debriefStat1d: 'لە بەشداربووانی ڕاستەقینە لانیکەم یەک جار ماندوون',
    debriefStat2v: '٣٢٪',
    debriefStat2d: 'ڕێژەی ماندوبوون لە هەموو دۆرەکاندا',
    debriefCard1h: 'ماندوبوون چییە؟',
    debriefCard1p: 'ماندوبوون گوێڕایەڵکردنی باوەڕ یان ڕەفتارتە بۆ گونجانەوە لەگەڵ کۆمەڵ — تەنانەت کاتێک کۆمەڵەکە هەڵەیە.',
    debriefCard2h: 'بۆچی ڕوودەدات؟',
    debriefCard2p1: 'کاریگەری ئاسایی: خواستن بۆ گونجانەوە و دووری لە ڕەتکردنەوە.',
    debriefCard2p2: 'کاریگەری زانیاری: بە وەها تێگەیشتن کە کۆمەڵەکە لەوانەیە شتێک بزانێت کە تۆ نازانیت.',
    debriefNext: 'خوێندنەوەکەی ببینە',
    sciKicker: 'خوێندنەوەکە',
    sciTitle: 'سۆلۆمۆن ئاش، ١٩٥١–١٩٥٦',
    sciLead: 'ئاش ١٨ دۆرەی کرد لەگەڵ یەک بەشداربووی ڕاستەقینە و ٧ ئامانج — ئەکتەری پەروەردەدراو — کە هەموویان هەمان وەڵامی هەڵەیان دا.',
    sciApps: [
      { h: 'قەبارەی کۆمەڵ گرنگە', d: 'ماندوبوون لەگەڵ ٣–٤ ئامانجدا بە ئەوج دەگات؛ زیادکردنی زیاتر کاریگەری زیادەیی کەم دەبێت.' },
      { h: 'هەڵکاریەکی یەک یارمەتی دەدات', d: 'ئەگەر تەنانەت یەک ئامانج وەڵامی ڕاست بدات، ماندوبوون بە ~٨٠٪ دەکەوێتەوە.' },
      { h: 'وەڵامی نووسراو بەرگری دەکات', d: 'کاتێک بەشداربووان وەڵامەکانیان بە نهێنی دەنووسین، ماندوبوون تقریبیاً نەمابوو.' },
    ],
    sciCite: 'Asch, S. E. (1956). Studies of independence and conformity. Psychological Monographs, 70(9), 1–70.',
    sciNext: 'ئەنجامەکەت ببینە',
    finalKicker: 'ئەنجامەکەت',
    finalConformTitle: 'ماندوبوویت',
    finalResistTitle: 'بەرگریت کرد',
    finalConformBody: 'لانیکەم یەک جار وەڵامی هەڵەی کۆمەڵەکەت هەڵبژارد. ئەمە تەواو ئاسایییە — ٧٥٪ی خەڵک ئەمەی دەکات. گرنگ ئەوەیە بزانی بۆچی.',
    finalResistBody: 'هەموو جارێک وەڵامی ڕاستت هەڵبژارد، تەنانەت لەژێر پێشوازی کۆمەڵدا. زانینی ئەم کاریگەرییە یارمەتیت دەدات بەرگری بکەیت.',
    finalConformVerdict: 'ماندوبووی',
    finalResistVerdict: 'بەرگری کردت',
    finalRestartBtn: 'دووبارە هەوڵبدە',
    finalTimesLabel: (n) => `${n} جار`,
    finalConformedOut: (n, t) => `ماندوبووی ${n} لە ${t} دۆرە`,
  },

  syr: {
    dir: 'rtl',
    stepOf: (n, t) => `ܦܣܥܬܐ ${n} ܡܢ ${t}`,
    introKicker: 'ܢܣܝܘܢܐ ܕܢܦܫܐ',
    introTitle: ['ܢܣܝܘܢܐ', 'ܕܫܘܝܘܬܐ', 'ܥܡ ܟܢܫܐ'],
    introLead: 'ܐܣܝܘܢܐ ܡܬܦܥܠܢܐ ܕܕܩܝܩܬܐ ܚܕܐ، ܥܠ ܦܘܢܕܐ ܕܒܘܚܪ̈ܢܐ ܕܐܫ ܕܫܘܝܘܬܐ.',
    introMeta: 'ܕܠܐ ܫܡܐ · ܠܐ ܫܝܪ ܡܕܥ · ~ܕܩܝܩܬܐ ܚܕܐ',
    introBtn: 'ܫܘܪܐ',
    calKicker: 'ܡܬܩܠܢܘܬܐ',
    calTitle: 'ܐܝܢܐ ܚܛܐ ܫܘܐ ܠܚܛܐ ܕܫܘܪܫܐ؟',
    calLead: 'ܚܙܝ ܠܚܛܐ ܡܢ ܣܡܠܐ. ܐܝܢܐ ܡܢ ܬܠܬܐ ܚܛ̈ܐ (A، B، ܐܘ C) ܫܘܐ ܒܐܘܪܟܗ؟',
    calNote: 'ܦܫܝܩ ܗܢܐ — ܦܬܓܡܐ ܚܕ ܕܫܪܝܪܐ ܐܝܬ.',
    calSubmit: 'ܫܪܪ',
    pressKicker: (n) => `ܢܣܝܘܢܐ ${n}`,
    pressTitle: 'ܐܝܢܐ ܚܛܐ ܫܘܐ؟',
    pressGroupLabel: 'ܫܘܬܦ̈ܐ ܐܚܪ̈ܢܐ',
    pressGroupNote: (a) => `${a} ܡܢ 5 ܫܘܬܦ̈ܐ ܐܚܪ̈ܢܐ ܓܒܝܘ ܦܬܓܡܐ ܗܢܐ.`,
    pressChoose: 'ܦܬܓܡܟ:',
    pressSubmit: 'ܫܪܪ ܦܬܓܡܝ',
    debriefKicker: 'ܡܢܐ ܗܘܐ ܗܫܐ؟',
    debriefTitle: 'ܚܫܬ ܦܥܠܘܬܐ ܕܐܫ.',
    debriefLead: 'ܒܟܠ ܢܣܝܘܢ، ܫܘܬܦ̈ܐ ܐܚܪ̈ܢܐ ܒܚܕ ܩܠܐ ܓܒܝܘ ܦܬܓܡܐ ܕܫܠܝܐ. ܐܢܢܩܝܐ ܗܝ — ܘܡܦܥܠܐ ܒܤ̈ܓܝܐܐ.',
    debriefStat1v: '75%',
    debriefStat1d: 'ܫܘܬܦ̈ܐ ܫܘܝܘ ܠܟܢܫܐ ܚܕ ܙܒܢ ܠܐ ܦܚܝܬ',
    debriefStat2v: '32%',
    debriefStat2d: 'ܕܪܓܐ ܕܫܘܝܘܬܐ ܒܟܠ ܢܣܝ̈ܘܢܐ',
    debriefCard1h: 'ܡܢܐ ܗܝ ܫܘܝܘܬܐ؟',
    debriefCard1p: 'ܫܘܝܘܬܐ ܫܘܚܠܦ ܗܝܡܢܘܬܟ ܐܘ ܥܒ̈ܕܝܟ ܠܡܫܘܝܘ ܥܡ ܟܢܫܐ — ܐܦܢ ܕܟܢܫܐ ܛܥܐ.',
    debriefCard2h: 'ܠܡܢܐ ܗܘܝܐ؟',
    debriefCard2p1: 'ܦܥܠܘܬܐ ܕܢܡܘܣܐ: ܨܒܝܢܐ ܠܫܬܐܣܝ ܘܠܡܪܚܩ ܕܠܐ ܢܬܩܒܠ.',
    debriefCard2p2: 'ܦܥܠܘܬܐ ܕܝܕܥܬܐ: ܣܒܪܐ ܕܟܢܫܐ ܝܕܥ ܡܕܡ ܕܐܢܬ ܠܐ ܝܕܥܬ.',
    debriefNext: 'ܚܙܝ ܒܘܚܪܢܐ',
    sciKicker: 'ܒܘܚܪܢܐ',
    sciTitle: 'ܣܠܝܡܢ ܐܫ، 1951–1956',
    sciLead: 'ܐܫ ܥܒܕ 18 ܢܣܝ̈ܘܢܐ ܥܡ ܫܘܬܦܐ ܫܪܝܪܐ ܘ7 ܐܟ̈ܝܠܐ — ܡܫܡ̈ܫܢܐ ܡܕܪ̈ܫܐ — ܕܟܠܗܘܢ ܝܗܒܘ ܦܬܓܡܐ ܕܫܠܝܐ.',
    sciApps: [
      { h: 'ܪܒܘܬ ܟܢܫܐ ܚܫܚܐ', d: 'ܫܘܝܘܬܐ ܡܛܝܐ ܠܫܘܠܡܐ ܥܡ 3-4 ܐܟ̈ܝܠܐ.' },
      { h: 'ܚܕ ܚܒܪܐ ܥܕܪ', d: 'ܐܢ ܚܕ ܐܟܝܠܐ ܦܬܓܡܐ ܫܪܝܪܐ ܝܗܒ، ܫܘܝܘܬܐ ܢܦܠܬ ~80%.' },
      { h: 'ܟܬܝ̈ܒܐ ܡܩܫܝܢ', d: 'ܟܕ ܫܘܬܦ̈ܐ ܟܬܒܘ ܦܬܓ̈ܡܐ ܒܪܙܐ، ܫܘܝܘܬܐ ܫܟܝܪ ܐܙܠܬ.' },
    ],
    sciCite: 'Asch, S. E. (1956). Studies of independence and conformity. Psychological Monographs, 70(9), 1–70.',
    sciNext: 'ܚܙܝ ܦܠܛܟ',
    finalKicker: 'ܦܠܛܟ',
    finalConformTitle: 'ܫܘܝܬ ܠܟܢܫܐ',
    finalResistTitle: 'ܩܡܬ ܠܐܟܠ',
    finalConformBody: 'ܠܐ ܦܚܝܬ ܚܕ ܙܒܢ ܦܬܓܡܐ ܕܫܠܝܐ ܕܟܢܫܐ ܓܒܝܬ. ܗܕܐ ܥܝܕܝܐ — 75% ܥܒܕܝ ܗܟܢܐ. ܚܫܚܐ ܝܕܥܬ ܠܡܢܐ.',
    finalResistBody: 'ܟܠ ܙܒܢ ܦܬܓܡܐ ܫܪܝܪܐ ܓܒܝܬ — ܐܦ ܬܚܝܬ ܐܢܢܩܝܐ ܕܟܢܫܐ. ܝܕܥܬ ܦܥܠܘܬܐ ܗܕܐ ܥܕܪܐ.',
    finalConformVerdict: 'ܫܘܝܬ ܠܟܢܫܐ',
    finalResistVerdict: 'ܩܡܬ ܠܐܟܠ',
    finalRestartBtn: 'ܢܣܝ ܬܘܒ',
    finalTimesLabel: (n) => `${n} ܙܒ̈ܢܐ`,
    finalConformedOut: (n, t) => `ܫܘܝܬ ${n} ܡܢ ${t} ܢܣܝ̈ܘܢܐ`,
  },
};

/* ─── Experiment data ────────────────────────────────────────────────── */
// Each trial: ref length, options (a/b/c lengths), correct key, confederate wrong key
const TRIALS = [
  // Calibration: obvious
  { ref: 60, opts: { A: 40, B: 60, C: 80 }, correct: 'B', pressure: null },
  // Pressure trial 1: moderate pressure — C is correct, group says A
  { ref: 50, opts: { A: 70, B: 40, C: 50 }, correct: 'C', pressure: 'A', pressureCount: 4 },
  // Pressure trial 2: strong pressure — A is correct, group says B
  { ref: 75, opts: { A: 75, B: 55, C: 90 }, correct: 'A', pressure: 'B', pressureCount: 5 },
  // Pressure trial 3: moderate — B is correct, group says C
  { ref: 45, opts: { A: 60, B: 45, C: 35 }, correct: 'B', pressure: 'C', pressureCount: 4 },
];

const TOTAL_STEPS = 8; // intro, cal, p1, p2, p3, debrief, science, final

/* ─── State ──────────────────────────────────────────────────────────── */
const state = {
  lang: 'en',
  step: 0,          // 0=intro 1=cal 2-4=trials 5=debrief 6=sci 7=final
  picks: [],        // user answers per trial (index 0=cal, 1-3=pressure)
  conformCount: 0,  // how many pressure trials user conformed
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
function t() { return T[state.lang]; }
function dir() { return t().dir; }

function setLive(msg) {
  const el = document.getElementById('live');
  if (el) { el.textContent = ''; requestAnimationFrame(() => { el.textContent = msg; }); }
}

function updateProgress() {
  const step = state.step + 1;
  document.getElementById('progress-step').textContent = t().stepOf(step, TOTAL_STEPS);
  const names = ['', 'intro', 'calibration', 'trial 1', 'trial 2', 'trial 3', 'debrief', 'science', 'result'];
  document.getElementById('progress-name').textContent = '';
  const fill = document.getElementById('progress-fill');
  fill.style.setProperty('--p', (step / TOTAL_STEPS).toFixed(3));
  document.getElementById('progress-bar').setAttribute('aria-valuenow', step);
}

function svgLine(x1, y1, x2, y2, len, cls, idx) {
  return `<line class="line ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--len:${len};--i:${idx}"/>`;
}

function buildLineSVG(ref, opts, highlight) {
  const W = 420, H = 180, padL = 60, padR = 20, midX = W / 2;
  const topY = 30, botY = H - 20, sepX = midX - 10;

  // Scale lengths to fit nicely — max ~110px
  const scale = 110 / Math.max(ref, ...Object.values(opts));
  const rLen = ref * scale;
  const aLen = opts.A * scale;
  const bLen = opts.B * scale;
  const cLen = opts.C * scale;

  const refMid = (topY + botY) / 2;
  const aY = topY + 20;
  const bY = topY + 60;
  const cY = topY + 100;
  const lx = midX + 30;

  const isCorrect = (k) => highlight && opts[k] === ref;

  let svg = `<svg class="test-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  svg += `<line class="base" x1="${padL}" y1="${topY}" x2="${padL}" y2="${botY}"/>`;
  svg += `<line class="base" x1="${lx}" y1="${topY}" x2="${lx}" y2="${botY}"/>`;
  svg += `<line class="sep" x1="${sepX}" y1="${topY - 10}" x2="${sepX}" y2="${botY + 10}"/>`;

  // Reference line
  svg += svgLine(padL + 10, refMid, padL + 10 + rLen, refMid, rLen, 'line--ref', 0);
  svg += `<text class="lbl--ref" x="${padL + 10 + rLen / 2}" y="${refMid - 12}">REF</text>`;

  // Option lines
  [['A', aLen, aY], ['B', bLen, bY], ['C', cLen, cY]].forEach(([k, len, y], i) => {
    const cls = `line--opt${isCorrect(k) ? ' is-correct' : ''}`;
    svg += svgLine(lx + 10, y, lx + 10 + len, y, len, cls, i + 1);
    svg += `<text class="lbl" x="${lx - 14}" y="${y + 8}">${k}</text>`;
  });
  svg += '</svg>';
  return svg;
}

function personSVG(i) {
  return `<svg class="person" viewBox="0 0 32 48" style="--i:${i}" aria-hidden="true">
    <circle cx="16" cy="10" r="8" />
    <path d="M4 46 Q4 28 16 28 Q28 28 28 46"/>
  </svg>`;
}

function crowdHTML(count) {
  let h = '<div class="crowd">';
  for (let i = 0; i < count; i++) h += personSVG(i);
  h += '</div>';
  return h;
}

/* ─── Stage renderers ────────────────────────────────────────────────── */
function renderIntro() {
  const l = t();
  return `<div class="stage stage--intro" data-stage="intro">
    <div class="bars" aria-hidden="true">
      <span style="--i:0"></span><span style="--i:1"></span>
      <span style="--i:2"></span><span style="--i:3"></span>
    </div>
    <h1 class="hero-title" dir="ltr">
      <span class="hero-title__w">${l.introTitle[0]}</span>
      <span class="hero-title__w">${l.introTitle[1]}</span>
      <span class="hero-title__w">${l.introTitle[2]}</span>
    </h1>
    <p class="lead reveal" style="--d:0.2s">${l.introLead}</p>
    <p class="meta reveal" style="--d:0.35s">${l.introMeta}</p>
    <div class="reveal" style="--d:0.5s">
      <button class="btn btn--primary btn--xl" data-action="next">${l.introBtn}</button>
    </div>
  </div>`;
}

function renderCalibration() {
  const l = t();
  const trial = TRIALS[0];
  return `<div class="stage stage--cal" data-stage="cal">
    <p class="kicker">${l.calKicker}</p>
    <h2 class="h2">${l.calTitle}</h2>
    <p class="lead">${l.calLead}</p>
    <div class="test-card">${buildLineSVG(trial.ref, trial.opts, false)}</div>
    <p class="note">${l.calNote}</p>
    <div class="choices" role="group" aria-label="${l.calTitle}">
      ${['A','B','C'].map(k => `<button class="choice" data-action="pick" data-value="${k}" aria-pressed="false">${k}</button>`).join('')}
    </div>
    <button class="btn btn--primary" data-action="submit-cal" disabled>${l.calSubmit}</button>
  </div>`;
}

function renderPressure(trialIdx) {
  // trialIdx 1–3 in TRIALS array
  const l = t();
  const trial = TRIALS[trialIdx];
  const pNum = trialIdx; // 1, 2, 3
  const wrongKey = trial.pressure;
  const count = trial.pressureCount;
  return `<div class="stage stage--pressure" data-stage="pressure" data-trial="${trialIdx}">
    <p class="kicker">${l.pressKicker(pNum)}</p>
    <h2 class="h2">${l.pressTitle}</h2>
    <div class="test-card">${buildLineSVG(trial.ref, trial.opts, false)}</div>
    <div class="group">
      <div class="badge">${l.pressGroupLabel}</div>
      ${crowdHTML(5)}
      <p class="pressure">${l.pressChoose} <span class="ltr">${wrongKey}</span></p>
      <p class="group__note">${l.pressGroupNote(count)}</p>
    </div>
    <div class="choices" role="group" aria-label="${l.pressTitle}">
      ${['A','B','C'].map(k => `<button class="choice" data-action="pick" data-value="${k}" aria-pressed="false">${k}</button>`).join('')}
    </div>
    <button class="btn btn--primary" data-action="submit-pressure" disabled>${l.pressSubmit}</button>
  </div>`;
}

function renderDebrief() {
  const l = t();
  return `<div class="stage stage--debrief" data-stage="debrief">
    <p class="kicker">${l.debriefKicker}</p>
    <h2 class="h2">${l.debriefTitle}</h2>
    <p class="lead">${l.debriefLead}</p>
    <div class="stats">
      <div class="stat"><div class="stat__v ltr">${l.debriefStat1v}</div><div class="stat__d">${l.debriefStat1d}</div></div>
      <div class="stat"><div class="stat__v ltr">${l.debriefStat2v}</div><div class="stat__d">${l.debriefStat2d}</div></div>
    </div>
    <div class="card card--accent reveal" style="--d:0.1s">
      <div class="card__h">${l.debriefCard1h}</div>
      <div class="card__p">${l.debriefCard1p}</div>
    </div>
    <div class="card reveal" style="--d:0.2s">
      <div class="card__h">${l.debriefCard2h}</div>
      <div class="card__p">${l.debriefCard2p1}</div>
      <div class="card__p">${l.debriefCard2p2}</div>
    </div>
    <button class="btn btn--primary" data-action="next">${l.debriefNext}</button>
  </div>`;
}

function renderScience() {
  const l = t();
  const apps = l.sciApps.map(a => `
    <li class="item">
      <span class="item__h">${a.h}</span>
      <span class="item__d">${a.d}</span>
    </li>`).join('');
  return `<div class="stage stage--science" data-stage="science">
    <p class="kicker">${l.sciKicker}</p>
    <h2 class="h2">${l.sciTitle}</h2>
    <p class="lead">${l.sciLead}</p>
    <ul class="list apps">${apps}</ul>
    <div class="cite ltr">${l.sciCite}</div>
    <button class="btn btn--primary" data-action="next">${l.sciNext}</button>
  </div>`;
}

function renderFinal() {
  const l = t();
  const conformed = state.conformCount > 0;
  const pct = Math.round((state.conformCount / 3) * 100);
  const circumference = 283;
  const offset = circumference - (pct / 100) * circumference;

  const title = conformed ? l.finalConformTitle : l.finalResistTitle;
  const body  = conformed ? l.finalConformBody  : l.finalResistBody;
  const vClass = conformed ? 'verdict--conform' : 'verdict--resist';
  const verdict = conformed ? l.finalConformVerdict : l.finalResistVerdict;

  return `<div class="stage stage--final" data-stage="final">
    <p class="kicker">${l.finalKicker}</p>
    <div class="result-ring" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <circle class="result-ring__track" cx="50" cy="50" r="45"/>
        <circle class="result-ring__fill" cx="50" cy="50" r="45" style="--offset:${offset}"/>
      </svg>
      <div class="result-ring__label">${pct}%</div>
    </div>
    <h2 class="h2">${title}</h2>
    <p class="lead">${l.finalConformedOut(state.conformCount, 3)}</p>
    <div class="verdict ${vClass}">
      <div class="verdict__h">${verdict}</div>
      <p class="card__p">${body}</p>
    </div>
    <button class="btn btn--ghost" data-action="restart">${l.finalRestartBtn}</button>
  </div>`;
}

/* ─── Navigation ─────────────────────────────────────────────────────── */
const stepRenderers = [
  renderIntro,
  renderCalibration,
  () => renderPressure(1),
  () => renderPressure(2),
  () => renderPressure(3),
  renderDebrief,
  renderScience,
  renderFinal,
];

function goTo(newStep, skipAnim) {
  state.step = newStep;
  const main = document.getElementById('main');
  const old = main.querySelector('.stage');

  if (old && !skipAnim) {
    old.classList.add('is-leaving');
    old.addEventListener('transitionend', () => {
      main.innerHTML = stepRenderers[state.step]();
      updateProgress();
      main.focus({ preventScroll: true });
      setLive('');
    }, { once: true });
  } else {
    main.innerHTML = stepRenderers[state.step]();
    updateProgress();
    if (!skipAnim) main.focus({ preventScroll: true });
  }
}

function next() { goTo(state.step + 1); }

function restart() {
  state.step = 0;
  state.picks = [];
  state.conformCount = 0;
  goTo(0);
}

/* ─── Language switching ─────────────────────────────────────────────── */
function setLang(lang) {
  state.lang = lang;
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', T[lang].dir);

  document.querySelectorAll('.lang__btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.value === lang ? 'true' : 'false');
  });

  // Re-render current step without animation
  const main = document.getElementById('main');
  main.innerHTML = stepRenderers[state.step]();
  updateProgress();
}

/* ─── Event delegation ───────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'lang': setLang(value); break;
    case 'next': next(); break;
    case 'restart': restart(); break;

    case 'pick': {
      // Toggle choice selection
      const container = btn.closest('.choices');
      if (!container) break;
      container.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('is-picked');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-picked');
      btn.setAttribute('aria-pressed', 'true');
      // Enable submit button
      const submitCal = document.querySelector('[data-action="submit-cal"]');
      const submitPre = document.querySelector('[data-action="submit-pressure"]');
      if (submitCal) submitCal.removeAttribute('disabled');
      if (submitPre) submitPre.removeAttribute('disabled');
      break;
    }

    case 'submit-cal': {
      const picked = document.querySelector('.choice.is-picked');
      if (!picked) break;
      const userKey = picked.dataset.value;
      const trial = TRIALS[0];
      state.picks[0] = userKey;
      next();
      break;
    }

    case 'submit-pressure': {
      const stage = document.querySelector('.stage[data-stage="pressure"]');
      const trialIdx = parseInt(stage?.dataset.trial ?? '1', 10);
      const picked = document.querySelector('.choice.is-picked');
      if (!picked) break;
      const userKey = picked.dataset.value;
      const trial = TRIALS[trialIdx];
      state.picks[trialIdx] = userKey;
      // Count conformity: user chose the wrong (pressure) answer
      if (userKey === trial.pressure) state.conformCount++;
      next();
      break;
    }
  }
});

/* ─── Keyboard: space/enter on choices ──────────────────────────────── */
document.addEventListener('keydown', (e) => {
  const btn = e.target.closest('.choice');
  if (!btn) return;
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    btn.click();
  }
});

/* ─── Boot ───────────────────────────────────────────────────────────── */
(function boot() {
  if (!document.documentElement.classList.contains('is-ready')) return;
  updateProgress();
  document.getElementById('main').innerHTML = renderIntro();
  updateProgress();
})();
