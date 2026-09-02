const fs = require('fs');

const path = 'src/data/defaultData.ts';
let content = fs.readFileSync(path, 'utf8');

const newVideos = `
  {
    id: 'vid-6',
    title: 'Random Moment #1: Streaming Spesial Liburan',
    description: 'Kesibukan saat liburan dan momen spontan.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80',
    duration: '07:22',
    views: 45000,
    likes: 1200,
    category: 'VIP Clip',
    tags: ['Santai', 'Vlog', 'SiskaAmelia'],
    addedAt: '1 hari yang lalu',
    uploaderName: 'Siska Amelia Official',
  },
  {
    id: 'vid-7',
    title: 'Random Moment #2: Kejutan Tengah Malam',
    description: 'Bikin kaget satu server pas lagi asyik mabar.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80',
    duration: '05:43',
    views: 65000,
    likes: 2100,
    category: 'Highlights',
    tags: ['Game', 'Kocak', 'Seru'],
    addedAt: '2 hari yang lalu',
    uploaderName: 'Siska Amelia Official',
  },
  {
    id: 'vid-8',
    title: 'Random Moment #3: Q&A Santai Sambil Ngopi',
    description: 'Jawabin pertanyaan kalian yang masuk ke DM.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80',
    duration: '12:05',
    views: 89000,
    likes: 4500,
    category: 'Live VOD',
    tags: ['QNA', 'SiskaAmelia', 'Santuy'],
    addedAt: '3 hari yang lalu',
    uploaderName: 'Siska Amelia Official',
  },
  {
    id: 'vid-9',
    title: 'Random Moment #4: Cerita Horor di Kosan Lama',
    description: 'Throwback cerita waktu zaman ngekos dulu.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60?w=800&auto=format&fit=crop&q=80',
    duration: '15:30',
    views: 120000,
    likes: 4900,
    category: 'Terbaru',
    tags: ['Horor', 'Storytime'],
    addedAt: '4 hari yang lalu',
    uploaderName: 'Siska Amelia Official',
  },
  {
    id: 'vid-10',
    title: 'Random Moment #5: Dibalik Layar Setup Baru',
    description: 'Unboxing dan rakit PC baru buat streaming.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1587302912306-cf1ed9c33146?w=800&auto=format&fit=crop&q=80',
    duration: '11:10',
    views: 95000,
    likes: 3100,
    category: 'Semua',
    tags: ['Setup', 'Unboxing', 'PC'],
    addedAt: '5 hari yang lalu',
    uploaderName: 'Siska Amelia Official',
  }
];`;

content = content.replace(/];[\s]*$/, newVideos);

fs.writeFileSync(path, content);
