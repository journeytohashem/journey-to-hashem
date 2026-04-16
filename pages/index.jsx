import { useState, useEffect, useRef } from 'react';



// ── HEBREW DATE (approximate — demo only) ────────────────
// Note: uses a fixed-month-length anchor model. Cheshvan/Kislev variable lengths,
// leap years with Adar I, and edge cases near Rosh Hashana are not handled.
// Dates may be off by 1–2 days near month boundaries or in leap years.
// For production, use a proper Hebrew calendar library (e.g. hebcal.com API).
function getHebrewDate() {
  const now = new Date();
  // Anchor: 15 Nissan 5785 = April 13, 2025 (verified)
  const anchor = new Date(2025, 3, 13);
  const diffDays = Math.floor((now - anchor) / 86400000);
  // Fixed month lengths — approximate (ignores variable Cheshvan/Kislev and Adar I)
  const MONTHS = [
    {name:'Nissan',days:30},{name:'Iyar',days:29},{name:'Sivan',days:30},
    {name:'Tammuz',days:29},{name:'Av',days:30},{name:'Elul',days:29},
    {name:'Tishrei',days:30},{name:'Cheshvan',days:29},{name:'Kislev',days:30},
    {name:'Tevet',days:29},{name:'Shevat',days:30},{name:'Adar',days:29},
  ];
  let hDay = 15, hMonth = 0, hYear = 5785;
  if (diffDays >= 0) {
    let remaining = diffDays;
    while (remaining > 0) {
      const daysLeft = MONTHS[hMonth].days - hDay;
      if (remaining <= daysLeft) { hDay += remaining; remaining = 0; }
      else { remaining -= (daysLeft + 1); hDay = 1; hMonth++; if (hMonth >= 12) { hMonth = 0; hYear++; } }
    }
  } else {
    let remaining = Math.abs(diffDays);
    while (remaining > 0) {
      if (remaining < hDay) { hDay -= remaining; remaining = 0; }
      else { remaining -= hDay; hMonth--; if (hMonth < 0) { hMonth = 11; hYear--; } hDay = MONTHS[hMonth].days; }
    }
  }
  const ordinals = ['','א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳','ט׳','י׳','י״א','י״ב','י״ג','י״ד','ט״ו','ט״ז','י״ז','י״ח','י״ט','כ׳','כ״א','כ״ב','כ״ג','כ״ד','כ״ה','כ״ו','כ״ז','כ״ח','כ״ט','ל׳'];
  return `~${ordinals[hDay]} ${MONTHS[hMonth].name} ${hYear}`;
}

// ── SHABBAT DETECTION (approximate — demo only) ───────────
// Uses Friday 18:00 local time as a fixed approximation for candle lighting.
// Actual Shabbat start depends on geographic sunset, which varies by location
// and season. For production, use a zmanim API (e.g. hebcal.com/zmanim).
function isShabbat() {
  const now = new Date();
  const day = now.getDay(); // 5 = Friday, 6 = Saturday
  const hour = now.getHours();
  // Approximate: Friday after 6 PM or all of Saturday
  return (day === 6) || (day === 5 && hour >= 18);
}

// ── PARASHA OF THE WEEK (approximate — demo only) ─────────
// Advances by simple weekly offset from a fixed anchor. Does not account for
// holiday schedule differences, Israel vs. diaspora splits, or combined portions
// that vary year to year. May diverge from the actual reading schedule by 1–2 weeks.
const WEEKLY_PARASHA = [
  'Achrei Mot','Kedoshim','Emor','Behar','Bechukotai',
  'Bamidbar','Nasso','Beha\'alotcha','Shelach','Korach',
  'Chukat','Balak','Pinchas','Matot-Masei','Devarim',
  'Va\'etchanan','Eikev','Re\'eh','Shoftim','Ki Teitzei',
  'Ki Tavo','Nitzavim-Vayelech','Ha\'azinu','Vezot HaBracha',
  'Bereishit','Noach','Lech Lecha','Vayera','Chayei Sarah',
  'Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz',
  'Vayigash','Vayechi','Shemot','Va\'era','Bo',
  'Beshalach','Yitro','Mishpatim','Terumah','Tetzaveh',
  'Ki Tisa','Vayakhel-Pekudei','Vayikra','Tzav','Shemini',
  'Tazria-Metzora','Achrei Mot',
];

function getParasha() {
  // Anchor: Shabbat April 19 2025 = Achrei Mot (diaspora)
  const anchor = new Date(2025, 3, 19);
  const now = new Date();
  const weeksSince = Math.floor((now - anchor) / (7 * 86400000));
  const idx = ((weeksSince % WEEKLY_PARASHA.length) + WEEKLY_PARASHA.length) % WEEKLY_PARASHA.length;
  return WEEKLY_PARASHA[idx]; // approximate — see note above
}


// ── SHARE UTILITY ─────────────────────────────────────────
function shareApp(title='Journey to HaShem', text='I\'ve been learning Torah on Journey to HaShem — check it out!') {
  if(navigator.share){
    navigator.share({title, text, url: window.location.href}).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(window.location.href).then(()=>alert('Link copied to clipboard!')).catch(()=>alert('Share: ' + window.location.href));
  }
}

// ── DATA ──────────────────────────────────────────────────
const LEARNING_PATH = [
  { id:'unit1', title:'Foundations of Faith', level:'Beginner', lessons:[
    { id:'u1l1', title:'Who is HaShem?', icon:'✡️', slides:[
      { title:'Who is HaShem?', icon:'✡️', body:`<p>HaShem — literally "The Name" — is how Jewish people refer to G-d in everyday speech. The word reflects a deep truth: G-d's essence is beyond any name we could give Him.</p><p>In Torah, G-d is not a distant force but a personal, present reality — the source of all existence, deeply involved in every human life.</p>`, source:'See Rambam, Mishneh Torah, Hilchot Yesodei HaTorah 1:1' },
      { title:'Ein Sof — Without End', hebrew:'אֵין סוֹף', transliteration:'Ein Sof', translation:'Without End / Infinite', body:`<p>Jewish mysticism describes G-d as <em>Ein Sof</em> — infinite, boundless, without beginning or end. He is not contained by time or space.</p><p>Yet the Torah teaches that HaShem is also close — closer than your own breath. This paradox is at the heart of Jewish spirituality.</p>`, concept:'G-d is simultaneously transcendent (beyond everything) and immanent (present within everything). This is called "filling all worlds and surrounding all worlds."', source:'Tanya, Iggeret Hakodesh 20; Zohar Vol. 3, 225a' },
      { title:'The Shema — Our Declaration', hebrew:'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד', transliteration:"Shema Yisrael, Adonai Eloheinu, Adonai Echad", translation:"Hear O Israel, the L-rd is our G-d, the L-rd is One", body:`<p>The Shema is Judaism's most fundamental declaration. Said twice daily, it affirms the absolute unity of G-d.</p><p>The word <em>Echad</em> (One) is not just about number. It means G-d is the singular, unified reality behind all of existence.</p>`, source:'Devarim 6:4; Talmud Berakhot 13b' },
      { title:'Quick Check', exercise:{ question:'The word "Echad" in the Shema means:', options:['First','One','Eternal','Creator'], answer:1, explanation:'Echad means "One" — affirming that G-d is the singular, unified reality behind all existence. Not just numerically first, but uniquely one.' } },
    ]},
    { id:'u1l2', title:'What is the Torah?', icon:'📜', slides:[
      { title:'What is the Torah?', icon:'📜', body:`<p>The Torah is the foundational text of Judaism — given by HaShem to Moshe at Mount Sinai approximately 3,300 years ago.</p><p>In its most specific sense, Torah refers to the Five Books of Moses: Bereishit, Shemot, Vayikra, Bamidbar, and Devarim.</p>`, source:'Talmud Shabbat 88a; Seder Olam Rabbah' },
      { title:'Written and Oral Torah', body:`<p><strong style="color:var(--gold)">Written Torah (Torah She\'bichtav):</strong> The Five Books, Prophets, and Writings — together the Tanakh.</p><p><strong style="color:var(--gold)">Oral Torah (Torah She\'be\'al Peh):</strong> The explanations transmitted orally from Sinai — written down as the Mishnah (~200 CE) and Talmud (~500 CE).</p>`, concept:'Torah is not just a historical text — it is described as eternally relevant, continuously interpreted by each generation.', source:'Rambam, Introduction to Mishneh Torah' },
      { title:'Torah as a Blueprint', hebrew:'בְּרֵאשִׁית בָּרָא אֱלֹהִים', transliteration:'Bereishit bara Elokim', translation:'In the beginning, G-d created...', body:`<p>The Midrash teaches that HaShem "looked into the Torah and created the world." Torah is not merely a book of laws — it is the blueprint of existence itself.</p><p>This is why Torah study is considered one of the greatest mitzvot — not just for knowledge, but as connection to divine wisdom underlying all reality.</p>`, source:'Bereishit Rabbah 1:1; Zohar Vol. 2, 161a' },
      { title:'Quick Check', exercise:{ question:'When was the Mishnah (Oral Torah) written down?', options:['At Sinai (~1313 BCE)','~200 CE','~500 CE','1000 CE'], answer:1, explanation:'The Oral Torah was transmitted verbally for centuries, then compiled by Rabbi Yehuda HaNasi around 200 CE as the Mishnah, to ensure it would not be forgotten during exile.' } },
    ]},
    { id:'u1l3', title:'The Jewish People', icon:'🕍', slides:[
      { title:'Am Yisrael — The People of Israel', icon:'🕍', body:`<p>The Jewish people trace their origin to Avraham, called by HaShem to leave his homeland and found a people dedicated to ethical monotheism.</p><p>From Avraham, Yitzchak, and Yaakov — the three Patriarchs — descended the twelve tribes who became Am Yisrael.</p>`, source:'Bereishit 12:1–3; 17:4–8' },
      { title:'A Kingdom of Priests', hebrew:'מַמְלֶכֶת כֹּהֲנִים וְגוֹי קָדוֹשׁ', transliteration:"Mamlekhet kohanim v'goy kadosh", translation:'A kingdom of priests and a holy nation', body:`<p>At Sinai, HaShem described the Jewish mission: to be a "kingdom of priests and a holy nation" — set apart not for their own benefit, but to bring the light of Torah and ethical living to humanity.</p><p>This concept — <em>Or La\'goyim</em>, a light unto the nations — is central to Jewish purpose.</p>`, concept:'Judaism is not only a religion but a covenant — a relationship between HaShem and the Jewish people, with mutual obligations and a shared destiny.', source:'Shemot 19:6; Yeshayahu 42:6' },
      { title:'A People of Memory', body:`<p>Jewish identity is rooted in <em>zachor</em> — memory. The Torah commands remembering the Exodus, the giving of Torah at Sinai, the 40 years in the desert.</p><p>Each generation is meant to see themselves as if they personally left Egypt. This active, living memory connects every Jew across time to the same story.</p>`, source:'Devarim 16:3; Haggadah shel Pesach' },
      { title:'Quick Check', exercise:{ question:'What does "Or La\'goyim" mean?', options:['The Law of the Nations','A Light unto the Nations','The People of G-d','Return to the Land'], answer:1, explanation:'"Or La\'goyim" — a light unto the nations — describes the Jewish mission to bring the ethical and spiritual light of Torah to all humanity.' } },
    ]},
    { id:'u1l4', title:'What is a Mitzvah?', icon:'⭐', slides:[
      { title:'What is a Mitzvah?', icon:'⭐', body:`<p>A mitzvah (plural: mitzvot) is a divine commandment — one of the 613 commandments in the Torah. The word comes from <em>tzavah</em>, meaning both "to command" and "to connect."</p><p>Every mitzvah is simultaneously an instruction and an opportunity to connect with HaShem.</p>`, source:'Sefer HaChinuch, Introduction; Rambam, Sefer HaMitzvot' },
      { title:'613 Mitzvot', body:`<p>The Torah contains 613 mitzvot — 248 positive ("do this") and 365 prohibitions ("do not do this"). These cover every area of life: prayer, food, relationships, business, and more.</p><p>The Rabbis added further commandments (d\'rabanan) to protect and expand Torah observance.</p>`, concept:'Mitzvot are not arbitrary rules — each is a "recipe" for holiness, shaping a life of awareness, intention, and connection to the divine.', source:'Talmud Makkot 23b; Rambam, Sefer HaMitzvot' },
      { title:'Mitzvot Between People', hebrew:'בֵּין אָדָם לַחֲבֵרוֹ', transliteration:"Bein adam l'chaveiro", translation:'Between a person and their fellow', body:`<p>Mitzvot divide into those between a person and G-d, and those between people. The Talmud teaches that Yom Kippur can only atone for sins against G-d — wrongs against people must be rectified directly with those people first.</p>`, source:'Talmud Yoma 85b; Rambam, Hilchot Teshuva 2:9' },
      { title:'Quick Check', exercise:{ question:'How many mitzvot are in the Torah?', options:['10','248','365','613'], answer:3, explanation:'The Torah contains 613 mitzvot — 248 positive commandments and 365 prohibitions. The Talmud (Makkot 23b) is the source for this count.' } },
    ]},
    { id:'u1l5', title:'Foundations Quiz', icon:'📝', isQuiz:true, slides:[
      { title:'Unit Quiz — Foundations of Faith', icon:'📝', body:`<p>Test what you've learned about HaShem, Torah, the Jewish people, and mitzvot. Five questions — take your time.</p>` },
      { title:'Question 1', exercise:{ question:'What does the name "HaShem" literally mean in Hebrew?', options:['G-d Almighty','The Name','The Creator','The Eternal'], answer:1, explanation:'"HaShem" means "The Name" — a way of referring to G-d in everyday speech without using His holy name directly.' } },
      { title:'Question 2', exercise:{ question:'The Torah was given to Moshe at which mountain?', options:['Mount Moriah','Mount Carmel','Mount Sinai','Mount Nebo'], answer:2, explanation:'The Torah was given at Mount Sinai, approximately 3,300 years ago — the foundational event of Jewish history.' } },
      { title:'Question 3', exercise:{ question:'What does "Ein Sof" mean?', options:['The Infinite One','Without End','The First','Without Form'], answer:1, explanation:'"Ein Sof" means "Without End" — describing G-d as infinite and boundless, beyond all limits of time and space.' } },
      { title:'Question 4', exercise:{ question:'How many mitzvot are contained in the Torah?', options:['248','365','613','1000'], answer:2, explanation:'The Torah contains 613 mitzvot — 248 positive commandments and 365 prohibitions, as counted in the Talmud (Makkot 23b).' } },
      { title:'Question 5', exercise:{ question:'What is the mission described in the phrase "Or La\'goyim"?', options:['To build the Temple','A light unto the nations','To observe all mitzvot','To return to Israel'], answer:1, explanation:'"Or La\'goyim" — a light unto the nations — describes the Jewish mission to bring ethical and spiritual light to all humanity (Yeshayahu 42:6).' } },
      { title:'Unit Complete! 🏆', icon:'🏆', body:`<p>You've completed the Foundations of Faith unit. You've learned about HaShem, the Torah, Am Yisrael, and what a mitzvah is.</p><p>These are the building blocks of everything else in your Jewish journey.</p>`, concept:'Next: Shabbat — the most observed and beloved practice in all of Judaism.' },
    ]},
  ]},
  { id:'unit2', title:'Shabbat — The Day of Rest', level:'Beginner', lessons:[
    { id:'u2l1', title:'What is Shabbat?', icon:'🕯️', slides:[
      { title:'What is Shabbat?', icon:'🕯️', body:`<p>Shabbat is the Jewish day of rest, observed from Friday sundown to Saturday nightfall. It is the only holiday mentioned in the Ten Commandments and a sign of the covenant between HaShem and the Jewish people.</p><p>"Remember the Sabbath day to keep it holy" (Shemot 20:8).</p>`, source:'Shemot 20:8–11; Devarim 5:12–15' },
      { title:'A Taste of the World to Come', hebrew:'מֵעֵין עוֹלָם הַבָּא', transliteration:"Me'ein olam haba", translation:'A foretaste of the World to Come', body:`<p>The Talmud describes Shabbat as "a foretaste of the World to Come" — a weekly experience of the reality that awaits those who live righteous lives.</p><p>On Shabbat, we cease creating and controlling. We step back from the world we build during the week and simply exist as children of G-d.</p>`, concept:'Shabbat is not about restriction — it is about elevation. The 39 categories of forbidden labor represent human mastery over nature. On Shabbat, we acknowledge that HaShem is the true master.', source:'Talmud Berakhot 57b; Zohar Vol. 2, 88a' },
      { title:'Shabbat Shalom', hebrew:'שַׁבָּת שָׁלוֹם', transliteration:'Shabbat Shalom', translation:'A Peaceful Sabbath', body:`<p>The traditional greeting is "Shabbat Shalom" — a peaceful Sabbath. Shalom means wholeness, completeness, harmony.</p><p>On Friday night, families gather with candles, wine (kiddush), and two loaves of challah — a scene repeated in Jewish homes worldwide for thousands of years.</p>`, source:'See Rambam, Hilchot Shabbat; Shulchan Aruch, Orach Chaim 271' },
      { title:'Quick Check', exercise:{ question:'When does Shabbat begin?', options:['Friday midnight','Saturday morning','Friday at sundown','Thursday night'], answer:2, explanation:'Shabbat begins at sundown on Friday (18 minutes before, candles are lit) and ends at nightfall on Saturday when three stars appear.' } },
    ]},
    { id:'u2l2', title:'Friday Night — Kabbalat Shabbat', icon:'✨', slides:[
      { title:'Welcoming Shabbat', icon:'✨', body:`<p>Shabbat begins 18 minutes before sunset on Friday. The woman of the house lights at least two candles and recites a blessing, ushering in the holy day.</p><p>In synagogue, the community recites <em>Kabbalat Shabbat</em> — Psalms and songs welcoming Shabbat like a queen or bride.</p>`, source:'Shulchan Aruch, Orach Chaim 263:2–5' },
      { title:'Candle Lighting Blessing', hebrew:'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת', transliteration:"Baruch Atah Adonai, Eloheinu Melech haolam, asher kid'shanu b'mitzvotav v'tzivanu l'hadlik ner shel Shabbat", translation:'Blessed are You, L-rd our G-d, King of the universe, who has sanctified us with His commandments and commanded us to kindle the Sabbath light.', body:`<p>As the flames are kindled, many women circle their hands over the candles three times then cover their eyes — bringing the light inward before opening their eyes to see Shabbat for the first time.</p>`, source:'Talmud Shabbat 25b; Rambam, Hilchot Shabbat 5:1' },
      { title:'Lecha Dodi', hebrew:'לְכָה דוֹדִי לִקְרַאת כַּלָּה', transliteration:'Lecha dodi likrat kallah', translation:'Come my beloved, to meet the bride', body:`<p>Lecha Dodi is a 16th-century poem by Rabbi Shlomo Alkabetz, sung at the start of Friday night services. It speaks of welcoming Shabbat as a bride.</p><p>At the last verse, the congregation turns to face the door and bows — symbolically welcoming the Shabbat queen.</p>`, source:'Rabbi Shlomo Alkabetz, 16th century, Tzfat (Safed)' },
      { title:'Quick Check', exercise:{ question:'What is the Friday night synagogue service called?', options:['Havdalah','Maariv','Kabbalat Shabbat','Mincha'], answer:2, explanation:'Kabbalat Shabbat — "Receiving the Sabbath" — is the Friday evening service that welcomes Shabbat with Psalms and the poem Lecha Dodi.' } },
    ]},
    { id:'u2l3', title:'Shabbat Day', icon:'📖', slides:[
      { title:'Shabbat Morning', icon:'📖', body:`<p>Shabbat morning centers on the synagogue service and Torah reading. The weekly portion (parasha) is read aloud from a handwritten scroll, and congregants are called up for the honor of reciting blessings.</p><p>After services, families return home for Shabbat lunch — a festive meal filled with Torah discussion, singing, and rest.</p>`, source:'Mishnah Megillah 3:4–6; Shulchan Aruch, Orach Chaim 285' },
      { title:'The Parasha System', body:`<p>The Torah is divided into 54 weekly portions, called <em>parashiyot</em>. Each week, the entire Jewish world reads the same portion — creating a shared rhythm unifying the Jewish people for over a millennium.</p><p>The cycle ends and immediately restarts each fall on <em>Simchat Torah</em> — the celebration of the Torah.</p>`, concept:'Walking into any synagogue in the world on any given Shabbat, you will hear the exact same portion being read. This shared rhythm is one of the great unifying forces in Jewish life.', source:'Talmud Megillah 29b; Rambam, Hilchot Tefillah 12:1' },
      { title:'Shabbat Afternoon', body:`<p>Shabbat afternoon is for rest, study, and walking. Many take long walks, visit friends, or learn Torah informally.</p><p>In the late afternoon, Mincha (afternoon prayer) is held, often followed by Seudah Shlishit — the "third meal" — a light gathering before the day ends.</p>`, source:'Shulchan Aruch, Orach Chaim 291–292' },
      { title:'Quick Check', exercise:{ question:'How many weekly Torah portions (parashiyot) are there?', options:['12','24','54','613'], answer:2, explanation:'There are 54 parashiyot — one for each Shabbat, with some combined in shorter years. The entire Torah is read in a one-year cycle.' } },
    ]},
    { id:'u2l4', title:'Havdalah — Ending Shabbat', icon:'🌟', slides:[
      { title:'Havdalah', icon:'🌟', body:`<p>As three stars appear Saturday night, Shabbat ends with Havdalah — a beautiful ritual of separation between the holy and the ordinary, using wine, spices, and a multi-wicked candle.</p>`, source:'Talmud Berakhot 33a; Shulchan Aruch, Orach Chaim 296–299' },
      { title:'The Four Elements', body:`<p><strong style="color:var(--gold)">Wine:</strong> Marks the transition, as with Kiddush at the start.<br/><strong style="color:var(--gold)">Spices (Besamim):</strong> We smell fragrant spices to revive the soul, which grieves at the departure of the extra Shabbat soul.<br/><strong style="color:var(--gold)">Candle:</strong> A multi-wicked flame — we look at our fingernails in the light, the first use of fire after Shabbat.<br/><strong style="color:var(--gold)">Blessing:</strong> We bless HaShem who "separates between holy and secular."</p>`, source:'Talmud Pesachim 103a–b; Rambam, Hilchot Shabbat 29:1' },
      { title:'Havdalah Blessing', hebrew:'הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל', transliteration:"HaMavdil bein kodesh l'chol", translation:'Who separates between the holy and the secular', body:`<p>After Havdalah, it is customary to wish "Shavua Tov" — a good week — and begin the week with the spiritual charge of Shabbat still fresh.</p><p>The Zohar teaches that Havdalah brings a "protection" for the entire coming week.</p>`, source:'Shulchan Aruch, Orach Chaim 299; Zohar Vol. 2, 207b' },
      { title:'Quick Check', exercise:{ question:'What does Havdalah mean?', options:['Blessing','Separation','Completion','Rest'], answer:1, explanation:'Havdalah comes from the root "l\'havdil" — to separate or distinguish. It marks the separation between the holy Shabbat and the regular weekdays.' } },
    ]},
    { id:'u2l5', title:'Shabbat Quiz', icon:'📝', isQuiz:true, slides:[
      { title:'Unit Quiz — Shabbat', icon:'🕯️', body:`<p>Test your knowledge of Shabbat — from candle lighting Friday night to Havdalah on Saturday. Five questions.</p>` },
      { title:'Question 1', exercise:{ question:'How many minutes before sunset does Shabbat begin?', options:['10 minutes','18 minutes','30 minutes','At sunset exactly'], answer:1, explanation:'Shabbat begins 18 minutes before sunset on Friday, when candles are lit. This buffer provides a margin to ensure Shabbat is not violated.' } },
      { title:'Question 2', exercise:{ question:'What does "Kabbalat Shabbat" mean?', options:['The Shabbat Prayer','Receiving the Sabbath','Ending the Sabbath','The Shabbat Candles'], answer:1, explanation:'"Kabbalat Shabbat" means "Receiving the Sabbath" — the Friday night service that welcomes Shabbat with Psalms and the poem Lecha Dodi.' } },
      { title:'Question 3', exercise:{ question:'Who wrote the poem Lecha Dodi?', options:['Rabbi Akiva','King David','Rabbi Shlomo Alkabetz','The Vilna Gaon'], answer:2, explanation:'Lecha Dodi was written by Rabbi Shlomo Alkabetz in 16th-century Tzfat (Safed), Israel — one of the great centers of Jewish mysticism.' } },
      { title:'Question 4', exercise:{ question:'What are the four elements of Havdalah?', options:['Candle, wine, challah, spices','Wine, spices, candle, blessing','Torah, prayer, charity, rest','Kiddush, Havdalah, Hallel, Amidah'], answer:1, explanation:'Havdalah uses wine, spices (besamim), a multi-wicked candle, and the concluding blessing — each with deep symbolic meaning.' } },
      { title:'Question 5', exercise:{ question:'The Talmud describes Shabbat as a foretaste of what?', options:['The Temple service','Yom Kippur','The World to Come','The giving of the Torah'], answer:2, explanation:'The Talmud (Berakhot 57b) describes Shabbat as "Me\'ein Olam Haba" — a foretaste of the World to Come, a glimpse of ultimate spiritual reality.' } },
      { title:'Shabbat Unit Complete! ✨', icon:'✨', body:`<p>You've completed the Shabbat unit. From candle lighting to Havdalah — you now understand the full structure of this sacred day.</p>`, concept:'Next: Prayer — learning how to talk to HaShem and build a daily practice.' },
    ]},
  ]},
  { id:'unit3', title:'Prayer — Connecting to HaShem', level:'Intermediate', lessons:[
    { id:'u3l1', title:'Why Do We Pray?', icon:'🙏', slides:[
      { title:'Why Do We Pray?', icon:'🙏', body:`<p>Prayer in Judaism is called <em>Avodah shebalev</em> — "service of the heart." It is not primarily about asking G-d for things. It is about cultivating awareness of the divine and aligning ourselves with what truly matters.</p><p>The Hebrew word for prayer, <em>hitpalel</em>, is reflexive — it literally means "to judge oneself."</p>`, source:'Talmud Ta\'anit 2a; Rambam, Hilchot Tefillah 1:1' },
      { title:'Three Times a Day', body:`<p>Three daily prayer services correspond to the three Patriarchs and Temple sacrifices:</p><p><strong style="color:var(--gold)">Shacharit</strong> (Morning) — instituted by Avraham<br/><strong style="color:var(--gold)">Mincha</strong> (Afternoon) — instituted by Yitzchak<br/><strong style="color:var(--gold)">Maariv</strong> (Evening) — instituted by Yaakov</p>`, concept:'Prayer times connect to the natural transitions of the day — morning light, the turning of midday, the coming of night. Judaism sanctifies time itself.', source:'Talmud Berakhot 26b' },
      { title:'Prayer and the Heart', hebrew:'וְעָבַדְתֶּם אֵת יְהוָה אֱלֹהֵיכֶם', transliteration:"V'avadtem et Adonai Eloheichem", translation:'You shall serve the L-rd your G-d', body:`<p>The Talmud asks: what does it mean to "serve" G-d with your heart? The answer: prayer. Not just recitation of words, but genuine engagement — speaking to G-d with intention (<em>kavanah</em>).</p><p>Even a simple sincere prayer in your own language, from the heart, fulfills this mitzvah.</p>`, source:'Talmud Ta\'anit 2a; Devarim 11:13' },
      { title:'Quick Check', exercise:{ question:'What does the word "hitpalel" (to pray) literally mean?', options:['To speak to G-d','To judge oneself','To ask for things','To give thanks'], answer:1, explanation:'"Hitpalel" is a reflexive verb meaning "to judge oneself" — prayer in Judaism is fundamentally an act of self-examination and alignment, not just petition.' } },
    ]},
    { id:'u3l2', title:'The Structure of the Siddur', icon:'📚', slides:[
      { title:'The Siddur', icon:'📚', body:`<p>The Siddur (from <em>seder</em>, "order") is the Jewish prayer book — a carefully ordered sequence of prayers, Psalms, and blessings for daily use.</p><p>The Siddur was compiled primarily during the Geonic period (6th–11th centuries), though many prayers date back to the Temple period.</p>`, source:'Talmud Berakhot 28b; Rav Amram Gaon\'s Siddur, ~870 CE' },
      { title:'The Core: The Amidah', hebrew:'עֲמִידָה', transliteration:'Amidah', translation:'Standing', body:`<p>The centerpiece of every prayer service is the <em>Amidah</em> — "standing" — recited while standing, feet together, facing Jerusalem.</p><p>The Amidah contains blessings of praise, personal requests (health, livelihood, wisdom, redemption), and thanksgiving. It is said silently, as a private conversation with G-d.</p>`, concept:'The Amidah is the closest thing in Judaism to a direct conversation with HaShem. Every word is addressed personally, and many add private prayers at the end.', source:'Talmud Berakhot 28b–29a; Rambam, Hilchot Tefillah 4:1' },
      { title:'Shacharit Structure', body:`<p>The morning service follows a deliberate progression — like gradually approaching a king:</p><p><strong style="color:var(--gold)">1. Morning Blessings</strong> — gratitude for waking up<br/><strong style="color:var(--gold)">2. Pesukei D\'Zimra</strong> — Psalms to warm the heart<br/><strong style="color:var(--gold)">3. Shema & Blessings</strong> — declaration of faith<br/><strong style="color:var(--gold)">4. Amidah</strong> — the core prayer<br/><strong style="color:var(--gold)">5. Concluding Prayers</strong> — Aleinu and Kaddish</p>`, source:'Rambam, Hilchot Tefillah 7; Shulchan Aruch, Orach Chaim 51–132' },
      { title:'Quick Check', exercise:{ question:'What is the centerpiece of every Jewish prayer service?', options:['The Shema','The Amidah','The Kaddish','The Aleinu'], answer:1, explanation:'The Amidah (meaning "standing") is the core of every prayer service — a silent, private prayer recited standing while facing Jerusalem, containing 19 blessings.' } },
    ]},
    { id:'u3l3', title:'Shacharit — Morning Prayer', icon:'🌅', slides:[
      { title:'Beginning the Day', icon:'🌅', body:`<p>The first words a Jew says upon waking — before even getting out of bed — are <em>Modeh Ani</em>: "I give thanks before You, living and eternal King, who has returned my soul to me with compassion."</p><p>This simple declaration sets the tone for the entire day: gratitude before anything else.</p>`, source:'Siddur; Mishnah Berurah 1:8' },
      { title:'Modeh Ani', hebrew:'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ', transliteration:"Modeh ani lefanecha Melech chai v'kayam, shehechezarta bi nishmati b'chemla. Rabbah emunatecha.", translation:'I give thanks before You, living and eternal King, who has returned my soul with compassion. How great is Your faithfulness.', body:`<p>Modeh Ani notably does NOT contain the name of G-d — intentional, because we speak to G-d before even washing our hands. The Rabbis crafted the prayer to express thanks without the divine name.</p>`, source:'Siddur; Kitzur Shulchan Aruch 1:3' },
      { title:'The Shema in Shacharit', body:`<p>The Shema is recited in Shacharit — once in the early blessings, and once in its formal context with surrounding blessings.</p><p>Before the Shema, we recite blessings about G-d\'s daily renewal of creation and His love for Israel. After, we transition directly into the Amidah — from declaration of faith into prayer.</p>`, source:'Talmud Berakhot 11b–12a; Shulchan Aruch, Orach Chaim 59–70' },
      { title:'Quick Check', exercise:{ question:'Why does Modeh Ani not contain the name of G-d?', options:['It was added later by the Rabbis','We say it before washing our hands','It is a private prayer','G-d\'s name is only in the Amidah'], answer:1, explanation:'Modeh Ani is said immediately upon waking, before washing hands. Since Jewish law restricts speaking G-d\'s name in an impure state, the Rabbis crafted the prayer without it.' } },
    ]},
    { id:'u3l4', title:'Mincha and Maariv', icon:'🌙', slides:[
      { title:'Mincha — Afternoon Prayer', icon:'🌙', body:`<p>Mincha, the afternoon prayer, is recited between midday and sunset. Despite being the shortest service, the Talmud gives it special significance — it requires the greatest intentional effort to pause from the busy workday.</p><p>The Zohar says Mincha is especially beloved by HaShem because it requires the most sacrifice of time and attention.</p>`, source:'Talmud Berakhot 6b; Zohar Vol. 1, 132b' },
      { title:'Maariv — Evening Prayer', hebrew:'מַעֲרִיב עֲרָבִים', transliteration:"Ma'ariv aravim", translation:'Who brings on evenings', body:`<p>Maariv, the evening prayer, begins after nightfall and includes the Shema and the Amidah. The opening blessing praises G-d as "Ma\'ariv Aravim" — the One who orchestrates the rotation of day and night with wisdom.</p>`, concept:'Maariv was technically optional in Talmudic times but has become universally accepted as obligatory — an example of the Jewish people voluntarily taking on a higher standard of practice.', source:'Talmud Berakhot 27b; Rambam, Hilchot Tefillah 1:6' },
      { title:'Building a Practice', body:`<p>For someone beginning, the path to full daily prayer is gradual. Common entry points:</p><p><strong style="color:var(--gold)">Start with Modeh Ani</strong> — 10 seconds each morning<br/><strong style="color:var(--gold)">Add the Shema</strong> — morning and night<br/><strong style="color:var(--gold)">Learn Shacharit</strong> — with a siddur and transliteration<br/><strong style="color:var(--gold)">Join a minyan</strong> — community strengthens the practice</p>`, source:'See Rabbi Aryeh Kaplan, "Jewish Meditation"; Rambam, Hilchot Tefillah 1:1' },
      { title:'Quick Check', exercise:{ question:'Which prayer service is described as especially beloved because it requires the most sacrifice?', options:['Shacharit','Kabbalat Shabbat','Mincha','Maariv'], answer:2, explanation:'Mincha — the afternoon prayer — is described in the Zohar as especially beloved by HaShem because it requires pausing from the middle of a busy workday to pray.' } },
    ]},
    { id:'u3l5', title:'Prayer Quiz', icon:'📝', isQuiz:true, slides:[
      { title:'Unit Quiz — Prayer', icon:'🙏', body:`<p>Test your knowledge of Jewish prayer — the Siddur, the three daily services, and how to connect with HaShem. Five questions.</p>` },
      { title:'Question 1', exercise:{ question:'What does the Hebrew word "hitpalel" (to pray) literally mean?', options:['To speak to G-d','To judge oneself','To ask for things','To give thanks'], answer:1, explanation:'"Hitpalel" is a reflexive verb meaning "to judge oneself" — prayer in Judaism is fundamentally an act of self-examination and alignment, not just petition.' } },
      { title:'Question 2', exercise:{ question:'Which Patriarch instituted the Shacharit (morning) prayer?', options:['Moshe','Yaakov','Yitzchak','Avraham'], answer:3, explanation:'The Talmud (Berakhot 26b) teaches that Shacharit was instituted by Avraham, Mincha by Yitzchak, and Maariv by Yaakov.' } },
      { title:'Question 3', exercise:{ question:'What is the Amidah also called?', options:['The Shema','Shemoneh Esreh','Kaddish','Hallel'], answer:1, explanation:'The Amidah is also called "Shemoneh Esreh" — the Eighteen Blessings. It is the core prayer of every service, recited while standing, facing Jerusalem.' } },
      { title:'Question 4', exercise:{ question:'The first words said upon waking each morning are:', options:['Baruch HaShem','Shema Yisrael','Modeh Ani','Ashrei'], answer:2, explanation:'"Modeh Ani" is recited immediately upon waking — before getting out of bed. It expresses gratitude to G-d for returning the soul with compassion.' } },
      { title:'Question 5', exercise:{ question:'According to the Zohar, which prayer is especially beloved because it requires the most sacrifice?', options:['Shacharit','Maariv','Kabbalat Shabbat','Mincha'], answer:3, explanation:'The Zohar says Mincha is especially beloved because it requires pausing from a busy workday — demanding the greatest act of intention and sacrifice.' } },
      { title:'Prayer Unit Complete! 🙏', icon:'🙏', body:`<p>You've completed the Prayer unit. You understand why Jews pray, the structure of the Siddur, and the three daily services.</p>`, concept:'Next: Jewish Holidays — the full cycle of the Jewish year and its spiritual meaning.' },
    ]},
  ]},
  { id:'unit4', title:'Jewish Holidays', level:'Intermediate', lessons:[
    { id:'u4l1', title:'The Jewish Calendar', icon:'📅', slides:[
      { title:'The Jewish Calendar', icon:'📅', body:`<p>The Jewish calendar is lunisolar — it follows the lunar cycle for months but adjusts with the solar cycle to keep holidays in their proper seasons. The Jewish year begins in the fall with Rosh Hashana.</p>`, source:'Rambam, Hilchot Kiddush HaChodesh; Talmud Rosh Hashana 25a' },
      { title:'The Cycle of the Year', body:`<p><strong style="color:var(--gold)">Tishrei</strong> (Fall): Rosh Hashana, Yom Kippur, Sukkot<br/><strong style="color:var(--gold)">Kislev</strong> (Winter): Chanukah<br/><strong style="color:var(--gold)">Adar</strong> (Winter/Spring): Purim<br/><strong style="color:var(--gold)">Nissan</strong> (Spring): Pesach<br/><strong style="color:var(--gold)">Sivan</strong> (Early Summer): Shavuot</p>`, concept:'Each holiday is not just historical commemoration — it is a recurring spiritual opportunity. The same "energy" of Pesach is available every year at the same point in the cosmic cycle.', source:'See Sefer HaTanya, Iggeret HaKodesh; Ramban on Vayikra 23' },
      { title:'Quick Check', exercise:{ question:'Which month does the Jewish year begin in?', options:['Nissan (Spring)','Sivan (Summer)','Tishrei (Fall)','Shevat (Winter)'], answer:2, explanation:'The Jewish New Year — Rosh Hashana — falls in Tishrei, corresponding to September/October. However, Nissan is called the "first month" in the Torah, reflecting that Pesach marks the birth of the Jewish people.' } },
    ]},
    { id:'u4l2', title:'Rosh Hashana & Yom Kippur', icon:'🍎', slides:[
      { title:'Rosh Hashana', icon:'🍎', body:`<p>Rosh Hashana (literally "Head of the Year") is the Jewish New Year, observed on the 1st–2nd of Tishrei. Unlike secular celebrations, it is a day of solemnity and self-reflection — the day the world stands in judgment before G-d. The central mitzvah is hearing the shofar (ram\'s horn) — 100 blasts across the day.</p>`, source:'Talmud Rosh Hashana 16a; Rambam, Hilchot Teshuva 3:1–4' },
      { title:'The Shofar', hebrew:'תְּקִיעָה שְׁבָרִים תְּרוּעָה', transliteration:'Tekiah, Shevarim, Teruah', translation:'One long blast, three medium, nine staccato', body:`<p>The shofar is one of the oldest instruments in human history. Maimonides wrote: "Wake up, sleepers, from your sleep! Arise from your slumber! Examine your deeds, return to G-d, and remember your Creator."</p>`, concept:'The Ten Days between Rosh Hashana and Yom Kippur — "Aseret Yemei Teshuva" — are the most spiritually intense period of the Jewish year.', source:'Rambam, Hilchot Teshuva 3:4; Talmud Rosh Hashana 26b' },
      { title:'Yom Kippur', body:`<p>Yom Kippur is the holiest day in the Jewish calendar — a 25-hour fast during which Jews abstain from food, water, bathing, leather shoes, and marital relations.</p><p>The day is spent in synagogue, confessing sins collectively, praying for forgiveness. The final prayer, <em>Neilah</em> — "the closing" — ends with a single long shofar blast as the "gates of heaven" close at nightfall.</p>`, source:'Vayikra 16:29–34; 23:26–32; Talmud Yoma' },
      { title:'Quick Check', exercise:{ question:'What is the central mitzvah of Rosh Hashana?', options:['Fasting for 25 hours','Eating apples and honey','Hearing the shofar','Reciting Hallel'], answer:2, explanation:'The central mitzvah of Rosh Hashana is hearing the shofar — 100 blasts across the day. The fast and intensive prayer is associated with Yom Kippur, 10 days later.' } },
    ]},
    { id:'u4l3', title:'Sukkot, Pesach & Shavuot', icon:'🌿', slides:[
      { title:'The Three Pilgrimage Festivals', icon:'🌿', body:`<p>Three times a year, when the Temple stood, every Jewish male was commanded to make a pilgrimage to Jerusalem. These <em>Shalosh Regalim</em> combine historical memory with agricultural meaning and spiritual themes.</p>`, source:'Shemot 23:14–17; Devarim 16:16; Talmud Chagigah' },
      { title:'Pesach — Passover', hebrew:'פֶּסַח', transliteration:'Pesach', translation:'Passover', body:`<p>Pesach commemorates the Exodus from Egypt. For 7-8 days, Jews remove all leavened bread (chametz) and eat matzah — reliving the rushed departure from Egypt.</p><p>The central ritual is the Seder — a family gathering with specific foods, songs, and the retelling of the Exodus story.</p>`, source:'Shemot 12–13; Haggadah shel Pesach; Talmud Pesachim' },
      { title:'Shavuot & Sukkot', body:`<p><strong style="color:var(--gold)">Shavuot</strong> (50 days after Pesach): Commemorates the giving of the Torah at Sinai. Many stay up all night studying Torah (<em>tikkun leil Shavuot</em>).</p><p><strong style="color:var(--gold)">Sukkot</strong> (7 days after Yom Kippur): Jews build and eat in temporary outdoor booths (sukkot), recalling 40 years in the desert. The most joyful time of the Jewish year.</p>`, concept:"The Vilna Gaon taught that Sukkot's joy is so great it is called simply 'The Festival' (HaChag) — the holiday par excellence.", source:'Vayikra 23:33–43; Talmud Sukkah; Vilna Gaon on Shir HaShirim' },
      { title:'Quick Check', exercise:{ question:'What is eaten on Pesach instead of bread?', options:['Challah','Matza','Pita','Crackers'], answer:1, explanation:'On Pesach, all chametz (leavened products) are removed and matzah — unleavened bread — is eaten to recall the bread the Israelites baked in haste when leaving Egypt.' } },
    ]},
    { id:'u4l4', title:'Chanukah and Purim', icon:'🕎', slides:[
      { title:'Chanukah', icon:'🕎', body:`<p>Chanukah commemorates the Maccabees\' victory over the Greek-Syrian empire in 165 BCE and the miracle of a single day\'s worth of pure olive oil lasting eight days in the rededicated Temple.</p><p>For eight nights, Jews light a menorah (chanukiah) in the window or doorway — publicizing the miracle.</p>`, source:'Talmud Shabbat 21b; Rambam, Hilchot Chanukah 3:1–4' },
      { title:'The Chanukiah', hebrew:'וְעַל הַנִּסִּים', transliteration:"V'al haNissim", translation:'And for the miracles...', body:`<p>The menorah holds 9 candles — 8 for the eight nights, plus the <em>shamash</em> (helper candle). Each night, one additional candle is added, building to maximum light on the final night.</p><p>"V\'al haNissim" — for the miracles — is added to prayers and grace after meals throughout Chanukah.</p>`, source:'Talmud Shabbat 21b; Shulchan Aruch, Orach Chaim 671–684' },
      { title:'Purim', hebrew:'פּוּרִים', transliteration:'Purim', translation:'Lots (as in lottery)', body:`<p>Purim celebrates the salvation of Persian Jews from the plot of Haman, as told in the Book of Esther. The four mitzvot of Purim: reading the Megillah, sending food gifts to friends (<em>mishloach manot</em>), giving charity to the poor, and enjoying a festive meal.</p>`, source:'Megillat Esther; Talmud Megillah; Rambam, Hilchot Megillah 1–2' },
      { title:'Quick Check', exercise:{ question:'How many nights does Chanukah last?', options:['3','7','8','9'], answer:2, explanation:'Chanukah lasts 8 nights, commemorating the miracle of one day\'s worth of oil burning for 8 days in the rededicated Temple in Jerusalem in 165 BCE.' } },
    ]},
    { id:'u4l5', title:'Holidays Quiz', icon:'📝', isQuiz:true, slides:[
      { title:'Unit Quiz — Jewish Holidays', icon:'🍎', body:`<p>Test your knowledge of the Jewish calendar and its major holidays — from Rosh Hashana to Purim. Five questions.</p>` },
      { title:'Question 1', exercise:{ question:'The Jewish New Year — Rosh Hashana — falls in which Hebrew month?', options:['Nissan','Sivan','Tishrei','Adar'], answer:2, explanation:'Rosh Hashana falls on the 1st of Tishrei, corresponding to September/October. Though Nissan is the "first month" of the year in the Torah, Tishrei is when the new year begins.' } },
      { title:'Question 2', exercise:{ question:'What is the central mitzvah of Rosh Hashana?', options:['Fasting for 25 hours','Building a sukkah','Hearing the shofar','Eating apples and honey'], answer:2, explanation:'The central mitzvah of Rosh Hashana is hearing the shofar (ram\'s horn) — 100 blasts across the day. Its sound is a call to wake up and return to G-d.' } },
      { title:'Question 3', exercise:{ question:'On Pesach, what replaces bread for 7–8 days?', options:['Pita','Crackers','Matzah','Challah'], answer:2, explanation:'On Pesach, all chametz (leavened products) are removed and matzah — unleavened bread — is eaten to commemorate the Israelites\' rushed departure from Egypt.' } },
      { title:'Question 4', exercise:{ question:'Which holiday commemorates the Maccabees\' victory and the miracle of oil?', options:['Purim','Sukkot','Shavuot','Chanukah'], answer:3, explanation:'Chanukah commemorates the Maccabees\' victory over the Greek-Syrian empire in 165 BCE and the miracle of a single day\'s worth of oil burning for eight days.' } },
      { title:'Question 5', exercise:{ question:'How many days after Pesach is Shavuot celebrated?', options:['7 days','30 days','50 days','100 days'], answer:2, explanation:'Shavuot is celebrated 50 days after Pesach — the 49-day counting period is called Sefirat HaOmer. Shavuot commemorates the giving of the Torah at Sinai.' } },
      { title:'Holidays Unit Complete! 🍎', icon:'🍎', body:`<p>You've completed the Jewish Holidays unit. The Jewish calendar is a year-long spiritual curriculum moving through creation, redemption, revelation, and joy.</p>`, concept:'Final unit: Torah Study — how to engage with the weekly Parasha and the great commentators.' },
    ]},
  ]},
  { id:'unit5', title:'Torah Study — Parshat HaShavua', level:'Advanced', lessons:[
    { id:'u5l1', title:'What is the Parasha?', icon:'📜', slides:[
      { title:'The Weekly Torah Portion', icon:'📜', body:`<p>Each week, the Jewish world reads the same section of the Torah — called the <em>parasha</em> or <em>parshat hashavua</em>. The 54 portions cycle through the Five Books of Moses in one year.</p>`, source:'Talmud Megillah 29b; Rambam, Hilchot Tefillah 12:1' },
      { title:'How It Works', body:`<p>Each portion is named after its first distinctive word — Bereishit ("In the beginning"), Noach ("Noah"), Lech Lecha ("Go forth"). In leap years, some portions are combined.</p><p>Studying the weekly parasha connects you to a living, global Jewish conversation.</p>`, concept:'Whatever is happening in your life, the parasha of the week is speaking to it. Generations of Jews have found that the portion seems to be "about" their exact situation.', source:'Ba\'al Shem Tov (attributed); see Chiddushei HaRim, Introduction' },
      { title:'PaRDeS — Four Levels', body:`<p>Jewish tradition recognizes four levels of interpretation — called <em>PaRDeS</em>:</p><p><strong style="color:var(--gold)">Peshat</strong> — Literal meaning<br/><strong style="color:var(--gold)">Remez</strong> — Allegorical/symbolic meaning<br/><strong style="color:var(--gold)">Derash</strong> — Homiletical/moral teaching<br/><strong style="color:var(--gold)">Sod</strong> — Mystical/Kabbalistic meaning</p>`, source:'Zohar Vol. 3, 202a; Bachya ibn Paquda, Chovot HaLevavot' },
      { title:'Quick Check', exercise:{ question:'What does "PaRDeS" stand for?', options:['Peshat, Remez, Derash, Sod','Prayer, Reading, Discussion, Study','Parasha, Rabbi, Discussion, Seder','Psalm, Ritual, Drasha, Shul'], answer:0, explanation:'PaRDeS stands for Peshat (literal), Remez (allegorical), Derash (homiletical), and Sod (mystical) — the four levels of Torah interpretation. The word itself means "orchard" in Hebrew.' } },
    ]},
    { id:'u5l2', title:'Reading the Torah', icon:'✍️', slides:[
      { title:'The Hebrew Alphabet', icon:'✍️', body:`<p>The Torah is written in Biblical Hebrew — 22 letters with no vowels in the written scroll. Even basic Hebrew literacy opens enormous doors — following Torah readings, praying with intention, accessing original texts.</p>`, source:'See Rabbi Nosson Scherman, "The Aleph-Beis"' },
      { title:'Cantillation — Trop', body:`<p>The Torah is not just read — it is sung. Each word has a cantillation mark (<em>trop</em>) indicating the melody for that word. These marks also serve as punctuation and phrasing guides.</p><p>The Torah reader (ba\'al koreh) chants the entire portion using these melodies, from an unmarked scroll.</p>`, concept:'The tradition of reading Torah with cantillation is one of the oldest forms of sacred music in the world — practiced continuously for over 2,000 years.', source:'Talmud Nedarim 37b; Rambam, Hilchot Tefillah 12:2' },
      { title:'Aliyot — Being Called Up', hebrew:'עֲלִיָּה', transliteration:'Aliyah', translation:'Going up', body:`<p>During the Torah reading, members of the community are called up (aliyah) to recite blessings before and after a section is read. There are typically 7 aliyot on Shabbat morning.</p>`, source:'Mishnah Megillah 4:1–2; Talmud Megillah 23a' },
      { title:'Quick Check', exercise:{ question:'What is the Hebrew term for being called up to the Torah?', options:['Kiddush','Aliyah','Havdalah','Minyan'], answer:1, explanation:'Aliyah (going up) describes being called to the Torah to recite the blessings. The same word is used for immigration to Israel — both are acts of "going up" spiritually.' } },
    ]},
    { id:'u5l3', title:'Commentary — Rashi and Beyond', icon:'🧠', slides:[
      { title:'Rashi', icon:'🧠', body:`<p>Rabbi Shlomo Yitzchaki (1040–1105), known by the acronym Rashi, wrote the most widely studied commentary on the Torah. He uses remarkably concise language to explain difficult words, reconcile contradictions, and bring in Midrashic teachings.</p>`, source:'Rashi on Bereishit 1:1; see R\' Chaim Dov Chavel\'s biography of Rashi' },
      { title:'The Giants of Commentary', body:`<p><strong style="color:var(--gold)">Rashi</strong> — 11th c. France. Essential first commentary.<br/><strong style="color:var(--gold)">Ramban (Nachmanides)</strong> — 13th c. Spain. Philosophical and mystical depth.<br/><strong style="color:var(--gold)">Or HaChaim</strong> — 18th c. Morocco. Beloved Kabbalistic commentary.<br/><strong style="color:var(--gold)">Netziv</strong> — 19th c. Russia. Halachic and national focus.</p>`, concept:'Each commentator brings their era, culture, and perspective to the eternal text. Reading multiple commentators on the same verse reveals the extraordinary depth of Torah.', source:'See R\' Adin Even-Israel Steinsaltz, "Biblical Images"' },
      { title:'How to Learn Parasha', body:`<p>A practical weekly routine:</p><p><strong style="color:var(--gold)">1.</strong> Read the English translation (15–20 min)<br/><strong style="color:var(--gold)">2.</strong> Read Rashi on 1–2 key verses<br/><strong style="color:var(--gold)">3.</strong> Listen to a 10-minute shiur (class)<br/><strong style="color:var(--gold)">4.</strong> Share one insight at your Shabbat table</p>`, source:'Based on Rambam, Hilchot Talmud Torah 1:8; Shulchan Aruch, Yoreh Deah 246' },
      { title:'Quick Check', exercise:{ question:'In which century did Rashi live?', options:['8th century','11th century','14th century','16th century'], answer:1, explanation:'Rashi (Rabbi Shlomo Yitzchaki) lived from 1040–1105 CE in Troyes, France — in the 11th century. His commentary remains the most widely studied Torah commentary to this day.' } },
    ]},
    { id:'u5l4', title:'Applying Torah to Daily Life', icon:'💫', slides:[
      { title:'Torah is a Living Document', icon:'💫', body:`<p>"It is not in heaven" (Devarim 30:12) — the Torah itself teaches that it must be interpreted and applied by human beings, in every generation and circumstance. This is the entire project of halacha.</p>`, source:'Devarim 30:12; Talmud Bava Metzia 59b' },
      { title:'Mussar — Ethics of the Soul', hebrew:'מוּסַר', transliteration:'Mussar', translation:'Ethics / Discipline', body:`<p>Mussar is a Jewish ethical discipline developed in 19th-century Lithuania by Rabbi Yisrael Salanter. It focuses on systematic character development — identifying dominant negative traits and working to correct them.</p><p>Traits studied in Mussar: humility, patience, trust in G-d, order, silence, and love of Torah.</p>`, concept:'Mussar bridges knowing Torah intellectually and actually living it. It gives Judaism a personal, psychological dimension that many find transformative.', source:'R\' Yisrael Salanter; Mesillat Yesharim by R\' Moshe Chaim Luzzatto' },
      { title:'Your Path Forward', body:`<p>You have completed the Journey to HaShem foundational curriculum!</p><p>Next steps:<br/><strong style="color:var(--gold)">Find a chevruta</strong> — a study partner<br/><strong style="color:var(--gold)">Attend a shiur</strong> — join a regular class<br/><strong style="color:var(--gold)">Start keeping Shabbat</strong> — even partially<br/><strong style="color:var(--gold)">Learn the daily prayers</strong> — with understanding</p>`, source:'"Find yourself a teacher, and acquire a study partner." — Pirkei Avot 1:6' },
      { title:'Quick Check', exercise:{ question:'Who founded the Mussar movement?', options:['Rabbi Akiva','Rabbi Yisrael Salanter','The Vilna Gaon','Rabbi Moshe Chaim Luzzatto'], answer:1, explanation:'Rabbi Yisrael Salanter (1809–1883) founded the Mussar movement in 19th-century Lithuania, focusing on systematic ethical self-improvement as a Jewish practice.' } },
    ]},
    { id:'u5l5', title:'Torah Study Quiz', icon:'📝', isQuiz:true, slides:[
      { title:'Unit Quiz — Torah Study', icon:'📜', body:`<p>Test your knowledge of Torah study — the parasha system, commentators, and how to engage with the weekly portion. Five questions.</p>` },
      { title:'Question 1', exercise:{ question:'How many weekly Torah portions (parashiyot) are there in the annual cycle?', options:['24','36','54','70'], answer:2, explanation:'There are 54 parashiyot — one read each Shabbat over the course of a year. In shorter years, some are combined. The cycle restarts each fall on Simchat Torah.' } },
      { title:'Question 2', exercise:{ question:'What does the acronym "PaRDeS" stand for?', options:['Peshat, Remez, Derash, Sod','Prayer, Reading, Discussion, Study','Parasha, Rav, Derasha, Shul','Psalms, Ritual, Drasha, Sermon'], answer:0, explanation:'PaRDeS stands for Peshat (literal), Remez (allegorical), Derash (homiletical), and Sod (mystical) — the four levels of Torah interpretation. The word means "orchard" in Hebrew.' } },
      { title:'Question 3', exercise:{ question:'In which century did Rashi write his Torah commentary?', options:['8th century','11th century','14th century','16th century'], answer:1, explanation:'Rashi (Rabbi Shlomo Yitzchaki) lived from 1040–1105 CE in Troyes, France. His commentary remains the most widely studied Torah commentary to this day.' } },
      { title:'Question 4', exercise:{ question:'What does "aliyah" mean in the context of the Torah reading?', options:['Reading from the Torah','Going up to the Torah','The weekly portion','The cantor\'s melody'], answer:1, explanation:'"Aliyah" (going up) refers to being called to the Torah to recite blessings before and after a section is read — considered a great honor.' } },
      { title:'Question 5', exercise:{ question:'Who founded the Mussar movement of Jewish ethics?', options:['The Vilna Gaon','Rabbi Akiva','Rabbi Yisrael Salanter','Rabbi Moshe Chaim Luzzatto'], answer:2, explanation:'Rabbi Yisrael Salanter (1809–1883) founded the Mussar movement in Lithuania, focusing on systematic ethical self-improvement as a central Jewish practice.' } },
      { title:'Course Complete! 🎓', icon:'🎓', body:`<p>You have completed the full Journey to HaShem foundational curriculum — five units covering the core pillars of Jewish life and learning.</p><p>This is just the beginning. The ocean of Torah is infinite, and every drop you learn brings you closer to HaShem and to your truest self.</p>`, concept:'"It is not upon you to finish the work, nor are you free to desist from it." — Pirkei Avot 2:16' },
    ]},
  ]},
];

const QUIZ_QUESTIONS = [
  { id:'q1', question:"Where are you in your Jewish journey?", options:["Just curious / exploring","Culturally Jewish, not very observant","Somewhat observant","Observant and want to go deeper","Orthodox / deeply learned"] },
  { id:'q2', question:"What draws you to learning Torah?", options:["I want to understand my heritage","I'm becoming more observant","I want to connect with my community","I'm seeking spiritual meaning","I already learn regularly and want to go deeper"] },
  { id:'q3', question:"Which area interests you most right now?", options:["Jewish history and identity","Prayer and connecting to G-d","Shabbat and holidays","Torah study and text","Jewish ethics and philosophy"] },
  { id:'q4', question:"How do you learn best?", options:["Reading at my own pace","Short daily lessons (5–10 min)","Audio and video content","Live classes with a teacher","Discussion with others"] },
  { id:'q5', question:"How much time can you dedicate daily?", options:["5 minutes","10–15 minutes","30 minutes","1 hour or more"] },
];

const SIDDUR_DATA = {
  daily: [
    { id:'shacharit', name:'Shacharit', hebrew:'שַׁחֲרִית', description:'Morning Prayer', lines:[
      { hebrew:'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם', transliteration:"Modeh ani lefanecha Melech chai v'kayam", english:'I give thanks before You, living and eternal King' },
      { hebrew:'שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה', transliteration:"shehechezarta bi nishmati b'chemla", english:'who has returned my soul to me with compassion' },
      { hebrew:'רַבָּה אֱמוּנָתֶךָ', transliteration:'rabbah emunatecha', english:'How great is Your faithfulness' },
    ]},
    { id:'shema', name:'Shema Yisrael', hebrew:'שְׁמַע יִשְׂרָאֵל', description:'Declaration of Faith', lines:[
      { hebrew:'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ', transliteration:'Shema Yisrael Adonai Eloheinu', english:'Hear O Israel, the L-rd is our G-d' },
      { hebrew:'יְהוָה אֶחָד', transliteration:'Adonai Echad', english:'The L-rd is One' },
      { hebrew:'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד', transliteration:"Baruch shem k'vod malchuto l'olam va'ed", english:'Blessed is the name of His glorious kingdom forever and ever' },
    ]},
    { id:'mincha', name:'Mincha', hebrew:'מִנְחָה', description:'Afternoon Prayer', lines:[
      { hebrew:'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ', transliteration:"Ashrei yoshvei veitecha", english:'Happy are those who dwell in Your house' },
      { hebrew:'עוֹד יְהַלְלוּךָ סֶּלָה', transliteration:"od y'hal'lucha selah", english:'they will praise You forever, Selah' },
      { hebrew:'אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ', transliteration:"Ashrei ha'am shekachah lo", english:'Happy is the people for whom this is so' },
    ]},
    { id:'maariv', name:'Maariv', hebrew:'מַעֲרִיב', description:'Evening Prayer', lines:[
      { hebrew:'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם', transliteration:"Baruch Atah Adonai Eloheinu Melech haolam", english:'Blessed are You, L-rd our G-d, King of the universe' },
      { hebrew:'אֲשֶׁר בִּדְבָרוֹ מַעֲרִיב עֲרָבִים', transliteration:"asher bidvaro ma'ariv aravim", english:'who by His word brings on evenings' },
      { hebrew:'בְּחָכְמָה פּוֹתֵחַ שְׁעָרִים', transliteration:"b'chochmah pote'ach she'arim", english:'in wisdom opens the gates' },
    ]},
  ],
  shabbat: [
    { id:'kabbalat_shabbat', name:'Kabbalat Shabbat', hebrew:'קַבָּלַת שַׁבָּת', description:'Welcoming Shabbat', lines:[
      { hebrew:'לְכָה דוֹדִי לִקְרַאת כַּלָּה', transliteration:"L'cha dodi likrat kallah", english:'Come my beloved, to meet the bride' },
      { hebrew:'פְּנֵי שַׁבָּת נְקַבְּלָה', transliteration:"p'nei Shabbat nekabelah", english:'let us welcome the Shabbat presence' },
      { hebrew:'שָׁמוֹר וְזָכוֹר בְּדִבּוּר אֶחָד', transliteration:"Shamor v'zachor b'dibur echad", english:'Observe and remember in one utterance' },
    ]},
    { id:'shabbat_shacharit', name:'Shabbat Shacharit', hebrew:'שַׁחֲרִית שֶׁל שַׁבָּת', description:'Shabbat Morning Prayer', lines:[
      { hebrew:'אֵל אָדוֹן עַל כָּל הַמַּעֲשִׂים', transliteration:"El Adon al kol hama'asim", english:"G-d is Master over all His works" },
      { hebrew:'בָּרוּךְ וּמְבֹרָךְ בְּפִי כָּל נְשָׁמָה', transliteration:"baruch um'vorach b'fi kol neshama", english:'blessed and praised by the mouth of every soul' },
    ]},
    { id:'havdalah', name:'Havdalah', hebrew:'הַבְדָּלָה', description:'Ending Shabbat', lines:[
      { hebrew:'הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל', transliteration:"HaMavdil bein kodesh l'chol", english:'Who separates between holy and secular' },
      { hebrew:'בֵּין אוֹר לְחֹשֶׁךְ', transliteration:"bein or l'choshech", english:'between light and darkness' },
      { hebrew:'בֵּין יִשְׂרָאֵל לָעַמִּים', transliteration:"bein Yisrael la'amim", english:'between Israel and the nations' },
    ]},
  ],
  holidays: [
    { id:'musaf', name:'Musaf', hebrew:'מוּסָף', description:'Additional Prayer Service', lines:[
      { hebrew:'תִּקַּנְתָּ שַׁבָּת רָצִיתָ קָרְבְּנוֹתֶיהָ', transliteration:"Tikanta Shabbat ratzita korb'noteha", english:'You established Shabbat, desired its offerings' },
      { hebrew:'צִוִּיתָ פֵרוּשֶׁיהָ עִם סִדּוּרֵי נְסָכֶיהָ', transliteration:"tzivita perusheiha im siddurei nesacheiha", english:'commanded its portions with its arrangements of libations' },
    ]},
    { id:'holiday_prayers', name:'Holiday Prayers', hebrew:'תְּפִלַּת יוֹם טוֹב', description:'Yom Tov Prayers', lines:[
      { hebrew:'יַעֲלֶה וְיָבֹא', transliteration:"Ya'aleh v'yavo", english:'May there rise and come' },
      { hebrew:'וְיַגִּיעַ וְיֵרָאֶה וְיֵרָצֶה', transliteration:"v'yagia v'yera'eh v'yeratzeh", english:'and arrive and be seen and be accepted' },
      { hebrew:'וְיִשָּׁמַע וְיִפָּקֵד וְיִזָּכֵר', transliteration:"v'yishama v'yipaked v'yizacher", english:'and be heard and counted and remembered' },
    ]},
  ],
};

const COMMUNITY_POSTS = [
  { id:1, initials:'RY', name:'Rabbi Yosef', badge:'Rabbi', time:'2 hours ago', text:"Beautiful thought for this week's parasha: the Torah begins with the letter Bet (ב) not Aleph (א) to teach us that the world was created for the sake of blessing (bracha). Everything begins with blessing.", likes:24 },
  { id:2, initials:'MG', name:'Miriam G.', badge:'', time:'5 hours ago', text:'First time doing Havdalah on my own last night. I cried. Something about the spices and the candle flame... I finally understood why people say Shabbat is a taste of the next world.', likes:41 },
  { id:3, initials:'DK', name:'David K.', badge:'', time:'Yesterday', text:"I'm just starting out and feeling overwhelmed by how much there is to learn. Any advice on where to focus first? The lessons here are incredible but I want to know what to prioritize.", likes:18 },
  { id:4, initials:'SL', name:'Sara L.', badge:'Educator', time:'Yesterday', text:"Responding to David: Start with Shabbat. Just one Shabbat dinner a week, with candles, kiddush, and a real meal with family. Everything else grows from there. Don't try to do it all at once.", likes:33 },
  { id:5, initials:'AH', name:'Avi H.', badge:'', time:'2 days ago', text:"The Modeh Ani prayer changed my mornings completely. Saying those words before I even check my phone — it reorients everything. Highly recommend starting there.", likes:29 },
];

const DAILY_INSIGHTS = [
  { text:"A person is obligated to say: the world was created for my sake.", source:"Talmud, Sanhedrin 4:5" },
  { text:"Who is wise? One who learns from every person.", source:"Pirkei Avot 4:1" },
  { text:"In every generation, a person is obligated to see himself as if he personally left Egypt.", source:"Passover Haggadah" },
  { text:"The seal of G-d is truth.", source:"Talmud, Shabbat 55a" },
  { text:"A person should always be as soft as a reed and not as hard as a cedar.", source:"Talmud, Ta'anit 20a" },
  { text:"Do not judge your fellow until you have reached his place.", source:"Pirkei Avot 2:4" },
  { text:"It is not upon you to finish the work, nor are you free to desist from it.", source:"Pirkei Avot 2:16" },
];

function getPathFromAnswers(a) {
  const q1 = a[0]??0;
  if(q1<=1) return {name:"The Seeker's Path",weeks:8,description:"A gentle introduction to Jewish heritage, designed for those curious and open to discovery."};
  if(q1===2) return {name:"The Returner's Path",weeks:6,description:"A meaningful journey back to your roots, bridging modern life with timeless Jewish wisdom."};
  return {name:"The Scholar's Path",weeks:4,description:"An immersive deep-dive into Torah study and halacha for the dedicated learner."};
}
function getTodayPrayer(){const h=new Date().getHours();if(h<12)return{name:'Shacharit',time:'Morning Prayer',id:'shacharit'};if(h<17)return{name:'Mincha',time:'Afternoon Prayer',id:'mincha'};return{name:'Maariv',time:'Evening Prayer',id:'maariv'};}
function getDailyInsight(){return DAILY_INSIGHTS[new Date().getDay()%DAILY_INSIGHTS.length];}

// ── SEARCH ────────────────────────────────────────────────
function SearchOverlay({ onClose, onOpenLesson, onOpenPrayer }) {
  const [q, setQ] = useState('');
  const allLessons = LEARNING_PATH.flatMap(u => u.lessons.map(l => ({...l, unitTitle:u.title})));
  const allPrayers = [...SIDDUR_DATA.daily, ...SIDDUR_DATA.shabbat, ...SIDDUR_DATA.holidays];
  const results = q.length < 2 ? [] : [
    ...allLessons.filter(l => l.title.toLowerCase().includes(q.toLowerCase())).map(l => ({type:'lesson', item:l})),
    ...allPrayers.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase())).map(p => ({type:'prayer', item:p})),
  ];
  return (
    <div className="search-overlay fade-in">
      <div className="search-header">
        <input className="search-input" placeholder="Search lessons, prayers..." autoFocus value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="btn-back-text" onClick={onClose}>Cancel</button>
      </div>
      <div className="search-results">
        {q.length < 2 && <div className="search-empty" style={{paddingTop:60}}><div style={{fontSize:32,marginBottom:12}}>🔍</div>Search lessons and prayers</div>}
        {q.length >= 2 && results.length === 0 && <div className="search-empty">No results for "{q}"</div>}
        {results.map((r, i) => (
          <button key={i} className="search-result-item" style={{width:'100%',textAlign:'left'}} onClick={() => { if(r.type==='lesson'){const unit=LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===r.item.id));onOpenLesson(r.item,unit);}else{onOpenPrayer(r.item);}onClose();}}>
            <span className="search-result-icon">{r.type==='lesson'?r.item.icon:'📖'}</span>
            <div><div className="search-result-title">{r.item.name||r.item.title}</div><div className="search-result-sub">{r.type==='lesson'?r.item.unitTitle:'Siddur'}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────
const TABS = [
  {id:'home',icon:'🏠',label:'Home'},
  {id:'learn',icon:'📚',label:'Learn'},
  {id:'live',icon:'🔴',label:'Live'},
  {id:'siddur',icon:'📖',label:'Siddur'},
  {id:'community',icon:'💬',label:'Community'},
  {id:'profile',icon:'👤',label:'Profile'},
];
function BottomNav({activeTab,onChange}){
  return(
    <nav className="bottom-nav">
      {TABS.map(t=>(
        <button key={t.id} className={`nav-tab${activeTab===t.id?' nav-tab-active':''}`} onClick={()=>onChange(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
          {activeTab===t.id && <span className="nav-active-dot"/>}
        </button>
      ))}
    </nav>
  );
}

// ── ONBOARDING ────────────────────────────────────────────
function StepDots({total, current}){
  return(
    <div className="onboarding-step-dots">
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} className={`step-dot${i===current?' step-dot-active':i<current?' step-dot-done':''}`}/>
      ))}
    </div>
  );
}

function Welcome({onBegin, onSkip}){
  const FEATURES = [
    {icon:'📚', title:'25 Structured Lessons', text:'Five units covering the foundations of Jewish faith, Shabbat, prayer, holidays, and Torah study'},
    {icon:'📖', title:'Digital Siddur', text:'Daily prayers with Hebrew, transliteration, and English — always in your pocket'},
    {icon:'🔴', title:'Live Shiurim', text:'Learn directly from rabbis in live sessions and recorded classes'},
    {icon:'💬', title:'Community', text:'Ask questions and share insights with learners and rabbis worldwide'},
  ];
  return(
    <div className="screen-full onboarding-screen fade-in">
      <div className="onboarding-content">
        <div className="logo-area">
          <div className="logo-star">✡️</div>
          <h1 className="logo-title">Journey to HaShem</h1>
          <p className="logo-tagline">Find your path home</p>
        </div>
        <p className="welcome-subtext">Built by someone on his own journey —<br/>for everyone still finding theirs.</p>
        <div className="welcome-features">
          {FEATURES.map((f,i)=>(
            <div key={i} className="welcome-feature" style={{animationDelay:`${0.1+i*0.07}s`}}>
              <span className="welcome-feature-icon">{f.icon}</span>
              <div>
                <div className="welcome-feature-title">{f.title}</div>
                <div className="welcome-feature-text">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary btn-large" onClick={onBegin}>Begin My Journey →</button>
        <div className="welcome-divider">
          <div className="welcome-divider-line"/>
          <span className="welcome-divider-text">Already have a path?</span>
          <div className="welcome-divider-line"/>
        </div>
        <button className="welcome-skip" onClick={onSkip}>Skip intro and go straight to learning</button>
      </div>
    </div>
  );
}

function Quiz({onComplete}){
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [selected,setSelected]=useState(null);
  const [animDir,setAnimDir]=useState('right');
  const q=QUIZ_QUESTIONS[current];
  const isLast=current===QUIZ_QUESTIONS.length-1;
  const pct=((current)/QUIZ_QUESTIONS.length)*100;

  const handleNext=()=>{
    if(selected===null)return;
    const newAns=[...answers,selected];
    setAnimDir('right');
    if(isLast){onComplete(newAns);}
    else{setAnswers(newAns);setCurrent(c=>c+1);setSelected(null);}
  };

  const handleBack=()=>{
    if(current===0)return;
    setAnimDir('left');
    setAnswers(a=>a.slice(0,-1));
    setCurrent(c=>c-1);
    setSelected(answers[current-1]??null);
  };

  return(
    <div className="screen-full onboarding-screen fade-in">
      <div className="onboarding-content quiz-content">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
          <StepDots total={QUIZ_QUESTIONS.length} current={current}/>
          <span className="quiz-step">{current+1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="quiz-progress-track"><div className="quiz-progress-fill" style={{width:`${pct}%`}}/></div>
        <h2 className="quiz-question" key={current} style={{animation:'fadeIn 0.3s ease both'}}>{q.question}</h2>
        <div className="quiz-options">
          {q.options.map((opt,i)=>(
            <button key={i} className={`quiz-option${selected===i?' quiz-option-selected':''}`} onClick={()=>setSelected(i)}>
              <div className="quiz-option-inner">
                <span>{opt}</span>
                <span className="quiz-option-check">{selected===i?'✓':''}</span>
              </div>
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:10,width:'100%'}}>
          {current>0&&<button className="btn-secondary" style={{flex:'0 0 auto'}} onClick={handleBack}>← Back</button>}
          <button className={`btn-primary${selected===null?' btn-disabled':''}`} onClick={handleNext} disabled={selected===null} style={{flex:1}}>
            {isLast?'See My Path →':'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PathReady({path, answers, onStart}){
  if(!path)return null;
  const firstUnit = LEARNING_PATH[0];
  const previewLessons = firstUnit.lessons.slice(0,3);
  const timeLabel = answers[4]===0?'5 min/day':answers[4]===1?'10–15 min/day':answers[4]===2?'30 min/day':'1+ hr/day';
  return(
    <div className="screen-full onboarding-screen fade-in">
      <div className="onboarding-content">
        <div className="path-ready-icon">✨</div>
        <p className="path-ready-label">Your personalized path</p>
        <h2 className="path-ready-name">{path.name}</h2>
        <p className="path-ready-description">{path.description}</p>
        <div className="path-ready-meta">
          <div className="path-meta-item"><span className="path-meta-value">{path.weeks}</span><span className="path-meta-label">weeks</span></div>
          <div className="path-meta-divider"/>
          <div className="path-meta-item"><span className="path-meta-value">25</span><span className="path-meta-label">lessons</span></div>
          <div className="path-meta-divider"/>
          <div className="path-meta-item"><span className="path-meta-value">{timeLabel}</span><span className="path-meta-label">your pace</span></div>
        </div>
        <div className="path-preview">
          <div className="path-preview-title">You'll start with</div>
          {previewLessons.map((l,i)=>(
            <div key={l.id} className="path-preview-lesson">
              <span className="path-preview-icon">{l.icon}</span>
              <span className={i===0?'path-preview-name':'path-preview-locked'}>{l.title}</span>
              {i===0&&<span style={{marginLeft:'auto',fontSize:10,color:'var(--gold)',fontWeight:700,background:'rgba(201,168,76,0.12)',padding:'2px 8px',borderRadius:20}}>FIRST</span>}
            </div>
          ))}
        </div>
        <button className="btn-primary btn-large" onClick={onStart}>Start My Journey →</button>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────
function HomeTab({state,onOpenLesson,onOpenPrayer,onGoTab,onSearch,onOpenPitch}){
  const {completedLessons,currentStreak,totalXP,userName}=state;
  const [showReminder,setShowReminder]=useState(true);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const curLesson=curIdx>=0?allLessons[curIdx]:null;
  const curUnit=curLesson?LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===curLesson.id)):null;
  const todayPrayer=getTodayPrayer();
  const insight=getDailyInsight();
  const shabbat=isShabbat();
  const parasha=getParasha();
  const greeting=(()=>{const h=new Date().getHours();if(h<12)return'Good morning';if(h<17)return'Good afternoon';return'Good evening';})();
  const showStreakReminder=currentStreak>0&&showReminder&&!shabbat;

  return(
    <div className="tab-screen fade-in">
      <div className="home-hero">
        <div className="home-top-row">
          <div>
            <p className="home-greeting">{greeting}{userName?`, ${userName}`:''}</p>
            <h2 className="home-name">{shabbat?'Shabbat Shalom ✡️':'Journey to HaShem'}</h2>
            <p className="home-date">{getHebrewDate()} · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
            <button className="home-search-btn" onClick={()=>shareApp()} title="Share app">🔗</button>
            <button className="home-search-btn" onClick={onSearch} title="Search">🔍</button>
          </div>
        </div>
        <div className="home-streak-bar">
          <span className="home-streak-icon">🔥</span>
          <div className="home-streak-text">
            <div className="home-streak-num">{currentStreak} day{currentStreak!==1?'s':''}</div>
            <div className="home-streak-label">learning streak · {totalXP} XP total</div>
          </div>
        </div>
      </div>

      {shabbat&&(
        <div className="shabbat-banner">
          <span className="shabbat-banner-icon">🕯️</span>
          <div className="shabbat-banner-text">
            <div className="shabbat-banner-title">Shabbat Shalom</div>
            <div className="shabbat-banner-sub">Shabbat is a day of rest — come back after nightfall to continue learning.</div>
          </div>
        </div>
      )}

      {showStreakReminder&&(
        <div className="streak-reminder">
          <span style={{fontSize:18}}>🔔</span>
          <span className="streak-reminder-text">Don't break your {currentStreak}-day streak — complete a lesson today!</span>
          <button className="streak-reminder-close" onClick={()=>setShowReminder(false)}>×</button>
        </div>
      )}

      {!shabbat&&curLesson&&(
        <button className="home-cta" onClick={()=>onOpenLesson(curLesson,curUnit)}>
          <div>
            <div className="home-cta-label">Continue Learning</div>
            <div className="home-cta-title">{curLesson.title}</div>
          </div>
          <span className="home-cta-arrow">→</span>
        </button>
      )}

      <div className="section section-top">
        <div className="parasha-card">
          <div className="parasha-label">📜 This Week's Parasha (approx.)</div>
          <div className="parasha-name">Parashat {parasha}</div>
          <div className="parasha-detail">Approximate weekly Torah portion — verify at hebcal.com for your location.</div>
        </div>

        <div className="home-card">
          <div className="home-card-header"><span className="home-card-icon">🕍</span><span className="home-card-title">Today's Prayer</span></div>
          <div className="home-prayer-time">{todayPrayer.time}</div>
          <div className="home-prayer-name">{todayPrayer.name}</div>
          <button className="home-prayer-btn" onClick={()=>{const p=SIDDUR_DATA.daily.find(x=>x.id===todayPrayer.id);if(p)onOpenPrayer(p);}}>Open in Siddur →</button>
        </div>

        <div className="home-card">
          <div className="home-card-header"><span className="home-card-icon">✨</span><span className="home-card-title">Daily Insight</span></div>
          <div className="home-insight-text">"{insight.text}"</div>
          <div className="home-insight-source">— {insight.source}</div>
        </div>

        <div className="home-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}} onClick={()=>onGoTab('community')}>
          <div>
            <div className="home-card-title" style={{fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:4}}>💬 Community</div>
            <div style={{fontSize:14,color:'var(--text-body)'}}>5 new posts today</div>
            <div style={{fontSize:12,color:'var(--text-dim)',marginTop:2}}>Discussing Parashat {parasha}</div>
          </div>
          <span style={{color:'var(--text-dim)',fontSize:22}}>›</span>
        </div>

        <button className="pitch-home-btn" onClick={onOpenPitch}>
          <span className="pitch-home-btn-icon">🕍</span>
          <div className="pitch-home-btn-text">
            <div className="pitch-home-btn-title">Are you a Rabbi or Educator?</div>
            <div className="pitch-home-btn-sub">Partner with Journey to HaShem →</div>
          </div>
        </button>
      </div>
    </div>
  );
}


// ── LEARN TAB ─────────────────────────────────────────────
const NODE_OFFSETS=[0,1,0,-1,0];
function PathMap({completedLessons,bookmarks,onLessonTap}){
  const completedSet=new Set(completedLessons);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedSet.has(l.id));
  const curId=curIdx>=0?allLessons[curIdx].id:null;
  const getState=id=>completedSet.has(id)?'completed':id===curId?'current':'locked';
  return(
    <div className="path-map">
      {LEARNING_PATH.map(unit=>(
        <div key={unit.id} className="path-unit">
          <div className="unit-divider">
            <div className="unit-divider-line"/>
            <div className="unit-divider-badge">
              <span className="unit-badge-level">{unit.level}</span>
              <span className="unit-badge-title">{unit.title}</span>
            </div>
            <div className="unit-divider-line"/>
          </div>
          <div className="unit-nodes">
            <div className="unit-nodes-track"/>
            {unit.lessons.map((lesson,i)=>{
              const st=getState(lesson.id);
              const shift=NODE_OFFSETS[i]*56;
              const isBookmarked=bookmarks&&bookmarks.includes(lesson.id);
              return(
                <div key={lesson.id} className="node-row">
                  <div className="node-col" style={{transform:`translateX(${shift}px)`}}>
                    <button className={`lesson-node node-${st}`} onClick={()=>st!=='locked'&&onLessonTap(lesson,unit)} disabled={st==='locked'}>
                      <span className="node-icon">{lesson.icon}</span>
                      {st==='completed'&&<span className="node-check">✓</span>}
                      {isBookmarked&&st!=='completed'&&<span className="node-bookmark">🔖</span>}
                    </button>
                    <span className={`node-label label-${st}`}>{lesson.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
function LearnTab({state,onOpenLesson}){
  const {completedLessons,currentStreak,dailyLessonsCompleted,totalXP,pathName,bookmarks}=state;
  const DAILY_GOAL=3;
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const curLesson=curIdx>=0?allLessons[curIdx]:null;
  const curUnit=curLesson?LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===curLesson.id)):null;
  const dailyPct=Math.min((dailyLessonsCompleted/DAILY_GOAL)*100,100);
  return(
    <div className="tab-screen learn-tab">
      <div className="learn-header">
        <div className="learn-header-top">
          <div className="streak-counter"><span className="streak-icon">🔥</span><span className="streak-number">{currentStreak} day{currentStreak!==1?'s':''}</span></div>
          <div className="xp-counter"><span className="xp-icon">⭐</span><span className="xp-number">{totalXP} XP</span></div>
        </div>
        <p className="daily-goal-text">{dailyLessonsCompleted}/{DAILY_GOAL} lessons today</p>
        <div className="daily-goal-bar"><div className="daily-goal-fill" style={{width:`${dailyPct}%`}}/></div>
      </div>
      {curLesson?(
        <div className="section section-top">
          <h3 className="section-title">Continue Your Path</h3>
          <button className="continue-card" onClick={()=>onOpenLesson(curLesson,curUnit)}>
            <div className="continue-card-content">
              <p className="continue-unit">{curUnit?.title}</p>
              <p className="continue-lesson">{curLesson.title}</p>
            </div>
            <span className="btn-continue">Continue →</span>
          </button>
        </div>
      ):(
        <div className="section section-top">
          <div className="all-complete-banner"><span>🏆</span><p>You've completed all lessons!</p></div>
        </div>
      )}
      <div className="section">
        <h3 className="section-title">Your Learning Path</h3>
        <p className="section-subtitle">{pathName}</p>
        <PathMap completedLessons={completedLessons} bookmarks={bookmarks} onLessonTap={onOpenLesson}/>
      </div>
    </div>
  );
}

// ── EXERCISE COMPONENT ────────────────────────────────────
function Exercise({exercise}){
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  // Reset when exercise changes (quiz multi-slide)
  useEffect(()=>{ setSelected(null); setAnswered(false); },[exercise.question]);
  const isCorrect=selected===exercise.answer;
  return(
    <div className="exercise-card">
      <div className="exercise-label">✏️ Quick Check</div>
      <div className="exercise-question">{exercise.question}</div>
      <div className="exercise-options">
        {exercise.options.map((opt,i)=>{
          let cls='exercise-option';
          if(answered){
            if(i===exercise.answer)cls+=' correct disabled';
            else if(i===selected)cls+=' wrong disabled';
            else cls+=' disabled';
          }
          return(
            <button key={i} className={cls} onClick={()=>{if(!answered){setSelected(i);setAnswered(true);}}}>
              {answered&&i===exercise.answer?'✓ ':answered&&i===selected&&!isCorrect?'✗ ':''}{opt}
            </button>
          );
        })}
      </div>
      {answered&&(
        <div className={`exercise-feedback${isCorrect?' correct':' wrong'}`}>
          {isCorrect?'Correct! ':'Not quite — '}{exercise.explanation}
        </div>
      )}
    </div>
  );
}

// ── AUDIO DATA ────────────────────────────────────────────
const RABBI_VOICES = {
  'u1l1': { rabbi:'Rabbi Moshe Cohen', title:'Who is HaShem?', duration:'8:24', emoji:'👨‍🏫' },
  'u1l2': { rabbi:'Rabbi Yosef Levi',  title:'Understanding the Torah', duration:'11:02', emoji:'📜' },
  'u1l3': { rabbi:'Rabbi David Shapiro',title:'Am Yisrael — Our People', duration:'9:45', emoji:'✡️' },
  'u1l4': { rabbi:'Rabbi Avi Bergman', title:'The Meaning of Mitzvot', duration:'7:18', emoji:'⭐' },
  'u2l1': { rabbi:'Rabbi Moshe Cohen', title:'Shabbat — The Day of Rest', duration:'13:30', emoji:'🕯️' },
  'u2l2': { rabbi:'Rabbi Yosef Levi',  title:'Welcoming the Shabbat Queen', duration:'10:15', emoji:'✨' },
  'u3l1': { rabbi:'Rabbi David Shapiro',title:'Why We Pray', duration:'12:00', emoji:'🙏' },
  'u3l3': { rabbi:'Rabbi Avi Bergman', title:'The Morning Prayer — Shacharit', duration:'15:45', emoji:'🌅' },
};

const WAVEFORM_HEIGHTS = [30,55,40,70,45,85,60,40,75,50,65,35,80,45,60,70,40,55,85,45,65,35,75,50,60,40,70,55,45,80];

function AudioPlayer({lessonId, lessonTitle}){
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = React.useRef(null);
  const voice = RABBI_VOICES[lessonId];
  const totalSecs = voice ? parseInt(voice.duration.split(':')[0])*60+parseInt(voice.duration.split(':')[1]) : 480;

  useEffect(()=>{
    if(playing){
      intervalRef.current = setInterval(()=>{
        setElapsed(e=>{
          if(e>=totalSecs){setPlaying(false);clearInterval(intervalRef.current);return totalSecs;}
          return e+1;
        });
      },1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return()=>clearInterval(intervalRef.current);
  },[playing,totalSecs]);

  useEffect(()=>{setProgress((elapsed/totalSecs)*100);},[elapsed,totalSecs]);

  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const playedBars = Math.floor((elapsed/totalSecs)*WAVEFORM_HEIGHTS.length);

  return(
    <div className="audio-player">
      <div className="audio-player-top">
        <div className="audio-rabbi-avatar">{voice?.emoji||'🎙️'}</div>
        <div className="audio-rabbi-info">
          <div className="audio-rabbi-name">{voice?.rabbi||'Rabbi Moshe Cohen'}</div>
          <div className="audio-rabbi-title">Featured Rabbi · Journey to HaShem</div>
        </div>
        <span className="audio-coming-soon-tag">AUDIO PREVIEW</span>
      </div>
      <div className="audio-track-title">"{voice?.title||lessonTitle}" — Rabbi Commentary</div>
      <div className="audio-waveform">
        {WAVEFORM_HEIGHTS.map((h,i)=>(
          <div key={i} className={`audio-bar${i<playedBars?' played':i===playedBars&&playing?' active':''}`}
            style={{height:`${playing&&i===playedBars?h*(0.7+Math.sin(Date.now()/200+i)*0.3):h}%`}}/>
        ))}
      </div>
      <div className="audio-controls">
        <button className="audio-skip-btn" onClick={()=>setElapsed(e=>Math.max(0,e-15))}>⏮ 15s</button>
        <button className={`audio-play-btn${playing?' playing':''}`} onClick={()=>setPlaying(p=>!p)}>
          {playing?'⏸':'▶'}
        </button>
        <button className="audio-skip-btn" onClick={()=>setElapsed(e=>Math.min(totalSecs,e+15))}>15s ⏭</button>
        <div className="audio-progress-wrap">
          <div className="audio-progress-track" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setElapsed(Math.floor(((e.clientX-r.left)/r.width)*totalSecs));}}>
            <div className="audio-progress-fill" style={{width:`${progress}%`}}/>
          </div>
          <div className="audio-time-row">
            <span className="audio-time">{fmt(elapsed)}</span>
            <span className="audio-time">{voice?.duration||'8:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LESSON SCREEN ─────────────────────────────────────────
function LessonScreen({lesson,unit,onClose,onComplete,isBookmarked,onToggleBookmark}){
  const [step,setStep]=useState(0);
  const [showAudio,setShowAudio]=useState(false);
  const contentRef=React.useRef(null);
  const slides=lesson.slides||[];
  const STEPS=slides.length||1;
  const isLast=step===STEPS-1;
  const slide=slides[step]||{};
  const hasAudio=!!RABBI_VOICES[lesson.id];

  // Scroll to top on slide change
  useEffect(()=>{
    if(contentRef.current) contentRef.current.scrollTop=0;
  },[step]);

  return(
    <div className="screen-full lesson-screen fade-in">
      <div className="lesson-header">
        <button className="btn-icon" onClick={onClose}>✕</button>
        <div className="lesson-header-info">
          <p className="lesson-header-unit">{unit?.title}</p>
          <p className="lesson-header-title">{lesson.title}</p>
        </div>
        <div style={{display:'flex',gap:6}}>
          {hasAudio&&<button className={`lesson-bookmark-btn${showAudio?' bookmarked':''}`} onClick={()=>setShowAudio(a=>!a)} title="Rabbi Audio">🎙️</button>}
          <button className={`lesson-bookmark-btn${isBookmarked?' bookmarked':''}`} onClick={onToggleBookmark}>{isBookmarked?'🔖':'🏷️'}</button>
        </div>
      </div>
      <div className="lesson-progress-bar"><div className="lesson-progress-fill" style={{width:`${((step+1)/STEPS)*100}%`}}/></div>
      <div className="lesson-content" ref={contentRef}>
        <div className="lesson-slide" key={step}>
          {slide.icon&&<div className="lesson-slide-icon">{slide.icon}</div>}
          {slide.title&&<h2 className="lesson-slide-title">{slide.title}</h2>}
          {slide.body&&<div className="lesson-slide-body" dangerouslySetInnerHTML={{__html:slide.body}}/>}
          {slide.hebrew&&(
            <div className="lesson-hebrew-block">
              <div className="lesson-hebrew">{slide.hebrew}</div>
              {slide.transliteration&&<div className="lesson-transliteration">{slide.transliteration}</div>}
              {slide.translation&&<div className="lesson-translation">{slide.translation}</div>}
            </div>
          )}
          {slide.concept&&(
            <div className="lesson-key-concept">
              <div className="lesson-key-label">Key Concept</div>
              <div className="lesson-key-text">{slide.concept}</div>
            </div>
          )}
          {slide.exercise&&<Exercise exercise={slide.exercise}/>}
          {slide.source&&<div className="lesson-source">Source: {slide.source}</div>}
          {hasAudio&&step===0&&showAudio&&(
            <AudioPlayer lessonId={lesson.id} lessonTitle={lesson.title}/>
          )}
          {hasAudio&&step===0&&!showAudio&&(
            <button onClick={()=>setShowAudio(true)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'var(--radius-lg)',padding:'12px 16px',textAlign:'left',transition:'all 0.2s'}}>
              <span style={{fontSize:22}}>🎙️</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text-body)'}}>Rabbi Commentary Available</div>
                <div style={{fontSize:11,color:'var(--text-dim)',marginTop:2}}>{RABBI_VOICES[lesson.id]?.rabbi} · {RABBI_VOICES[lesson.id]?.duration}</div>
              </div>
              <span style={{fontSize:12,color:'var(--gold)',fontWeight:600}}>Listen →</span>
            </button>
          )}
        </div>
      </div>
      <div className="lesson-nav">
        <button className="btn-secondary" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Back</button>
        {isLast
          ?<button className="btn-primary" onClick={onComplete}>Complete ✓</button>
          :<button className="btn-primary" onClick={()=>setStep(s=>s+1)}>Next →</button>
        }
      </div>
    </div>
  );
}

// ── CONGRATS ──────────────────────────────────────────────
function CongratsScreen({lesson,xpEarned,streak,newBadges,totalXP,replay,onContinue}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(t);},[]);
  const level=getLevel(totalXP);
  return(
    <div className="screen-full congrats-screen">
      <div className={`congrats-content${visible?' congrats-visible':''}`}>
        <div className="congrats-star">{replay?'📖':'⭐'}</div>
        <h2 className="congrats-title">{replay?'Lesson Reviewed!':'Lesson Complete!'}</h2>
        <p className="congrats-lesson-name">{lesson.title}</p>
        {replay?(
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--radius-lg)',padding:'16px 24px',textAlign:'center'}}>
            <div style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.6}}>You already completed this lesson — no XP or streak credit for replays. Reviewing is always encouraged.</div>
          </div>
        ):(
          <div className="congrats-rewards">
            <div className="reward-item"><span className="reward-value">+{xpEarned}</span><span className="reward-label">XP earned</span></div>
            <div className="reward-divider"/>
            <div className="reward-item"><span className="reward-value">🔥 {streak}</span><span className="reward-label">Day streak</span></div>
            <div className="reward-divider"/>
            <div className="reward-item"><span className="reward-value" style={{fontSize:18}}>{level.name}</span><span className="reward-label">Your level</span></div>
          </div>
        )}
        {!replay&&newBadges.length>0&&(
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.8px',fontWeight:700,marginBottom:8}}>🏅 Badge{newBadges.length>1?'s':''} Unlocked!</div>
            <div className="congrats-badges">
              {newBadges.map(b=>(
                <div key={b.id} className="congrats-badge-pill">
                  <span className="congrats-badge-pill-icon">{b.icon}</span>
                  <span className="congrats-badge-pill-name">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="congrats-message">{replay?'Keep reviewing to reinforce your learning.':'Keep going — one lesson at a time.'}</p>
        <button className="btn-primary btn-large" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

// ── LIVE TAB ──────────────────────────────────────────────
const LIVE_NOW=[{id:1,rabbi:'Rabbi Moshe Cohen',topic:'Understanding Parashat Hashavua',viewers:'127 watching'}];
// UPCOMING sessions — times are relative to the current week so they never become stale
function getUpcomingSessions() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun ... 6=Sat
  // Find the next occurrence of each weekday (Sun=0, Mon=1, ... Sat=6)
  const nextWeekday = (target) => {
    const diff = (target - dayOfWeek + 7) % 7 || 7; // 0 → next week same day
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    return d;
  };
  const fmt = (d) => {
    const diff = Math.round((d - now) / 86400000);
    const dayLabel = diff === 1 ? 'Tomorrow'
      : diff === 0 ? 'Today'
      : d.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayLabel}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };
  return [
    { id:1, rabbi:'Rabbi Yosef Levi',   topic:'Introduction to Kabbalah',          time: fmt(nextWeekday(0)), hour:20 }, // Sunday 8PM
    { id:2, rabbi:'Rabbi Avi Bergman',  topic:'Halacha in the Modern World',       time: fmt(nextWeekday(3)), hour:19 }, // Wednesday 7PM
    { id:3, rabbi:'Rabbi David Shapiro',topic:"Pirkei Avot — Ethics of the Fathers", time: fmt(nextWeekday(4)), hour:21 }, // Thursday 9PM
  ];
}
const UPCOMING = getUpcomingSessions();
const RECORDINGS=[
  {id:1,rabbi:'Rabbi Moshe Cohen',topic:'The Meaning of Teshuvah',views:'2.4k views'},
  {id:2,rabbi:'Rabbi Yosef Levi',topic:"Shabbat — A Day Outside of Time",views:'1.8k views'},
  {id:3,rabbi:'Rabbi Avi Bergman',topic:'Building a Jewish Home',views:'3.1k views'},
];
function LiveTab(){
  const [miniPlayer,setMiniPlayer]=useState(null);
  const [miniProgress,setMiniProgress]=useState(22);
  const [remindModal,setRemindModal]=useState(null);
  const [reminded,setReminded]=useState({});
  const [remindTime,setRemindTime]=useState(0);
  const intervalRef=React.useRef(null);

  const startMini=(title,rabbi)=>{
    setMiniPlayer({title,rabbi,playing:true});
    clearInterval(intervalRef.current);
    intervalRef.current=setInterval(()=>setMiniProgress(p=>p>=100?0:p+0.15),100);
  };

  // Pause/resume: clear or restart the interval based on playing state
  const toggleMiniPlay=()=>{
    setMiniPlayer(p=>{
      if(!p) return p;
      const nowPlaying=!p.playing;
      if(nowPlaying){
        // Resume — restart interval from current miniProgress
        clearInterval(intervalRef.current);
        intervalRef.current=setInterval(()=>setMiniProgress(prog=>prog>=100?0:prog+0.15),100);
      } else {
        // Pause — stop the interval
        clearInterval(intervalRef.current);
      }
      return {...p,playing:nowPlaying};
    });
  };

  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  const handleRemind=(session)=>{
    setRemindModal(session);
    setRemindTime(0);
  };

  const confirmRemind=()=>{
    setReminded(r=>({...r,[remindModal.id]:true}));
    setRemindModal(null);
  };

  const VOICE_CARDS=[
    {emoji:'👨‍🏫',rabbi:'Rabbi Moshe Cohen',topic:'The Deeper Meaning of Shabbat',duration:'18:24',views:'2.4k'},
    {emoji:'📜',rabbi:'Rabbi Yosef Levi',topic:'Introduction to Jewish Prayer',duration:'22:10',views:'1.8k'},
    {emoji:'✡️',rabbi:'Rabbi David Shapiro',topic:"Pirkei Avot — Ethics of the Fathers",duration:'14:55',views:'3.1k'},
    {emoji:'🕯️',rabbi:'Rabbi Avi Bergman',topic:'Building a Jewish Home',duration:'19:30',views:'1.2k'},
  ];

  return(
    <div className="tab-screen live-tab fade-in" style={{paddingBottom:miniPlayer?140:100}}>
      <div className="tab-header"><h2 className="tab-title">Live Sessions</h2><p className="tab-subtitle">Learn directly from rabbis</p></div>

      <div style={{padding:'12px 20px 0'}}>
        <div className="live-audio-banner">
          <div className="live-pulse"/>
          <div className="live-audio-text">
            <div className="live-audio-title">Rabbi Cohen is live now</div>
            <div className="live-audio-sub">Understanding Parashat Hashavua · 127 listening</div>
          </div>
          <button className="live-tune-btn" onClick={()=>startMini('Understanding Parashat Hashavua','Rabbi Moshe Cohen')}>
            {miniPlayer?.title==='Understanding Parashat Hashavua'?'Listening ✓':'Tune In'}
          </button>
        </div>
      </div>

      <div className="section section-top">
        <h3 className="section-title">Live Now</h3>
        {LIVE_NOW.map(s=>(
          <div key={s.id} className="live-card">
            <div className="live-thumbnail"><span className="live-menorah">🕎</span><span className="live-badge">● LIVE</span></div>
            <div className="live-info"><p className="live-rabbi">{s.rabbi}</p><p className="live-topic">{s.topic}</p><p className="live-viewers">{s.viewers}</p></div>
            <button className="btn-coming-soon" disabled>Coming Soon</button>
          </div>
        ))}
      </div>

      <div className="rabbi-voices-section">
        <div className="rabbi-voices-title">🎙️ Rabbi Audio Library</div>
        {VOICE_CARDS.map((v,i)=>(
          <div key={i} className="rabbi-voice-card">
            <div className="rabbi-voice-avatar">{v.emoji}</div>
            <div className="rabbi-voice-info">
              <div className="rabbi-voice-name">{v.rabbi}</div>
              <div className="rabbi-voice-topic">{v.topic}</div>
              <div className="rabbi-voice-duration">⏱ {v.duration} · {v.views} plays</div>
            </div>
            <button className="rabbi-voice-play" onClick={()=>startMini(v.topic,v.rabbi)}>
              {miniPlayer?.title===v.topic?'⏸':'▶'}
            </button>
          </div>
        ))}
      </div>

      <div className="section section-top">
        <h3 className="section-title">Upcoming</h3>
        {UPCOMING.map(s=>(
          <div key={s.id} className="upcoming-card">
            <div className="upcoming-info"><p className="upcoming-rabbi">{s.rabbi}</p><p className="upcoming-topic">{s.topic}</p><p className="upcoming-time">{s.time}</p></div>
            {reminded[s.id]
              ? <span style={{fontSize:11,color:'var(--gold)',fontWeight:700,background:'rgba(201,168,76,0.12)',padding:'6px 12px',borderRadius:100,border:'1px solid rgba(201,168,76,0.2)'}}>✓ Set</span>
              : <button className="btn-outline" style={{opacity:1,cursor:'pointer'}} onClick={()=>handleRemind(s)}>Remind Me</button>
            }
          </div>
        ))}
      </div>

      {miniPlayer&&(
        <div className="mini-player">
          <span className="mini-player-icon">🎙️</span>
          <div className="mini-player-info">
            <div className="mini-player-title">{miniPlayer.title}</div>
            <div className="mini-player-rabbi">{miniPlayer.rabbi}</div>
            <div className="mini-player-bar"><div className="mini-player-fill" style={{width:`${miniProgress}%`}}/></div>
          </div>
          <button className="mini-player-btn" onClick={toggleMiniPlay}>
            {miniPlayer.playing?'⏸':'▶'}
          </button>
          <button className="mini-player-close" onClick={()=>{setMiniPlayer(null);clearInterval(intervalRef.current);}}>✕</button>
        </div>
      )}

      {remindModal&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setRemindModal(null);}}>
          <div className="modal-sheet">
            <div className="modal-handle"/>
            <h3 className="modal-title">Set Reminder</h3>
            <p style={{fontSize:14,color:'var(--text-dim)',marginBottom:16,lineHeight:1.6}}><strong style={{color:'var(--text-body)'}}>{remindModal.rabbi}</strong><br/>{remindModal.topic}<br/><span style={{color:'var(--gold)'}}>{remindModal.time}</span></p>
            <div className="remind-options">
              {['30 minutes before','1 hour before','Day before','Morning of'].map((opt,i)=>(
                <div key={i} className={`remind-option${remindTime===i?' selected':''}`} onClick={()=>setRemindTime(i)}>
                  <div className="remind-option-check">{remindTime===i?'✓':''}</div>
                  <span style={{fontSize:14,color:'var(--text-body)'}}>{opt}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button className="btn-secondary" style={{flex:1}} onClick={()=>setRemindModal(null)}>Cancel</button>
              <button className="btn-primary" style={{flex:2}} onClick={confirmRemind}>Set Reminder ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SIDDUR TAB ────────────────────────────────────────────
function SiddurTab({onOpenPrayer}){
  const h=new Date().getHours();
  const ctx=h<12?{greeting:'Good morning',prayer:'time for Shacharit'}:h<17?{greeting:'Good afternoon',prayer:'time for Mincha'}:{greeting:'Good evening',prayer:'time for Maariv'};
  const PCard=({p})=>(
    <button className="prayer-card" onClick={()=>onOpenPrayer(p)}>
      <div className="prayer-card-body"><p className="prayer-hebrew">{p.hebrew}</p><p className="prayer-name">{p.name}</p><p className="prayer-desc">{p.description}</p></div>
      <span className="prayer-arrow">›</span>
    </button>
  );
  return(
    <div className="tab-screen siddur-tab fade-in">
      <div className="tab-header"><h2 className="tab-title">Siddur</h2><p className="tab-subtitle">Daily Prayers</p></div>
      <div className="siddur-time-banner"><span className="time-icon">🕍</span><p className="time-text">{ctx.greeting} — {ctx.prayer}</p></div>
      <div className="section section-top"><h3 className="section-title">Daily Prayers</h3>{SIDDUR_DATA.daily.map(p=><PCard key={p.id} p={p}/>)}</div>
      <div className="section"><h3 className="section-title">Shabbat</h3>{SIDDUR_DATA.shabbat.map(p=><PCard key={p.id} p={p}/>)}</div>
      <div className="section"><h3 className="section-title">Holidays</h3>{SIDDUR_DATA.holidays.map(p=><PCard key={p.id} p={p}/>)}</div>
    </div>
  );
}

// ── PRAYER VIEW ───────────────────────────────────────────
function PrayerView({prayer,onBack}){
  return(
    <div className="screen-full prayer-screen fade-in">
      <div className="prayer-header"><button className="btn-back-text" onClick={onBack}>← Back</button></div>
      <div className="prayer-body">
        <div className="prayer-view-hebrew-title">{prayer.hebrew}</div>
        <h2 className="prayer-view-name">{prayer.name}</h2>
        <p className="prayer-view-desc">{prayer.description}</p>
        {prayer.lines&&prayer.lines.length>0&&(
          <div className="prayer-section">
            <div className="prayer-section-label">Hebrew · Transliteration · English</div>
            {prayer.lines.map((line,i)=>(
              <div key={i} className="prayer-line">
                <div className="prayer-line-hebrew">{line.hebrew}</div>
                <div className="prayer-line-transliteration">{line.transliteration}</div>
                <div className="prayer-line-english">{line.english}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── COMMUNITY TAB ─────────────────────────────────────────
function CommunityTab({state}){
  const [likes,setLikes]=useState({});
  const [showAsk,setShowAsk]=useState(false);
  const [question,setQuestion]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [activeSection,setActiveSection]=useState('feed');
  const toggleLike=id=>setLikes(prev=>({...prev,[id]:!prev[id]}));
  const handleSubmit=()=>{if(question.trim()){setSubmitted(true);setTimeout(()=>{setShowAsk(false);setQuestion('');setSubmitted(false);},1500);}};

  const leaderboard=[...LEADERBOARD].map(r=>r.me?{...r,xp:state?.totalXP||0,streak:state?.currentStreak||0}:r).sort((a,b)=>b.xp-a.xp);
  const medals=['🥇','🥈','🥉'];

  return(
    <div className="tab-screen fade-in" style={{position:'relative'}}>
      <div className="community-header">
        <div><h2 className="tab-title">Community</h2><p className="tab-subtitle">Learn and grow together</p></div>
        <button className="community-ask-btn" onClick={()=>setShowAsk(true)}>+ Ask</button>
      </div>

      {/* Section toggle */}
      <div style={{display:'flex',gap:8,padding:'14px 20px 4px'}}>
        {['feed','leaderboard'].map(s=>(
          <button key={s} onClick={()=>setActiveSection(s)} style={{padding:'7px 16px',borderRadius:100,fontSize:13,fontWeight:600,transition:'all 0.2s',background:activeSection===s?'var(--gold)':'rgba(255,255,255,0.05)',color:activeSection===s?'var(--navy)':'var(--text-dim)',border:'none'}}>
            {s==='feed'?'💬 Feed':'🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {activeSection==='feed'&&(<>
        <p className="community-section-label">Recent Discussions</p>
        {COMMUNITY_POSTS.map(post=>(
          <div key={post.id} className="community-post">
            <div className="community-post-top">
              <div className="community-avatar">{post.initials}</div>
              <div><div className="community-username">{post.name}</div><div className="community-time">{post.time}</div></div>
              {post.badge&&<div className="community-badge">{post.badge}</div>}
            </div>
            <div className="community-post-text">{post.text}</div>
            <div className="community-post-actions">
              <button className={`community-like-btn${likes[post.id]?' liked':''}`} onClick={()=>toggleLike(post.id)}>
                {likes[post.id]?'♥':'♡'} {post.likes+(likes[post.id]?1:0)}
              </button>
              <button className="community-reply-btn">↩ Reply</button>
            </div>
          </div>
        ))}
      </>)}

      {activeSection==='leaderboard'&&(
        <div style={{padding:'8px 0 24px'}}>
          <div style={{padding:'8px 20px 16px',fontSize:12,color:'var(--text-dim)'}}>Weekly XP rankings · resets every Sunday</div>
          {leaderboard.map((r,i)=>(
            <div key={r.name} className={`leaderboard-row${r.me?' me':''}`}>
              <span className={`leaderboard-rank${i===0?' gold':i===1?' silver':i===2?' bronze':''}`}>
                {i<3?medals[i]:i+1}
              </span>
              <div className="leaderboard-avatar" style={r.me?{background:'linear-gradient(135deg,#4a90d9,#7bb3f0)',color:'#fff'}:{}}>{r.initials}</div>
              <div style={{flex:1}}>
                <div className="leaderboard-name">{r.name}{r.me&&<span style={{fontSize:10,color:'var(--gold)',marginLeft:6,fontWeight:700}}>YOU</span>}</div>
                <div className="leaderboard-streak">🔥 {r.streak} day streak</div>
              </div>
              <span className="leaderboard-xp">{r.xp} XP</span>
            </div>
          ))}
          <div style={{padding:'16px 20px',fontSize:12,color:'var(--text-dim)',textAlign:'center',fontStyle:'italic'}}>
            Complete more lessons to climb the leaderboard
          </div>
        </div>
      )}

      {showAsk&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAsk(false);}}>
          <div className="modal-sheet">
            <div className="modal-handle"/>
            <h3 className="modal-title">{submitted?'Question Submitted! ✓':'Ask the Community'}</h3>
            {!submitted&&(<>
              <textarea className="modal-textarea" placeholder="Ask a question about Torah, Jewish practice, or anything on your mind..." value={question} onChange={e=>setQuestion(e.target.value)} rows={4}/>
              <div className="modal-actions">
                <button className="btn-secondary" style={{flex:1}} onClick={()=>setShowAsk(false)}>Cancel</button>
                <button className={`btn-primary${!question.trim()?' btn-disabled':''}`} style={{flex:2}} onClick={handleSubmit} disabled={!question.trim()}>Post Question</button>
              </div>
            </>)}
            {submitted&&<p style={{color:'var(--text-dim)',fontSize:14,textAlign:'center',marginTop:8}}>A rabbi or community member will respond shortly.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE TAB ───────────────────────────────────────────
const SETTINGS=['Language','Observance Level','About'];
function ProfileTab({state,onReset,onOpenPitch,onUpdateName}){
  const {completedLessons,currentStreak,totalXP,pathName,userName,earnedBadges}=state;
  const [editing,setEditing]=useState(false);
  const [nameVal,setNameVal]=useState(userName||'');
  const [showNotifs,setShowNotifs]=useState(false);
  const [notifs,setNotifs]=useState({daily:true,streak:true,live:false,shabbat:true});
  const bookmarkedLessons=LEARNING_PATH.flatMap(u=>u.lessons).filter(l=>(state.bookmarks||[]).includes(l.id));
  const level=getLevel(totalXP);
  const nextLevel=XP_LEVELS[XP_LEVELS.indexOf(level)+1];
  const levelPct=nextLevel?Math.round(((totalXP-level.min)/(nextLevel.min-level.min))*100):100;
  const earnedSet=new Set(earnedBadges||[]);

  const saveName=()=>{
    setEditing(false);
    if(nameVal.trim()) onUpdateName(nameVal.trim());
  };

  return(
    <div className="tab-screen profile-tab fade-in">
      <div className="profile-hero">
        <div className="profile-avatar">{(nameVal||'G').charAt(0).toUpperCase()}</div>
        {editing
          ?<input className="name-edit-input" value={nameVal} onChange={e=>setNameVal(e.target.value)} onBlur={saveName} onKeyDown={e=>e.key==='Enter'&&saveName()} autoFocus/>
          :<h2 className="profile-name" onClick={()=>setEditing(true)} style={{cursor:'pointer'}}>{nameVal||'Tap to set name'} ✏️</h2>
        }
        <p className="profile-path-label">{pathName||'Learning Path'}</p>
        <button className="share-btn" style={{marginTop:8}} onClick={()=>shareApp(`${nameVal||'I'} am on Journey to HaShem`,`I've completed ${completedLessons.length} lessons on @JourneyToHaShem — join me!`)}>
          🔗 Share My Progress
        </button>
      </div>

      <div className="xp-level-bar">
        <div className="xp-level-info">
          <div className="xp-level-name">{level.name} <span style={{fontSize:13,fontFamily:'Cormorant Garamond,serif',color:'var(--gold-light)',fontStyle:'italic'}}>{level.hebrew}</span></div>
          <div className="xp-bar-track"><div className="xp-bar-fill" style={{width:`${levelPct}%`}}/></div>
          <div className="xp-level-sub">{totalXP} XP{nextLevel?` · ${nextLevel.min-totalXP} to ${nextLevel.name}`:' · Max Level'}</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon">🔥</span><span className="stat-value">{currentStreak}</span><span className="stat-label">Day Streak</span></div>
        <div className="stat-card"><span className="stat-icon">⭐</span><span className="stat-value">{totalXP}</span><span className="stat-label">Total XP</span></div>
        <div className="stat-card"><span className="stat-icon">✅</span><span className="stat-value">{completedLessons.length}</span><span className="stat-label">Lessons</span></div>
      </div>

      <div className="section">
        <h3 className="section-title">Badges <span style={{fontSize:13,color:'var(--text-dim)',fontFamily:'Inter,sans-serif',fontWeight:400}}>{earnedSet.size}/{ALL_BADGES.length}</span></h3>
      </div>
      <div className="badges-grid">
        {ALL_BADGES.map(b=>{
          const earned=earnedSet.has(b.id);
          return(
            <div key={b.id} className={`badge-card${earned?' earned':' locked'}`}>
              <span className={`badge-icon${earned?'':' locked-icon'}`}>{b.icon}</span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-desc">{b.desc}</span>
              {earned&&<span className="badge-earned-tag">Earned</span>}
            </div>
          );
        })}
      </div>

      <div className="section">
        <h3 className="section-title">Progress</h3>
        {LEARNING_PATH.map(unit=>{
          const done=unit.lessons.filter(l=>completedLessons.includes(l.id)).length;
          return(
            <div key={unit.id} className="unit-progress">
              <div className="unit-progress-row"><span className="unit-progress-name">{unit.title}</span><span className="unit-progress-count">{done}/{unit.lessons.length}</span></div>
              <div className="unit-progress-bar"><div className="unit-progress-fill" style={{width:`${(done/unit.lessons.length)*100}%`}}/></div>
            </div>
          );
        })}
      </div>

      {bookmarkedLessons.length>0&&(
        <div className="section">
          <h3 className="section-title">Bookmarked</h3>
          {bookmarkedLessons.map(l=>(
            <div key={l.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <span style={{fontSize:20}}>{l.icon}</span>
              <span style={{fontSize:14,color:'var(--text-body)'}}>{l.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <h3 className="section-title">Settings</h3>
        <div className="settings-list">
          <button className="settings-item" onClick={()=>setShowNotifs(true)}><span>🔔 Notifications</span><span className="settings-chevron">›</span></button>
          {SETTINGS.map(s=>(<button key={s} className="settings-item"><span>{s}</span><span className="settings-chevron">›</span></button>))}
          <button className="settings-item" onClick={onOpenPitch} style={{color:'var(--gold)'}}><span>🕍 Partner With Us — For Rabbis</span><span className="settings-chevron">›</span></button>
          <button className="settings-item settings-item-danger" onClick={onReset}><span>🔄 Reset Demo / Start Over</span><span className="settings-chevron">›</span></button>
        </div>
      </div>

      {showNotifs&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowNotifs(false);}}>
          <div className="modal-sheet">
            <div className="modal-handle"/>
            <h3 className="modal-title">Notifications</h3>
            <div style={{padding:'4px 0'}}>
              {[
                {key:'daily',icon:'📚',title:'Daily Learning Reminder',sub:'Remind me to complete my daily lesson'},
                {key:'streak',icon:'🔥',title:'Streak Protection',sub:'Alert me before my streak is about to break'},
                {key:'live',icon:'🔴',title:'Live Session Alerts',sub:'Notify me when a rabbi goes live'},
                {key:'shabbat',icon:'🕯️',title:'Shabbat Times',sub:'Friday candle lighting reminder'},
              ].map(n=>(
                <div key={n.key} className="notif-row">
                  <div className="notif-info">
                    <div className="notif-title">{n.icon} {n.title}</div>
                    <div className="notif-sub">{n.sub}</div>
                  </div>
                  <button className={`toggle${notifs[n.key]?' on':''}`} onClick={()=>setNotifs(p=>({...p,[n.key]:!p[n.key]}))}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:16}}>
              <button className="btn-primary" onClick={()=>setShowNotifs(false)}>Save Preferences</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RABBI PITCH SCREEN ───────────────────────────────────
function RabbiPitchScreen({onBack}){
  const [showContact,setShowContact]=useState(false);
  const [contactForm,setContactForm]=useState({name:'',synagogue:'',email:'',phone:'',message:''});
  const [submitted,setSubmitted]=useState(false);

  const handleSubmit=()=>{
    if(contactForm.name&&contactForm.email){
      setSubmitted(true);
      setTimeout(()=>{setShowContact(false);setSubmitted(false);},2000);
    }
  };

  const RABBI_BENEFITS=[
    'Your teachings reach Jews worldwide — 24/7, not just on Shabbat morning',
    'Upload shiurim once; students can replay, bookmark, and share them',
    'Full analytics: who listened, how long, what topics resonate',
    'Your congregation gets a dedicated learning track tied to your curriculum',
    'Co-brand the platform with your synagogue or yeshiva name',
    'Earn a revenue share from premium subscriptions in your community',
    'Help secular and distant Jews find their way back — at scale',
  ];

  const REVENUE_MODELS=[
    {icon:'🆓', title:'Free Tier', desc:'Full access to foundational lessons, daily Siddur, and community feed', price:'Free forever'},
    {icon:'✨', title:'Premium — $9.99/mo', desc:'Advanced units, full audio library, live session access, offline mode', price:'$9.99 / month'},
    {icon:'🕍', title:'Synagogue Plan', desc:'Branded community hub, congregation analytics, custom content tools', price:'$149 / month'},
    {icon:'🎓', title:'Yeshiva / School', desc:'Full curriculum integration, student progress dashboards, bulk licensing', price:'Custom pricing'},
  ];

  // Timeline uses relative phase labels — no hardcoded calendar dates that expire
  const TIMELINE=[
    {phase:'Phase 1 — Now',   future:false, title:'Prototype & Rabbi Partnerships',  desc:'Onboarding founding rabbis, building content pipeline, finalizing curriculum structure'},
    {phase:'Phase 2 — ~3 mo', future:true,  title:'Soft Launch — 500 Users',         desc:'iOS & Android apps, core learning path, audio library with 20+ shiurim, live session infrastructure'},
    {phase:'Phase 3 — ~6 mo', future:true,  title:'Community & Monetization',        desc:'Synagogue plans, leaderboards, push notifications, Stripe integration, rabbi revenue share'},
    {phase:'Phase 4 — ~12 mo',future:true,  title:'Scale — 50,000 Users',            desc:'Hebrew content track, Sephardic curriculum, Spanish localization, partnerships with major organizations'},
    {phase:'Phase 5 — ~24 mo',future:true,  title:'Global Platform',                 desc:'The Duolingo of Jewish learning — 500k+ users across 40+ countries'},
  ];

  return(
    <div className="screen-full fade-in">
      <div className="pitch-screen">
        {/* Hero */}
        <div className="pitch-hero">
          <button className="pitch-back" onClick={onBack}>← Back to App</button>
          <div className="pitch-hero-tag"><span className="pitch-hero-tag-dot"/>For Rabbis & Jewish Educators</div>
          <h1 className="pitch-hero-title">Bring your teachings<br/>to <span>every Jew</span>,<br/>everywhere.</h1>
          <p className="pitch-hero-sub">Journey to HaShem is building the world's most accessible Jewish learning platform — and we're looking for founding rabbi partners to shape it.</p>
          <div className="pitch-hero-stats">
            <div className="pitch-stat"><span className="pitch-stat-value">3.2M</span><span className="pitch-stat-label">Unaffiliated US Jews</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">85%</span><span className="pitch-stat-label">Never attended a shiur</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">1</span><span className="pitch-stat-label">App to change that</span></div>
          </div>
        </div>

        {/* The Problem */}
        <div className="pitch-section">
          <h2 className="pitch-section-title">The Problem</h2>
          <p className="pitch-section-sub">Millions of Jews want to connect with their heritage — but synagogue attendance is declining, access to qualified rabbis is limited, and existing apps are either too dry or too basic.</p>
          <div className="pitch-value-grid">
            {[
              {icon:'📉', title:'Declining Engagement', desc:'Synagogue attendance has dropped 30% in a generation'},
              {icon:'🌍', title:'Global Disconnect', desc:'Most diaspora Jews have no connection to Jewish learning'},
              {icon:'📱', title:'Mobile-First World', desc:'People learn on phones — Jewish content hasn\'t caught up'},
              {icon:'🚪', title:'High Barrier', desc:'Finding a rabbi, scheduling a class — most never start'},
            ].map((v,i)=>(
              <div key={i} className="pitch-value-item">
                <div className="pitch-value-icon">{v.icon}</div>
                <div className="pitch-value-title">{v.title}</div>
                <div className="pitch-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The Solution */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">The Solution</h2>
          <p className="pitch-section-sub">A beautifully designed, Duolingo-style platform that makes daily Jewish learning as easy as checking Instagram — with real rabbis at the center.</p>
          {[
            {icon:'📚', title:'Structured Learning Path', body:'25+ lessons across 5 units covering foundations of faith, Shabbat, prayer, holidays, and Torah study — with XP, streaks, and badges to keep learners engaged.'},
            {icon:'🎙️', title:'Rabbi Audio Integration', body:'Every lesson includes a rabbi voice commentary. Your shiurim become permanent, searchable, shareable assets — not one-time Saturday morning talks.'},
            {icon:'💬', title:'Live & Community', body:'Live shiurim, Q&A sessions, and a moderated community feed where learners ask questions and rabbis answer — building real relationships at scale.'},
            {icon:'📊', title:'Analytics Dashboard', body:'See exactly which topics resonate, where learners drop off, and which of your congregants are engaging — data you\'ve never had before.'},
          ].map((c,i)=>(
            <div key={i} className="pitch-card pitch-card-gold">
              <div className="pitch-card-icon">{c.icon}</div>
              <div className="pitch-card-title">{c.title}</div>
              <div className="pitch-card-body">{c.body}</div>
            </div>
          ))}
        </div>

        {/* Why Partner */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Why Partner With Us</h2>
          <p className="pitch-section-sub">Founding rabbi partners get exclusive benefits — and help shape the platform from day one.</p>
          <div className="pitch-card">
            {RABBI_BENEFITS.map((b,i)=>(
              <div key={i} className="pitch-rabbi-benefit">
                <span className="pitch-rabbi-benefit-check">✓</span>
                <span className="pitch-rabbi-benefit-text">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Revenue Model</h2>
          <p className="pitch-section-sub">Sustainable freemium model — free tier drives growth, premium tiers generate revenue shared with partner rabbis.</p>
          <div className="pitch-card">
            {REVENUE_MODELS.map((m,i)=>(
              <div key={i} className="pitch-model-row">
                <div className="pitch-model-icon">{m.icon}</div>
                <div>
                  <div className="pitch-model-title">{m.title}</div>
                  <div className="pitch-model-desc">{m.desc}</div>
                  <div className="pitch-model-price">{m.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Roadmap</h2>
          <p className="pitch-section-sub">We're building in phases — rabbis who join now shape the product from the ground up.</p>
          <div className="pitch-timeline">
            {TIMELINE.map((t,i)=>(
              <div key={i} className="pitch-timeline-item">
                <div className={`pitch-timeline-dot${t.future?' future':''}`}/>
                <div className="pitch-timeline-phase">{t.phase}</div>
                <div className="pitch-timeline-title">{t.title}</div>
                <div className="pitch-timeline-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">What People Are Saying</h2>
          <p className="pitch-section-sub">Early feedback from beta users and advisors.</p>
          {[
            {initials:'RD',name:'Rabbi Daniel Feldman',role:'Educator · Teaneck, NJ',quote:"This is exactly what our community's young adults need. Most of them aren't coming to shul — but they ARE on their phones. Meet them where they are."},
            {initials:'SA',name:'Sarah A.',role:'Beta User · Miami, FL',quote:"I grew up culturally Jewish but knew almost nothing about actual practice. I've completed 8 lessons in two weeks and finally feel connected to my heritage."},
            {initials:'MB',name:'Michael B.',role:'Beta User · New York, NY',quote:"The Siddur feature alone is worth it. I've been going to services for years without understanding what I was saying. Now I actually follow along."},
          ].map((t,i)=>(
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <div className="testimonial-quote">"{t.quote}"</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Ask */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">What We're Asking</h2>
          <p className="pitch-section-sub">We're not asking for money. We're asking for your partnership, your content, and your endorsement.</p>
          {[
            {icon:'🎙️', title:'Record 3–5 Audio Shiurim', body:'Short commentaries (8–15 min) tied to our existing lesson units. One recording session, permanent impact.'},
            {icon:'📣', title:'Share With Your Community', body:'Introduce Journey to HaShem to your congregation. Help us reach the Jews who aren\'t in the pews yet.'},
            {icon:'💡', title:'Shape the Curriculum', body:'Founding rabbi partners review and guide our content — ensuring halachic accuracy and pedagogical quality.'},
          ].map((c,i)=>(
            <div key={i} className="pitch-card">
              <div className="pitch-card-icon">{c.icon}</div>
              <div className="pitch-card-title">{c.title}</div>
              <div className="pitch-card-body">{c.body}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pitch-cta-section">
          <div className="pitch-cta-title">Ready to bring Torah to the world?</div>
          <p className="pitch-cta-sub">We're onboarding a small cohort of founding rabbi partners before our public launch. Spots are limited.</p>
          <div className="pitch-cta-buttons">
            <button className="btn-primary btn-large" onClick={()=>setShowContact(true)}>Express Interest →</button>
            <button className="btn-secondary" style={{width:'100%',padding:'14px'}} onClick={onBack}>← Explore the App First</button>
          </div>
        </div>

        {/* Contact Modal */}
        {showContact&&(
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowContact(false);}}>
            <div className="modal-sheet">
              <div className="modal-handle"/>
              {!submitted?(<>
                <h3 className="modal-title">Express Interest</h3>
                <div className="pitch-contact-modal-body">
                  <input className="pitch-input" placeholder="Your name" value={contactForm.name} onChange={e=>setContactForm(f=>({...f,name:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Synagogue / Yeshiva / Organization" value={contactForm.synagogue} onChange={e=>setContactForm(f=>({...f,synagogue:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Email address" type="email" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Phone number (preferred for follow-up)" type="tel" value={contactForm.phone} onChange={e=>setContactForm(f=>({...f,phone:e.target.value}))}/>
                  <textarea className="modal-textarea" placeholder="Tell us about your community and what you'd bring to this partnership..." value={contactForm.message} onChange={e=>setContactForm(f=>({...f,message:e.target.value}))} rows={3}/>
                </div>
                <div className="modal-actions" style={{marginTop:14}}>
                  <button className="btn-secondary" style={{flex:1}} onClick={()=>setShowContact(false)}>Cancel</button>
                  <button className={`btn-primary${(!contactForm.name||!contactForm.email)?' btn-disabled':''}`} style={{flex:2}} onClick={handleSubmit} disabled={!contactForm.name||!contactForm.email}>Submit →</button>
                </div>
              </>):(
                <div style={{textAlign:'center',padding:'20px 0'}}>
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--gold)',marginBottom:8}}>Thank You!</div>
                  <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.6}}>We'll be in touch within 48 hours to schedule a conversation.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GAMIFICATION DATA ─────────────────────────────────────
const XP_LEVELS = [
  { name:'Beginner',     hebrew:'מַתְחִיל',   min:0,   max:50  },
  { name:'Student',      hebrew:'תַּלְמִיד',  min:50,  max:120 },
  { name:'Learner',      hebrew:'לוֹמֵד',    min:120, max:220 },
  { name:'Scholar',      hebrew:'חָכָם',     min:220, max:360 },
  { name:'Torah Scholar',hebrew:'תַּלְמִיד חָכָם', min:360, max:550 },
  { name:'Rabbi',        hebrew:'רַב',        min:550, max:999 },
];

function getLevel(xp){
  return XP_LEVELS.find((l,i)=>xp>=l.min&&(xp<l.max||i===XP_LEVELS.length-1))||XP_LEVELS[0];
}

const ALL_BADGES = [
  { id:'first_step',    icon:'🌱', name:'First Step',       desc:'Complete your first lesson',       check:(s)=>s.completedLessons.length>=1 },
  { id:'shabbat_soul',  icon:'🕯️', name:'Shabbat Soul',     desc:'Complete the Shabbat unit',        check:(s)=>['u2l1','u2l2','u2l3','u2l4','u2l5'].every(id=>s.completedLessons.includes(id)) },
  { id:'streak_3',      icon:'🔥', name:'On Fire',          desc:'3-day learning streak',            check:(s)=>s.currentStreak>=3 },
  { id:'streak_7',      icon:'⚡', name:'Lightning Streak', desc:'7-day learning streak',            check:(s)=>s.currentStreak>=7 },
  { id:'scholar_50',    icon:'⭐', name:'50 XP',            desc:'Earn 50 XP',                       check:(s)=>s.totalXP>=50 },
  { id:'scholar_100',   icon:'💫', name:'100 XP',           desc:'Earn 100 XP',                      check:(s)=>s.totalXP>=100 },
  { id:'half_path',     icon:'📚', name:'Halfway There',    desc:'Complete 12 lessons',              check:(s)=>s.completedLessons.length>=12 },
  { id:'full_path',     icon:'🏆', name:'Path Complete',    desc:'Complete all 25 lessons',          check:(s)=>s.completedLessons.length>=25 },
  { id:'bookmarker',    icon:'🔖', name:'Bookworm',         desc:'Bookmark 3 lessons',               check:(s)=>(s.bookmarks||[]).length>=3 },
  { id:'prayer_start',  icon:'🙏', name:'Man of Prayer',    desc:'Open the Siddur',                  check:(s)=>s.openedSiddur||false },
  { id:'foundations',   icon:'✡️', name:'Foundation Stone', desc:'Complete Foundations of Faith',    check:(s)=>['u1l1','u1l2','u1l3','u1l4','u1l5'].every(id=>s.completedLessons.includes(id)) },
  { id:'daily_3',       icon:'📅', name:'Daily 3',          desc:'Complete 3 lessons in one day',    check:(s)=>s.dailyLessonsCompleted>=3 },
];

function getEarnedBadges(state){
  return ALL_BADGES.filter(b=>b.check(state));
}

function getNewBadges(prevState, nextState){
  const prev = new Set(getEarnedBadges(prevState).map(b=>b.id));
  return getEarnedBadges(nextState).filter(b=>!prev.has(b.id));
}

const LEADERBOARD = [
  { initials:'RY', name:'Rabbi Yosef',  xp:340, streak:21, me:false },
  { initials:'SL', name:'Sara L.',      xp:280, streak:14, me:false },
  { initials:'MG', name:'Miriam G.',    xp:190, streak:9,  me:false },
  { initials:'ME', name:'You',          xp:0,   streak:0,  me:true  },
  { initials:'AH', name:'Avi H.',       xp:130, streak:5,  me:false },
  { initials:'DK', name:'David K.',     xp:80,  streak:3,  me:false },
  { initials:'JB', name:'Jacob B.',     xp:60,  streak:2,  me:false },
];

// ── RETURNING USER SCREEN ────────────────────────────────
function ReturningUserScreen({state, onContinue}){
  const {userName,currentStreak,totalXP,completedLessons,pathName}=state;
  const level=getLevel(totalXP);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const nextLesson=curIdx>=0?allLessons[curIdx]:null;
  const greeting=(()=>{const h=new Date().getHours();if(h<12)return'Welcome back';if(h<17)return'Good afternoon';return'Good evening';})();

  return(
    <div className="screen-full returning-screen fade-in">
      <div className="returning-content">
        <div className="returning-avatar">{(userName||'J').charAt(0).toUpperCase()}</div>
        <h2 className="returning-title">{greeting}{userName?`, ${userName}`:''}!</h2>
        <p className="returning-sub">
          {currentStreak>0
            ? `You're on a ${currentStreak}-day streak 🔥 — keep it going!`
            : 'Ready to continue your journey?'
          }
        </p>
        <div className="returning-stats">
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value">{completedLessons.length}</span>
            <span className="pitch-stat-label">Lessons</span>
          </div>
          <div style={{width:1,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value">{totalXP}</span>
            <span className="pitch-stat-label">XP</span>
          </div>
          <div style={{width:1,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value" style={{fontSize:16,paddingTop:4}}>{level.name}</span>
            <span className="pitch-stat-label">Level</span>
          </div>
        </div>
        {nextLesson&&(
          <div style={{width:'100%',background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'var(--radius-lg)',padding:'14px 18px',textAlign:'center'}}>
            <div style={{fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.8px',fontWeight:700,marginBottom:4}}>Next Up</div>
            <div style={{fontSize:16,color:'var(--text-body)',fontFamily:'Cormorant Garamond,serif',fontWeight:600}}>{nextLesson.title}</div>
          </div>
        )}
        <button className="btn-primary btn-large" onClick={onContinue}>Continue Learning →</button>
        <p style={{fontSize:12,color:'var(--text-dim)',textAlign:'center'}}>{getHebrewDate()}</p>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
const DEFAULT_STATE={
  onboardingComplete:false,onboardingStep:'welcome',
  selectedPath:null,pathName:null,quizAnswers:[],
  completedLessons:[],currentStreak:0,totalXP:0,
  dailyLessonsCompleted:0,lastActiveDate:null,
  activeTab:'home',bookmarks:[],userName:'',
  earnedBadges:[],openedSiddur:false,
};

function App(){
  const [state,setState]=useState(()=>{
    try{const s=localStorage.getItem('jth-v3');return s?{...DEFAULT_STATE,...JSON.parse(s)}:DEFAULT_STATE;}
    catch{return DEFAULT_STATE;}
  });
  const [currentView,setCurrentView]=useState(null);
  const [showSearch,setShowSearch]=useState(false);
  const [showPitch,setShowPitch]=useState(false);
  const [badgeToast,setBadgeToast]=useState(null);
  const [showReturning,setShowReturning]=useState(()=>{
    // Show returning screen if user has progress but hasn't seen it this session
    try{
      const s=localStorage.getItem('jth-v3');
      const saved=s?JSON.parse(s):null;
      return !!(saved?.onboardingComplete&&saved?.completedLessons?.length>0);
    }catch{return false;}
  });

  useEffect(()=>{localStorage.setItem('jth-v3',JSON.stringify(state));},[state]);

  const update=u=>setState(prev=>({...prev,...u}));

  const updateWithBadgeCheck=(updates)=>{
    setState(prev=>{
      const next={...prev,...updates};
      const newBadges=getNewBadges(prev,next);
      if(newBadges.length>0){
        next.earnedBadges=[...new Set([...(prev.earnedBadges||[]),...newBadges.map(b=>b.id)])];
        setTimeout(()=>{
          setBadgeToast(newBadges[0]);
          setTimeout(()=>setBadgeToast(null),3000);
        },800);
      }
      return next;
    });
  };

  const handleReset=()=>{
    if(window.confirm('Reset all progress and start over?')){
      localStorage.removeItem('jth-v3');
      setState(DEFAULT_STATE);
      setCurrentView(null);
      setBadgeToast(null);
      setShowReturning(false);
    }
  };

  const handleLessonComplete=lesson=>{
    const alreadyCompleted=state.completedLessons.includes(lesson.id);
    const today=new Date().toDateString();
    const last=state.lastActiveDate;

    // Always mark as completed, but only award XP/streak/daily progress
    // if this is the FIRST time completing this lesson
    const newCompleted=[...new Set([...state.completedLessons,lesson.id])];

    if(alreadyCompleted){
      // Replay: no rewards, just close with a quiet congrats
      setCurrentView({type:'congrats',lesson,xpEarned:0,streak:state.currentStreak,newBadges:[],replay:true});
      return;
    }

    let newStreak=state.currentStreak;
    if(!last){newStreak=1;}
    else if(last===today){newStreak=state.currentStreak;}
    else{const y=new Date();y.setDate(y.getDate()-1);newStreak=last===y.toDateString()?state.currentStreak+1:1;}
    const newXP=state.totalXP+10;
    const newDaily=last===today?state.dailyLessonsCompleted+1:1;
    const updates={
      completedLessons:newCompleted,totalXP:newXP,currentStreak:newStreak,
      dailyLessonsCompleted:newDaily,lastActiveDate:today,
    };
    updateWithBadgeCheck(updates);
    const nextState={...state,...updates};
    const newBadges=getNewBadges(state,nextState);
    setCurrentView({type:'congrats',lesson,xpEarned:10,streak:newStreak,newBadges,replay:false});
  };

  const handleToggleBookmark=lessonId=>{
    const bookmarks=state.bookmarks||[];
    const newBookmarks=bookmarks.includes(lessonId)?bookmarks.filter(id=>id!==lessonId):[...bookmarks,lessonId];
    updateWithBadgeCheck({bookmarks:newBookmarks});
  };

  const handleUpdateName=name=>update({userName:name});

  const handleOpenSiddur=p=>{
    if(!state.openedSiddur) updateWithBadgeCheck({openedSiddur:true});
    setCurrentView({type:'prayer',prayer:p});
  };

  // Returning user screen
  if(showReturning&&state.onboardingComplete) return(
    <div className="app-container">
      <div className="demo-banner">
        <span className="demo-label">📱 DEMO MODE</span>
        <button className="demo-reset" onClick={handleReset}>Reset</button>
      </div>
      <ReturningUserScreen state={state} onContinue={()=>setShowReturning(false)}/>
    </div>
  );

  // Pitch screen
  if(showPitch) return(
    <div className="app-container">
      <RabbiPitchScreen onBack={()=>setShowPitch(false)}/>
    </div>
  );

  // Overlay views
  if(showSearch) return(
    <div className="app-container">
      <SearchOverlay
        onClose={()=>setShowSearch(false)}
        onOpenLesson={(l,u)=>{setShowSearch(false);setCurrentView({type:'lesson',lesson:l,unit:u});}}
        onOpenPrayer={p=>{setShowSearch(false);handleOpenSiddur(p);}}
      />
    </div>
  );

  if(currentView){
    if(currentView.type==='lesson') return(
      <div className="app-container">
        <LessonScreen lesson={currentView.lesson} unit={currentView.unit}
          onClose={()=>setCurrentView(null)}
          onComplete={()=>handleLessonComplete(currentView.lesson)}
          isBookmarked={(state.bookmarks||[]).includes(currentView.lesson.id)}
          onToggleBookmark={()=>handleToggleBookmark(currentView.lesson.id)}
        />
      </div>
    );
    if(currentView.type==='congrats') return(
      <div className="app-container">
        <CongratsScreen lesson={currentView.lesson} xpEarned={currentView.xpEarned} streak={currentView.streak} newBadges={currentView.newBadges||[]} totalXP={state.totalXP} replay={currentView.replay||false} onContinue={()=>setCurrentView(null)}/>
      </div>
    );
    if(currentView.type==='prayer') return(
      <div className="app-container">
        <PrayerView prayer={currentView.prayer} onBack={()=>setCurrentView(null)}/>
      </div>
    );
  }

  if(!state.onboardingComplete) return(
    <div className="app-container">
      <div className="demo-banner">
        <span className="demo-label">📱 DEMO MODE</span>
        <button className="demo-reset" onClick={handleReset}>Reset</button>
      </div>
      {state.onboardingStep==='welcome'&&<Welcome onBegin={()=>update({onboardingStep:'quiz'})} onSkip={()=>update({onboardingComplete:true,activeTab:'learn',pathName:"The Seeker's Path"})}/>}
      {state.onboardingStep==='quiz'&&<Quiz onComplete={ans=>{const path=getPathFromAnswers(ans);update({quizAnswers:ans,selectedPath:path,pathName:path.name,onboardingStep:'path-ready'});}}/>}
      {state.onboardingStep==='path-ready'&&<PathReady path={state.selectedPath} answers={state.quizAnswers||[]} onStart={()=>update({onboardingComplete:true,activeTab:'home'})}/>}
    </div>
  );

  return(
    <div className="app-container">
      <div className="demo-banner">
        <span className="demo-label">📱 DEMO MODE</span>
        <button className="demo-reset" onClick={handleReset}>Reset Demo</button>
      </div>
      {badgeToast&&(
        <div className="badge-toast">
          <span className="badge-toast-icon">{badgeToast.icon}</span>
          <div>
            <div className="badge-toast-label">🏅 Badge Unlocked!</div>
            <div className="badge-toast-name">{badgeToast.name}</div>
          </div>
        </div>
      )}
      <div className="tab-content">
        <div key={state.activeTab} className="tab-view">
          {state.activeTab==='home'&&<HomeTab state={state} onOpenLesson={(l,u)=>setCurrentView({type:'lesson',lesson:l,unit:u})} onOpenPrayer={p=>handleOpenSiddur(p)} onGoTab={t=>update({activeTab:t})} onSearch={()=>setShowSearch(true)} onOpenPitch={()=>setShowPitch(true)}/>}
          {state.activeTab==='learn'&&<LearnTab state={state} onOpenLesson={(l,u)=>setCurrentView({type:'lesson',lesson:l,unit:u})}/>}
          {state.activeTab==='live'&&<LiveTab/>}
          {state.activeTab==='siddur'&&<SiddurTab onOpenPrayer={p=>handleOpenSiddur(p)}/>}
          {state.activeTab==='community'&&<CommunityTab state={state}/>}
          {state.activeTab==='profile'&&<ProfileTab state={state} onReset={handleReset} onOpenPitch={()=>setShowPitch(true)} onUpdateName={handleUpdateName}/>}
        </div>
      </div>
      <BottomNav activeTab={state.activeTab} onChange={tab=>update({activeTab:tab})}/>
    </div>
  );
}

export default App;
