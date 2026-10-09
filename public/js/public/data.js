// Static site data: official links and artwork credits.

export const SOCIALS = [
  { id: 'x', label: 'X (Twitter)', handle: '@Hanon_moco', url: 'https://x.com/Hanon_moco', icon: '/assets/img/icon-x-96.webp' },
  { id: 'youtube', label: 'YouTube', handle: '@Hanon_moco', url: 'https://www.youtube.com/@Hanon_moco', icon: '/assets/img/icon-youtube-96.webp' },
  { id: 'twitch', label: 'Twitch', handle: '@hanon_moco', url: 'https://www.twitch.tv/hanon_moco', icon: '/assets/img/icon-twitch-96.webp' },
  // Official icon from TwitCasting's brand guideline pack (https://about.moi.st/en/guideline/), resized only
  { id: 'twitcasting', label: 'TwitCasting', handle: '@hanon_moco', url: 'https://twitcasting.tv/hanon_moco', icon: '/assets/img/icon-twitcasting-96.webp' },
];

export const OFFICIAL_LINKS = [
  ...SOCIALS.map(({ id, label, url }) => ({ id, label, url })),
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/hanon.moco/' },
  { id: 'bluesky', label: 'Bluesky', url: 'https://bsky.app/profile/hanonmoco.bsky.social' },
  { id: 'fanbox', label: 'PixivFANBOX', url: 'https://hanon-moco.fanbox.cc/' },
  { id: 'music', label: 'Music (TuneCore)', url: 'https://www.tunecore.co.jp/artists/Hanon_moco' },
  { id: 'litlink', label: 'lit.link', url: 'https://lit.link/Hanonmoco' },
  { id: 'hakoniwalily', label: 'ハコニワリリィ Official', url: 'https://hakoniwalily.jp/' },
  { id: 'stellaphizz', label: 'StellaPhizz', url: 'https://www.youtube.com/@StellaPhizz' },
  { id: 'booth', label: 'BOOTH (goods)', url: 'https://hanon-goods.booth.pm/' },
];

// Artwork credits, researched 2026-10-09 (docs/IMPLEMENTATION_PLAN.md §1.1). null = artist unknown.
// loader2/loader3 reuse the Discography/Gallery art until the owner adds dedicated loader art.
export const CREDITS = {
  // clean version of the thumbnail art for Hanon's cover おまえも♡ (youtu.be/w41z2znVTmQ); the X post itself wasn't found
  home: { handle: '逢坂レイ (@6963Saki)', url: 'https://x.com/6963Saki' },
  about: { handle: '@Parfait_Pie_12', url: 'https://x.com/Parfait_Pie_12/status/1596201447003394048' },
  news: { handle: '@snowclole', url: 'https://x.com/snowclole/status/1784902250097422367' },
  discography: null,
  gallery: null,
  loader1: { handle: '@snowclole', url: 'https://x.com/snowclole/status/1962514323965952440' },
  loader2: null,
  loader3: null,
  profile: null,
};
