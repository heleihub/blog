import fs from 'fs/promises';

const SITE_CONFIG_FILE = './content/config/site.json';
const STATS_FILE = './content/config/stats.json';
const VIEWS_FILE = './content/config/views.json';

export async function getSiteConfig() {
  try {
    const data = await fs.readFile(SITE_CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      site: {
        name: 'XiaoHe',
        title: 'XiaoHe Blog',
        description: '分享技术与生活的点滴',
        author: 'XiaoHe',
        url: 'https://xiaohe.blog'
      },
      social: {
        youtube: 'https://youtube.com/@xiaohe',
        telegram: 'https://t.me/xiaohe',
        twitter: 'https://twitter.com/xiaohe',
        github: 'https://github.com/xiaohe'
      },
      nav: [
        { label: '首页', href: '/' },
        { label: '分类', href: '/categories' },
        { label: '标签', href: '/tags' },
        { label: '关于', href: '/about' },
        { label: '联系', href: '/contact' }
      ]
    };
  }
}

export async function getStats() {
  try {
    const data = await fs.readFile(STATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    const initialStats = {
      totalVisits: 0,
      todayVisits: 0,
      todayDate: new Date().toDateString(),
      posts: 0,
      comments: 0,
    };
    await saveStats(initialStats);
    return initialStats;
  }
}

export async function saveStats(stats) {
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

export async function incrementStats() {
  const stats = await getStats();
  const today = new Date().toDateString();
  
  if (stats.todayDate !== today) {
    stats.todayVisits = 0;
    stats.todayDate = today;
  }
  
  stats.totalVisits++;
  stats.todayVisits++;
  
  await saveStats(stats);
  return stats;
}

export async function getViews() {
  try {
    const data = await fs.readFile(VIEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}
