import { ChatMessage } from '../types';

// Pool of real male avatar photos (90% proportion)
export const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // replacement
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492446845049-9c50ce313d00?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

// Pool of real female avatar photos (10% proportion)
export const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
];

// Pool of Indonesian Male Usernames (90%)
export const MALE_NAMES = [
  'Rizky_Pratama', 'Dimas_Nugraha', 'Fajar_Ramadhan', 'Bayu_Anggoro', 'Hendra_Wijaya',
  'Kevin_Sanjaya', 'Aditya_Pratama', 'Doni_Setiawan', 'Gilang_Ramadhan', 'Rendy_Saputra',
  'Wahyu_Hidayat', 'Arya_Wibowo', 'Bagus_Prasetyo', 'Budi_Santoso', 'Rio_Febrian',
  'Ilham_Saputra', 'Farhan_Kurniawan', 'Dennis_Chandra', 'Danang_Prakoso', 'Yuda_Kusuma',
  'Reza_Fahlevi', 'Aldi_Gunawan', 'Angga_Putra', 'Taufik_Hidayat', 'Dika_Firmansyah',
  'Eko_Prasetyo', 'Sandy_Pratama', 'Galih_Wicaksono', 'Randy_Pangalila', 'Tommy_Kurniawan',
  'Aris_Munandar', 'Fikri_Ardiansyah', 'Agung_Permana', 'Zaky_Alfarizi', 'Fandi_Ahmad',
  'Bram_Ganteng', 'Indra_Lesmana', 'Teguh_Kurnia', 'Satria_Bima', 'Yoga_Pratama',
  'Bagas_Kurnia', 'Irvan_Setia', 'Alvin_Santoso', 'Lukman_Hakim', 'Bambang_Suryo'
];

// Pool of Indonesian Female Usernames (10%)
export const FEMALE_NAMES = [
  'Siska_Amelia', 'Bella_Safitri', 'Nabila_Anggraini', 'Putri_Maharani',
  'Clarissa_Octavia', 'Maya_Cantika', 'Nadia_Rahma', 'Tasya_Kamila', 'Cindy_Aulia', 'Dewi_Lestari'
];

// Male realistic live comments
export const MALE_COMMENT_TEMPLATES = [
  'Halo kak cantik banget malam ini ✨😍',
  'Videonya jernih banget parah, 1080p 60fps lancar pol!',
  'Gila suaranya bening banget, mic-nya pake apa kak?',
  'Auto tonton sampe abis, asik banget pembawaannya!',
  'Nitip saweria buat kopi ya kak, semangat terus livenya! ☕❤️',
  'Salam dari Surabaya kak! Sehat selalu yaa 🔥',
  'Player-nya responsif banget di HP, gak ada buffering sama sekali mantap!',
  'Senyumnya bikin betah nonton lama-lama haha 🥰',
  'Spill playlist lagu santainya dong kak!',
  'Wkwkwk kocak banget part barusan 😂',
  'Langsung klik tombol like kak, kontennya selalu berkualitas!',
  'Salam kenal kak, baru pertama kali gabung live tapi langsung suka 👍',
  'Semangat terus kak, ditunggu konten dan live streaming berikutnya!',
  'Keren banget setup lightingnya, cozy bgt suasananya!',
  'Lagi santai nonton sambil ngopi nih kak ☕',
  'Bagus banget angle kameranya kak, aesthetic!',
  'Auto bookmark link web ini, gampang bgt nontonnya 👍',
  'Halo kak, spill tips streaming biar lancar kaya gini dong!',
  'Top markotop! Kualitas videonya no debat 💯',
  'Makin hari makin glowing aja kak live-nya ✨',
  'Waduh telat join nih, udah mulai dari tadi ya kak?',
  'Kak request game horror dong di live berikutnya! 👻',
  'Malam kak, sapa penonton dari Bandung dong kak! 🙌',
  'Smooth abis player videyco nya, no lag sama sekali!',
  'Dah ku share ke grup WhatsApp ya kak, biar makin rame 🚀',
  'Keren banget vibe studionya, betah nonton berjam-jam',
  'Saweria sent ya kak, cek notif! Semoga berkah 💎',
  'Semoga viewersnya tembus 100K malam ini kak! 🔥',
  'Asik bgt musik backgroundnya, rileks didengernya',
  'Halo kak, udah makan malam belum? Jaga kesehatan ya!'
];

// Female realistic live comments
export const FEMALE_COMMENT_TEMPLATES = [
  'Halo kak cantikkk! Outfitnya gemes bgt malam ini 🥰💕',
  'Suka banget liat make-up nya, glowing natural bgt kak! ✨',
  'Semangat streamingnya kak sayang! Selalu nonton setia 💖',
  'Rambutnya bagus bgt kak, spill hair care nya dong kak! 🌸',
  'Hai kak! Salam dari cewek-cewek Jogja yaa 🤗✨',
  'Kakak ramah banget bacain chat, seneng nontonnya 💕',
  'Cute bgt ekspresinya barusan haha 🥰',
  'Udah kirim gift love buat kakak yaa ❤️',
  'Bagus bgt lighting kamarnya kak, estetik parah!',
  'Semangat ya kak cantikk, istirahat yg cukup nanti yaa 💖'
];

export const INITIAL_50_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'cm-1',
    user: 'Rizky_Pratama',
    text: 'Halo kak cantik banget malam ini ✨😍 Selamat malam semuanya!',
    timestamp: '5 mnt lalu',
    avatar: MALE_AVATARS[0],
    badge: '👑 Member',
  },
  {
    id: 'cm-2',
    user: 'Dimas_Nugraha',
    text: 'Videonya jernih banget parah, 1080p 60fps lancar pol!',
    timestamp: '5 mnt lalu',
    avatar: MALE_AVATARS[1],
    badge: '🔥 Aktif',
  },
  {
    id: 'cm-3',
    user: 'Sultan_Budi88',
    text: 'Semangat terus live-nya kak! Nitip saweria buat kopi yaa ☕💖',
    timestamp: '4 mnt lalu',
    avatar: MALE_AVATARS[2],
    isVip: true,
    tipAmount: 50000,
    badge: '💎 VIP Donatur',
  },
  {
    id: 'cm-4',
    user: 'Fajar_Ramadhan',
    text: 'Gila suaranya bening banget, mic studio-nya juara!',
    timestamp: '4 mnt lalu',
    avatar: MALE_AVATARS[3],
    badge: '⭐ VIP',
  },
  {
    id: 'cm-5',
    user: 'Bella_Safitri',
    text: 'Halo kak cantikkk! Outfitnya gemes bgt malam ini 🥰💕 (10% Viewer Wanita)',
    timestamp: '4 mnt lalu',
    avatar: FEMALE_AVATARS[0],
    badge: '🌸 Sis',
  },
  {
    id: 'cm-6',
    user: 'Bayu_Anggoro',
    text: 'Auto tonton sampe abis, asik banget pembawaan livenya!',
    timestamp: '3 mnt lalu',
    avatar: MALE_AVATARS[4],
  },
  {
    id: 'cm-7',
    user: 'Hendra_Wijaya',
    text: 'Salam dari Surabaya kak! Sehat selalu yaa 🔥',
    timestamp: '3 mnt lalu',
    avatar: MALE_AVATARS[5],
  },
  {
    id: 'cm-8',
    user: 'Kevin_Sanjaya',
    text: 'Player-nya responsif banget di HP, gak ada buffering sama sekali mantap!',
    timestamp: '3 mnt lalu',
    avatar: MALE_AVATARS[6],
    badge: '👑 Member',
  },
  {
    id: 'cm-9',
    user: 'Aditya_Pratama',
    text: 'Senyumnya bikin betah nonton lama-lama haha 🥰',
    timestamp: '3 mnt lalu',
    avatar: MALE_AVATARS[7],
  },
  {
    id: 'cm-10',
    user: 'Doni_Setiawan',
    text: 'Spill playlist lagu santainya dong kak!',
    timestamp: '2 mnt lalu',
    avatar: MALE_AVATARS[8],
  },
  {
    id: 'cm-11',
    user: 'Gilang_Ramadhan',
    text: 'Wkwkwk kocak banget momen yang barusan 😂',
    timestamp: '2 mnt lalu',
    avatar: MALE_AVATARS[9],
  },
  {
    id: 'cm-12',
    user: 'Rendy_Saputra',
    text: 'Langsung klik tombol like kak, kontennya selalu berkualitas!',
    timestamp: '2 mnt lalu',
    avatar: MALE_AVATARS[10],
    badge: '🔥 Top Fans',
  },
  {
    id: 'cm-13',
    user: 'Wahyu_Hidayat',
    text: 'Salam kenal kak, baru pertama kali gabung live tapi langsung suka 👍',
    timestamp: '2 mnt lalu',
    avatar: MALE_AVATARS[11],
  },
  {
    id: 'cm-14',
    user: 'Arya_Wibowo',
    text: 'Keren banget setup lightingnya, cozy bgt suasananya!',
    timestamp: '2 mnt lalu',
    avatar: MALE_AVATARS[12],
  },
  {
    id: 'cm-15',
    user: 'Putri_Maharani',
    text: 'Suka banget liat make-up nya, glowing natural bgt kak! ✨💖',
    timestamp: '1 mnt lalu',
    avatar: FEMALE_AVATARS[1],
    badge: '🌸 Sis',
  },
  {
    id: 'cm-16',
    user: 'Bagus_Prasetyo',
    text: 'Lagi santai nonton sambil ngopi nih kak ☕',
    timestamp: '1 mnt lalu',
    avatar: MALE_AVATARS[13],
  },
  {
    id: 'cm-17',
    user: 'Rio_Febrian',
    text: 'Bagus banget angle kameranya kak, aesthetic!',
    timestamp: '1 mnt lalu',
    avatar: MALE_AVATARS[14],
  },
  {
    id: 'cm-18',
    user: 'Ilham_Saputra',
    text: 'Auto bookmark link web ini, gampang bgt nontonnya 👍',
    timestamp: '1 mnt lalu',
    avatar: MALE_AVATARS[15],
    badge: '⭐ VIP',
  },
  {
    id: 'cm-19',
    user: 'Farhan_Kurniawan',
    text: 'Halo kak, spill tips streaming biar lancar kaya gini dong!',
    timestamp: '1 mnt lalu',
    avatar: MALE_AVATARS[16],
  },
  {
    id: 'cm-20',
    user: 'Dennis_Chandra',
    text: 'Top markotop! Kualitas videonya no debat 💯',
    timestamp: '1 mnt lalu',
    avatar: MALE_AVATARS[17],
  },
  {
    id: 'cm-21',
    user: 'Danang_Prakoso',
    text: 'Makin hari makin glowing aja kak live-nya ✨',
    timestamp: '45 dtk lalu',
    avatar: MALE_AVATARS[18],
  },
  {
    id: 'cm-22',
    user: 'Yuda_Kusuma',
    text: 'Waduh telat join nih, udah mulai dari tadi ya kak?',
    timestamp: '40 dtk lalu',
    avatar: MALE_AVATARS[19],
  },
  {
    id: 'cm-23',
    user: 'Reza_Fahlevi',
    text: 'Kak request game horror dong di live berikutnya! 👻',
    timestamp: '35 dtk lalu',
    avatar: MALE_AVATARS[20],
    badge: '👑 Member',
  },
  {
    id: 'cm-24',
    user: 'Aldi_Gunawan',
    text: 'Malam kak, sapa penonton dari Bandung dong kak! 🙌',
    timestamp: '30 dtk lalu',
    avatar: MALE_AVATARS[21],
  },
  {
    id: 'cm-25',
    user: 'Clarissa_Octavia',
    text: 'Semangat streamingnya kak sayang! Selalu nonton setia 💖✨',
    timestamp: '25 dtk lalu',
    avatar: FEMALE_AVATARS[2],
    badge: '🌸 Sis',
  },
  {
    id: 'cm-26',
    user: 'Angga_Putra',
    text: 'Smooth abis player videyco nya, no lag sama sekali!',
    timestamp: '20 dtk lalu',
    avatar: MALE_AVATARS[22],
  },
  {
    id: 'cm-27',
    user: 'Taufik_Hidayat',
    text: 'Dah ku share ke grup WhatsApp ya kak, biar makin rame 🚀',
    timestamp: '18 dtk lalu',
    avatar: MALE_AVATARS[23],
  },
  {
    id: 'cm-28',
    user: 'Dika_Firmansyah',
    text: 'Keren banget vibe studionya, betah nonton berjam-jam',
    timestamp: '15 dtk lalu',
    avatar: MALE_AVATARS[0],
  },
  {
    id: 'cm-29',
    user: 'Eko_Prasetyo',
    text: 'Saweria sent ya kak, cek notif! Semoga berkah 💎',
    timestamp: '12 dtk lalu',
    avatar: MALE_AVATARS[1],
    isVip: true,
    tipAmount: 25000,
    badge: '💎 VIP Donatur',
  },
  {
    id: 'cm-30',
    user: 'Sandy_Pratama',
    text: 'Semoga viewersnya tembus 100K malam ini kak! 🔥',
    timestamp: '10 dtk lalu',
    avatar: MALE_AVATARS[2],
  },
  {
    id: 'cm-31',
    user: 'Galih_Wicaksono',
    text: 'Asik bgt musik backgroundnya, rileks didengernya',
    timestamp: '8 dtk lalu',
    avatar: MALE_AVATARS[3],
  },
  {
    id: 'cm-32',
    user: 'Randy_Pangalila',
    text: 'Halo kak, udah makan malam belum? Jaga kesehatan ya!',
    timestamp: '5 dtk lalu',
    avatar: MALE_AVATARS[4],
  },
  {
    id: 'cm-33',
    user: 'Tommy_Kurniawan',
    text: 'Tampilan websitenya estetik dan elegan banget kak 🌟',
    timestamp: '3 dtk lalu',
    avatar: MALE_AVATARS[5],
  },
  {
    id: 'cm-34',
    user: 'Nadia_Rahma',
    text: 'Rambutnya bagus bgt kak, spill hair care nya dong kak! 🌸✨',
    timestamp: '2 dtk lalu',
    avatar: FEMALE_AVATARS[3],
    badge: '🌸 Sis',
  },
  {
    id: 'cm-35',
    user: 'Aris_Munandar',
    text: 'Gass terus kak, siap temenin live sampe subuh! 💪🔥',
    timestamp: 'Baru saja',
    avatar: MALE_AVATARS[6],
    badge: '🔥 Top Fans',
  },
];

/**
 * Generate a single simulated live chat message following 90% male and 10% female distribution
 */
export function generateRandomChatMessage(): ChatMessage {
  // 90% chance male, 10% chance female
  const isMale = Math.random() < 0.90;

  if (isMale) {
    const name = MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)];
    const avatar = MALE_AVATARS[Math.floor(Math.random() * MALE_AVATARS.length)];
    const text = MALE_COMMENT_TEMPLATES[Math.floor(Math.random() * MALE_COMMENT_TEMPLATES.length)];
    const isDonation = Math.random() < 0.08;
    const donationAmounts = [10000, 25000, 50000, 100000];

    return {
      id: 'auto-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user: name,
      avatar,
      text,
      timestamp: 'Baru saja',
      isVip: isDonation,
      tipAmount: isDonation ? donationAmounts[Math.floor(Math.random() * donationAmounts.length)] : undefined,
      badge: isDonation ? '💎 VIP Donatur' : (Math.random() < 0.25 ? '👑 Member' : undefined),
    };
  } else {
    const name = FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const avatar = FEMALE_AVATARS[Math.floor(Math.random() * FEMALE_AVATARS.length)];
    const text = FEMALE_COMMENT_TEMPLATES[Math.floor(Math.random() * FEMALE_COMMENT_TEMPLATES.length)];
    const isDonation = Math.random() < 0.12;

    return {
      id: 'auto-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user: name,
      avatar,
      text,
      timestamp: 'Baru saja',
      isVip: isDonation,
      tipAmount: isDonation ? 25000 : undefined,
      badge: isDonation ? '💎 VIP Donatur' : '🌸 Sis',
    };
  }
}
