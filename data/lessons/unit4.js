// Unit 4 — Prayer. V1 gamification format (see data/lessons/schema.js).
const unit3 = {
  id: 'unit4',
  title: 'Prayer — Connecting to Hashem',
  level: 'Intermediate',
  lessons: [
    {
      id: 'u4l1',
      title: 'Why Do We Pray?',
      iconName: 'praying_hands',
      hook: {
        title: 'Why Do We Pray?',
        body: `<p>Jewish prayer is called <em>Avodah shebalev</em> — service of the heart. It\'s less about asking G-d for things and more about reshaping who we are.</p>`,
      },
      teachSlides: [
        {
          title: 'Three Times a Day',
          body: `<p>The three daily services — <strong>Shacharit</strong> (morning), <strong>Mincha</strong> (afternoon), <strong>Maariv</strong> (evening) — correspond to the three Patriarchs. Prayer sanctifies each transition of the day.</p>`,
          concept: 'Prayer marks time, not just words.',
        },
        {
          title: 'To Judge Oneself',
          hebrew: 'לְהִתְפַּלֵּל',
          transliteration: "l'hitpalel",
          translation: 'to pray (reflexive)',
          body: `<p>The Hebrew <em>hitpalel</em> is reflexive — literally "to judge oneself." Prayer is self-examination and alignment before it is petition.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What does "hitpalel" (to pray) literally mean?',
          options: ['To speak to G-d', 'To judge oneself', 'To ask for things', 'To give thanks'],
          correct: 1,
          explanation: '"Hitpalel" is reflexive — "to judge oneself." Prayer is self-examination, not only petition.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which Patriarch is traditionally credited with instituting Shacharit?',
          options: ['Avraham', 'Yitzchak', 'Yaakov', 'Moshe'],
          correct: 0,
          explanation: 'Talmud Berakhot 26b: Avraham instituted Shacharit, Yitzchak Mincha, Yaakov Maariv.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Prayer is called which of the following in rabbinic language?',
          options: ['Avodah shebalev (service of the heart)', 'Talmud Torah', 'Tikkun Olam', 'Bitachon'],
          correct: 0,
          explanation: '"Avodah shebalev" — service of the heart (Talmud Ta\'anit 2a).',
        },
        {
          type: 'true_false',
          prompt: 'A heartfelt prayer in one\'s own language can fulfill the mitzvah of prayer.',
          correct: true,
          explanation: 'While the Siddur provides the traditional structure, personal prayer in any language is valid and valued.',
        },
        {
          type: 'fill_blank',
          prompt: 'Jews pray ___ times each day.',
          answer_variants: ['three', '3'],
          explanation: 'Three daily services — Shacharit, Mincha, Maariv — map to the three Patriarchs and to the sacrifices of the Temple.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Avodah shebalev".',
          answer_variants: ['service of the heart', 'heart service', 'work of the heart'],
          explanation: '"Service of the heart" — the Rabbis\' definition of prayer.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each daily service to the Patriarch who instituted it.',
          left: [
            { id: 'a', text: 'Shacharit' },
            { id: 'b', text: 'Mincha' },
            { id: 'c', text: 'Maariv' },
          ],
          right: [
            { id: '1', text: 'Yaakov' },
            { id: '2', text: 'Avraham' },
            { id: '3', text: 'Yitzchak' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Avraham → Shacharit, Yitzchak → Mincha, Yaakov → Maariv.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the three daily services from first to last in the day.',
          steps: [
            { id: 'a', text: 'Shacharit (morning)' },
            { id: 'b', text: 'Mincha (afternoon)' },
            { id: 'c', text: 'Maariv (evening)' },
          ],
          correctOrder: ['a', 'b', 'c'],
          explanation: 'Morning, afternoon, evening — a daily rhythm of pause and alignment.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Prayer in Judaism is a discipline of alignment — service of the heart, practiced three times daily, shaping who we are as we speak.</p>`,
      },
      sources: [
        'Talmud Ta\'anit 2a',
        'Talmud Berakhot 26b',
        'Devarim 11:13',
        'Rambam, Hilchot Tefillah 1:1',
      ],
      readMore: `<p>The Rambam opens his laws of prayer by calling daily prayer a Torah-level commandment of serving G-d "with all your heart" (Devarim 11:13) — though the fixed number, times, and texts are rabbinic. In his view, at the deepest level, every human being is obligated to turn daily toward G-d; the Siddur is a finely engineered tool for doing so.</p>`,
    },

    {
      id: 'u4l2',
      title: 'The Structure of the Siddur',
      iconName: 'siddur',
      hook: {
        title: 'The Siddur',
        body: `<p>The Siddur ("order") is the Jewish prayer book — centuries of liturgy compiled into a careful daily sequence. At its core: the Amidah.</p>`,
      },
      teachSlides: [
        {
          title: 'The Amidah',
          hebrew: 'עֲמִידָה',
          transliteration: 'Amidah',
          translation: 'Standing',
          body: `<p>The Amidah — the standing prayer — is the centerpiece of every service. Said silently, facing Jerusalem, feet together: a private conversation with G-d.</p>`,
          concept: 'Standing, silent, intimate.',
        },
        {
          title: 'Shacharit\'s Arc',
          body: `<p>Morning prayer builds gradually: <strong>Morning Blessings → Pesukei D\'Zimra (Psalms) → Shema and its blessings → Amidah → Aleinu / Kaddish</strong>. Each step draws closer to the core.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What is the centerpiece of every Jewish prayer service?',
          options: ['The Shema', 'The Amidah', 'The Kaddish', 'Aleinu'],
          correct: 1,
          explanation: 'The Amidah — recited standing, silently, facing Jerusalem — is the core of Shacharit, Mincha, and Maariv.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What does "Siddur" mean?',
          options: ['Prayer', 'Order', 'Book', 'Blessing'],
          correct: 1,
          explanation: '"Siddur" comes from <em>seder</em> — "order." The book orders the prayers of the day.',
        },
        {
          type: 'multiple_choice',
          prompt: 'The Amidah is traditionally recited:',
          options: ['Sitting, out loud', 'Standing, silently, facing Jerusalem', 'While walking', 'With eyes closed only'],
          correct: 1,
          explanation: 'Standing, feet together, silently, facing Jerusalem — an intimate conversation with Hashem.',
        },
        {
          type: 'true_false',
          prompt: 'The weekday Amidah contains nineteen blessings.',
          correct: true,
          explanation: 'Originally eighteen (hence "Shemoneh Esreh"); a nineteenth was added later. On Shabbat and holidays the number changes.',
        },
        {
          type: 'fill_blank',
          prompt: 'Another name for the Amidah is "___ Esreh," the Eighteen.',
          answer_variants: ['shemoneh', 'shmoneh'],
          explanation: '"Shemoneh Esreh" = Eighteen. Named for the original count of blessings.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Pesukei D\'Zimra".',
          answer_variants: ['verses of song', 'verses of praise', 'verses of songs'],
          explanation: '"Pesukei D\'Zimra" — Verses of Song — a section of Psalms recited to warm the heart before the core prayers.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each section of Shacharit to its role.',
          left: [
            { id: 'a', text: 'Morning Blessings' },
            { id: 'b', text: 'Pesukei D\'Zimra' },
            { id: 'c', text: 'Shema & blessings' },
            { id: 'd', text: 'Amidah' },
          ],
          right: [
            { id: '1', text: 'Core silent prayer' },
            { id: '2', text: 'Gratitude on waking' },
            { id: '3', text: 'Declaration of faith' },
            { id: '4', text: 'Psalms that warm the heart' },
          ],
          correct: { a: '2', b: '4', c: '3', d: '1' },
          explanation: 'Gratitude → Psalms → declaration → silent conversation. A graduated approach.',
        },
        {
          type: 'order_steps',
          prompt: 'Order these sections of Shacharit.',
          steps: [
            { id: 'a', text: 'Morning Blessings' },
            { id: 'b', text: 'Pesukei D\'Zimra' },
            { id: 'c', text: 'Shema and its blessings' },
            { id: 'd', text: 'Amidah' },
            { id: 'e', text: 'Aleinu / Kaddish' },
          ],
          correctOrder: ['a', 'b', 'c', 'd', 'e'],
          explanation: 'The Shacharit arc: blessings → psalms → Shema → Amidah → concluding prayers.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>The Siddur is a graduated ascent — gratitude, song, declaration, and finally the silent Amidah. Structure supports intention.</p>`,
      },
      sources: [
        'Talmud Berakhot 28b–29a',
        'Rav Amram Gaon\'s Siddur (~870 CE)',
        'Rambam, Hilchot Tefillah 4:1, 7',
        'Shulchan Aruch, Orach Chaim 51–132',
      ],
      readMore: `<p>The earliest complete siddur we have is Rav Amram Gaon\'s, written around 870 CE in Babylonia in response to a question from the Jewish community of Spain. Over the next thousand years, nusachim (rites) diverged — Ashkenaz, Sefard, Edot HaMizrach, Chassidic variants — but the skeleton Rav Amram sketched still stands in every Jewish prayer book today.</p>`,
    },

    {
      id: 'u4l3',
      title: 'Shacharit — Morning Prayer',
      iconName: 'sunrise',
      hook: {
        title: 'Beginning the Day',
        body: `<p>Before getting out of bed, the first Jewish words of the day are <em>Modeh Ani</em> — a 12-second thank-you that reframes everything that follows.</p>`,
      },
      teachSlides: [
        {
          title: 'Modeh Ani',
          hebrew: 'מוֹדֶה אֲנִי לְפָנֶיךָ',
          transliteration: 'Modeh ani lefanecha',
          translation: 'I give thanks before You',
          body: `<p>"I give thanks before You, living and eternal King, who has returned my soul to me with compassion." Notably, the prayer avoids G-d\'s explicit name — so it can be said before washing.</p>`,
          concept: 'Gratitude before anything else.',
        },
        {
          title: 'The Shema in Shacharit',
          body: `<p>The Shema sits between rich blessings on G-d\'s daily renewal of creation and His love for Israel, and leads directly into the Amidah — declaration flowing into conversation.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What are the first words traditionally said upon waking?',
          options: ['Baruch Hashem', 'Shema Yisrael', 'Modeh Ani', 'Ashrei'],
          correct: 2,
          explanation: '"Modeh Ani" — said in bed, before washing, before anything else.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Why does Modeh Ani notably avoid the explicit name of G-d?',
          options: ['It was written after the other prayers', 'It is said before washing hands', 'G-d\'s name is only for the Amidah', 'To keep it short'],
          correct: 1,
          explanation: 'The Rabbis crafted it so it can be said immediately upon waking, before ritual handwashing.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What flows directly into the Amidah each morning?',
          options: ['Aleinu', 'The Shema and its blessings', 'Modeh Ani', 'Kaddish'],
          correct: 1,
          explanation: 'Shema → Amidah is a deliberate flow: declaration of faith moves into silent prayer.',
        },
        {
          type: 'true_false',
          prompt: 'Modeh Ani is recited while still in bed, before any other activity.',
          correct: true,
          explanation: 'That\'s the custom — gratitude is the day\'s first act.',
        },
        {
          type: 'fill_blank',
          prompt: 'Modeh Ani thanks Hashem for returning one\'s ___.',
          answer_variants: ['soul', 'neshama', 'neshamah'],
          explanation: 'The prayer thanks G-d for returning the <em>neshama</em> (soul) with compassion each morning.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Modeh Ani".',
          answer_variants: ['i give thanks', 'i thank', 'i am thankful', 'i give thanks before you'],
          explanation: '"Modeh Ani" — I give thanks (before You). First words, every day.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each moment of morning to its prayer.',
          left: [
            { id: 'a', text: 'Upon waking, still in bed' },
            { id: 'b', text: 'After washing, early blessings' },
            { id: 'c', text: 'The core silent prayer' },
          ],
          right: [
            { id: '1', text: 'Amidah' },
            { id: '2', text: 'Morning Blessings' },
            { id: '3', text: 'Modeh Ani' },
          ],
          correct: { a: '3', b: '2', c: '1' },
          explanation: 'Modeh Ani in bed → Morning Blessings → Amidah as the core.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the morning in four steps.',
          steps: [
            { id: 'a', text: 'Say Modeh Ani in bed' },
            { id: 'b', text: 'Wash hands, recite Morning Blessings' },
            { id: 'c', text: 'Shema and its surrounding blessings' },
            { id: 'd', text: 'Silent Amidah' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'A graduated approach: gratitude → blessings → declaration → intimate prayer.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Shacharit starts the day with gratitude, praise, and declaration — a staircase from the first breath into silent conversation with Hashem.</p>`,
      },
      sources: [
        'Talmud Berakhot 11b–12a',
        'Mishnah Berurah 1:8',
        'Kitzur Shulchan Aruch 1:3',
        'Shulchan Aruch, Orach Chaim 59–70',
      ],
      readMore: `<p>Modeh Ani is a relatively late addition to the Siddur — first appearing in print in the 17th century — but it has become one of the most universally recited prayers, taught to Jewish children before they can read. Its power comes from its simplicity: twelve Hebrew words, said before anything else, that reframe the day as a gift.</p>`,
    },

    {
      id: 'u4l4',
      title: 'The Amidah — The 19 Blessings',
      iconName: 'amidah',
      hook: {
        title: 'The Spine of Jewish Prayer',
        body: `<p>The Amidah is said three times a day, silently, standing still, facing Jerusalem. It\'s not a monologue — it\'s a structured conversation in three movements: praise, petition, gratitude.</p>`,
      },
      teachSlides: [
        {
          title: 'Three Movements',
          body: `<p>The Amidah has a precise architecture:<br>
          <strong>Shevach (Praise):</strong> 3 opening blessings — the Patriarchs, G-d\'s power, His holiness.<br>
          <strong>Bakasha (Petition):</strong> 13 middle blessings on weekdays — wisdom, repentance, health, livelihood, the ingathering of exiles, and more.<br>
          <strong>Hodaah (Thanksgiving):</strong> 3 closing blessings — Temple service, gratitude, peace.</p>`,
          concept: 'Praise → Ask → Thank. In that order.',
        },
        {
          title: 'Shabbat and Holidays',
          body: `<p>On Shabbat and Yom Tov, the 13 middle petitions are replaced by a single blessing focusing on the holiness of the day. We don\'t petition for our personal needs on the day of rest. The total drops to 7 (Shabbat) or 9 (Yom Tov).</p>`,
          concept: 'On Shabbat, rest from asking.',
        },
        {
          title: 'How to Stand',
          body: `<p>Feet together (like the angels in Yechezkel 1:7), facing Jerusalem, lips moving but voice inaudible. Bow at four points: beginning and end of Avot (first blessing), beginning and end of Modim (thanksgiving). Take three steps back at the end — leaving the "throne room."</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many blessings does the weekday Amidah contain?',
          options: ['18', '19', '20', '7'],
          correct: 1,
          explanation: 'Originally 18 ("Shemoneh Esreh"), a 19th blessing (Birkat HaMinim) was added by Rabban Gamliel. On Shabbat the total drops to 7.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What are the three sections of the Amidah in order?',
          options: [
            'Petition → Praise → Thanksgiving',
            'Praise → Petition → Thanksgiving',
            'Thanksgiving → Petition → Praise',
            'Petition → Thanksgiving → Praise',
          ],
          correct: 1,
          explanation: 'Praise (Shevach) → Petition (Bakasha) → Thanksgiving (Hodaah). The Talmud says you don\'t enter a king\'s presence demanding things — you praise first.',
        },
        {
          type: 'multiple_choice',
          prompt: 'On Shabbat, what happens to the 13 middle blessings of the Amidah?',
          options: [
            'They are recited faster',
            'They are replaced by a single blessing about Shabbat',
            'They are said only at Maariv',
            'They are doubled',
          ],
          correct: 1,
          explanation: 'On Shabbat and Yom Tov we don\'t petition for personal needs. The 13 middle blessings become one blessing centered on the holiness of the day.',
        },
        {
          type: 'true_false',
          prompt: 'The chazzan (prayer leader) repeats the Amidah aloud so the congregation can say Amen.',
          correct: true,
          explanation: 'After the silent Amidah, the chazzan repeats it aloud — the "chazarat hashatz" — enabling those who couldn\'t pray alone to fulfill their obligation through Amen.',
        },
        {
          type: 'fill_blank',
          prompt: 'The Amidah is also called "___ Esreh" — the Eighteen.',
          answer_variants: ['shemoneh', 'shmoneh'],
          explanation: '"Shemoneh Esreh" (Eighteen) was its original name. A 19th blessing was added, but the old name stuck.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Amidah".',
          answer_variants: ['standing', 'the standing prayer', 'standing prayer'],
          explanation: '"Amidah" means standing — because it is always recited on your feet.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Amidah section to its Hebrew name.',
          left: [
            { id: 'a', text: 'Praise (opening 3 blessings)' },
            { id: 'b', text: 'Petition (middle blessings)' },
            { id: 'c', text: 'Thanksgiving (closing 3 blessings)' },
          ],
          right: [
            { id: '1', text: 'Hodaah' },
            { id: '2', text: 'Shevach' },
            { id: '3', text: 'Bakasha' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Shevach (praise), Bakasha (petition), Hodaah (thanksgiving) — the Amidah\'s three-part architecture.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the three sections of the Amidah.',
          steps: [
            { id: 'a', text: 'Shevach — Praise' },
            { id: 'b', text: 'Bakasha — Petition' },
            { id: 'c', text: 'Hodaah — Thanksgiving' },
          ],
          correctOrder: ['a', 'b', 'c'],
          explanation: 'You enter a king\'s presence with praise, then make requests, then give thanks on the way out.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>The Amidah is Jewish prayer\'s masterwork — three movements of praise, petition, and gratitude, said silently three times each day facing Jerusalem. Its architecture teaches how to approach the Divine.</p>`,
      },
      sources: [
        'Talmud Berakhot 28b–29a',
        'Rambam, Hilchot Tefillah 1:4',
        'Yechezkel 1:7',
        'Shulchan Aruch, Orach Chaim 98–127',
      ],
      readMore: `<p>The Anshei Knesset HaGedolah — the Men of the Great Assembly, led by Ezra — codified the Amidah's structure after the Babylonian exile, when the Temple was destroyed and prophecy had ended. They understood that without a fixed liturgy, Jewish prayer would fragment into 70 individual styles and slowly disappear. The Amidah was their engineering solution: a container strong enough to hold personal prayer across centuries and continents.</p>`,
    },

    {
      id: 'u4l5',
      title: 'Mincha and Maariv',
      iconName: 'sun_moon',
      hook: {
        title: 'Afternoon and Evening',
        body: `<p>After Shacharit comes Mincha — the afternoon pause — and Maariv, the evening\'s close. Two briefer services, two distinct moods.</p>`,
      },
      teachSlides: [
        {
          title: 'Mincha',
          body: `<p>Mincha, between midday and sunset, is short but especially beloved — it demands pausing in the middle of a busy workday. The Zohar calls it the "hour of grace."</p>`,
          concept: 'The hardest pause is the most precious.',
        },
        {
          title: 'Maariv',
          hebrew: 'מַעֲרִיב עֲרָבִים',
          transliteration: "Ma'ariv Aravim",
          translation: 'Who brings on evenings',
          body: `<p>Maariv opens with a blessing praising G-d who orchestrates day and night. Though once "optional," it is universally observed — an example of Israel taking on more than strict law required.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'When is Mincha recited?',
          options: ['Before dawn', 'Between midday and sunset', 'After nightfall', 'Only on Shabbat'],
          correct: 1,
          explanation: 'Mincha is the afternoon service — from midday until sunset.',
        },
        {
          type: 'multiple_choice',
          prompt: 'According to the Zohar, why is Mincha especially beloved?',
          options: ['It\'s the longest prayer', 'It comes before Shabbat', 'It requires pausing mid-workday', 'It\'s tied to the Temple\'s founding'],
          correct: 2,
          explanation: 'The sacrifice of attention — stopping real life to pray — makes Mincha precious.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Maariv was historically considered:',
          options: ['The most important prayer', 'Technically optional, then universally accepted', 'Only for Shabbat', 'A replacement for Mincha'],
          correct: 1,
          explanation: 'The Talmud debates its obligatory status; universal practice settled on obligating it.',
        },
        {
          type: 'true_false',
          prompt: 'Mincha is generally shorter than Shacharit.',
          correct: true,
          explanation: 'Much shorter — no Pesukei D\'Zimra, no Shema blessings — mostly Ashrei and Amidah.',
        },
        {
          type: 'fill_blank',
          prompt: 'The evening prayer service is called ___.',
          answer_variants: ['maariv', 'ma\'ariv', 'arvit'],
          explanation: 'Maariv (also called Arvit in Sephardic communities) — recited after nightfall.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Ma\'ariv Aravim".',
          answer_variants: ['who brings on evenings', 'who brings evenings', 'bringer of evenings'],
          explanation: '"Ma\'ariv Aravim" — Who brings on evenings. The opening blessing of the evening service.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each service to its time.',
          left: [
            { id: 'a', text: 'Shacharit' },
            { id: 'b', text: 'Mincha' },
            { id: 'c', text: 'Maariv' },
          ],
          right: [
            { id: '1', text: 'After nightfall' },
            { id: '2', text: 'Morning (through 4 "halachic hours")' },
            { id: '3', text: 'Midday to sunset' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Shacharit in the morning, Mincha in the afternoon, Maariv after dark.',
        },
        {
          type: 'order_steps',
          prompt: 'Order a full day of prayer.',
          steps: [
            { id: 'a', text: 'Modeh Ani' },
            { id: 'b', text: 'Shacharit' },
            { id: 'c', text: 'Mincha' },
            { id: 'd', text: 'Maariv' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'A full daily rhythm: gratitude on waking, morning, afternoon, and evening services.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Mincha and Maariv complete the daily cycle — an afternoon pause and an evening close, both rooted in the Talmud and Torah readings of the Temple.</p>`,
      },
      sources: [
        'Talmud Berakhot 6b',
        'Talmud Berakhot 27b',
        'Zohar Vol. 1, 132b',
        'Rambam, Hilchot Tefillah 1:6',
      ],
      readMore: `<p>For beginners, daily prayer can feel overwhelming. A classic entry path: (1) say Modeh Ani on waking; (2) add the first line of the Shema morning and night; (3) learn one blessing of the Amidah; (4) slowly expand. Consistency beats completeness — five minutes every day is more transformative than an hour once a week.</p>`,
    },

    {
      id: 'u4l6',
      title: 'Kaddish — Sanctifying the Name',
      iconName: 'kaddish',
      hook: {
        title: 'A Prayer That Never Mentions Death',
        body: `<p>Kaddish is the mourner\'s prayer — said for 11 months after a parent\'s passing, on yahrzeit every year. Yet it contains not a single word about death, loss, or grief. It is pure praise of Hashem.</p>`,
      },
      teachSlides: [
        {
          title: 'What Kaddish Says',
          hebrew: 'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא',
          transliteration: 'Yitgadal v\'yitkadash sh\'mei rabbah',
          translation: 'May His great Name be exalted and sanctified',
          body: `<p>Kaddish is written almost entirely in Aramaic — the everyday language of Babylonian Jews. Its message: G-d\'s Name deserves exaltation precisely in our moments of loss. By praising Hashem at the hardest moment, the mourner sanctifies the Name.</p>`,
          concept: 'Praise in the dark is the deepest faith.',
        },
        {
          title: 'Mourner\'s Kaddish — Why 11 Months?',
          body: `<p>By tradition, a soul is judged for up to 12 months after death. Jews say Kaddish for only 11 months — implying the deceased doesn\'t need the full year of atonement. It is an act of respect. The custom originates in a story of Rabbi Akiva helping a suffering soul through the merit of his son reciting Kaddish (Or Zarua).</p>`,
        },
        {
          title: 'Forms of Kaddish',
          body: `<p>There are several types:<br>
          <strong>Kaddish Yatom</strong> (Mourner\'s Kaddish) — said by mourners after services.<br>
          <strong>Chatzi Kaddish</strong> (Half Kaddish) — divides sections of the prayer service.<br>
          <strong>Kaddish D\'Rabbanan</strong> — said after Torah study, adding a prayer for scholars.<br>
          <strong>Kaddish Shalem</strong> (Full Kaddish) — includes a line asking that prayers be accepted.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What language is Kaddish primarily written in?',
          options: ['Hebrew', 'Aramaic', 'Yiddish', 'Greek'],
          correct: 1,
          explanation: 'Kaddish is mostly in Aramaic — the spoken language of Jews in Babylonia, chosen so ordinary people could understand it.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What is the subject of Kaddish?',
          options: ['Mourning and loss', 'The deceased person\'s soul', 'Praise of G-d\'s Name', 'Forgiveness for the dead'],
          correct: 2,
          explanation: 'Kaddish praises the greatness of Hashem\'s Name. It never mentions death, grief, or the deceased.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Why is Mourner\'s Kaddish said for 11 months, not 12?',
          options: [
            'The custom was set arbitrarily',
            'To imply the deceased does not need a full year of atonement',
            'It was shortened by later authorities',
            'The 12th month is reserved for the chazzan',
          ],
          correct: 1,
          explanation: 'Jewish tradition holds that a soul is judged for up to 12 months. Stopping at 11 is an act of respect — implying the deceased is righteous and doesn\'t require the full period.',
        },
        {
          type: 'true_false',
          prompt: 'Kaddish contains at least one reference to death or the deceased.',
          correct: false,
          explanation: 'Kaddish makes no mention of death, loss, or the deceased. It is entirely a declaration of praise.',
        },
        {
          type: 'fill_blank',
          prompt: 'Kaddish opens with "Yitgadal v\'yitkadash sh\'mei ___" (His great Name).',
          answer_variants: ['rabbah', 'raba'],
          explanation: '"Sh\'mei rabbah" — His great Name. The call-and-response that anchors the prayer.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Yitgadal v\'yitkadash".',
          answer_variants: [
            'may his name be exalted and sanctified',
            'may it be exalted and sanctified',
            'exalted and sanctified',
            'magnified and sanctified',
          ],
          explanation: '"May His great Name be exalted and sanctified" — the opening words of Kaddish.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each form of Kaddish to its use.',
          left: [
            { id: 'a', text: 'Kaddish Yatom' },
            { id: 'b', text: 'Chatzi Kaddish' },
            { id: 'c', text: 'Kaddish D\'Rabbanan' },
          ],
          right: [
            { id: '1', text: 'Said after Torah study, includes prayer for scholars' },
            { id: '2', text: 'Divides sections of the prayer service' },
            { id: '3', text: 'Said by mourners at end of services' },
          ],
          correct: { a: '3', b: '2', c: '1' },
          explanation: 'Yatom = orphan\'s/mourner\'s; Chatzi = half; D\'Rabbanan = of the rabbis (after learning).',
        },
        {
          type: 'order_steps',
          prompt: 'Order the stages of mourning in traditional practice.',
          steps: [
            { id: 'a', text: 'Shiva — 7 days of mourning at home' },
            { id: 'b', text: 'Shloshim — 30 days of lesser mourning' },
            { id: 'c', text: 'Kaddish said for 11 months' },
            { id: 'd', text: 'Yahrzeit observed annually' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Jewish mourning is structured in concentric circles: shiva → shloshim → 11 months of Kaddish → annual yahrzeit.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Kaddish is Judaism\'s paradox: the mourner\'s prayer that praises G-d without a word of grief. By sanctifying the Name in the hardest moment, the mourner transforms personal loss into a declaration of faith.</p>`,
      },
      sources: [
        'Talmud Berakhot 3a',
        'Or Zarua, Rabbi Yitzchak of Vienna (13th c.)',
        'Shulchan Aruch, Yoreh De\'ah 376',
        'Shulchan Aruch, Orach Chaim 132',
      ],
      readMore: `<p>The Kaddish story in the Or Zarua: Rabbi Akiva saw a man running in great distress in the afterlife. He discovered the man had sinned greatly, and his soul's suffering could be eased if his son would recite Kaddish in the synagogue. Rabbi Akiva found the man's son, taught him to pray, and the son began reciting Kaddish — whereupon the father's soul found rest. From this story grew the universal Jewish custom that continues to this day.</p>`,
    },

    {
      id: 'u4l7',
      title: 'Brachos — Blessings in Daily Life',
      iconName: 'blessing_hands',
      hook: {
        title: 'The World Belongs to Hashem',
        body: `<p>Before you eat an apple, drink water, smell a rose, or hear thunder — Jewish law says: say a blessing first. The bracha isn\'t politeness. It\'s acknowledgment of ownership.</p>`,
      },
      teachSlides: [
        {
          title: 'The Formula',
          hebrew: 'בָּרוּךְ אַתָּה ה\' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם',
          transliteration: 'Baruch Atah Hashem, Elokeinu Melech haolam',
          translation: 'Blessed are You, Lord our G-d, King of the universe',
          body: `<p>Every bracha begins identically — then finishes with the specific reason (e.g., "...who creates the fruit of the tree"). The Talmud teaches that a person should say 100 brachot each day (Menachot 43b), weaving blessing through every hour.</p>`,
          concept: 'One formula, a hundred occasions.',
        },
        {
          title: 'Three Families of Brachot',
          body: `<p><strong>Birkot HaNehenin</strong> — blessings over pleasures (food, drink, fragrance, beautiful sights). Said before enjoying.<br>
          <strong>Birkot HaMitzvot</strong> — blessings before performing a commandment ("...who sanctified us with His commandments and commanded us to...").<br>
          <strong>Birkot HaShevach</strong> — blessings of praise (thunder, lightning, seeing a Torah scholar, the ocean). Said in response to encountering something wondrous.</p>`,
        },
        {
          title: 'Why Before, Not After?',
          body: `<p>Talmud Berakhot 35a: "The earth and its fullness belong to Hashem" (Tehillim 24:1). Enjoying something without acknowledging G-d\'s ownership is compared to theft. The bracha is the acknowledgment — the permission to enjoy. Saying it after would be like paying after you\'ve already taken something.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many brachot does a Jew ideally say each day?',
          options: ['7', '18', '100', '613'],
          correct: 2,
          explanation: 'The Talmud (Menachot 43b) teaches that a person should say 100 brachot every day, weaving blessing throughout all daily activities.',
        },
        {
          type: 'multiple_choice',
          prompt: 'A bracha said before eating fruit is an example of:',
          options: ['Birkot HaShevach', 'Birkot HaNehenin', 'Birkot HaMitzvot', 'Birkat HaMazon'],
          correct: 1,
          explanation: 'Birkot HaNehenin — blessings over pleasures and enjoyment, including food, drink, and fragrances.',
        },
        {
          type: 'multiple_choice',
          prompt: 'According to the Talmud, why must one say a bracha BEFORE enjoying something?',
          options: [
            'It makes the food ritually pure',
            'The entire world belongs to Hashem — the bracha is an acknowledgment of ownership',
            'It is a rabbinic decree with no deeper reason',
            'To give thanks for one\'s health',
          ],
          correct: 1,
          explanation: 'Berakhot 35a: "The earth and its fullness belong to Hashem" (Tehillim 24:1). Enjoying without acknowledging G-d is compared to theft. The bracha is the permission.',
        },
        {
          type: 'true_false',
          prompt: 'Brachot are only required for food and drink.',
          correct: false,
          explanation: 'Brachot are said before mitzvot, over pleasant fragrances, upon seeing lightning, hearing thunder, encountering a Torah scholar, and many other occasions.',
        },
        {
          type: 'fill_blank',
          prompt: 'Every bracha begins: "Baruch Atah Hashem, Elokeinu Melech ___."',
          answer_variants: ['haolam', 'ha\'olam'],
          explanation: '"Melech haolam" — King of the universe. The opening formula is identical for every blessing; only the ending changes.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Birkot HaNehenin".',
          answer_variants: ['blessings of enjoyment', 'blessings of pleasure', 'blessings over pleasures'],
          explanation: '"Nehenin" comes from "hana\'ah" — pleasure or enjoyment. These blessings are said before any pleasurable experience.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each bracha family to its use.',
          left: [
            { id: 'a', text: 'Birkot HaNehenin' },
            { id: 'b', text: 'Birkot HaMitzvot' },
            { id: 'c', text: 'Birkot HaShevach' },
          ],
          right: [
            { id: '1', text: 'Said when seeing lightning or a great Torah scholar' },
            { id: '2', text: 'Said before performing a commandment' },
            { id: '3', text: 'Said before food, drink, or pleasant fragrances' },
          ],
          correct: { a: '3', b: '2', c: '1' },
          explanation: 'HaNehenin = pleasures, HaMitzvot = commandments, HaShevach = praise upon encountering wonders.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the proper sequence when enjoying food.',
          steps: [
            { id: 'a', text: 'Identify the correct bracha for this food' },
            { id: 'b', text: 'Say the bracha aloud (or quietly, lips moving)' },
            { id: 'c', text: 'Eat and enjoy' },
            { id: 'd', text: 'Say Birkat HaMazon (Grace After Meals) after a bread meal' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Identify → bless → enjoy → conclude (for a full meal with bread). The bracha always precedes the pleasure.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Brachot transform daily life into an ongoing conversation with Hashem. By pausing to acknowledge G-d\'s ownership before each pleasure, every moment of eating, smelling, or seeing becomes an act of awareness.</p>`,
      },
      sources: [
        'Talmud Berakhot 35a',
        'Talmud Menachot 43b',
        'Tehillim 24:1',
        'Shulchan Aruch, Orach Chaim 46, 210–232',
        'Rambam, Hilchot Brachot 1:1–2',
      ],
      readMore: `<p>The 100-brachot-a-day standard is attributed by some to King David himself, who instituted it after a plague that killed 100 people per day. By blessing 100 times — one for each person — the Jewish people would remember their vulnerability and their dependence on G-d. The number became law; the spiritual practice of attention remained its point.</p>`,
    },

    {
      id: 'u4l8',
      title: 'Kavvanah — The Art of Intentional Prayer',
      iconName: 'kavvanah',
      hook: {
        title: 'Talking At vs. Talking To',
        body: `<p>You can recite the entire Amidah without a single mispronunciation and miss the point entirely. Kavvanah — direction of the heart — is what separates words from prayer.</p>`,
      },
      teachSlides: [
        {
          title: 'What Kavvanah Means',
          hebrew: 'כַּוָּנָה',
          transliteration: 'kavvanah',
          translation: 'intention, direction',
          body: `<p>"Kavvanah" comes from the root meaning "to aim" or "to direct." In prayer it means: knowing before Whom you stand. Not just reciting text, but directing your attention and intention toward Hashem as you speak. The Shulchan Aruch (OC 98:1) says a person praying should consider that the Shechina (Divine Presence) is before them.</p>`,
          concept: 'Prayer without kavvanah is a letter without a recipient.',
        },
        {
          title: 'The Rambam\'s Minimum',
          body: `<p>The Rambam rules (Hilchot Tefillah 4:15–16): if you prayed the entire Amidah without kavvanah, you must repeat it — except if you had kavvanah for at least the first blessing (Avot). That single blessing with full attention is the minimum threshold. The Rambam\'s baseline is demanding: even one blessing prayed with a wandering mind requires repeating it.</p>`,
          concept: 'The first blessing is the non-negotiable.',
        },
        {
          title: 'Chana\'s Model',
          body: `<p>The Talmud (Berakhot 31a) derives all laws of Amidah prayer from Chana\'s prayer in Shmuel Aleph (1:13): "She spoke to her heart — only her lips moved, and her voice was not heard." Chana was so absorbed in prayer that Eli the Kohen thought she was drunk. This total absorption — lips moving, heart engaged, voice inaudible — is the Jewish ideal of prayer.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What does "kavvanah" literally mean?',
          options: ['Intention / direction', 'Silence', 'Holiness', 'Concentration'],
          correct: 0,
          explanation: '"Kavvanah" comes from the root meaning "to aim" or "to direct." In prayer it means directing your heart and attention toward Hashem.',
        },
        {
          type: 'multiple_choice',
          prompt: 'According to the Rambam, which blessing of the Amidah requires kavvanah at minimum?',
          options: ['The last blessing (Shalom)', 'Any one blessing', 'The first blessing (Avot)', 'All 19 blessings equally'],
          correct: 2,
          explanation: 'Rambam rules that the first blessing (Avot) is the minimum — if you had kavvanah for that, you don\'t need to repeat the Amidah even if the rest lacked focus.',
        },
        {
          type: 'multiple_choice',
          prompt: 'From whose prayer does the Talmud derive the laws of the Amidah?',
          options: ['Miriam', 'Chana', 'Rivkah', 'Devorah'],
          correct: 1,
          explanation: 'Berakhot 31a derives all Amidah laws from Chana (Shmuel Aleph 1:13) — her silent, heart-engaged, barely audible prayer is the model.',
        },
        {
          type: 'true_false',
          prompt: 'Kavvanah means pronouncing every word of the prayer correctly.',
          correct: false,
          explanation: 'Kavvanah is about directing the heart, not pronunciation. You can say every word perfectly and have no kavvanah. You can stumble on words and have deep kavvanah.',
        },
        {
          type: 'fill_blank',
          prompt: 'Chana\'s prayer model: "She spoke to her ___; only her lips moved."',
          answer_variants: ['heart', 'lev'],
          explanation: 'Shmuel Aleph 1:13: she prayed in her heart (lev) with only her lips moving — the Talmudic ideal of kavvanah.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "kavvanah".',
          answer_variants: ['intention', 'direction', 'intent', 'intention and direction'],
          explanation: 'Kavvanah = intention or direction. In prayer it means knowing before Whom you stand and directing your words there.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each teaching to its source.',
          left: [
            { id: 'a', text: 'Laws of Amidah posture derived from her prayer' },
            { id: 'b', text: 'First blessing minimum kavvanah rule' },
            { id: 'c', text: 'Imagine the Shechina is before you when praying' },
          ],
          right: [
            { id: '1', text: 'Shulchan Aruch, Orach Chaim 98:1' },
            { id: '2', text: 'Chana (Shmuel Aleph 1:13)' },
            { id: '3', text: 'Rambam, Hilchot Tefillah 4:15–16' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Chana → posture, Rambam → minimum standard, Shulchan Aruch → the visualization practice.',
        },
        {
          type: 'order_steps',
          prompt: 'Order practical steps for building kavvanah before the Amidah.',
          steps: [
            { id: 'a', text: 'Pause for a moment before beginning — don\'t rush in' },
            { id: 'b', text: 'Recall before Whom you are standing' },
            { id: 'c', text: 'Say the first blessing slowly and with full focus' },
            { id: 'd', text: 'Continue through the rest of the Amidah' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Pause → awareness → focused first blessing → continue. The Rambam\'s logic: if you get the first blessing right, you\'ve prayed.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Kavvanah is the difference between ritual and relationship. The Rambam sets a minimum — one blessing with a directed heart — but the tradition\'s ideal is Chana: total absorption, still lips, voice barely audible, heart fully present.</p>`,
      },
      sources: [
        'Talmud Berakhot 31a',
        'Shmuel Aleph 1:13',
        'Rambam, Hilchot Tefillah 4:15–16',
        'Shulchan Aruch, Orach Chaim 98:1',
      ],
      readMore: `<p>The Chassidic masters spent enormous energy on kavvanah — some would spend hours preparing before prayer, using melody (niggun) and hitbonenut (contemplation) to arouse the heart. The Baal Shem Tov taught that a simple person saying Tehillim with complete sincerity reaches places a scholar reciting Talmud without feeling cannot. The vessel matters; so does what's inside it.</p>`,
    },

    {
      id: 'u4l9',
      title: 'Tehillim — Psalms in Jewish Life',
      iconName: 'tehillim',
      hook: {
        title: '150 Psalms, Every Human Situation',
        body: `<p>For three thousand years, Jews have turned to the same book in moments of fear, illness, grief, and joy. Sefer Tehillim (the Book of Psalms) has 150 chapters — and somewhere in them, every human experience is spoken aloud to Hashem.</p>`,
      },
      teachSlides: [
        {
          title: 'The Book of Psalms',
          body: `<p>Bava Batra 14b lists 10 authors of Tehillim — including Adam, Avraham, Moshe, and Shlomo — but David HaMelech is its primary voice. David was a warrior, a fugitive, a king, a sinner, and a penitent. His words map onto every human situation because he lived every human situation.</p>`,
          concept: 'David wrote Tehillim from the inside of life, not above it.',
        },
        {
          title: 'When Jews Say Tehillim',
          body: `<p>Jews say Tehillim:<br>
          <strong>During illness</strong> — especially Psalm 119 (the longest), spelled out with letters of the sick person\'s Hebrew name and the word <em>neshamah</em>.<br>
          <strong>In danger or crisis</strong> — communities gather to recite Tehillim when the Jewish people face threat.<br>
          <strong>Seasonally</strong> — Psalm 27 throughout Elul and the High Holiday season; Psalm 130 during the Days of Awe.<br>
          <strong>Daily</strong> — many divide all 150 psalms weekly or monthly.</p>`,
        },
        {
          title: 'Key Psalms',
          body: `<p><strong>Psalm 23</strong> — "Hashem is my shepherd" — comfort in darkness.<br>
          <strong>Psalm 27</strong> — "The Lord is my light and salvation" — Elul and the High Holidays.<br>
          <strong>Psalm 91</strong> — "Dwelling in the shadow of the Almighty" — protection.<br>
          <strong>Psalm 130</strong> — "From the depths I call to You" — penitence and return.<br>
          <strong>Psalm 150</strong> — "Let everything that breathes praise G-d" — closing praise.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many psalms does Sefer Tehillim contain?',
          options: ['100', '120', '150', '180'],
          correct: 2,
          explanation: 'Sefer Tehillim has 150 psalms. They are divided into five books, mirroring the five books of the Torah.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Who is the primary author of Tehillim?',
          options: ['Moshe Rabbeinu', 'Shlomo HaMelech', 'David HaMelech', 'Avraham Avinu'],
          correct: 2,
          explanation: 'David HaMelech wrote the majority of Tehillim, though the Talmud (Bava Batra 14b) names 10 authors total.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which psalm is traditionally recited throughout the month of Elul and the High Holiday season?',
          options: ['Psalm 23', 'Psalm 27', 'Psalm 91', 'Psalm 130'],
          correct: 1,
          explanation: 'Psalm 27 — "The Lord is my light and salvation" — is said from Rosh Chodesh Elul through Hoshana Rabbah, the season of teshuva.',
        },
        {
          type: 'true_false',
          prompt: 'David HaMelech is the sole author of all 150 psalms.',
          correct: false,
          explanation: 'The Talmud (Bava Batra 14b) lists 10 authors, including Adam, Avraham, Moshe, Shlomo, and others. David compiled and wrote most of them.',
        },
        {
          type: 'fill_blank',
          prompt: 'The Hebrew word "Tehillim" means "___."',
          answer_variants: ['praises', 'songs of praise', 'hymns'],
          explanation: '"Tehillim" comes from the root "hillel" — to praise. The book is literally a collection of praises.',
        },
        {
          type: 'typed_translation',
          prompt: 'Translate Psalm 23\'s opening: "Hashem ro\'i."',
          answer_variants: ['the lord is my shepherd', 'hashem is my shepherd', 'god is my shepherd'],
          explanation: '"Hashem ro\'i" — The Lord is my shepherd. Perhaps the most recognizable line in all of Tehillim.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each psalm to its theme or occasion.',
          left: [
            { id: 'a', text: 'Psalm 23' },
            { id: 'b', text: 'Psalm 27' },
            { id: 'c', text: 'Psalm 130' },
            { id: 'd', text: 'Psalm 150' },
          ],
          right: [
            { id: '1', text: 'Penitence — "From the depths I call to You"' },
            { id: '2', text: 'Closing praise — "Let everything that breathes praise G-d"' },
            { id: '3', text: 'Comfort — "The Lord is my shepherd"' },
            { id: '4', text: 'Elul season — "The Lord is my light and salvation"' },
          ],
          correct: { a: '3', b: '4', c: '1', d: '2' },
          explanation: 'Psalm 23 = comfort, Psalm 27 = Elul, Psalm 130 = penitence, Psalm 150 = closing praise.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the stages of the High Holiday season during which Psalm 27 is recited.',
          steps: [
            { id: 'a', text: 'Rosh Chodesh Elul — beginning of Psalm 27 recitation' },
            { id: 'b', text: 'Rosh Hashanah — the new year' },
            { id: 'c', text: 'Yom Kippur — the Day of Atonement' },
            { id: 'd', text: 'Hoshana Rabbah — final day of Psalm 27 recitation' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Psalm 27 accompanies the 40-day period of teshuva from Rosh Chodesh Elul through Hoshana Rabbah.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Tehillim is the Jewish people\'s emotional vocabulary for speaking to Hashem — 150 psalms covering every human experience, from "The Lord is my shepherd" to "From the depths I call to You." Three thousand years of Jews have turned to the same words in the same moments.</p>`,
      },
      sources: [
        'Talmud Bava Batra 14b',
        'Talmud Berakhot 4b',
        'Mishnah Tamid 7:4',
        'Shulchan Aruch, Orach Chaim 119',
      ],
      readMore: `<p>The Mishnah Tamid (7:4) records the psalm sung by the Levites in the Temple for each day of the week — Sunday through Friday plus Shabbat. This practice survives in the Siddur today: after Shacharit, the daily psalm (Shir shel Yom) is recited. Psalm 92 is the Shabbat psalm. The Temple is gone, but the daily cycle of Tehillim continues wherever Jews pray.</p>`,
    },

    {
      id: 'u4l10',
      title: 'Prayer Quiz',
      iconName: 'quiz_checklist',
      isQuiz: true,
      hook: {
        title: 'Prayer — Quiz',
        body: `<p>Ten questions reviewing the three daily services, the Amidah, Kaddish, brachot, kavvanah, and Tehillim.</p>`,
      },
      teachSlides: [],
      questions: [
        {
          type: 'multiple_choice',
          prompt: '"Hitpalel" (to pray) literally means:',
          options: ['To speak to G-d', 'To judge oneself', 'To ask for things', 'To give thanks'],
          correct: 1,
          explanation: 'Reflexive — "to judge oneself." Prayer as self-examination.',
        },
        {
          type: 'multiple_choice',
          prompt: 'The weekday Amidah contains how many blessings?',
          options: ['7', '18', '19', '20'],
          correct: 2,
          explanation: 'Originally 18 ("Shemoneh Esreh"); a 19th was added. On Shabbat it drops to 7.',
        },
        {
          type: 'multiple_choice',
          prompt: 'The Amidah\'s three sections in order are:',
          options: [
            'Petition → Praise → Thanksgiving',
            'Praise → Petition → Thanksgiving',
            'Thanksgiving → Praise → Petition',
            'Praise → Thanksgiving → Petition',
          ],
          correct: 1,
          explanation: 'Shevach (Praise) → Bakasha (Petition) → Hodaah (Thanksgiving). You praise before you ask.',
        },
        {
          type: 'multiple_choice',
          prompt: 'The first words said each morning are:',
          options: ['Baruch Hashem', 'Shema Yisrael', 'Modeh Ani', 'Ashrei'],
          correct: 2,
          explanation: '"Modeh Ani" — said in bed, before washing, 12 words of gratitude.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Kaddish is primarily written in:',
          options: ['Hebrew', 'Aramaic', 'Yiddish', 'Greek'],
          correct: 1,
          explanation: 'Aramaic — the everyday language of Babylonian Jews, so the prayer would be understood by all.',
        },
        {
          type: 'multiple_choice',
          prompt: 'A bracha said before eating is an example of:',
          options: ['Birkot HaShevach', 'Birkot HaMitzvot', 'Birkot HaNehenin', 'Birkat HaMazon'],
          correct: 2,
          explanation: 'Birkot HaNehenin — blessings over pleasures, including all food and drink.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which psalm is said throughout Elul and the High Holiday season?',
          options: ['Psalm 23', 'Psalm 27', 'Psalm 91', 'Psalm 130'],
          correct: 1,
          explanation: 'Psalm 27 — "The Lord is my light and salvation" — accompanies the 40-day period of teshuva.',
        },
        {
          type: 'true_false',
          prompt: 'The Amidah is traditionally said silently while standing, facing Jerusalem.',
          correct: true,
          explanation: 'Standing, feet together, silent, facing Jerusalem — an intimate conversation with Hashem.',
        },
        {
          type: 'fill_blank',
          prompt: '"Kavvanah" means intention or ___ of the heart.',
          answer_variants: ['direction', 'aim'],
          explanation: 'Kavvanah = intention and direction. In prayer, it means knowing before Whom you stand and pointing your words there.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each prayer term to its meaning.',
          left: [
            { id: 'a', text: 'Amidah' },
            { id: 'b', text: 'Kaddish' },
            { id: 'c', text: 'Kavvanah' },
            { id: 'd', text: 'Tehillim' },
          ],
          right: [
            { id: '1', text: 'Book of Psalms — 150 chapters of praise and prayer' },
            { id: '2', text: 'The standing prayer — 19 blessings in 3 movements' },
            { id: '3', text: 'Intention — directing the heart toward Hashem' },
            { id: '4', text: 'Aramaic doxology said by mourners — pure praise' },
          ],
          correct: { a: '2', b: '4', c: '3', d: '1' },
          explanation: 'Amidah = standing prayer, Kaddish = mourner\'s praise, Kavvanah = heart-direction, Tehillim = Psalms.',
        },
      ],
      wrap: {
        title: 'Unit Complete',
        body: `<p>You\'ve walked through the full world of Jewish prayer — from Modeh Ani on waking to the Amidah\'s structure, from Kaddish\'s paradox to the 150 psalms of Tehillim. Next: the sanctity of Shabbat.</p>`,
      },
      sources: [
        'Talmud Berakhot 26b',
        'Talmud Berakhot 28b–29a',
        'Rambam, Hilchot Tefillah 1:1',
        'Shulchan Aruch, Orach Chaim 98–132',
      ],
    },
  ],
};

export default unit3;
