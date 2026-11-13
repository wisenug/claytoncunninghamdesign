/* Wonder Deck: quiz cards for young kids, served at /learn/.

   How it fits together (top to bottom):
     1. Small helpers (DOM builder, random picks, number words)
     2. Saved state (localStorage on this device only, nothing is uploaded)
     3. Picture builders (ten-frames, coins, calendar, number rows)
     4. LEVELS: the decks. Each deck has skills, each skill has a make()
        that returns a fresh, randomly generated card every time.
     5. The screens: home, play, done, grown-ups.

   To add a level for another kid, add an entry to LEVELS.
   To add a question style, add a skill with a make() to a deck.

   Card shapes a make() can return:
     { type: 'choice', prompt, say, stim, choices: [{..., correct}], cols, why }
     { type: 'open',   prompt, say, stim, answer, detail }   say it out loud, flip to check
     { type: 'dial',   prompt, say, digits, show }           phone keypad
   Personal details (name, birthday, address, phone) are typed in on the
   Grown-ups screen and never live in this file: the repo is public. */
(function () {
  'use strict';

  /* ---------- 1. Helpers ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid == null || kid === false) continue;
      if (Array.isArray(kid)) kid.forEach(function (c) { if (c) el.appendChild(c); });
      else el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    }
    return el;
  }
  var SVG = 'http://www.w3.org/2000/svg';
  function s(tag, attrs) {
    var el = document.createElementNS(SVG, tag);
    for (var k in attrs || {}) el.setAttribute(k, attrs[k]);
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
    return el;
  }
  function rand(n) { return Math.floor(Math.random() * n); }
  function between(a, b) { return a + rand(b - a + 1); }
  function pick(arr) { return arr[rand(arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rand(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function uniq(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }

  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWord(n) {
    if (n < 20) return ONES[n];
    if (n === 100) return 'one hundred';
    return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  }
  function ordinal(n) {
    var v = n % 100;
    return n + (v > 10 && v < 14 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------- 2. Saved state ---------- */
  var KEY = 'wonder-deck-v1';
  var state = { profile: {}, stats: {}, voice: true };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      state.profile = saved.profile || {};
      state.stats = saved.stats || {};
      state.voice = saved.voice !== false;
    }
  } catch (e) { /* private mode or blocked storage: play still works, nothing is kept */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function skillStat(deckId, skillId) {
    var d = state.stats[deckId] || (state.stats[deckId] = { plays: 0, best: 0, skills: {} });
    return d.skills[skillId] || (d.skills[skillId] = { seen: 0, right: 0 });
  }

  var canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  // Reads a question out loud, slowly, with a short beat after every sentence.
  // A "|" in the text adds a beat too: it sits between a question and its answers.
  var VOICE_RATE = 0.8;      // 1 is the voice's normal speed
  var VOICE_PAUSE_MS = 250;
  var VOICE_LANG = 'en-GB';   // British English. The voices themselves come from the device.
  var speakRun = 0, speaking = null;
  // The device's British voice if it has one. Otherwise null, and the browser picks.
  function britishVoice() {
    var all = [];
    try { all = speechSynthesis.getVoices() || []; } catch (e) {}
    var gb = all.filter(function (v) { return /^en[-_]GB/i.test(v.lang || ''); });
    return gb.filter(function (v) { return v.localService; })[0] || gb[0] || null;
  }
  // Some browsers load their voice list late. Asking early makes it ready by the first card.
  try { if (canSpeak) { speechSynthesis.getVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', function () {}); } } catch (e) {}
  function speak(text) {
    if (!state.voice || !canSpeak || !text) return;
    var run = ++speakRun;
    // Also take a beat after each sentence.
    var parts = String(text).replace(/([.?!])\s+/g, '$1|').split('|').map(function (t) { return t.trim(); }).filter(Boolean);
    try { speechSynthesis.cancel(); } catch (e) { return; }
    (function next(i) {
      if (i >= parts.length || run !== speakRun) return;
      try {
        var u = new SpeechSynthesisUtterance(parts[i]);
        var voice = britishVoice();
        if (voice) u.voice = voice;
        u.lang = voice ? voice.lang : VOICE_LANG;
        u.rate = VOICE_RATE;
        u.onend = function () { setTimeout(function () { next(i + 1); }, VOICE_PAUSE_MS); };
        speaking = u;          // held so the browser does not drop it mid-sentence
        speechSynthesis.speak(u);
      } catch (e) {}
    })(0);
  }
  function hush() { speakRun++; try { if (canSpeak) speechSynthesis.cancel(); } catch (e) {} }

  /* ---------- 3. Picture builders ---------- */
  function glyph(text) { return h('div', { class: 'big-glyph', text: String(text) }); }
  function pic(w) { return h('div', { class: 'pic' }, h('span', { class: 'emoji', 'aria-hidden': 'true', text: w.e || '' }), h('span', { class: 'word', text: w.w })); }
  function seq(items) {
    return h('div', { class: 'seq', role: 'img', 'aria-label': items.map(function (x) { return x === '?' ? 'blank' : x; }).join(', ') },
      items.map(function (x) { return h('span', { class: x === '?' ? 'blank' : '', text: String(x) }); }));
  }
  function frames(n, small) {
    var wrap = h('div', { class: 'frames' + (small ? ' small' : ''), role: 'img', 'aria-label': 'Dots in boxes of ten' });
    for (var left = n; left > 0; left -= 10) {
      var f = h('div', { class: 'frame' });
      for (var i = 0; i < 10; i++) f.appendChild(h('i', { class: i < left ? 'on' : '' }));
      wrap.appendChild(f);
    }
    return wrap;
  }

  // Coins are shown at their true relative sizes (mm).
  var COINS = {
    penny:   { name: 'penny',   cents: 1,  mm: 19.05, fill: '#c57b4a', rim: '#8a4f28', reeded: false, text: 'ONE CENT',  look: 'copper colored, smooth edge' },
    nickel:  { name: 'nickel',  cents: 5,  mm: 21.21, fill: '#c9cdd3', rim: '#7d848e', reeded: false, text: 'FIVE CENTS', look: 'silver colored, smooth edge, thick' },
    dime:    { name: 'dime',    cents: 10, mm: 17.91, fill: '#d5d9de', rim: '#7d848e', reeded: true,  text: 'ONE DIME',  look: 'silver colored, ridged edge, the smallest' },
    quarter: { name: 'quarter', cents: 25, mm: 24.26, fill: '#cfd3d8', rim: '#7d848e', reeded: true,  text: 'QUARTER',   look: 'silver colored, ridged edge, the biggest' }
  };
  var COIN_IDS = ['penny', 'nickel', 'dime', 'quarter'];
  // Real coin photos (US Mint, public domain, via Wikimedia Commons). Credits: learn/coins/CREDITS.txt
  var COIN_BACKS = { nickel: true, dime: true };
  function coinSrc(name) { return (window.WD_ASSETS && window.WD_ASSETS[name]) || 'coins/' + name + '.webp'; }
  function coin(id, scale, mayFlip) {
    var px = Math.round(COINS[id].mm * (scale || 4));
    var side = mayFlip && COIN_BACKS[id] && rand(3) === 0 ? 'back' : 'front';
    return h('img', { class: 'coin', src: coinSrc(id + '-' + side), width: px, height: px, alt: '', draggable: 'false' });
  }
  function coinRow(ids, scale, mayFlip) {
    return h('div', { class: 'coins', role: 'img', 'aria-label': ids.length + (ids.length === 1 ? ' coin' : ' coins') },
      ids.map(function (id) { return coin(id, scale, mayFlip); }));
  }

  function monthInfo(year, month) {
    return { year: year, month: month, name: MONTHS[month], days: new Date(year, month + 1, 0).getDate(), first: new Date(year, month, 1).getDay() };
  }
  // A month grid. cell(day) returns the element for each date.
  function calendar(info, cell) {
    var grid = h('div', { class: 'cal-grid' });
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d, i) { grid.appendChild(h('span', { class: 'dow', 'aria-label': DAYS[i], text: d })); });
    for (var b = 0; b < info.first; b++) grid.appendChild(h('span'));
    for (var d = 1; d <= info.days; d++) grid.appendChild(cell(d));
    return h('div', { class: 'cal' }, h('div', { class: 'cal-title', text: info.name }), grid);
  }
  function calendarShown(info, mark) {
    return calendar(info, function (d) { return h('span', { class: 'day' + (d === mark ? ' mark' : ''), text: String(d) }); });
  }

  /* Choice shorthands */
  function cBig(text, correct) { return { big: String(text), label: String(text), correct: !!correct }; }
  function cPic(w, correct) { return { emoji: w.e, word: w.w, label: w.w, correct: !!correct }; }
  function cCoin(id, correct) { return { coin: id, label: 'Coin: ' + COINS[id].look, correct: !!correct }; }
  function numChoices(answer, pool, n) {
    var wrong = shuffle(uniq(pool).filter(function (x) { return x !== answer && x > 0; })).slice(0, (n || 3) - 1);
    return shuffle([cBig(answer, true)].concat(wrong.map(function (x) { return cBig(x); })));
  }

  /* ---------- 4. Decks ---------- */

  // Rhyme families. e = emoji picture. Words without one are only used as spoken examples.
  var RHYMES = [
    [{ w: 'cat', e: '🐱' }, { w: 'hat', e: '🎩' }, { w: 'bat', e: '🦇' }, { w: 'rat', e: '🐀' }, { w: 'mat' }],
    [{ w: 'dog', e: '🐶' }, { w: 'frog', e: '🐸' }, { w: 'log', e: '🪵' }, { w: 'hog' }],
    [{ w: 'bug', e: '🐛' }, { w: 'mug', e: '☕' }, { w: 'hug', e: '🤗' }, { w: 'rug' }],
    [{ w: 'bee', e: '🐝' }, { w: 'tree', e: '🌳' }, { w: 'key', e: '🔑' }, { w: 'knee' }, { w: 'three' }],
    [{ w: 'car', e: '🚗' }, { w: 'star', e: '⭐' }, { w: 'jar' }, { w: 'far' }],
    [{ w: 'cake', e: '🎂' }, { w: 'snake', e: '🐍' }, { w: 'lake' }, { w: 'rake' }],
    [{ w: 'king', e: '🤴' }, { w: 'ring', e: '💍' }, { w: 'wing' }, { w: 'swing' }, { w: 'sing' }],
    [{ w: 'sock', e: '🧦' }, { w: 'clock', e: '🕐' }, { w: 'rock', e: '🪨' }, { w: 'lock', e: '🔒' }, { w: 'block' }],
    [{ w: 'fox', e: '🦊' }, { w: 'box', e: '📦' }, { w: 'socks' }],
    [{ w: 'snail', e: '🐌' }, { w: 'whale', e: '🐳' }, { w: 'mail', e: '📬' }, { w: 'tail' }, { w: 'pail' }],
    [{ w: 'bear', e: '🐻' }, { w: 'chair', e: '🪑' }, { w: 'pear', e: '🍐' }, { w: 'hair' }],
    [{ w: 'boat', e: '⛵' }, { w: 'goat', e: '🐐' }, { w: 'coat', e: '🧥' }],
    [{ w: 'moon', e: '🌙' }, { w: 'spoon', e: '🥄' }, { w: 'balloon', e: '🎈' }],
    [{ w: 'mouse', e: '🐭' }, { w: 'house', e: '🏠' }],
    [{ w: 'train', e: '🚂' }, { w: 'rain', e: '🌧️' }, { w: 'plane', e: '✈️' }, { w: 'crane' }],
    [{ w: 'bed', e: '🛏️' }, { w: 'bread', e: '🍞' }, { w: 'sled', e: '🛷' }, { w: 'red' }],
    [{ w: 'hen', e: '🐔' }, { w: 'pen', e: '🖊️' }, { w: 'ten', e: '🔟' }],
    [{ w: 'fish', e: '🐟' }, { w: 'dish' }, { w: 'wish' }],
    [{ w: 'bell', e: '🔔' }, { w: 'shell', e: '🐚' }, { w: 'well' }],
    [{ w: 'pig', e: '🐷' }, { w: 'wig' }, { w: 'dig' }, { w: 'big' }]
  ];
  var RHYME_LINES = [
    ['A bug is asleep on the…', 'rug', 2], ['The frog sat on a…', 'log', 1], ['A bee flew up in the…', 'tree', 3],
    ['The king has a shiny…', 'ring', 6], ['A goat sailed off in a…', 'boat', 11], ['The mouse lives in a little…', 'house', 13],
    ['A snake baked a yummy…', 'cake', 5], ['The bear sat down on a…', 'chair', 10], ['A fox hid inside a…', 'box', 8],
    ['Drive the car to a…', 'star', 4], ['The cat is wearing a…', 'hat', 0], ['I rode a train in the…', 'rain', 14],
    ['The snail got a letter in the…', 'mail', 9], ['Fly to the moon on a…', 'balloon', 12]
  ];
  function pictured(fam) { return fam.filter(function (w) { return w.e; }); }
  function otherWords(famIndex, n) {
    var pool = [];
    RHYMES.forEach(function (fam, i) { if (i !== famIndex) pool.push(pick(pictured(fam).length ? pictured(fam) : fam)); });
    return sample(pool.filter(function (w) { return w.e; }), n);
  }
  function rhymePair() {
    var i = rand(RHYMES.length);
    var p = pictured(RHYMES[i]);
    if (p.length < 2) return rhymePair();
    var two = sample(p, 2);
    return { i: i, a: two[0], b: two[1] };
  }

  var rhymeDeck = {
    id: 'rhyme', name: 'Rhyme Time', icon: '🎵', blurb: 'Words that sound alike', color: '#ff8a5b', tint: '#ffe6da',
    skills: [
      { id: 'match', label: 'Find the rhyme', make: function () {
        var r = rhymePair();
        var wrong = otherWords(r.i, 2);
        var ch = shuffle([cPic(r.b, true), cPic(wrong[0]), cPic(wrong[1])]);
        return { type: 'choice', stim: pic(r.a), prompt: 'Which word rhymes with ' + r.a.w + '?',
          say: 'Which word rhymes with ' + r.a.w + '? | ' + ch.map(function (c) { return c.word; }).join(', ') + '?',
          choices: ch, why: r.a.w + ' and ' + r.b.w + ' rhyme.' };
      } },
      { id: 'either', label: 'This one or that one', make: function () {
        var r = rhymePair();
        var wrong = otherWords(r.i, 1)[0];
        var ch = shuffle([cPic(r.b, true), cPic(wrong)]);
        return { type: 'choice', cols: 2, stim: pic(r.a),
          prompt: 'Does ' + r.a.w + ' rhyme with ' + ch[0].word + ' or ' + ch[1].word + '?',
          choices: ch, why: r.a.w + ' and ' + r.b.w + ' end with the same sound.' };
      } },
      { id: 'odd', label: 'Odd one out', make: function () {
        var r = rhymePair();
        var wrong = otherWords(r.i, 1)[0];
        var ch = shuffle([cPic(r.a), cPic(r.b), cPic(wrong, true)]);
        return { type: 'choice', prompt: 'Two of these words rhyme. Which one does not?',
          say: 'Two of these words rhyme. Which one does not? | ' + ch.map(function (c) { return c.word; }).join(', ') + '.',
          choices: ch, why: r.a.w + ' and ' + r.b.w + ' rhyme. ' + wrong.w + ' does not.' };
      } },
      { id: 'yesno', label: 'Rhyme or not', make: function () {
        var r = rhymePair();
        var yes = rand(2) === 0;
        var other = yes ? r.b : otherWords(r.i, 1)[0];
        return { type: 'choice', cols: 2,
          stim: h('div', { class: 'stim' }, pic(r.a), h('span', { class: 'plus', text: '+' }), pic(other)),
          prompt: 'Do these two words rhyme?', say: r.a.w + '. ' + other.w + '. Do these two words rhyme?',
          choices: [{ emoji: '👍', word: 'Yes', label: 'Yes', correct: yes }, { emoji: '👎', word: 'No', label: 'No', correct: !yes }],
          why: r.a.w + ' and ' + other.w + (yes ? ' rhyme.' : ' do not rhyme.') };
      } },
      { id: 'finish', label: 'Finish the rhyme', make: function () {
        var line = pick(RHYME_LINES);
        var fam = RHYMES[line[2]];
        var ans = fam.filter(function (w) { return w.w === line[1]; })[0] || { w: line[1] };
        var wrong = otherWords(line[2], 2);
        var ch = shuffle([cPic(ans, true), cPic(wrong[0]), cPic(wrong[1])]);
        return { type: 'choice', prompt: line[0],
          say: 'Finish the rhyme. ' + line[0].replace('…', ' blank.') + ' | ' + ch.map(function (c) { return c.word; }).join(', ') + '?',
          choices: ch, why: line[0].replace('…', ' ' + line[1] + '!') };
      } },
      { id: 'make', label: 'Make a rhyme', make: function () {
        var i = rand(RHYMES.length);
        var fam = RHYMES[i];
        var w = pick(fam);
        var rest = fam.filter(function (x) { return x !== w; }).map(function (x) { return x.w; });
        return { type: 'open', stim: pic(w), prompt: pick(['Say a word that rhymes with ' + w.w + '.', 'What rhymes with ' + w.w + '? Say one out loud.', 'Can you think of two words that rhyme with ' + w.w + '?']),
          answer: rest.slice(0, 3).join(', '), detail: 'Silly made-up words count too, as long as they rhyme.' };
      } }
    ]
  };

  var LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var LOOKALIKE = { b: 'dpq', d: 'bpq', p: 'qbd', q: 'pbg', m: 'nw', n: 'muh', u: 'nv', i: 'lj', l: 'it', t: 'fl', f: 't', g: 'qyj', a: 'eo', e: 'ac', c: 'eo', h: 'nb', v: 'wuy', w: 'mv', j: 'ig', y: 'vg', o: 'ca', s: 'z', z: 's', k: 'x', x: 'k', r: 'n' };
  // Letters whose two cases look clearly different (so "big or small?" is fair in isolation)
  var TWO_SHAPES = 'abdefghjmnqrty'.split('');
  var STARTS = [{ l: 'a', w: 'apple', e: '🍎' }, { l: 'b', w: 'bear', e: '🐻' }, { l: 'd', w: 'dog', e: '🐶' }, { l: 'f', w: 'fish', e: '🐟' },
    { l: 'g', w: 'goat', e: '🐐' }, { l: 'h', w: 'hat', e: '🎩' }, { l: 'l', w: 'lion', e: '🦁' }, { l: 'm', w: 'moon', e: '🌙' },
    { l: 'n', w: 'nose', e: '👃' }, { l: 'p', w: 'pig', e: '🐷' }, { l: 'r', w: 'rain', e: '🌧️' }, { l: 's', w: 'sun', e: '☀️' },
    { l: 't', w: 'tree', e: '🌳' }, { l: 'w', w: 'whale', e: '🐳' }, { l: 'z', w: 'zebra', e: '🦓' }];
  function letterRivals(l, n) {
    var close = shuffle((LOOKALIKE[l] || '').split('')).slice(0, 2);
    var rest = shuffle(LOWER.filter(function (x) { return x !== l && close.indexOf(x) < 0; }));
    return close.concat(rest).slice(0, n);
  }

  var letterDeck = {
    id: 'letters', name: 'Letter Match', icon: '🔤', blurb: 'Big letters and small letters', color: '#4d9de0', tint: '#dcecfa',
    skills: [
      { id: 'up2low', label: 'Big to small', make: function () {
        var l = pick(LOWER);
        var ch = shuffle([cBig(l, true)].concat(letterRivals(l, 2).map(function (x) { return cBig(x); })));
        return { type: 'choice', stim: glyph(l.toUpperCase()), prompt: pick(['Which one is the lowercase letter?', 'Find the small letter that goes with this big letter.']),
          choices: ch, why: l.toUpperCase() + ' and ' + l + ' are the same letter.', sayWhy: 'Yes! That is the letter ' + l.toUpperCase() + '.' };
      } },
      { id: 'low2up', label: 'Small to big', make: function () {
        var l = pick(LOWER);
        var ch = shuffle([cBig(l.toUpperCase(), true)].concat(letterRivals(l, 2).map(function (x) { return cBig(x.toUpperCase()); })));
        return { type: 'choice', stim: glyph(l), prompt: pick(['Which one is the uppercase letter?', 'Find the big letter that goes with this small letter.']),
          choices: ch, why: l + ' and ' + l.toUpperCase() + ' are the same letter.', sayWhy: 'Yes! That is the letter ' + l.toUpperCase() + '.' };
      } },
      { id: 'hear', label: 'Listen and find', make: function () {
        var l = pick(LOWER);
        var upper = rand(2) === 0;
        var f = function (x) { return upper ? x.toUpperCase() : x; };
        var ch = shuffle([cBig(f(l), true)].concat(letterRivals(l, 3).map(function (x) { return cBig(f(x)); })));
        return { type: 'choice', cols: 4, prompt: 'Tap the letter you hear.', say: 'Tap the letter ' + l.toUpperCase() + '.',
          readAloud: 'the letter ' + l.toUpperCase() + (upper ? '' : ' (they are looking for lowercase)'),
          key: 'hear' + f(l), choices: ch, why: 'That is ' + f(l) + '.', sayWhy: 'Yes! That is the letter ' + l.toUpperCase() + '.' };
      } },
      { id: 'case', label: 'Big or small', make: function () {
        var l = pick(TWO_SHAPES);
        var upper = rand(2) === 0;
        return { type: 'choice', cols: 2, stim: glyph(upper ? l.toUpperCase() : l), prompt: 'Is this letter uppercase or lowercase?',
          say: 'Is this letter uppercase or lowercase? | Uppercase, a big letter. Or lowercase, a small letter.',
          choices: [{ big: 'A', word: 'Uppercase', label: 'Uppercase, big', correct: upper }, { big: 'a', word: 'Lowercase', label: 'Lowercase, small', correct: !upper }],
          why: 'It is ' + (upper ? 'an uppercase ' + l.toUpperCase() : 'a lowercase ' + l) + '.', sayWhy: 'Yes! It is ' + (upper ? 'uppercase.' : 'lowercase.') };
      } },
      { id: 'spot', label: 'Spot the big letter', make: function () {
        var three = sample(TWO_SHAPES, 3);
        var wantUpper = rand(2) === 0;
        var ch = shuffle(three.map(function (l, i) {
          var isOdd = i === 0;
          return cBig((isOdd === wantUpper) ? l.toUpperCase() : l, isOdd);
        }));
        return { type: 'choice', prompt: 'Only one of these is ' + (wantUpper ? 'an uppercase' : 'a lowercase') + ' letter. Which one?',
          key: 'spot' + three.join(''), choices: ch, why: 'The other two are ' + (wantUpper ? 'lowercase.' : 'uppercase.') };
      } },
      { id: 'next', label: 'ABC order', make: function () {
        var i = between(0, 22);
        var upper = rand(2) === 0;
        var f = function (x) { return upper ? x.toUpperCase() : x; };
        var ans = LOWER[i + 3];
        var wrong = sample(LOWER.filter(function (x) { return x !== ans && LOWER.slice(i, i + 3).indexOf(x) < 0; }), 2);
        return { type: 'choice', stim: seq([f(LOWER[i]), f(LOWER[i + 1]), f(LOWER[i + 2]), '?']), prompt: 'Which letter comes next?',
          choices: shuffle([cBig(f(ans), true), cBig(f(wrong[0])), cBig(f(wrong[1]))]),
          why: LOWER.slice(i, i + 4).map(f).join(', ') + '.' };
      } },
      { id: 'starts', label: 'First sound', make: function () {
        var three = sample(STARTS, 3);
        var a = three[0];
        return { type: 'choice', stim: glyph(a.l.toUpperCase() + a.l), prompt: 'Which word starts with this letter?',
          say: 'Which word starts with the letter ' + a.l.toUpperCase() + '? | ' + shuffle(three).map(function (x) { return x.w; }).join(', ') + '?',
          choices: shuffle(three.map(function (x, i) { return cPic(x, i === 0); })), why: a.w + ' starts with ' + a.l.toUpperCase() + '.' };
      } }
    ]
  };

  // Mostly teens and twenties, with a little below and above.
  function focusNumber() {
    var r = Math.random();
    if (r < 0.45) return between(11, 19);
    if (r < 0.8) return between(20, 29);
    if (r < 0.9) return between(1, 10);
    return between(30, 50);
  }
  function mixups(n) {
    var rev = (n % 10) * 10 + Math.floor(n / 10);
    var out = [rev, n + 1, n - 1, n + 10, n - 10];
    if (n > 12 && n < 20) out.unshift((n - 10) * 10);   // thirteen vs thirty
    if (n % 10 === 0 && n >= 30) out.unshift(n / 10 + 10);
    return out.filter(function (x) { return x >= 1 && x <= 59; });
  }

  var numberDeck = {
    id: 'numbers', name: 'Number Hunt', icon: '🔢', blurb: 'Numbers to 50, teens and twenties first', color: '#3bb273', tint: '#d9f2e4',
    skills: [
      { id: 'hear', label: 'Listen and find', make: function () {
        var n = focusNumber();
        return { type: 'choice', prompt: 'Tap the number you hear.', say: 'Tap the number ' + numWord(n) + '.', readAloud: numWord(n),
          key: 'hear' + n, choices: numChoices(n, mixups(n)), why: 'That is ' + numWord(n) + '.' };
      } },
      { id: 'name', label: 'Say the number', make: function () {
        var n = focusNumber();
        return { type: 'open', stim: glyph(n), prompt: pick(['What number is this? Say it out loud.', 'Read this number out loud.']), answer: numWord(n),
          detail: n > 12 && n < 20 ? 'Teen numbers start with a 1.' : (n >= 20 ? Math.floor(n / 10) + ' tens and ' + (n % 10) + ' ones.' : '') };
      } },
      { id: 'after', label: 'What comes next', make: function () {
        var n = Math.min(focusNumber(), 49);
        var start = Math.max(1, n - 2);
        var row = []; for (var i = start; i <= n; i++) row.push(i);
        return { type: 'choice', stim: seq(row.concat('?')), prompt: pick(['What number comes next?', 'Keep counting. What comes after ' + n + '?']),
          choices: numChoices(n + 1, [n + 2, n - 1, n + 11, n + 10, n]), why: row.concat(n + 1).join(', ') + '.' };
      } },
      { id: 'before', label: 'What comes before', make: function () {
        var n = Math.max(focusNumber(), 3);
        return { type: 'choice', stim: seq(['?', n, n + 1]), prompt: 'What number comes right before ' + n + '?',
          choices: numChoices(n - 1, [n + 1, n - 2, n - 11, n + 9, n - 10]), why: [n - 1, n, n + 1].join(', ') + '.' };
      } },
      { id: 'missing', label: 'Missing number', make: function () {
        var n = Math.max(focusNumber(), 2);
        return { type: 'choice', stim: seq([n - 1, '?', n + 1, n + 2]), prompt: 'One number is hiding. Which one?',
          choices: numChoices(n, [n + 3, n - 2, n + 10, n - 10, n + 4]), why: [n - 1, n, n + 1, n + 2].join(', ') + '.' };
      } },
      { id: 'compare', label: 'Bigger or smaller', make: function () {
        var a = focusNumber(), b = focusNumber();
        if (a === b) b = a + between(1, 6);
        var bigger = rand(2) === 0;
        var ans = bigger ? Math.max(a, b) : Math.min(a, b);
        return { type: 'choice', cols: 2, prompt: bigger ? pick(['Which number is bigger?', 'Which is more?']) : pick(['Which number is smaller?', 'Which is less?']),
          say: (bigger ? 'Which number is bigger? | ' : 'Which number is smaller? | ') + numWord(a) + ', or ' + numWord(b) + '?',
          key: 'cmp' + a + '-' + b + bigger, choices: [cBig(a, a === ans), cBig(b, b === ans)],
          why: ans + ' is ' + (bigger ? 'bigger' : 'smaller') + ' than ' + (ans === a ? b : a) + '.' };
      } },
      { id: 'count', label: 'Count the dots', make: function () {
        var n = between(11, 29);
        var tens = Math.floor(n / 10), ones = n % 10;
        return { type: 'choice', stim: frames(n),
          prompt: pick(['How many dots are there?', tens + (tens === 1 ? ' full box of ten' : ' full boxes of ten') + (ones ? ' and ' + ones + ' more' : '') + '. How many dots?']),
          choices: numChoices(n, [ones * 10 + tens, n + 1, n - 1, n + 10, n - 10]),
          why: tens + (tens === 1 ? ' ten' : ' tens') + ' and ' + ones + (ones === 1 ? ' one' : ' ones') + ' make ' + n + '.' };
      } }
    ]
  };

  var tensDeck = {
    id: 'tens', name: 'Count by Tens', icon: '🔟', blurb: '10, 20, 30 and on to 100', color: '#f2c14e', tint: '#fdf1cf',
    skills: [
      { id: 'next', label: 'What comes next', make: function () {
        var n = between(2, 9) * 10;
        var row = [n - 10, n].filter(function (x) { return x > 0; });
        if (n >= 30) row.unshift(n - 20);
        return { type: 'choice', stim: seq(row.concat('?')), prompt: 'Count by tens. What comes next?',
          choices: numChoices(n + 10, [n + 1, n + 20, n + 5, n - 10, n + 11]), why: row.concat(n + 10).join(', ') + '.' };
      } },
      { id: 'missing', label: 'Missing ten', make: function () {
        var n = between(2, 8) * 10;
        return { type: 'choice', stim: seq([n - 10, '?', n + 10, n + 20]), prompt: 'We are counting by tens. Which number is hiding?',
          choices: numChoices(n, [n + 5, n - 9, n + 30, n - 20, n + 1]), why: [n - 10, n, n + 10, n + 20].join(', ') + '.' };
      } },
      { id: 'boxes', label: 'Boxes of ten', make: function () {
        var k = between(2, 6);
        return { type: 'choice', stim: frames(k * 10, true), prompt: 'Each box holds 10 dots. Count by tens. How many dots?',
          choices: numChoices(k * 10, [k, k * 10 + 10, k * 10 - 10, k + 10]), why: k + ' tens make ' + (k * 10) + '.' };
      } },
      { id: 'dimes', label: 'Counting dimes', make: function () {
        var k = between(2, 6);
        var ids = []; for (var i = 0; i < k; i++) ids.push('dime');
        return { type: 'choice', stim: coinRow(ids, 3), prompt: 'Each dime is 10 cents. Count by tens. How many cents?',
          choices: numChoices(k * 10, [k, k * 10 + 10, k * 10 - 10, k * 5]).map(function (c) { c.big += '¢'; c.label += ' cents'; return c; }),
          why: k + ' dimes are ' + (k * 10) + ' cents.' };
      } },
      { id: 'notten', label: 'Which one does not belong', make: function () {
        var tens = sample([10, 20, 30, 40, 50, 60, 70, 80, 90], 2);
        var odd = between(1, 8) * 10 + pick([2, 5, 7]);
        return { type: 'choice', prompt: 'Which number do you skip when you count by tens?',
          key: 'not' + odd, choices: shuffle([cBig(tens[0]), cBig(tens[1]), cBig(odd, true)]), why: 'Tens numbers end in zero. ' + odd + ' does not.' };
      } },
      { id: 'say', label: 'Count out loud', make: function () {
        var from = pick([10, 10, 20, 30, 50]);
        var list = []; for (var n = from; n <= 100; n += 10) list.push(n);
        return { type: 'open', prompt: from === 10 ? 'Count by tens all the way to 100.' : 'Start at ' + from + ' and count by tens to 100.',
          key: 'say' + from, answer: list.join(', ') };
      } }
    ]
  };

  var coinDeck = {
    id: 'coins', name: 'Coin Jar', icon: '🪙', blurb: 'Penny, nickel, dime, quarter', color: '#c9a27c', tint: '#f3e7da',
    skills: [
      { id: 'find', label: 'Find the coin', make: function () {
        var id = pick(COIN_IDS);
        return { type: 'choice', cols: 2, prompt: pick(['Which coin is the ' + id + '?', 'Tap the ' + id + '.', 'Can you find the ' + id + '?']),
          key: 'find' + id, choices: shuffle(COIN_IDS.map(function (c) { return cCoin(c, c === id); })), why: 'That is the ' + id + '. It is worth ' + COINS[id].cents + (id === 'penny' ? ' cent.' : ' cents.') };
      } },
      { id: 'name', label: 'Name the coin', make: function () {
        var id = pick(COIN_IDS);
        return { type: 'open', stim: coinRow([id], 6, true), prompt: 'What is this coin called?', key: 'name' + id,
          answer: 'A ' + id, detail: 'It is worth ' + COINS[id].cents + (id === 'penny' ? ' cent.' : ' cents.') };
      } },
      { id: 'worth', label: 'How many cents', make: function () {
        var id = pick(COIN_IDS);
        return { type: 'choice', cols: 2, stim: coinRow([id], 6, true), prompt: 'This is a ' + id + '. How many cents is it worth?', key: 'worth' + id,
          choices: [1, 5, 10, 25].map(function (v) { return { big: v + '¢', label: v + ' cents', correct: v === COINS[id].cents }; }),
          why: 'A ' + id + ' is ' + COINS[id].cents + (id === 'penny' ? ' cent.' : ' cents.') };
      } },
      { id: 'byvalue', label: 'Find it by value', make: function () {
        var id = pick(COIN_IDS);
        var v = COINS[id].cents;
        return { type: 'choice', cols: 2, prompt: 'Which coin is worth ' + v + (v === 1 ? ' cent?' : ' cents?'), key: 'val' + id,
          choices: shuffle(COIN_IDS.map(function (c) { return cCoin(c, c === id); })), why: 'The ' + id + ' is worth ' + v + (v === 1 ? ' cent.' : ' cents.') };
      } },
      { id: 'more', label: 'Worth more', make: function () {
        var two = sample(COIN_IDS, 2);
        var more = rand(3) > 0;
        var a = COINS[two[0]], b = COINS[two[1]];
        var ans = (a.cents > b.cents) === more ? a : b;
        var other = ans === a ? b : a;
        return { type: 'choice', cols: 2, prompt: more ? 'Which coin is worth more?' : 'Which coin is worth less?',
          say: (more ? 'Which coin is worth more? | The ' : 'Which coin is worth less? | The ') + a.name + ', or the ' + b.name + '?', key: 'more' + two.join('') + more,
          choices: [cCoin(a.name, ans === a), cCoin(b.name, ans === b)],
          why: 'A ' + ans.name + ' is ' + ans.cents + '¢. A ' + other.name + ' is ' + other.cents + '¢.' + (ans.name === 'dime' && more ? ' Small coin, bigger value!' : '') };
      } },
      { id: 'clue', label: 'Who am I', make: function () {
        var clues = { penny: 'I am the only brown coin. I am worth 1 cent.', nickel: 'I am silver with a smooth edge. I am worth 5 cents.',
          dime: 'I am the smallest coin, but I am worth 10 cents.', quarter: 'I am the biggest coin here. I am worth 25 cents.' };
        var id = pick(COIN_IDS);
        return { type: 'choice', cols: 2, prompt: clues[id] + ' Which coin am I?', key: 'clue' + id,
          choices: shuffle(COIN_IDS.map(function (c) { return cCoin(c, c === id); })), why: 'It is the ' + id + '.' };
      } },
      { id: 'pennies', label: 'Count the pennies', make: function () {
        var k = between(3, 9);
        var ids = []; for (var i = 0; i < k; i++) ids.push('penny');
        return { type: 'choice', stim: coinRow(ids, 3), prompt: 'Each penny is 1 cent. How many cents are here?',
          choices: numChoices(k, [k + 1, k - 1, k + 2, k * 10]).map(function (c) { c.big += '¢'; c.label += ' cents'; return c; }), why: k + ' pennies are ' + k + ' cents.' };
      } }
    ]
  };

  function today() { return new Date(); }
  var calendarDeck = {
    id: 'calendar', name: 'Calendar Club', icon: '📅', blurb: 'Days, weeks, months and dates', color: '#9b7ede', tint: '#ebe4fb',
    skills: [
      { id: 'finddate', label: 'Find the date', make: function () {
        var t = today();
        var info = monthInfo(t.getFullYear(), t.getMonth());
        var d = between(1, info.days);
        return { type: 'choice', layout: 'calendar', info: info, answerDay: d, prompt: pick(['Find the number ' + d + ' on the calendar.', 'Tap the ' + ordinal(d) + ' day of ' + info.name + '.']),
          say: 'Find the number ' + numWord(d) + ' on the calendar.', readAloud: numWord(d), key: 'find' + d, why: 'That is ' + info.name + ' ' + ordinal(d) + '.' };
      } },
      { id: 'readdate', label: 'Read the date', make: function () {
        var t = today();
        var info = monthInfo(t.getFullYear(), t.getMonth());
        var d = between(1, info.days);
        return { type: 'choice', stim: calendarShown(info, d), prompt: 'One day is colored in. What number is it?', key: 'read' + d,
          choices: numChoices(d, mixups(d).filter(function (x) { return x <= 31; }).concat([d + 2, d - 2, d + 7])), why: 'It is the ' + ordinal(d) + '.' };
      } },
      { id: 'weekday', label: 'Which day of the week', make: function () {
        var t = today();
        var info = monthInfo(t.getFullYear(), t.getMonth());
        var d = between(1, info.days);
        return { type: 'open', stim: calendarShown(info, d), prompt: 'Look at the top of the column. What day of the week is the ' + ordinal(d) + '?', key: 'wd' + d,
          answer: DAYS[new Date(info.year, info.month, d).getDay()], detail: 'The letters across the top stand for Sunday through Saturday.' };
      } },
      { id: 'today', label: 'Today', make: function () {
        var t = today();
        var q = pick([
          ['What day of the week is it today?', DAYS[t.getDay()]],
          ['What day will it be tomorrow?', DAYS[(t.getDay() + 1) % 7]],
          ['What day was it yesterday?', DAYS[(t.getDay() + 6) % 7]],
          ['What month is it right now?', MONTHS[t.getMonth()]],
          ['What is today’s date? Say the month and the number.', MONTHS[t.getMonth()] + ' ' + ordinal(t.getDate())]
        ]);
        return { type: 'open', stim: calendarShown(monthInfo(t.getFullYear(), t.getMonth()), t.getDate()), prompt: q[0], answer: q[1], detail: 'Today is colored in on the calendar.' };
      } },
      { id: 'dayorder', label: 'Days in order', make: function () {
        var i = rand(7);
        var q = pick([
          ['What day comes after ' + DAYS[i] + '?', DAYS[(i + 1) % 7]],
          ['What day comes before ' + DAYS[i] + '?', DAYS[(i + 6) % 7]],
          ['Is ' + DAYS[i] + ' a school day or a weekend day?', i === 0 || i === 6 ? 'A weekend day' : 'A school day'],
          ['Say all the days of the week, starting with Sunday.', DAYS.join(', ')]
        ]);
        return { type: 'open', prompt: q[0], answer: q[1] };
      } },
      { id: 'monthorder', label: 'Months in order', make: function () {
        var i = rand(12);
        var q = pick([
          ['What month comes after ' + MONTHS[i] + '?', MONTHS[(i + 1) % 12]],
          ['What month comes before ' + MONTHS[i] + '?', MONTHS[(i + 11) % 12]],
          ['What is the first month of the year?', 'January'],
          ['What is the last month of the year?', 'December']
        ]);
        return { type: 'open', prompt: q[0], answer: q[1] };
      } },
      { id: 'facts', label: 'How many', make: function () {
        var t = today();
        var info = monthInfo(t.getFullYear(), t.getMonth());
        var q = pick([
          ['How many days are in one week?', 7, [5, 10, 12], null],
          ['How many months are in one year?', 12, [7, 10, 30], null],
          ['Look at the calendar. What is the last number in ' + info.name + '?', info.days, [info.days === 30 ? 31 : 30, 20, 7], calendarShown(info)]
        ]);
        return { type: 'choice', stim: q[3], prompt: q[0], choices: numChoices(q[1], q[2]), why: q[1] + '.' };
      } }
    ]
  };

  function phoneDigits() { return String(state.profile.phone || '').replace(/\D/g, ''); }
  function phonePretty(d) {
    if (d.length === 10) return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
    if (d.length === 7) return d.slice(0, 3) + '-' + d.slice(3);
    return d;
  }
  function whose() { return (state.profile.phoneOwner || '').trim() || 'your'; }
  function hasBirthday() { return state.profile.bMonth >= 0 && state.profile.bMonth !== '' && state.profile.bDay > 0; }

  var meDeck = {
    id: 'me', name: 'All About Me', icon: '🏠', blurb: 'Birthday, address, phone number', color: '#ef6f9c', tint: '#fce1ea', needsProfile: true,
    skills: [
      { id: 'birthday', label: 'My birthday', ready: hasBirthday, make: function () {
        var p = state.profile;
        var q = pick([['When is your birthday?', MONTHS[p.bMonth] + ' ' + ordinal(+p.bDay)], ['What month is your birthday in?', MONTHS[p.bMonth]],
          ['Your birthday is in ' + MONTHS[p.bMonth] + '. What number day?', ordinal(+p.bDay)]]);
        return { type: 'open', stim: h('div', { class: 'pic' }, h('span', { class: 'emoji', 'aria-hidden': 'true', text: '🎂' })), prompt: q[0], answer: q[1] };
      } },
      { id: 'birthdaycal', label: 'Birthday on the calendar', ready: hasBirthday, make: function () {
        var p = state.profile, t = today();
        var year = t.getFullYear() + (new Date(t.getFullYear(), +p.bMonth, +p.bDay) < new Date(t.getFullYear(), t.getMonth(), t.getDate()) ? 1 : 0);
        var info = monthInfo(year, +p.bMonth);
        return { type: 'choice', layout: 'calendar', info: info, answerDay: Math.min(+p.bDay, info.days),
          prompt: 'Your birthday is ' + MONTHS[p.bMonth] + ' ' + ordinal(+p.bDay) + '. Find it on the calendar.', why: 'Happy birthday on ' + MONTHS[p.bMonth] + ' ' + ordinal(+p.bDay) + '!' };
      } },
      { id: 'address', label: 'My address', ready: function () { return !!(state.profile.street || '').trim(); }, make: function () {
        var p = state.profile;
        var full = [(p.houseNumber || '') + ' ' + p.street, p.city].filter(function (x) { return x && x.trim(); }).join(', ');
        var qs = [['What is your address?', full.trim()], ['What street do you live on?', p.street]];
        if ((p.city || '').trim()) qs.push(['What city or town do you live in?', p.city]);
        var q = pick(qs);
        return { type: 'open', stim: h('div', { class: 'pic' }, h('span', { class: 'emoji', 'aria-hidden': 'true', text: '🏠' })), prompt: q[0], answer: q[1] };
      } },
      { id: 'house', label: 'My house number', ready: function () { return /^\d+$/.test(String(state.profile.houseNumber || '').trim()); }, make: function () {
        var n = +state.profile.houseNumber;
        var str = String(n);
        var swapped = str.length > 1 ? +(str.slice(0, -2) + str.slice(-1) + str.slice(-2, -1)) : n + 3;
        return { type: 'choice', stim: h('div', { class: 'pic' }, h('span', { class: 'emoji', 'aria-hidden': 'true', text: '🏠' })), prompt: 'Which one is your house number?',
          choices: numChoices(n, [swapped, n + 10, n - 1, n + 2, n + 100]), why: 'Your house number is ' + n + '.', sayWhy: 'Yes! That is your house number.' };
      } },
      { id: 'phonecopy', label: 'Dial it', ready: function () { return phoneDigits().length >= 7; }, make: function () {
        return { type: 'dial', digits: phoneDigits(), show: true, prompt: 'Dial ' + whose() + ' phone number.', say: 'Dial ' + whose() + ' phone number. Tap each number in order.' };
      } },
      { id: 'phonenext', label: 'What comes next', ready: function () { return phoneDigits().length >= 7; }, make: function () {
        var d = phoneDigits();
        var k = between(1, d.length - 1);
        var ans = +d[k];
        var pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== ans; });
        var wrong = sample(pool, 2);
        return { type: 'choice', stim: h('div', { class: 'seq' }, h('span', { text: phonePretty(d).slice(0, prettyIndex(d, k)) + ' ?' })),
          prompt: 'This is the start of ' + whose() + ' phone number. What number comes next?', key: 'pn' + k,
          choices: shuffle([{ big: String(ans), label: String(ans), correct: true }, cBig(wrong[0]), cBig(wrong[1])]), why: phonePretty(d) };
      } },
      { id: 'phonememory', label: 'Dial from memory', ready: function () { return phoneDigits().length >= 7 && skillStat('me', 'phonecopy').right >= 2; }, make: function () {
        return { type: 'dial', digits: phoneDigits(), show: false, prompt: 'Dial ' + whose() + ' phone number from memory.', say: 'Can you dial ' + whose() + ' phone number from memory? Tap peek if you get stuck.' };
      } },
      { id: 'phonesay', label: 'Say the number', ready: function () { return phoneDigits().length >= 7; }, make: function () {
        return { type: 'open', stim: h('div', { class: 'pic' }, h('span', { class: 'emoji', 'aria-hidden': 'true', text: '📱' })), prompt: 'Say ' + whose() + ' phone number out loud.', answer: phonePretty(phoneDigits()) };
      } }
    ]
  };
  // Position of the k-th digit inside the pretty-printed phone string
  function prettyIndex(d, k) {
    var pretty = phonePretty(d), seen = -1;
    for (var i = 0; i < pretty.length; i++) { if (/\d/.test(pretty[i])) seen++; if (seen === k) return i; }
    return pretty.length;
  }

  var mixDeck = { id: 'mix', name: 'Mix It Up', icon: '🌈', blurb: 'A little of everything', color: '#1d2a44', tint: '#e3e7ef', mix: true, skills: [] };

  var LEVELS = [
    { id: 'prek', label: 'Pre-K', decks: [mixDeck, rhymeDeck, letterDeck, numberDeck, tensDeck, coinDeck, calendarDeck, meDeck] }
  ];
  function findDeck(id) {
    for (var i = 0; i < LEVELS.length; i++) for (var j = 0; j < LEVELS[i].decks.length; j++) if (LEVELS[i].decks[j].id === id) return { deck: LEVELS[i].decks[j], level: LEVELS[i] };
    return null;
  }
  // Every skill a deck can ask right now, tagged with the deck it reports to.
  function readySkills(deck, level) {
    var out = [];
    var from = deck.mix ? level.decks.filter(function (d) { return !d.mix; }) : [deck];
    from.forEach(function (d) {
      d.skills.forEach(function (sk) { if (!sk.ready || sk.ready()) out.push({ deck: d, skill: sk }); });
    });
    return out;
  }

  var CARDS_PER_ROUND = 8;
  // Weaker skills come up more often. Unseen skills sit in the middle.
  function weight(entry) {
    var st = skillStat(entry.deck.id, entry.skill.id);
    var acc = st.seen ? st.right / st.seen : 0.5;
    return 1 + 2 * (1 - acc);
  }
  function drawCard(pool, lastSkill, usedKeys) {
    for (var tries = 0; tries < 30; tries++) {
      var total = 0;
      var opts = pool.filter(function (e) { return pool.length < 2 || e.skill !== lastSkill; });
      opts.forEach(function (e) { total += weight(e); });
      var r = Math.random() * total, chosen = opts[0];
      for (var i = 0; i < opts.length; i++) { r -= weight(opts[i]); if (r <= 0) { chosen = opts[i]; break; } }
      var card = chosen.skill.make();
      if (!card) continue;
      var key = chosen.skill.id + '|' + (card.key || card.prompt + (card.answer || ''));
      if (usedKeys[key] && tries < 25) continue;
      usedKeys[key] = true;
      card.entry = chosen;
      return card;
    }
    return null;
  }

  /* ---------- 5. Screens ---------- */
  var root = document.documentElement;
  var app = document.getElementById('app');
  var wipe = h('div', { class: 'wipe', 'aria-hidden': 'true' });
  document.body.insertBefore(wipe, app);
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Screen colors, as [background, text on it].
  var COLORS = {
    orange: ['#ff7a2f', '#1c0f05'], yellow: ['#ffd60a', '#1e1800'], pink: ['#ff5ca8', '#2b0616'],
    blue: ['#2f6bff', '#ffffff'], green: ['#3ddc97', '#04231a'], purple: ['#7b4dff', '#ffffff'],
    sky: ['#4cc9f0', '#04202b'], red: ['#ff4a3d', '#2a0805'], navy: ['#1b2a6b', '#ffe55c'],
    lilac: ['#c9a7ff', '#1d0b3d'], cream: ['#fff3d6', '#1b1330']
  };
  var DECK_COLOR = { mix: 'lilac', rhyme: 'orange', letters: 'blue', numbers: 'green', tens: 'yellow', coins: 'sky', calendar: 'purple', me: 'pink' };
  // Green is left out of play so a right answer (green) always stands out.
  var PLAY_COLORS = ['orange', 'yellow', 'pink', 'blue', 'purple', 'sky', 'red', 'navy', 'lilac'];
  var PRAISE = ['Yes!', 'You got it!', 'Nice thinking!', 'That’s it!', 'Way to go!', 'Great job!'];

  // Remember where the last tap was, so the next color can grow out of it.
  var tap = null;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button');
    if (!b) return;
    var r = b.getBoundingClientRect();
    tap = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: Date.now() };
  }, true);

  var wipeAnim = null, wipeTarget = null;
  function paint(name) {
    var pair = COLORS[name];
    root.style.setProperty('--bg', pair[0]);
    root.style.setProperty('--ink', pair[1]);
    if (themeMeta) themeMeta.setAttribute('content', pair[0]);
    if (wipeAnim) { root.style.setProperty('--stage', wipeTarget); wipeAnim.cancel(); wipeAnim = null; }
    if (reduce || !wipe.animate || getComputedStyle(root).getPropertyValue('--stage').trim() === pair[0]) { root.style.setProperty('--stage', pair[0]); return; }
    var W = window.innerWidth, H = window.innerHeight;
    var ox = tap && Date.now() - tap.at < 1500 ? tap.x : W / 2;
    var oy = tap && Date.now() - tap.at < 1500 ? tap.y : H;
    var r = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) + 8;
    var anim = wipe.animate(
      [{ clipPath: 'circle(0px at ' + ox + 'px ' + oy + 'px)' }, { clipPath: 'circle(' + r + 'px at ' + ox + 'px ' + oy + 'px)' }],
      { duration: 480, easing: 'cubic-bezier(.25,.7,.25,1)', fill: 'forwards' });
    wipeAnim = anim; wipeTarget = pair[0];
    anim.onfinish = function () {
      if (wipeAnim !== anim) return;
      root.style.setProperty('--stage', pair[0]); anim.cancel(); wipeAnim = null;
    };
  }

  // Stars flying out of a right answer.
  function burst(el) {
    if (reduce || !el.animate) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 9; i++) {
      var sp = h('span', { class: 'spark', 'aria-hidden': 'true', text: pick(['⭐', '✨', '⭐', '🌟']) });
      sp.style.left = cx + 'px'; sp.style.top = cy + 'px';
      document.body.appendChild(sp);
      var ang = (i / 9) * Math.PI * 2 + Math.random() * 0.6, dist = 80 + Math.random() * 90;
      var a = sp.animate([
        { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + Math.cos(ang) * dist + 'px), calc(-50% + ' + Math.sin(ang) * dist + 'px)) scale(1.2) rotate(' + (Math.random() * 180 - 90) + 'deg)', opacity: 1, offset: 0.7 },
        { transform: 'translate(calc(-50% + ' + Math.cos(ang) * dist * 1.15 + 'px), calc(-50% + ' + (Math.sin(ang) * dist * 1.15 + 30) + 'px)) scale(.6)', opacity: 0 }
      ], { duration: 750, easing: 'cubic-bezier(.2,.8,.3,1)' });
      a.onfinish = (function (n) { return function () { n.remove(); }; })(sp);
    }
  }

  function stars(n, cls) {
    var el = h('div', { class: cls, role: 'img', 'aria-label': n + ' out of 3 stars' });
    for (var i = 0; i < 3; i++) {
      var st = h('span', { class: i < n ? '' : 'off', 'aria-hidden': 'true', text: '⭐' });
      st.style.setProperty('--i', i);
      el.appendChild(st);
    }
    return el;
  }
  function stagger(el, cls, i) { el.classList.add(cls); el.style.setProperty('--i', i); return el; }
  function words(text) {
    var out = [];
    text.split(' ').forEach(function (w, i, all) {
      out.push(stagger(h('span', { class: 'w', text: w }), 'rise', i));
      if (i < all.length - 1) out.push(document.createTextNode(' '));
    });
    return out;
  }
  function show(node, color) {
    hush();
    paint(color);
    app.replaceChildren(node);
    window.scrollTo(0, 0);
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  var ICON_X = function () { return s('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, s('path', { d: 'M6 6l12 12M18 6L6 18', fill: 'none', stroke: 'currentColor', 'stroke-width': 3.4, 'stroke-linecap': 'round' })); };
  var ICON_ARROW = function () { return s('svg', { class: 'arrow', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, s('path', { d: 'M4 12h15M13 5.5l6.5 6.5-6.5 6.5', fill: 'none', stroke: 'currentColor', 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })); };
  var ICON_SOUND = function () { return s('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, s('path', { d: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4z', fill: 'currentColor' }), s('path', { d: 'M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round' })); };

  function home() {
    var name = (state.profile.name || '').trim();
    var view = h('main', { class: 'home' },
      stagger(h('h1', { class: 'home-title', text: 'Wonder Deck' }), 'rise', 0),
      stagger(h('p', { class: 'home-sub', text: name ? 'Hi, ' + name + '! Pick one.' : 'Pick one.' }), 'rise', 1));
    var n = 0;
    LEVELS.forEach(function (level) {
      if (LEVELS.length > 1) view.appendChild(h('h2', { class: 'level', text: level.label }));
      var list = h('ul', { class: 'decks' });
      level.decks.forEach(function (deck) {
        var best = (state.stats[deck.id] || {}).best || 0;
        var locked = deck.needsProfile && !readySkills(deck, level).length;
        var pair = COLORS[DECK_COLOR[deck.id] || 'orange'];
        var btn = h('button', { class: 'deck', type: 'button', onclick: function () { go(locked ? '#grownups' : '#play-' + deck.id); } },
          h('span', { class: 'deck-icon', 'aria-hidden': 'true', text: deck.icon }),
          h('span', {},
            h('span', { class: 'deck-name', text: deck.name }),
            locked ? h('span', { class: 'deck-note', text: ' Ask a grown-up to set this up.' }) : null),
          !locked && best ? stars(best, 'deck-stars') : null);
        btn.style.setProperty('--tile', pair[0]);
        btn.style.setProperty('--tile-ink', pair[1]);
        list.appendChild(stagger(h('li', {}, btn), 'pop', n++));
      });
      view.appendChild(list);
    });
    view.appendChild(h('div', { class: 'home-foot' }, h('button', { class: 'btn btn--ghost btn--small', type: 'button', text: 'Grown-ups', onclick: function () { go('#grownups'); } })));
    show(view, 'navy');
  }

  function play(found) {
    var deck = found.deck;
    var pool = readySkills(deck, found.level);
    if (!pool.length) { go('#grownups'); return; }
    var used = {}, total = CARDS_PER_ROUND, index = 0, firstTryCount = 0, extras = 0, lastSkill = null, current = null;
    var recentColors = [], color = DECK_COLOR[deck.id] === 'green' ? 'orange' : DECK_COLOR[deck.id];

    var fill = h('i', {});
    var replay = h('button', { class: 'round', type: 'button', 'aria-label': 'Hear the question again', onclick: function () { if (current) speak(current.say || current.prompt); } }, ICON_SOUND());
    replay.hidden = !canSpeak || !state.voice;
    var cardHost = h('div', { class: 'card' });
    var view = h('main', { class: 'play' },
      h('div', { class: 'bar' },
        h('button', { class: 'round', type: 'button', 'aria-label': 'Stop and go back to all decks', onclick: function () { go(''); } }, ICON_X()),
        h('div', { class: 'track', role: 'progressbar', 'aria-label': 'Cards done', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': '0' }, fill),
        replay),
      cardHost);
    var track = fill.parentNode;

    function nextColor() {
      var opts = PLAY_COLORS.filter(function (c) { return c !== color && recentColors.indexOf(c) < 0; });
      color = pick(opts);
      recentColors.push(color);
      if (recentColors.length > 3) recentColors.shift();
      return color;
    }
    function progress() {
      fill.style.width = Math.round(100 * index / total) + '%';
      track.setAttribute('aria-valuemax', String(total));
      track.setAttribute('aria-valuenow', String(index));
    }
    function record(card, firstTry) {
      var st = skillStat(card.entry.deck.id, card.entry.skill.id);
      st.seen++;
      if (firstTry) { st.right++; firstTryCount++; }
      else if (extras < 2) { extras++; total++; card.entry.again = true; }
      save();
    }
    function nextCard() {
      index++;
      progress();
      if (index >= total) return finish();
      paint(nextColor());
      deal();
    }
    function deal() {
      // A missed question style gets one more fresh question later in the round.
      var retry = pool.filter(function (e) { return e.again; })[0];
      var card = null;
      if (retry && index >= total - extras) { retry.again = false; card = drawCard([retry], null, used); }
      if (!card) card = drawCard(pool, lastSkill, used);
      if (!card) return finish();
      current = card;
      lastSkill = card.entry.skill;
      cardHost.replaceChildren.apply(cardHost, renderCard(card));
      window.scrollTo(0, 0);
      speak(card.say || card.prompt);
    }

    function renderCard(card) {
      var feedback = h('div', { class: 'feedback', role: 'status' });
      var actions = h('div', { class: 'actions' });
      var answers = h('div', { class: 'answers' });
      var mid = h('div', { class: 'mid' },
        card.stim ? stagger(h('div', { class: 'stim' }, card.stim), 'pop', 0) : null,
        h('h1', { class: 'prompt', tabindex: '-1' }, words(card.prompt)),
        card.readAloud && !(canSpeak && state.voice) ? h('p', { class: 'note' }, 'Grown-up, say: ' + card.readAloud) : null);
      var kicker = h('p', { class: 'kicker' }, h('span', { 'aria-hidden': 'true', text: card.entry.deck.icon + ' ' }), card.entry.skill.label);

      function nudge() {
        feedback.className = 'feedback';
        void feedback.offsetWidth;
        feedback.className = 'feedback nudge';
        feedback.textContent = pick(['Try again!', 'Look again.', 'Almost!']);
        speak(feedback.textContent);
      }
      function done(firstTry, why, sayWhy, from) {
        record(card, firstTry);
        var praise = pick(PRAISE);
        feedback.className = 'feedback good';
        feedback.textContent = praise + (why ? ' ' + why : '');
        speak(sayWhy || (praise + ' ' + (why || '')));
        if (from) burst(from);
        var next = h('button', { class: 'btn btn--go', type: 'button', onclick: nextCard }, index + 1 >= total ? 'Finish' : 'Next', ICON_ARROW());
        actions.replaceChildren(next);
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      }

      if (card.type === 'open') {
        var answer = h('div', { class: 'answer' }, card.answer, card.detail ? h('small', { text: card.detail }) : null);
        var flip = h('button', { class: 'btn', type: 'button', text: 'Show answer', onclick: function () {
          mid.appendChild(answer);
          speak(card.answer);
          var got = h('button', { class: 'btn', type: 'button', text: 'Got it!', onclick: function () { burst(got); record(card, true); nextCard(); } });
          actions.replaceChildren(got, h('button', { class: 'btn btn--ghost', type: 'button', text: 'Not yet', onclick: function () { record(card, false); nextCard(); } }));
          got.focus({ preventScroll: true });
        } });
        actions.appendChild(flip);
      } else if (card.type === 'dial') {
        answers.appendChild(dialPad(card, nudge, done));
      } else {
        var misses = 0;
        var buttons = [];
        var onPick = function (btn, correct) {
          if (correct) {
            btn.classList.remove('pop');
            btn.classList.add('right');
            buttons.forEach(function (b) { b.disabled = true; });
            done(misses === 0, card.why, card.sayWhy, btn);
          } else {
            misses++;
            btn.classList.remove('pop');
            btn.classList.add('wrong');
            btn.disabled = true;
            nudge();
          }
        };
        if (card.layout === 'calendar') {
          answers.appendChild(stagger(calendar(card.info, function (d) {
            var b = h('button', { class: 'day', type: 'button', text: String(d) });
            b.addEventListener('click', function () { onPick(b, d === card.answerDay); });
            buttons.push(b);
            return b;
          }), 'pop', 1));
        } else {
          var grid = h('div', { class: 'choices' });
          grid.style.setProperty('--cols', card.cols || card.choices.length);
          card.choices.forEach(function (c, i) {
            var b = h('button', { class: 'choice', type: 'button', 'aria-label': c.label },
              c.coin ? coin(c.coin, 5.4) : null,
              c.emoji ? h('span', { class: 'emoji', 'aria-hidden': 'true', text: c.emoji }) : null,
              c.big ? h('span', { class: 'big', text: c.big }) : null,
              c.word ? h('span', { class: 'word', text: c.word }) : null);
            b.addEventListener('click', function () { onPick(b, c.correct); });
            buttons.push(b);
            grid.appendChild(stagger(b, 'pop', i + 2));
          });
          answers.appendChild(grid);
        }
      }
      return [kicker, mid, answers, h('div', { class: 'foot' }, feedback, actions)];
    }

    function dialPad(card, nudge, done) {
      var digits = card.digits, pos = 0, missesHere = 0, anyMiss = false, peeked = false;
      var shown = h('div', { class: 'answer', hidden: !card.show, text: phonePretty(digits) });
      var slots = h('div', { class: 'slots', 'aria-hidden': 'true' });
      var live = h('span', { class: 'sr', 'aria-live': 'polite' });
      var keys = {};
      function paintSlots() {
        slots.replaceChildren();
        for (var i = 0; i < digits.length; i++) {
          if (digits.length === 10 && (i === 3 || i === 6) || digits.length === 7 && i === 3) slots.appendChild(h('span', { class: 'gap' }));
          slots.appendChild(h('span', { class: i === pos ? 'now' : (i === pos - 1 ? 'in' : (i < pos ? 'in' : '')), text: i < pos ? digits[i] : '' }));
        }
      }
      var pad = h('div', { class: 'keypad' });
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(function (n, i) {
        var k = h('button', { class: 'key' + (n === 0 ? ' zero' : ''), type: 'button', text: String(n) });
        k.addEventListener('click', function () {
          if (pos >= digits.length) return;
          Object.keys(keys).forEach(function (x) { keys[x].classList.remove('hint', 'shake', 'pop'); });
          if (String(n) === digits[pos]) {
            pos++; missesHere = 0;
            live.textContent = n + ', ' + (digits.length - pos) + ' to go';
            paintSlots();
            if (pos >= digits.length) {
              Object.keys(keys).forEach(function (x) { keys[x].disabled = true; });
              shown.hidden = false;
              done(!anyMiss && !peeked, '', 'You did it!', slots);
            }
          } else {
            anyMiss = true; missesHere++;
            void k.offsetWidth; k.classList.add('shake');
            nudge();
            if (missesHere >= 2) keys[digits[pos]].classList.add('hint');
          }
        });
        keys[n] = k;
        pad.appendChild(stagger(k, 'pop', i));
      });
      paintSlots();
      var peek = card.show ? null : h('div', { class: 'peek' }, h('button', { class: 'btn btn--ghost btn--small', type: 'button', text: 'Peek', onclick: function () { peeked = true; shown.hidden = false; } }));
      return h('div', {}, shown, slots, pad, peek, live);
    }

    function finish() {
      var ratio = firstTryCount / total;
      var n = ratio >= 0.85 ? 3 : (ratio >= 0.5 ? 2 : 1);
      var d = state.stats[deck.id] || (state.stats[deck.id] = { plays: 0, best: 0, skills: {} });
      d.plays++; d.best = Math.max(d.best || 0, n);
      save();
      var name = (state.profile.name || '').trim();
      var again = h('button', { class: 'btn', type: 'button', text: 'Play again', onclick: function () { play(found); } });
      var msg = pick(['Nice work', 'Way to go', 'You did it']) + (name ? ', ' + name : '') + '!';
      var starRow = stars(n, 'finish-stars');
      show(h('main', { class: 'finish' },
        starRow,
        h('h1', { tabindex: '-1' }, words(msg)),
        stagger(h('p', { text: firstTryCount + ' of ' + total + ' on the first try.' }), 'rise', 4),
        stagger(h('div', { class: 'actions' }, again, h('button', { class: 'btn btn--ghost', type: 'button', text: 'All decks', onclick: function () { go(''); } })), 'rise', 5)), 'green');
      speak(msg);
      setTimeout(function () { if (starRow.isConnected) burst(starRow); }, 700);
      again.focus({ preventScroll: true });
    }

    show(view, color);
    progress();
    deal();
  }

  var unlocked = false;
  function grownups() {
    if (!unlocked) return gate();
    var p = state.profile;
    function field(label, input) { return h('label', { class: 'field' }, h('span', { text: label }), input); }
    function input(key, attrs) {
      var el = h('input', Object.assign({ type: 'text', autocomplete: 'off', value: p[key] == null ? '' : p[key] }, attrs || {}));
      el.dataset.key = key;
      return el;
    }
    var month = h('select', {}, h('option', { value: '', text: 'Month' }), MONTHS.map(function (m, i) { return h('option', { value: i, text: m, selected: String(p.bMonth) === String(i) }); }));
    month.dataset.key = 'bMonth';
    var day = h('select', {}, h('option', { value: '', text: 'Day' }));
    for (var d = 1; d <= 31; d++) day.appendChild(h('option', { value: d, text: String(d), selected: String(p.bDay) === String(d) }));
    day.dataset.key = 'bDay';
    var voice = h('input', { type: 'checkbox', checked: state.voice });
    var savedMsg = h('p', { class: 'saved', role: 'status' });

    var form = h('form', { class: 'panel', onsubmit: function (e) {
      e.preventDefault();
      form.querySelectorAll('[data-key]').forEach(function (el) { state.profile[el.dataset.key] = el.value.trim(); });
      state.voice = voice.checked;
      save();
      savedMsg.textContent = 'Saved on this device.';
    } },
      field('Child’s first name', input('name')),
      h('div', { class: 'row' }, field('Birthday month', month), field('Birthday day', day)),
      h('div', { class: 'row' }, field('House number', input('houseNumber', { inputmode: 'numeric' })), field('Street', input('street'))),
      field('City or town', input('city')),
      h('div', { class: 'row' }, field('Whose phone? (like “Mom’s”)', input('phoneOwner')), field('Phone number', input('phone', { type: 'tel', inputmode: 'tel' }))),
      h('label', { class: 'check' }, voice, h('span', { text: canSpeak ? 'Read questions out loud' : 'Read questions out loud (this browser has no voice, so read them yourself)' })),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', text: 'Save' })),
      savedMsg);

    var table = h('table', { class: 'progress' }, h('caption', { class: 'sr', text: 'First-try answers by question style' }));
    var any = false;
    LEVELS.forEach(function (level) {
      level.decks.forEach(function (deck) {
        if (deck.mix) return;
        var body = h('tbody', {}, h('tr', {}, h('th', { scope: 'rowgroup', colspan: '2', text: deck.icon + ' ' + deck.name })));
        deck.skills.forEach(function (sk) {
          var st = ((state.stats[deck.id] || {}).skills || {})[sk.id];
          if (!st || !st.seen) return;
          any = true;
          var pct = Math.round(100 * st.right / st.seen);
          body.appendChild(h('tr', {}, h('td', { text: sk.label }), h('td', { class: 'num' + (pct < 60 && st.seen >= 3 ? ' weak' : ''), text: st.right + ' of ' + st.seen + ' (' + pct + '%)' })));
        });
        if (body.children.length > 1) table.appendChild(body);
      });
    });

    show(h('main', { class: 'grown' },
      h('div', { class: 'bar' }, h('button', { class: 'btn btn--ghost btn--small', type: 'button', text: '← Decks', onclick: function () { go(''); } })),
      h('h1', { tabindex: '-1', text: 'Grown-ups' }),
      h('h2', { text: 'All About Me' }),
      h('p', { text: 'These fill in the birthday, address and phone cards. They are saved only in this browser on this device. Nothing is uploaded.' }),
      form,
      h('h2', { text: 'How it’s going' }),
      h('p', { text: 'Right on the first try, by question style. Anything under 60% is marked, and the decks already ask those more often.' }),
      any ? h('div', { class: 'panel' }, table) : h('p', { text: 'Nothing yet. Play a deck and check back.' }),
      h('div', { class: 'actions' }, h('button', { class: 'btn btn--ghost btn--small', type: 'button', text: 'Erase progress', onclick: function () {
        if (confirm('Erase all stars and progress on this device? The details above are kept.')) { state.stats = {}; save(); grownups(); }
      } }))), 'cream');
  }

  function gate() {
    var a = between(3, 9), b = between(3, 9);
    var answer = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-describedby': 'gate-msg' });
    var msg = h('p', { class: 'saved', id: 'gate-msg', role: 'status' });
    show(h('main', { class: 'grown' },
      h('div', { class: 'bar' }, h('button', { class: 'btn btn--ghost btn--small', type: 'button', text: '← Decks', onclick: function () { go(''); } })),
      h('h1', { text: 'Grown-ups only' }),
      h('form', { class: 'panel', onsubmit: function (e) {
        e.preventDefault();
        if (+answer.value === a * b) { unlocked = true; grownups(); }
        else { msg.textContent = 'Not quite. Try again.'; answer.select(); }
      } },
        h('label', { class: 'field' }, h('span', { text: 'What is ' + a + ' × ' + b + '?' }), answer),
        h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', text: 'Continue' })),
        msg)), 'cream');
    answer.focus();
  }

  function route() {
    var hash = location.hash.replace(/^#/, '');
    if (hash === 'grownups') return grownups();
    if (hash.indexOf('play-') === 0) {
      var found = findDeck(hash.slice(5));
      if (found) return play(found);
    }
    home();
  }
  window.addEventListener('hashchange', route);
  route();
})();
