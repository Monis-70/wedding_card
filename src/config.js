// All personal details live here. Text is shown exactly as written.
// Dates use ISO format with the India offset (+05:30); the date lines are generated from them.

export const config = {
  bride: { name: 'Shafiya' },
  groom: { name: 'Burhan' },
  timeZone: 'Asia/Kolkata',

  invitation: {
    bismillahMeaning: 'In the name of Allah, the Most Beneficial and Merciful & His beloved Prophet Muhammed (SAW)',
    blessingsIntro: 'With the heavenly blessings of',
    blessings: 'Late Haji Abdul Gani Gadith & Hajiyani Zubeda Abdul Gani Gadith',
    hosts: 'Mr & Mrs Shifa Abdul Sattar Gadith',
    hostsLine: 'Cordially invite you to the wedding of their Daughter',
    joiner: 'With',
    groomParents: 'S/o Mrs Asma Sajid Patka',
  },

  nikah: {
    eyebrow: 'The sacred union',
    title: 'Nikah',
    subtitle: 'Ceremony',
    // Countdown target: Isha time is not fixed, 8:00 PM is assumed.
    start: '2026-12-10T20:00:00+05:30',
    dayText: 'On Thursday',
    hijri: '(1st Rajjab 1448 Hijri)',
    timeText: 'after Namaz e - Isha',
    venuePrefix: 'At:',
    venue: 'Sunni Masjid-e- Bilal',
    address: ['Shuklaji Street. Chota Sonapur', 'Mumbai - 400008'],
    // Paste the exact Google Maps share link in `url` (or fill lat/lng) to pin the venue precisely.
    map: { url: '', lat: null, lng: null, query: 'Sunni Masjid-e- Bilal, Shuklaji Street, Chota Sonapur, Mumbai 400008' },
  },

  reception: {
    eyebrow: '',
    title: 'Reception',
    subtitle: '',
    start: '2026-12-11T20:30:00+05:30',
    dayText: 'On Friday,',
    hijri: '',
    timeText: '8:30 PM onwards',
    venuePrefix: 'At –',
    venue: 'K Ground',
    address: ['Jogeshwari West'],
    map: { url: 'https://share.google/sy6khHyUMiL4J80iD', lat: null, lng: null, query: 'K Ground, Jogeshwari West, Mumbai' },
  },

  families: 'The Gadith & Patka Families',

  // Put the song in /public/music/ and set e.g. src: '/music/song.mp3'. Empty = no music button.
  music: { src: '/music/song.mp3', volume: 0.6, startAt: 0 },

  text: {
    sealHint: 'Tap to open',
    revealTitle: 'Tap to Reveal',
    revealedTitle: 'Save the Date',
    inshallah: 'Inshallah',
    countdownTitle: 'Counting down to the big day',
    countdownDone: 'Today is the day \u2014 Alhamdulillah',
    closingKicker: 'With love & duas',
    closing: 'Your presence and duas are the most precious gift we could ask for. We cannot wait to celebrate with you.',
  },

  // Public address after deploying (used for share previews), e.g. 'https://shafiya-burhan.vercel.app'.
  siteUrl: '',
};
