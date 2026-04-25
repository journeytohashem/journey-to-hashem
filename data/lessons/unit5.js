// Unit 5 — Shabbat. V1 gamification format (see data/lessons/schema.js).
const unit2 = {
  id: 'unit5',
  title: 'Shabbat — The Day of Rest',
  level: 'Beginner',
  lessons: [
    {
      id: 'u5l1',
      title: 'What is Shabbat?',
      iconName: 'shabbat_sunset',
      hook: {
        title: 'What is Shabbat?',
        body: `<p>Shabbat is the Jewish day of rest — observed from Friday sundown to Saturday nightfall. It is the only holiday in the Ten Commandments, and the weekly heartbeat of Jewish life.</p>`,
      },
      teachSlides: [
        {
          title: 'A Taste of the World to Come',
          hebrew: 'מֵעֵין עוֹלָם הַבָּא',
          transliteration: "Me'ein olam haba",
          translation: 'A foretaste of the World to Come',
          body: `<p>The Talmud calls Shabbat a foretaste of the World to Come. We stop creating and controlling, and simply exist — acknowledging that Hashem is the true master of the world.</p>`,
          concept: 'Not restriction — elevation.',
        },
        {
          title: 'Shabbat Shalom',
          hebrew: 'שַׁבָּת שָׁלוֹם',
          transliteration: 'Shabbat Shalom',
          translation: 'A Peaceful Sabbath',
          body: `<p>The greeting "Shabbat Shalom" wishes peace and wholeness. Friday nights, families gather with candles, wine (kiddush), and two loaves of challah — a scene repeated worldwide for thousands of years.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'When does Shabbat begin?',
          options: ['Friday midnight', 'Saturday morning', 'Friday at sundown', 'Thursday night'],
          correct: 2,
          explanation: 'Shabbat begins at sundown Friday — candles are lit 18 minutes before — and ends Saturday night when three stars appear.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Shabbat is mentioned in which foundational Jewish text?',
          options: ['The Book of Esther', 'The Ten Commandments', 'The Talmud only', 'The Zohar'],
          correct: 1,
          explanation: 'Shabbat is the only holiday in the Ten Commandments — both versions in Shemot 20 and Devarim 5.',
        },
        {
          type: 'multiple_choice',
          prompt: 'How many loaves of challah traditionally appear on the Shabbat table?',
          options: ['One', 'Two', 'Three', 'Seven'],
          correct: 1,
          explanation: 'Two challot — recalling the double portion of manna that fell on Fridays in the desert.',
        },
        {
          type: 'true_false',
          prompt: 'Shabbat is considered a sign of the covenant between Hashem and the Jewish people.',
          correct: true,
          explanation: 'The Torah explicitly calls Shabbat an <em>ot</em> — a sign — of the covenant (Shemot 31:16–17).',
        },
        {
          type: 'fill_blank',
          prompt: 'The traditional Friday-night greeting is "Shabbat ___."',
          answer_variants: ['shalom'],
          explanation: '"Shabbat Shalom" — a peaceful Sabbath. "Shalom" means peace, wholeness, and harmony.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Shabbat Shalom".',
          answer_variants: ['peaceful sabbath', 'a peaceful sabbath', 'sabbath of peace', 'peaceful shabbat'],
          explanation: '"Shabbat Shalom" — Peaceful Sabbath. "Shalom" carries the meanings of peace, wholeness, and completeness.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Shabbat element to what it is.',
          left: [
            { id: 'a', text: 'Challah' },
            { id: 'b', text: 'Kiddush' },
            { id: 'c', text: 'Shabbat' },
          ],
          right: [
            { id: '1', text: 'The day of rest itself' },
            { id: '2', text: 'Braided bread, two loaves' },
            { id: '3', text: 'Blessing over wine' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Challah is the bread, Kiddush is the blessing over wine, Shabbat is the day itself.',
        },
        {
          type: 'order_steps',
          prompt: 'Order these pieces of Friday night.',
          steps: [
            { id: 'a', text: 'Light Shabbat candles' },
            { id: 'b', text: 'Go to synagogue for Kabbalat Shabbat' },
            { id: 'c', text: 'Recite Kiddush over wine at home' },
            { id: 'd', text: 'Break bread over two challot' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Candles first (they bring Shabbat in), then the welcoming service, then Kiddush and the Shabbat meal.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Shabbat is a weekly pause — a covenantal sign that weaves peace, family, and holiness into the fabric of time itself.</p>`,
      },
      sources: [
        'Shemot 20:8–11',
        'Shemot 31:16–17',
        'Devarim 5:12–15',
        'Talmud Berakhot 57b',
        'Zohar Vol. 2, 88a',
        'Rambam, Hilchot Shabbat',
        'Shulchan Aruch, Orach Chaim 271',
      ],
      readMore: `<p>Ahad Ha\'am\'s famous line — "More than the Jews have kept Shabbat, Shabbat has kept the Jews" — captures something true about the day. In a world that never stops, choosing one day a week to stop is itself a radical spiritual act. The 39 categories of forbidden work (<em>melachot</em>) are not arbitrary; each mirrors a category of creative labor that built the Mishkan (the Tabernacle).</p>`,
    },

    {
      id: 'u5l2',
      title: 'Friday Night — Kabbalat Shabbat',
      iconName: 'shabbat_candles',
      hook: {
        title: 'Welcoming Shabbat',
        body: `<p>As Friday\'s sun drops, Jewish homes and synagogues transform. Candles are lit, services begin, and Shabbat is welcomed as a queen and bride.</p>`,
      },
      teachSlides: [
        {
          title: 'Candle Lighting',
          hebrew: 'לְהַדְלִיק נֵר שֶׁל שַׁבָּת',
          transliteration: "l'hadlik ner shel Shabbat",
          translation: 'to kindle the Sabbath light',
          body: `<p>At least two candles are lit — 18 minutes before sunset. Many circle their hands over the flames three times, cover their eyes, and bless, then open their eyes to see Shabbat for the first time.</p>`,
        },
        {
          title: 'Lecha Dodi',
          hebrew: 'לְכָה דוֹדִי לִקְרַאת כַּלָּה',
          transliteration: 'Lecha Dodi likrat kallah',
          translation: 'Come my beloved, to meet the bride',
          body: `<p>A 16th-century poem by Rabbi Shlomo Alkabetz of Tzfat. At the final verse, the congregation turns to the door and bows — welcoming the Shabbat queen in person.</p>`,
          concept: 'Shabbat as bride and queen.',
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many minutes before sunset is it customary to light Shabbat candles?',
          options: ['10 minutes', '18 minutes', '30 minutes', 'At sunset exactly'],
          correct: 1,
          explanation: '18 minutes before sunset — a buffer that ensures Shabbat is entered on time, without violation.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What is the Friday night synagogue service called?',
          options: ['Havdalah', 'Maariv alone', 'Kabbalat Shabbat', 'Mincha'],
          correct: 2,
          explanation: 'Kabbalat Shabbat — "Receiving the Sabbath" — welcomes Shabbat with Psalms and Lecha Dodi, followed by the regular evening Maariv.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Who composed the poem Lecha Dodi?',
          options: ['Rabbi Akiva', 'King David', 'Rabbi Shlomo Alkabetz', 'The Vilna Gaon'],
          correct: 2,
          explanation: 'Rabbi Shlomo Alkabetz, a 16th-century mystic of Tzfat, composed Lecha Dodi — sung today in nearly every Jewish community.',
        },
        {
          type: 'true_false',
          prompt: 'At the last verse of Lecha Dodi, the congregation turns toward the door of the synagogue.',
          correct: true,
          explanation: 'They turn to the door and bow, symbolically welcoming the Shabbat bride as she "enters."',
        },
        {
          type: 'fill_blank',
          prompt: 'At least ___ candles are traditionally lit to welcome Shabbat.',
          answer_variants: ['two', '2'],
          explanation: 'Two candles — corresponding to the two formulations of the Shabbat commandment ("Remember" and "Keep").',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Kabbalat Shabbat".',
          answer_variants: ['receiving the sabbath', 'welcoming the sabbath', 'receiving shabbat', 'welcoming shabbat'],
          explanation: '"Kabbalat Shabbat" — literally "Receiving Shabbat." We receive Shabbat as a guest of honor.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each term to its role.',
          left: [
            { id: 'a', text: 'Kabbalat Shabbat' },
            { id: 'b', text: 'Lecha Dodi' },
            { id: 'c', text: 'Kiddush' },
          ],
          right: [
            { id: '1', text: 'Blessing over wine at the meal' },
            { id: '2', text: 'Friday-night welcoming service' },
            { id: '3', text: 'Poem sung during Kabbalat Shabbat' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Kabbalat Shabbat = service, Lecha Dodi = its central poem, Kiddush = blessing over wine at the table.',
        },
        {
          type: 'order_steps',
          prompt: 'Order these Friday-night moments from first to last.',
          steps: [
            { id: 'a', text: 'Light candles (at home)' },
            { id: 'b', text: 'Recite Lecha Dodi at synagogue' },
            { id: 'c', text: 'Return home; Kiddush over wine' },
            { id: 'd', text: 'Break bread over challah' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Candles → Kabbalat Shabbat at shul → Kiddush at the table → blessing over the challah.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Friday night is Shabbat\'s opening chord — candles, a welcoming service, Kiddush, and the first Shabbat meal. Shabbat arrives like a guest, and we rise to greet her.</p>`,
      },
      sources: [
        'Talmud Shabbat 25b',
        'Shulchan Aruch, Orach Chaim 263:2–5',
        'Rambam, Hilchot Shabbat 5:1',
        'Rabbi Shlomo Alkabetz, Lecha Dodi (16th c., Tzfat)',
      ],
      readMore: `<p>The Talmud tells of Rabbi Chanina who, on Friday afternoons, would wrap himself in his finest clothes and say, "Come, let us go greet the Sabbath queen." Rabbi Yannai would say, "Come, bride; come, bride." These ancient scenes live on each Friday in the rhythm of Kabbalat Shabbat.</p>`,
    },

    {
      id: 'u5l3',
      title: 'Shabbat Day',
      iconName: 'kiddush_cup',
      hook: {
        title: 'Shabbat Morning',
        body: `<p>Shabbat day centers on synagogue, Torah reading, and a festive meal. The whole Jewish world reads the same Torah portion — creating a shared weekly rhythm across every continent.</p>`,
      },
      teachSlides: [
        {
          title: 'The Parasha System',
          body: `<p>The Torah is divided into 54 weekly portions (<em>parashiyot</em>). Every Shabbat, Jewish communities worldwide read the same one, finishing the cycle each year on Simchat Torah and restarting immediately.</p>`,
          concept: 'One Torah, one rhythm, one people.',
        },
        {
          title: 'Afternoon and Third Meal',
          body: `<p>Shabbat afternoon is for rest, walks, study, and family. Mincha (afternoon prayer) is followed by <em>Seudah Shlishit</em> — a lighter third meal, often with singing, as Shabbat begins to wind down.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many weekly Torah portions are there in the annual cycle?',
          options: ['12', '24', '54', '613'],
          correct: 2,
          explanation: '54 parashiyot — a few are combined in shorter years so the cycle always finishes on Simchat Torah.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which holiday marks the completion and immediate restart of the Torah reading cycle?',
          options: ['Rosh Hashanah', 'Yom Kippur', 'Simchat Torah', 'Tisha B\'Av'],
          correct: 2,
          explanation: 'Simchat Torah — "Rejoicing of the Torah" — celebrates finishing Devarim and immediately beginning Bereishit again.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What is the "third meal" of Shabbat called?',
          options: ['Kiddush', 'Seudah Shlishit', 'Havdalah', 'Motzaei Shabbat'],
          correct: 1,
          explanation: '<em>Seudah Shlishit</em> — literally "third meal" — eaten between Mincha and Maariv on Shabbat afternoon.',
        },
        {
          type: 'true_false',
          prompt: 'On Shabbat morning, Jewish communities around the world read the same weekly Torah portion.',
          correct: true,
          explanation: 'The synchronized parasha cycle unites the Jewish world in shared study each week.',
        },
        {
          type: 'fill_blank',
          prompt: 'The weekly Torah portion is called a "___".',
          answer_variants: ['parasha', 'parsha', 'parashah'],
          explanation: 'The <em>parasha</em> (also spelled parsha / parashah) is the weekly Torah portion read on Shabbat morning.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Seudah Shlishit".',
          answer_variants: ['third meal', 'the third meal'],
          explanation: '"Seudah Shlishit" — third meal. A lighter Shabbat-afternoon meal, often with singing and Torah.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Shabbat-day moment to its meaning.',
          left: [
            { id: 'a', text: 'Parasha' },
            { id: 'b', text: 'Mincha' },
            { id: 'c', text: 'Simchat Torah' },
          ],
          right: [
            { id: '1', text: 'Afternoon prayer service' },
            { id: '2', text: 'Weekly Torah portion' },
            { id: '3', text: 'Holiday completing the Torah cycle' },
          ],
          correct: { a: '2', b: '1', c: '3' },
          explanation: 'Parasha = weekly portion, Mincha = afternoon prayer, Simchat Torah = end/start of the yearly cycle.',
        },
        {
          type: 'order_steps',
          prompt: 'Order a traditional Shabbat day.',
          steps: [
            { id: 'a', text: 'Shacharit + Torah reading' },
            { id: 'b', text: 'Shabbat lunch' },
            { id: 'c', text: 'Rest, walks, study' },
            { id: 'd', text: 'Mincha + Seudah Shlishit' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Morning services with Torah, then lunch, then a restful afternoon, ending with Mincha and the third meal.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Shabbat day is built on Torah, meals, and rest — a rhythm so consistent that walking into any synagogue anywhere, you hear the same portion being read.</p>`,
      },
      sources: [
        'Mishnah Megillah 3:4–6',
        'Talmud Megillah 29b',
        'Shulchan Aruch, Orach Chaim 285',
        'Shulchan Aruch, Orach Chaim 291–292',
        'Rambam, Hilchot Tefillah 12:1',
      ],
      readMore: `<p>Public Torah reading is ancient — the Talmud attributes its weekday form to Moshe himself and its Shabbat form to Ezra the Scribe (~450 BCE). Over 2,500 years, the schedule has been refined but never broken. A Jew attending synagogue today is plugging into a continuous stream of Torah that has been read aloud every week for more than two millennia.</p>`,
    },

    {
      id: 'u5l4',
      title: 'Havdalah — Ending Shabbat',
      iconName: 'havdalah_candle',
      hook: {
        title: 'Havdalah',
        body: `<p>When three stars appear Saturday night, Shabbat ends with Havdalah — a brief, sensory ritual of separation between holy and ordinary, using wine, spices, and a braided flame.</p>`,
      },
      teachSlides: [
        {
          title: 'The Four Elements',
          body: `<p><strong>Wine</strong> marks the transition. <strong>Spices</strong> revive the soul, which mourns Shabbat\'s departure. <strong>Candle</strong> — a multi-wicked flame, the first fire after Shabbat. <strong>Blessing</strong>: separating holy from secular.</p>`,
          concept: 'Taste, smell, sight — every sense.',
        },
        {
          title: 'HaMavdil',
          hebrew: 'הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל',
          transliteration: "HaMavdil bein kodesh l'chol",
          translation: 'Who separates between holy and secular',
          body: `<p>The climactic blessing. Afterward: "Shavua Tov" — a good week. The Zohar teaches that Havdalah extends Shabbat\'s protection into the week ahead.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What does "Havdalah" mean?',
          options: ['Blessing', 'Separation', 'Completion', 'Rest'],
          correct: 1,
          explanation: 'From the root <em>l\'havdil</em> — to separate or distinguish. Havdalah separates holy Shabbat from the ordinary week.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which four elements are used in Havdalah?',
          options: ['Candle, wine, challah, spices', 'Wine, spices, candle, blessing', 'Torah, prayer, charity, rest', 'Kiddush, Havdalah, Hallel, Amidah'],
          correct: 1,
          explanation: 'Wine, spices (besamim), a multi-wicked candle, and the closing blessing — each engaging a different sense.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Why do we smell spices at Havdalah?',
          options: ['To clear the air', 'To revive the soul, which mourns Shabbat\'s departure', 'Because the Torah requires incense', 'To flavor the wine'],
          correct: 1,
          explanation: 'Tradition says the soul receives an "extra soul" on Shabbat that departs at its end. The spices revive us.',
        },
        {
          type: 'true_false',
          prompt: 'The Havdalah candle has multiple wicks braided together.',
          correct: true,
          explanation: 'A multi-wicked flame — often the first fire used after Shabbat, celebrating the return of creative labor.',
        },
        {
          type: 'fill_blank',
          prompt: 'Shabbat ends when ___ stars are visible in the night sky.',
          answer_variants: ['three', '3'],
          explanation: 'Three stars mark the halachic end of Shabbat, after which Havdalah is recited.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Shavua Tov".',
          answer_variants: ['good week', 'a good week', 'have a good week'],
          explanation: '"Shavua Tov" — good week. The traditional greeting after Havdalah.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Havdalah element to its meaning.',
          left: [
            { id: 'a', text: 'Wine' },
            { id: 'b', text: 'Besamim' },
            { id: 'c', text: 'Candle' },
          ],
          right: [
            { id: '1', text: 'First fire after Shabbat' },
            { id: '2', text: 'Marks the transition' },
            { id: '3', text: 'Fragrant spices to revive the soul' },
          ],
          correct: { a: '2', b: '3', c: '1' },
          explanation: 'Wine marks transition, spices revive the soul, the candle is the first fire after Shabbat.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the Havdalah ceremony.',
          steps: [
            { id: 'a', text: 'Blessing over wine' },
            { id: 'b', text: 'Blessing over spices, smell them' },
            { id: 'c', text: 'Blessing over the candle\'s light' },
            { id: 'd', text: 'HaMavdil — the final separation blessing' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Wine → spices → candle → HaMavdil. Then a sip of the wine and "Shavua Tov!"',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Havdalah closes Shabbat the way Kabbalat Shabbat opens it — with senses engaged and blessings said, carrying the day\'s light into the week ahead.</p>`,
      },
      sources: [
        'Talmud Berakhot 33a',
        'Talmud Pesachim 103a–b',
        'Shulchan Aruch, Orach Chaim 296–299',
        'Rambam, Hilchot Shabbat 29:1',
        'Zohar Vol. 2, 207b',
      ],
      readMore: `<p>Havdalah is short — only a few minutes — but ritually dense. The Talmud debates its elements, and different communities layer their own melodies and customs (some look at their fingernails in the candle\'s light to see the reflection; some dip a pinky in wine for a sweet week; many sing "Eliyahu HaNavi," invoking the prophet associated with the coming redemption).</p>`,
    },

    {
      id: 'u5l5',
      title: 'The 39 Melachot — What "Work" Means',
      iconName: 'melachot',
      hook: {
        title: 'Not Hard Work — Creative Work',
        body: `<p>The Torah forbids <em>melacha</em> on Shabbat — but melacha doesn\'t mean hard labor. It means creative, constructive work. And its 39 categories come from a surprising source: the building of the Mishkan.</p>`,
      },
      teachSlides: [
        {
          title: 'The Source: The Mishkan',
          body: `<p>The Torah places Shabbat laws immediately before the Mishkan (Tabernacle) construction instructions (Shemot 35:1–3). The Talmud (Shabbat 49b) derives that the categories of forbidden work are exactly those used to build the Mishkan. By resting from the same work that built G-d\'s dwelling place, we acknowledge He — not we — is the real Creator.</p>`,
          concept: 'What built the Mishkan is what rests on Shabbat.',
        },
        {
          title: 'The 39 Categories',
          body: `<p>Mishnah Shabbat 7:2 lists the 39 categories (<em>avot melacha</em> — "father categories"), organized by craft:<br>
          <strong>Agriculture:</strong> plowing, sowing, reaping, binding sheaves, threshing, winnowing, selecting, grinding, sifting, kneading, baking.<br>
          <strong>Textile:</strong> shearing, washing, combing, dyeing, spinning, warping, weaving, separating, tying, untying, sewing, tearing.<br>
          <strong>Leather/writing:</strong> trapping, slaughtering, flaying, tanning, smoothing, ruling, cutting, writing, erasing.<br>
          <strong>Construction/fire:</strong> building, demolishing, kindling, extinguishing, completing a tool, carrying from domain to domain.</p>`,
        },
        {
          title: 'Modern Applications',
          body: `<p>The spirit of melacha guides modern Shabbat observance:<br>
          <strong>No electricity</strong> — completing a circuit resembles building.<br>
          <strong>No driving</strong> — burning fuel resembles kindling.<br>
          <strong>No writing</strong> — one of the 39 categories directly.<br>
          <strong>No cooking</strong> — baking/cooking is explicitly listed.<br>
          The principle isn\'t "don\'t do difficult things" — it\'s "don\'t create, build, or transform." Rest means stepping back from controlling the world.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many categories of forbidden work (melachot) are there on Shabbat?',
          options: ['7', '18', '39', '613'],
          correct: 2,
          explanation: '39 avot melacha — "father categories" of forbidden work. Each has derivative sub-categories (toladot).',
        },
        {
          type: 'multiple_choice',
          prompt: 'The 39 melachot are derived from the activities used to build what?',
          options: ['The Temple in Jerusalem', 'The Mishkan (Tabernacle)', 'Noah\'s Ark', 'The city of Jerusalem'],
          correct: 1,
          explanation: 'The Talmud (Shabbat 49b) derives the 39 melachot from the work needed to build the Mishkan — the portable Tabernacle in the desert.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What is the correct definition of "melacha" (the forbidden Shabbat "work")?',
          options: ['Hard physical labor', 'Creative or constructive work', 'Any activity that causes tiredness', 'Work done for money'],
          correct: 1,
          explanation: '"Melacha" means creative, purposeful, constructive work — not effort. Carrying a boulder is not melacha. Writing one letter is.',
        },
        {
          type: 'true_false',
          prompt: 'Using electricity on Shabbat is related to the melacha of kindling fire.',
          correct: true,
          explanation: 'Many authorities hold that completing an electrical circuit relates to the melacha of kindling (or building). Hence no lights, phones, or appliances are turned on.',
        },
        {
          type: 'fill_blank',
          prompt: 'The 39 categories of Shabbat work are called "avot ___" — father categories.',
          answer_variants: ['melacha', 'melachah'],
          explanation: '"Avot melacha" — the 39 "parent" categories. Each has derivative sub-prohibitions called toladot.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "melacha".',
          answer_variants: ['work', 'creative work', 'constructive work', 'labor'],
          explanation: '"Melacha" = creative or constructive work. The key is purposeful transformation of the world, not effort.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each modern activity to the melacha category it relates to.',
          left: [
            { id: 'a', text: 'Driving a car' },
            { id: 'b', text: 'Writing a text message' },
            { id: 'c', text: 'Cooking food' },
            { id: 'd', text: 'Turning on a light switch' },
          ],
          right: [
            { id: '1', text: 'Kindling (completing a circuit)' },
            { id: '2', text: 'Writing' },
            { id: '3', text: 'Baking / cooking' },
            { id: '4', text: 'Kindling (burning fuel)' },
          ],
          correct: { a: '4', b: '2', c: '3', d: '1' },
          explanation: 'Each modern activity maps onto an ancient category. The Mishkan\'s crafts are the template for all time.',
        },
        {
          type: 'order_steps',
          prompt: 'Order these groups of melachot as they appear in Mishnah Shabbat 7:2.',
          steps: [
            { id: 'a', text: 'Agriculture (plowing, sowing, reaping...)' },
            { id: 'b', text: 'Textile work (spinning, weaving, sewing...)' },
            { id: 'c', text: 'Writing and erasing' },
            { id: 'd', text: 'Kindling and extinguishing fire' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'The Mishnah proceeds from food production → clothing → communication → fire — the essential crafts of civilization.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>The 39 melachot are not a list of inconveniences — they are a theology. By resting from the same creative acts that built G-d\'s dwelling place, we declare every week that we are not the masters of creation.</p>`,
      },
      sources: [
        'Mishnah Shabbat 7:2',
        'Talmud Shabbat 49b, 73a–74a',
        'Shemot 35:1–3',
        'Rambam, Hilchot Shabbat 7:1',
        'Shulchan Aruch, Orach Chaim 302–340',
      ],
      readMore: `<p>The 39 categories of melacha are "avot" — fathers — and each has countless derivative "toladot" (offspring), which extend the prohibitions to similar modern activities. Carrying in a public domain (hotza\'ah) is the last of the 39, yet arguably the most impactful in daily life. The eruv — a string or wire surrounding a neighborhood — creates a symbolic shared "private domain," allowing carrying within it. Walking into a neighborhood with an eruv on Shabbat is a quietly profound act: the community has literally enclosed itself to make Shabbat livable.</p>`,
    },

    {
      id: 'u5l6',
      title: 'Shabbat in Practice',
      iconName: 'shabbat_home',
      hook: {
        title: 'What Does Shabbat Actually Look Like?',
        body: `<p>Theory is one thing. But what does a Shabbat-observant household actually do from Friday afternoon to Saturday night? More than you\'d expect — and less technology than you\'d fear.</p>`,
      },
      teachSlides: [
        {
          title: 'Friday Preparation',
          body: `<p>Shabbat doesn\'t arrive — it\'s made. Friday afternoon is a rush: cook all food in advance, set the table, prepare clean clothes, shower, and finish all weekday work. The Shulchan Aruch says one should taste the Shabbat food on Friday to ensure it is ready. The act of preparation is itself a mitzvah — <em>kavod Shabbat</em>, honoring the day.</p>`,
          concept: 'Shabbat is earned on Friday.',
        },
        {
          title: 'Permitted on Shabbat',
          body: `<p>Shabbat is full:<br>
          Reading books, Torah study, prayer.<br>
          Long walks, family conversations, naps.<br>
          Playing with children, hosting guests, singing.<br>
          What\'s absent: phones, screens, work, rushed meals, background noise.<br>
          The result is a day that feels different — slower, quieter, more present.</p>`,
        },
        {
          title: 'Pikuach Nefesh — Life Overrides Everything',
          hebrew: 'פִּקּוּחַ נֶפֶשׁ',
          transliteration: 'pikuach nefesh',
          translation: 'saving a life',
          body: `<p>Shabbat is set aside entirely when a life is at risk. The Torah says "live by them" (Vayikra 18:5) — not die by them. A doctor must drive to an emergency. A sick person must take medicine. Jewish law demands this; hesitation is forbidden. The principle: the Torah was given to live by, not to die by.</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'Why is preparing food before Shabbat necessary?',
          options: ['Cooking is permitted on Shabbat if it\'s quick', 'Cooking (baking) is one of the 39 forbidden melachot', 'The food tastes better prepared in advance', 'It is only a custom, not law'],
          correct: 1,
          explanation: 'Baking and cooking are among the 39 melachot. All hot food must be prepared before Shabbat begins.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What does "pikuach nefesh" mean?',
          options: ['Shabbat prayer', 'Honoring the Sabbath', 'Saving a life', 'Shabbat preparation'],
          correct: 2,
          explanation: '"Pikuach nefesh" — saving a life — overrides virtually every Jewish law, including Shabbat.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Which verse supports the principle that Shabbat is set aside to save a life?',
          options: ['"Remember the Shabbat day" (Shemot 20)', '"Live by them" (Vayikra 18:5)', '"Keep the Shabbat" (Devarim 5)', '"Six days you shall work" (Shemot 20)'],
          correct: 1,
          explanation: 'Vayikra 18:5: "You shall live by them" — the mitzvot are given for life, not death. The Talmud applies this to permit Shabbat violation to save a life.',
        },
        {
          type: 'true_false',
          prompt: 'A doctor is permitted — and obligated — to drive to an emergency on Shabbat.',
          correct: true,
          explanation: 'Pikuach nefesh is not a permission but an obligation. Hesitation when a life is at stake is itself halachically problematic.',
        },
        {
          type: 'fill_blank',
          prompt: 'Honoring Shabbat through preparation and fine clothing is called "kavod ___."',
          answer_variants: ['shabbat', 'shabat'],
          explanation: '"Kavod Shabbat" — honor of the Sabbath. Distinct from "oneg Shabbat" (delight in Shabbat).',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "pikuach nefesh".',
          answer_variants: ['saving a life', 'preservation of life', 'life saving'],
          explanation: '"Pikuach nefesh" — saving a life. The halachic principle that life overrides most other Jewish law.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each activity to whether it is permitted or forbidden on Shabbat.',
          left: [
            { id: 'a', text: 'Reading a novel' },
            { id: 'b', text: 'Sending a text message' },
            { id: 'c', text: 'Taking a long walk' },
            { id: 'd', text: 'Turning on the oven' },
          ],
          right: [
            { id: '1', text: 'Forbidden (melacha — kindling/writing)' },
            { id: '2', text: 'Permitted (no melacha involved)' },
            { id: '3', text: 'Forbidden (melacha — writing)' },
            { id: '4', text: 'Permitted (rest and reflection)' },
          ],
          correct: { a: '2', b: '3', c: '4', d: '1' },
          explanation: 'Reading and walking are permitted. Texting (writing) and using the oven (kindling/cooking) are forbidden.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the Friday preparation timeline.',
          steps: [
            { id: 'a', text: 'Cook Shabbat food and set the table' },
            { id: 'b', text: 'Finish all weekday work' },
            { id: 'c', text: 'Shower and change into Shabbat clothes' },
            { id: 'd', text: 'Light candles 18 minutes before sunset' },
          ],
          correctOrder: ['b', 'a', 'c', 'd'],
          explanation: 'Finish work → cook → get dressed → light candles. Shabbat begins the moment the candles are lit.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Shabbat observance is practical: prepare on Friday, avoid the 39 melachot, and know that life always comes first. The result is a day stripped of urgency — and filled with presence.</p>`,
      },
      sources: [
        'Vayikra 18:5',
        'Talmud Yoma 85b',
        'Shulchan Aruch, Orach Chaim 250 (kavod Shabbat), 328 (pikuach nefesh)',
        'Rambam, Hilchot Shabbat 2:3',
        'Mishnah Berurah 250:1',
      ],
      readMore: `<p>The tradition of preparing a special Shabbat dish — "l\'kavod Shabbat," in honor of Shabbat — goes back to the Talmudic sages. Rav Safra would personally salt the meat. Rav Huna would purchase prime cuts. Rav Ashi would cook himself. The point was not poverty; they wanted the personal involvement. Every act of preparation is itself an act of reverence for the day.</p>`,
    },

    {
      id: 'u5l7',
      title: 'The Shabbat Table — Zemiros and Torah',
      iconName: 'shabbat_table',
      hook: {
        title: 'A Meal Like No Other',
        body: `<p>The Shabbat meal isn\'t just dinner. It has songs, Torah, blessing, and a pace that doesn\'t exist on weekdays. The table becomes a kind of altar — a place where food, family, and holiness converge.</p>`,
      },
      teachSlides: [
        {
          title: 'Shalom Aleichem and Eishet Chayil',
          body: `<p>The meal begins before the food. <strong>Shalom Aleichem</strong> — "Peace be upon you" — greets the Shabbat angels said to accompany us home from synagogue (Talmud Shabbat 119b). Then, in many homes, the husband sings <strong>Eishet Chayil</strong> (Mishlei 31) — a tribute to "the woman of valor," celebrating the woman who created the Shabbat at home.</p>`,
          concept: 'The table is greeted like a throne room.',
        },
        {
          title: 'Zemiros — Shabbat Songs',
          hebrew: 'זְמִירוֹת',
          transliteration: 'Zemiros',
          translation: 'Shabbat songs',
          body: `<p>Zemiros are sung between courses throughout the meal. Classic songs include <em>Kah Ribbon</em> (praising G-d, by Rabbi Yisrael Najara, 16th c.), <em>Tzur Mishelo</em> (abridged Grace After Meals in song), and <em>Shabbat HaMalkah</em>. Each family has its melodies; guests bring new ones. Over centuries, the table has become a concert hall.</p>`,
        },
        {
          title: 'Divrei Torah — Words of Torah',
          body: `<p>The Shabbat table tradition includes <em>divrei Torah</em> — teachings, stories, and reflections on the week\'s parasha. Even a brief thought elevates the meal from a dinner to a sacred gathering. The Talmud (Avot 3:3) says: "Three who eat at a table and speak words of Torah — it is as if they ate from the table of the Divine."</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What does "Shalom Aleichem" welcome at the start of the Shabbat meal?',
          options: ['Family members who just arrived', 'The Shabbat angels', 'The Shabbat bride', 'The three Patriarchs'],
          correct: 1,
          explanation: 'Based on Talmud Shabbat 119b — two Shabbat angels accompany a person home from synagogue on Friday night. Shalom Aleichem greets them.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What is "Eishet Chayil"?',
          options: ['A prayer for Jerusalem', 'A Psalm of David', 'A tribute to the woman of valor, sung before Kiddush', 'The Shabbat candle blessing'],
          correct: 2,
          explanation: '"Eishet Chayil" — the woman of valor — comes from Mishlei (Proverbs) 31. Many husbands sing it to their wives before Kiddush on Friday night.',
        },
        {
          type: 'multiple_choice',
          prompt: 'According to Pirkei Avot, three people who eat together and speak words of Torah are compared to:',
          options: ['Those who pray together', 'Those who eat from the table of the Divine', 'A quorum for prayer', 'Three Patriarchs at a meal'],
          correct: 1,
          explanation: 'Avot 3:3 — "it is as if they ate from the table of the Omnipresent." Torah at the table transforms the meal.',
        },
        {
          type: 'true_false',
          prompt: 'Zemiros (Shabbat songs) are typically sung between courses of the Shabbat meal.',
          correct: true,
          explanation: 'Zemiros slow the pace and fill the meal with song. They can be sung throughout — between courses, or while eating.',
        },
        {
          type: 'fill_blank',
          prompt: 'A brief Torah teaching shared at the table is called "divrei ___."',
          answer_variants: ['torah', 'Torah'],
          explanation: '"Divrei Torah" — words of Torah. Even one teaching at the Shabbat table fulfills the tradition.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Zemiros".',
          answer_variants: ['shabbat songs', 'sabbath songs', 'songs', 'shabbat hymns'],
          explanation: '"Zemiros" — Shabbat songs, sung at the table to extend and elevate the meal.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Shabbat table element to its description.',
          left: [
            { id: 'a', text: 'Shalom Aleichem' },
            { id: 'b', text: 'Eishet Chayil' },
            { id: 'c', text: 'Zemiros' },
            { id: 'd', text: 'Divrei Torah' },
          ],
          right: [
            { id: '1', text: 'Torah teaching that elevates the meal' },
            { id: '2', text: 'Songs sung between courses' },
            { id: '3', text: 'Greeting for the Shabbat angels' },
            { id: '4', text: 'Tribute to the woman of valor (Mishlei 31)' },
          ],
          correct: { a: '3', b: '4', c: '2', d: '1' },
          explanation: 'Shalom Aleichem = angels, Eishet Chayil = woman of valor, Zemiros = songs, Divrei Torah = teaching.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the traditional start of the Shabbat Friday-night meal.',
          steps: [
            { id: 'a', text: 'Shalom Aleichem (welcoming the angels)' },
            { id: 'b', text: 'Eishet Chayil (tribute to the woman of the home)' },
            { id: 'c', text: 'Kiddush over wine' },
            { id: 'd', text: 'Washing hands and blessing over challah' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Angels → woman of the home → sanctification of the day over wine → blessing over bread.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>The Shabbat table is where theology becomes dinner. Songs, Torah, blessings, and the company of family and guests — together they turn a meal into something that outlasts the food.</p>`,
      },
      sources: [
        'Talmud Shabbat 119b',
        'Mishlei 31:10–31',
        'Pirkei Avot 3:3',
        'Shulchan Aruch, Orach Chaim 271, 300',
        'Rabbi Yisrael Najara, Kah Ribbon (16th c.)',
      ],
      readMore: `<p>The custom of singing zemiros at the Shabbat table was codified in the 16th century, but the impulse is ancient. The Talmud records Rav\'s disciples singing before him at the table. The songs vary by community — Sephardic, Ashkenazic, Yemenite, Chassidic — but every table has its own repertoire, passed down through generations. Guests bring new melodies; children learn them before they can read. No other meal in any culture sounds quite like a Shabbat table in full voice.</p>`,
    },

    {
      id: 'u5l8',
      title: 'Oneg Shabbat — The Joy of Shabbat',
      iconName: 'oneg_shabbat',
      hook: {
        title: '"Call Shabbat a Delight"',
        body: `<p>Yeshayahu (Isaiah) tells us to "call Shabbat a delight" — <em>oneg Shabbat</em>. This isn\'t poetry. It\'s a positive commandment: Shabbat is not only about what you don\'t do, but about actively creating joy.</p>`,
      },
      teachSlides: [
        {
          title: 'The Mitzvah of Oneg',
          hebrew: 'וְקָרָאתָ לַשַּׁבָּת עֹנֶג',
          transliteration: 'v\'karata laShabbat oneg',
          translation: 'and you shall call Shabbat a delight',
          body: `<p>Yeshayahu 58:13 is the source. Rambam rules (Hilchot Shabbat 30:1) that one is obligated to honor Shabbat with fine food, fine clothing, and personal joy. The prohibition against fasting on Shabbat — even on a personal fast day — reflects this. Sadness is incompatible with Shabbat.</p>`,
          concept: 'Joy on Shabbat is a commandment.',
        },
        {
          title: 'The Extra Soul',
          hebrew: 'נְשָׁמָה יְתֵרָה',
          transliteration: 'neshama yeteira',
          translation: 'extra soul',
          body: `<p>The Talmud (Beitzah 16a) says a person receives an "extra soul" (<em>neshama yeteira</em>) on Shabbat, which departs at Shabbat\'s end. This is why food tastes better on Shabbat, why moods lift, why everything feels more meaningful. And it\'s why we smell fragrant spices at Havdalah — to comfort the soul as it loses that extra dimension.</p>`,
        },
        {
          title: 'Three Meals, Sleep, and Intimacy',
          body: `<p>The Shulchan Aruch codifies specific oneg practices: three meals are obligatory (Friday night, Shabbat day, Seudah Shlishit). Sleep on Shabbat is considered a mitzvah, not laziness — it is rest as commanded. Conjugal relations between husband and wife are specifically designated as a Shabbat mitzvah (Shulchan Aruch, OC 280).</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What is the Torah source for the mitzvah of "Oneg Shabbat"?',
          options: ['Shemot 20 (Ten Commandments)', 'Bereishit 2 (Creation)', 'Yeshayahu 58:13', 'Devarim 5:12'],
          correct: 2,
          explanation: 'Yeshayahu 58:13 — "and you shall call Shabbat a delight (oneg)" — is the primary source for the positive mitzvah of Shabbat joy.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What does "neshama yeteira" mean?',
          options: ['The Shabbat prayer', 'An additional soul received on Shabbat', 'The spirit of the Shabbat candles', 'A Shabbat melody'],
          correct: 1,
          explanation: '"Neshama yeteira" — extra soul. The Talmud (Beitzah 16a) says we receive it on Shabbat and lose it at its end.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Why are spices smelled at Havdalah?',
          options: ['To welcome the new week', 'To sanctify the wine', 'To comfort the soul as the extra neshama departs', 'It is a custom without known reason'],
          correct: 2,
          explanation: 'The extra soul (neshama yeteira) departs at Shabbat\'s end. The fragrant spices revive and comfort the regular soul in its moment of loss.',
        },
        {
          type: 'true_false',
          prompt: 'Fasting is forbidden on Shabbat even for personal reasons.',
          correct: true,
          explanation: 'Sadness and self-affliction contradict the mitzvah of oneg Shabbat. Fasting on Shabbat is prohibited except for Yom Kippur (which overrides it).',
        },
        {
          type: 'fill_blank',
          prompt: '"Oneg Shabbat" means ___ of Shabbat.',
          answer_variants: ['delight', 'joy', 'pleasure', 'enjoyment'],
          explanation: '"Oneg" means delight or pleasure. "Oneg Shabbat" is both the concept (Shabbat joy) and the mitzvah to actively create it.',
        },
        {
          type: 'typed_translation',
          prompt: 'Translate "neshama yeteira".',
          answer_variants: ['extra soul', 'additional soul', 'additional neshama'],
          explanation: '"Neshama yeteira" — extra/additional soul. It arrives with Shabbat and departs with Havdalah.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each oneg Shabbat practice to its source or reason.',
          left: [
            { id: 'a', text: 'Three obligatory Shabbat meals' },
            { id: 'b', text: 'Fine food and fine clothing' },
            { id: 'c', text: 'Smelling spices at Havdalah' },
            { id: 'd', text: 'No fasting on Shabbat' },
          ],
          right: [
            { id: '1', text: 'Comforting the soul as the neshama yeteira departs' },
            { id: '2', text: 'Oneg Shabbat is incompatible with sadness or deprivation' },
            { id: '3', text: 'Rambam\'s codification of kavod and oneg Shabbat' },
            { id: '4', text: 'Derived from the triple mention of food in the manna narrative' },
          ],
          correct: { a: '4', b: '3', c: '1', d: '2' },
          explanation: '3 meals from the manna text, fine food from Rambam, spices from the neshama yeteira, no fasting from the incompatibility of sadness and oneg.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the three obligatory Shabbat meals.',
          steps: [
            { id: 'a', text: 'Friday night dinner (after Kiddush)' },
            { id: 'b', text: 'Shabbat day lunch (after morning services)' },
            { id: 'c', text: 'Seudah Shlishit (third meal, Shabbat afternoon)' },
          ],
          correctOrder: ['a', 'b', 'c'],
          explanation: 'Three meals correspond to the three times the word "today" (hayom) appears in the manna narrative (Shemot 16).',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Oneg Shabbat is a mitzvah, not a mood. The commandment is to delight — in food, rest, song, family, and the extra dimension of soul that arrives every Friday and leaves us reaching for the besamim.</p>`,
      },
      sources: [
        'Yeshayahu 58:13',
        'Talmud Beitzah 16a',
        'Shemot 16:25',
        'Rambam, Hilchot Shabbat 30:1–14',
        'Shulchan Aruch, Orach Chaim 280, 288',
      ],
      readMore: `<p>The Talmud (Shabbat 118b) records that Rabbi Yehuda bar Ilai would honor Shabbat so completely that on his face shone a light visible to those around him. The phrase used — "his face would shine like a torch" — is the model for the Jewish concept that Shabbat observance literally illuminates a person. The extra soul isn\'t a metaphor to be explained away; it is something experienced by anyone who has walked into a Shabbat table fully present.</p>`,
    },

    {
      id: 'u5l9',
      title: 'Shabbat in History and Thought',
      iconName: 'shabbat_history',
      hook: {
        title: 'A Revolutionary Idea',
        body: `<p>The ancient world had no weekly day of rest. Every day was available for work, war, and commerce. The Jewish concept of Shabbat — a universal day of rest for people, slaves, and animals — was radical. And it changed the world.</p>`,
      },
      teachSlides: [
        {
          title: '"Remember" and "Keep"',
          body: `<p>The Ten Commandments appear twice — in Shemot 20 and Devarim 5. The Shabbat commandment differs slightly: Shemot says <em>Zachor</em> (Remember), Devarim says <em>Shamor</em> (Keep/Guard). The Talmud (Shevuot 20b) says both were spoken simultaneously at Sinai — a miracle of speech. <em>Zachor</em> is the positive dimension (Kiddush, three meals). <em>Shamor</em> is the negative (the melachot). Both are one commandment.</p>`,
          concept: '"Remember" and "Keep" — spoken as one.',
        },
        {
          title: 'Shabbat as Liberation',
          body: `<p>Devarim\'s version of the Shabbat commandment explicitly adds: "so that your slave and maidservant may rest as you do" (Devarim 5:14). The reason given is the Exodus — you were a slave in Egypt; now extend rest to your own servants. Shabbat is not only a spiritual practice. It is a social mandate, a weekly protest against endless labor and exploitation.</p>`,
        },
        {
          title: '"Shabbat Has Kept the Jews"',
          body: `<p>Ahad Ha\'am\'s famous line: "More than the Jews have kept Shabbat, Shabbat has kept the Jews." In exile, through persecution and displacement, Shabbat preserved Jewish identity. Without a land or a temple, Jews still had one thing: every seven days, the world stopped and holiness entered. Shabbat was portable — a homeland you could carry. This is likely why its observance is treated as equivalent in weight to the entire Torah (Yerushalmi Nedarim 3:9).</p>`,
        },
      ],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'What is the difference between "Zachor" and "Shamor" in the two versions of the Shabbat commandment?',
          options: [
            'One is for men, one is for women',
            'Zachor = Remember (positive practice); Shamor = Keep/Guard (avoid melachot)',
            'They appear in different books and have no connection',
            'Zachor refers to the Temple; Shamor to prayer',
          ],
          correct: 1,
          explanation: 'Zachor (Shemot 20) = the positive dimension of Shabbat. Shamor (Devarim 5) = the negative (avoid forbidden work). The Talmud says both were spoken simultaneously.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Devarim\'s Shabbat commandment adds which social dimension?',
          options: [
            'To build a Temple',
            'So that your slaves and servants may rest, recalling the Exodus',
            'To fast on the day before Shabbat',
            'To gather in Jerusalem',
          ],
          correct: 1,
          explanation: 'Devarim 5:14–15: rest must extend to all — "so that your slave and maidservant may rest as you do." The motivation is the memory of slavery in Egypt.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Ahad Ha\'am\'s famous observation was:',
          options: [
            '"The Torah was given to live by, not to die by"',
            '"More than the Jews have kept Shabbat, Shabbat has kept the Jews"',
            '"Every Jew should observe one Shabbat fully"',
            '"Shabbat is the most important of all the holidays"',
          ],
          correct: 1,
          explanation: 'Ahad Ha\'am identified Shabbat as the institution that preserved Jewish identity across centuries of exile and persecution.',
        },
        {
          type: 'true_false',
          prompt: 'The Talmud teaches that the Shabbat commandment was given in two versions spoken simultaneously at Sinai.',
          correct: true,
          explanation: 'Talmud Shevuot 20b: "Zachor and Shamor were spoken as one." This divine speech was a miracle — two words, one utterance.',
        },
        {
          type: 'fill_blank',
          prompt: 'The positive commandment to "Remember" Shabbat uses the Hebrew word "___."',
          answer_variants: ['zachor', 'zahor'],
          explanation: '"Zachor" — remember. The positive dimension: Kiddush, three meals, joy. Vs. "Shamor" — guard, the negative dimension.',
        },
        {
          type: 'typed_translation',
          prompt: 'Translate "Zachor" and "Shamor" — the two formulations of the Shabbat commandment.',
          answer_variants: ['remember and keep', 'remember and guard', 'zachor and shamor'],
          explanation: '"Zachor" = Remember (Shemot 20). "Shamor" = Keep/Guard (Devarim 5). Both are the Shabbat commandment.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each Shabbat concept to its source or meaning.',
          left: [
            { id: 'a', text: 'Zachor' },
            { id: 'b', text: 'Shamor' },
            { id: 'c', text: 'Social rest mandate' },
            { id: 'd', text: '"Shabbat has kept the Jews"' },
          ],
          right: [
            { id: '1', text: 'Ahad Ha\'am — Shabbat as portable homeland' },
            { id: '2', text: 'Devarim 5: servants and animals must rest too' },
            { id: '3', text: 'Shemot 20: positive observance (Kiddush, joy)' },
            { id: '4', text: 'Devarim 5: avoid forbidden work' },
          ],
          correct: { a: '3', b: '4', c: '2', d: '1' },
          explanation: 'Zachor = positive observance, Shamor = prohibition, social rest = Devarim\'s Exodus-memory clause, Ahad Ha\'am = Shabbat as identity preserver.',
        },
        {
          type: 'order_steps',
          prompt: 'Order the historical progression of Shabbat.',
          steps: [
            { id: 'a', text: 'G-d rests on the 7th day of creation (Bereishit 2)' },
            { id: 'b', text: 'Shabbat given at Sinai in the Ten Commandments' },
            { id: 'c', text: 'Shabbat sustains the Jewish people through exile' },
            { id: 'd', text: 'The weekly Shabbat cycle continues into the present' },
          ],
          correctOrder: ['a', 'b', 'c', 'd'],
          explanation: 'Creation → Sinai → Exile → Today. Shabbat was present at the beginning of the world and has outlasted every civilization that tried to end it.',
        },
      ],
      wrap: {
        title: 'In summary',
        body: `<p>Shabbat didn\'t just shape Judaism — it shaped history. The weekly rest cycle, the social protection of servants, and the portable holiness of the day carried Jewish identity through everything. "More than the Jews have kept Shabbat, Shabbat has kept the Jews."</p>`,
      },
      sources: [
        'Shemot 20:8–11',
        'Devarim 5:12–15',
        'Bereishit 2:2–3',
        'Talmud Shevuot 20b',
        'Yerushalmi Nedarim 3:9',
        'Ahad Ha\'am, "Shabbat and Zionism" (1898)',
      ],
      readMore: `<p>The idea that rest could be mandatory — that even a master\'s slave was entitled to one day of freedom per week — had no parallel in the ancient world. Greeks and Romans mocked Jewish Shabbat as laziness. But the idea spread. The seven-day week and the weekly rest cycle that now structure virtually all of human civilization originate in the Torah\'s Shabbat. The world rests, on a Jewish schedule.</p>`,
    },

    {
      id: 'u5l10',
      title: 'Shabbat Quiz',
      iconName: 'quiz_checklist',
      isQuiz: true,
      hook: {
        title: 'Shabbat — Quiz',
        body: `<p>Ten questions covering the full Shabbat unit — from candle lighting and the 39 melachot to oneg Shabbat and the history of the day.</p>`,
      },
      teachSlides: [],
      questions: [
        {
          type: 'multiple_choice',
          prompt: 'How many categories of forbidden work are there on Shabbat?',
          options: ['7', '18', '39', '613'],
          correct: 2,
          explanation: '39 avot melacha — derived from the work used to build the Mishkan (Talmud Shabbat 49b).',
        },
        {
          type: 'multiple_choice',
          prompt: 'What does "Kabbalat Shabbat" mean?',
          options: ['The Shabbat prayer', 'Receiving/Welcoming the Sabbath', 'Ending the Sabbath', 'The Shabbat candles'],
          correct: 1,
          explanation: '"Kabbalat Shabbat" — Receiving the Sabbath. The Friday-night welcoming service with Psalms and Lecha Dodi.',
        },
        {
          type: 'multiple_choice',
          prompt: 'What does "oneg Shabbat" mean?',
          options: ['Guarding the Sabbath', 'The Saturday morning service', 'Delight in the Sabbath', 'The Shabbat prayers'],
          correct: 2,
          explanation: '"Oneg" = delight. Yeshayahu 58:13 commands us to "call Shabbat a delight" — a positive mitzvah to create joy.',
        },
        {
          type: 'multiple_choice',
          prompt: 'Ahad Ha\'am\'s famous observation about Shabbat was:',
          options: [
            '"Shabbat is the most important of all holidays"',
            '"More than the Jews have kept Shabbat, Shabbat has kept the Jews"',
            '"Every Jew should observe one full Shabbat"',
            '"Without Shabbat there is no Torah"',
          ],
          correct: 1,
          explanation: 'Ahad Ha\'am recognized Shabbat as the portable homeland that preserved Jewish identity through exile.',
        },
        {
          type: 'multiple_choice',
          prompt: 'The "neshama yeteira" that arrives on Shabbat means:',
          options: ['The Shabbat candle', 'An extra soul', 'The Shabbat table', 'An extra prayer'],
          correct: 1,
          explanation: '"Neshama yeteira" — extra soul. It arrives with Shabbat and departs at its end, consoled by the besamim (spices) of Havdalah.',
        },
        {
          type: 'true_false',
          prompt: 'The 39 melachot derive from activities used to build the Mishkan (Tabernacle).',
          correct: true,
          explanation: 'Talmud Shabbat 49b derives the 39 categories of forbidden Shabbat work from the creative labor used to construct the Mishkan.',
        },
        {
          type: 'fill_blank',
          prompt: 'The weekly Torah portion read on Shabbat is called a "___."',
          answer_variants: ['parasha', 'parsha', 'parashah'],
          explanation: 'The weekly parasha is read simultaneously in synagogues worldwide every Shabbat morning.',
        },
        {
          type: 'fill_blank',
          prompt: 'The principle that Shabbat is overridden to save a life is called "pikuach ___."',
          answer_variants: ['nefesh'],
          explanation: '"Pikuach nefesh" — saving a life. It overrides virtually every Jewish law including Shabbat. The Torah was given to live by.',
        },
        {
          type: 'typed_translation',
          prompt: 'Type the English meaning of "Zemiros".',
          answer_variants: ['shabbat songs', 'sabbath songs', 'songs', 'shabbat hymns', 'sabbath hymns'],
          explanation: '"Zemiros" — Shabbat songs, sung at the table between courses to slow the meal and fill it with spirit.',
        },
        {
          type: 'match_pairs',
          prompt: 'Match each term to its meaning.',
          left: [
            { id: 'a', text: 'Zachor' },
            { id: 'b', text: 'Havdalah' },
            { id: 'c', text: 'Melacha' },
            { id: 'd', text: 'Oneg Shabbat' },
          ],
          right: [
            { id: '1', text: 'Creative/constructive work forbidden on Shabbat' },
            { id: '2', text: 'Positive commandment to delight in Shabbat' },
            { id: '3', text: 'Separation ritual ending Shabbat Saturday night' },
            { id: '4', text: '"Remember" — the positive dimension of Shabbat' },
          ],
          correct: { a: '4', b: '3', c: '1', d: '2' },
          explanation: 'Zachor = remember (positive), Havdalah = closing separation, Melacha = creative work, Oneg = commanded delight.',
        },
      ],
      wrap: {
        title: 'Unit Complete',
        body: `<p>You\'ve walked a full Shabbat — from its creation-rooted origins to candle lighting, the 39 melachot, the table, the joy, and the history that made it the Jewish people\'s portable homeland. Next: the Jewish holidays.</p>`,
      },
      sources: [
        'Shemot 20:8–11',
        'Talmud Berakhot 57b',
        'Talmud Shabbat 49b',
        'Shulchan Aruch, Orach Chaim 263–299',
      ],
    },
  ],
};

export default unit2;
