// Admin smoke test (Phase 6): drives the admin + auth API like the admin panel does and checks every flow.
// Run it ONLY against a local server pointed at a throwaway database copy (Neon branch): it creates, edits,
// archives and restores content and admin accounts. It refuses non-localhost URLs.
// The owner on that copy must have a known test password and must_change_password = true.
// Usage: node --env-file=<test env> scripts/perf/admin-smoke.js http://localhost:3300
//   env SMOKE_USER, SMOKE_PASS (current test password), SMOKE_NEW_PASS (password to change to)
// Not covered: gallery upload/delete (the copy's gallery rows point at the real Cloudinary files).

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) {
  console.error('Refusing to run: pass a local base URL (http://localhost:PORT) backed by a throwaway database copy.');
  process.exit(1);
}
const { SMOKE_USER: user, SMOKE_PASS: pass, SMOKE_NEW_PASS: newPass } = process.env;
if (!user || !pass || !newPass) { console.error('Set SMOKE_USER, SMOKE_PASS and SMOKE_NEW_PASS.'); process.exit(1); }

const results = [];
const check = (name, ok, detail = '') => {
  results.push(!!ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  (${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 300)})` : ''}`);
};

/** A cookie jar per signed-in person (owner, admin). */
function client() {
  let cookie = '';
  return async (method, path, body) => {
    const res = await fetch(base + path, {
      method,
      headers: { Origin: base, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    });
    const set = res.headers.getSetCookie?.() || [];
    for (const c of set) {
      const [pair] = c.split(';');
      if (/=$/.test(pair) || /Max-Age=0/i.test(c)) cookie = ''; else cookie = pair;
    }
    let json = null;
    try { json = await res.json(); } catch { /* empty body */ }
    return { status: res.status, json };
  };
}
const pub = async (path) => (await fetch(base + path)).json();
const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

const owner = client();
let r;

// ------------------------------------------------------------------ auth + forced password change
r = await owner('GET', '/api/auth/me');
check('me without a session → 401', r.status === 401, r);
r = await owner('POST', '/api/auth/login', { username: user, password: `${pass}x` });
check('wrong password → 401', r.status === 401, r);
r = await owner('POST', '/api/auth/login', { username: user, password: pass });
check('owner login → 200, must change password', r.status === 200 && r.json?.user?.mustChangePassword === true && r.json.user.role === 'owner', r);
r = await owner('GET', '/api/admin/summary');
check('admin API blocked until the password is changed (403)', r.status === 403 && r.json?.error?.code === 'PASSWORD_CHANGE_REQUIRED', r);
r = await owner('POST', '/api/auth/change-password', { currentPassword: pass, newPassword: 'hanonpenguin' });
check('weak new password rejected (422)', r.status === 422, r);
r = await owner('POST', '/api/auth/change-password', { currentPassword: pass, newPassword: newPass });
check('password change → 200', r.status === 200, r);
r = await owner('GET', '/api/auth/me');
check('session still valid, no longer must change', r.status === 200 && r.json?.user?.mustChangePassword === false, r);
r = await owner('GET', '/api/admin/summary');
const s0 = r.json;
check('dashboard summary → 200', r.status === 200 && s0.videos_published >= 8 && s0.news_published >= 15, r);

// ------------------------------------------------------------------ videos: lookup, draft, publish, archive, restore
r = await owner('POST', '/api/admin/videos/lookup', { url: 'https://www.youtube.com/watch?v=H0qsdnaWWTo' });
check('YouTube lookup returns the title', r.status === 200 && /Hanon/i.test(r.json?.title || ''), r);
const title = r.json?.title || '金曜日のおはよう -another story-／HoneyWorks【Covered by Hanon】';
r = await owner('POST', '/api/admin/videos', { youtube: 'https://youtu.be/H0qsdnaWWTo', title, postedOn: today, status: 'draft' });
const videoId = r.json?.item?.id;
check('video created as draft (201)', r.status === 201 && videoId, r);
check('draft video is not public', !(await pub('/api/public/videos?limit=50')).items.some((v) => v.id === videoId));
r = await owner('POST', '/api/admin/videos', { youtube: 'H0qsdnaWWTo', title, postedOn: today });
check('duplicate YouTube id rejected (409)', r.status === 409, r);
r = await owner('PATCH', `/api/admin/videos/${videoId}`, { status: 'published' });
check('video published (200)', r.status === 200 && r.json?.item?.status === 'published', r);
check('published video is public and newest on Home', (await pub('/api/public/home')).video?.id === videoId);
r = await owner('DELETE', `/api/admin/videos/${videoId}`);
const videoArchive = r.json?.archiveId;
check('video deleted → archived (200)', r.status === 200 && r.json?.archived === true && videoArchive, r);
check('archived video gone from the public site', !(await pub('/api/public/videos?limit=50')).items.some((v) => v.youtubeId === 'H0qsdnaWWTo'));
r = await owner('GET', '/api/admin/archive?source=videos');
check('archive lists the video as restorable', r.status === 200 && r.json?.items?.some((a) => a.id === videoArchive && a.restorable), r);
r = await owner('POST', `/api/admin/archive/${videoArchive}/restore`);
check('restore from the archive (200)', r.status === 200 && r.json?.restored === true, r);
check('restored video is public again', (await pub('/api/public/videos?limit=50')).items.some((v) => v.youtubeId === 'H0qsdnaWWTo'));

// ------------------------------------------------------------------ news, achievements, discography
r = await owner('POST', '/api/admin/news', { headline: 'x', summary: 'y', links: [1, 2, 3, 4].map((n) => ({ url: `https://example.com/${n}`, labelKey: 'details' })) });
check('news with 4 links rejected (422)', r.status === 422, r);
r = await owner('POST', '/api/admin/news', { summary: 'no headline' });
check('news without a headline rejected (422)', r.status === 422, r);
r = await owner('POST', '/api/admin/news', {
  postedOn: today, headline: 'スモークテスト：お知らせ', summary: 'テスト用のニュースです。', status: 'published',
  links: [{ url: 'https://hakoniwalily.jp/', labelKey: 'official' }, { url: 'https://www.youtube.com/watch?v=ev4W3pNB66k', labelKey: 'watch' }],
});
const newsId = r.json?.item?.id;
check('news with 2 links published (201)', r.status === 201 && newsId, r);
check('new news is first on Home', (await pub('/api/public/home')).news?.[0]?.id === newsId);
r = await owner('PATCH', `/api/admin/news/${newsId}`, { headline: 'スモークテスト：更新' });
check('news edited (200)', r.status === 200 && r.json?.item?.headline === 'スモークテスト：更新', r);
r = await owner('DELETE', `/api/admin/news/${newsId}`);
check('news archived', r.status === 200 && r.json?.archived, r);

r = await owner('POST', '/api/admin/achievements', { achievedOn: today, text: 'スモークテスト実績', status: 'draft' });
const achId = r.json?.item?.id;
check('achievement created as draft', r.status === 201 && achId, r);
r = await owner('PATCH', `/api/admin/achievements/${achId}`, { status: 'published' });
check('achievement published + public', r.status === 200 && (await pub('/api/public/achievements?limit=50')).items.some((a) => a.id === achId), r);
r = await owner('DELETE', `/api/admin/achievements/${achId}`);
check('achievement archived', r.status === 200 && r.json?.archived, r);

const soon = new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10);
r = await owner('POST', '/api/admin/discography', { title: 'スモークテスト・シングル', releaseType: 'cover', releasedOn: soon, note: 'test', status: 'published' });
const discId = r.json?.item?.id;
check('release (future date) created', r.status === 201 && discId, r);
check('future release is public (Coming soon)', (await pub('/api/public/discography?limit=50')).items.some((d) => d.id === discId));
r = await owner('DELETE', `/api/admin/discography/${discId}`);
check('release archived', r.status === 200 && r.json?.archived, r);

// ------------------------------------------------------------------ gallery (credits only)
r = await owner('GET', '/api/admin/gallery');
const g = r.json?.items || [];
check('admin gallery lists the seeded images', r.status === 200 && g.length >= 7, r);
if (g[0]) {
  r = await owner('PATCH', `/api/admin/gallery/${g[0].id}`, { authorName: `${g[0].authorName} (test)` });
  const changed = r.status === 200;
  r = await owner('PATCH', `/api/admin/gallery/${g[0].id}`, { authorName: g[0].authorName });
  check('gallery credit edited and reverted', changed && r.status === 200, r);
}

// ------------------------------------------------------------------ accounts: auto-numbered admins, owner-only, reset, remove
r = await owner('POST', '/api/admin/accounts');
const a1 = r.json?.account;
const temp1 = r.json?.tempPassword;
check(`admin account created as ${user}2 with a temporary password`, r.status === 201 && a1?.username === `${user}2` && temp1?.length >= 8, r);
const admin = client();
r = await admin('POST', '/api/auth/login', { username: a1.username, password: temp1 });
check('new admin logs in with the temporary password, must change it', r.status === 200 && r.json?.user?.mustChangePassword === true, r);
r = await admin('POST', '/api/auth/change-password', { currentPassword: temp1, newPassword: `${newPass}Ad` });
check('admin changes the password', r.status === 200, r);
r = await admin('GET', '/api/admin/summary');
check('admin can use the dashboard', r.status === 200, r);
r = await admin('GET', '/api/admin/accounts');
check('admin cannot manage accounts (owner only, 403)', r.status === 403, r);
r = await owner('POST', `/api/admin/accounts/${a1.id}/reset-password`);
check('owner resets the admin password', r.status === 200 && r.json?.tempPassword, r);
r = await admin('GET', '/api/auth/me');
check("the admin's old session is revoked by the reset", r.status === 401, r);
r = await owner('DELETE', `/api/admin/accounts/${a1.id}`, { reason: 'smoke test' });
check('owner removes the admin (archived snapshot)', r.status === 200 && r.json?.removed && r.json?.archiveId, r);
r = await admin('POST', '/api/auth/login', { username: a1.username, password: `${newPass}Ad` });
check('removed admin cannot log in', r.status === 401, r);
r = await owner('POST', '/api/admin/accounts');
check(`next admin is ${user}3 (numbers never reused)`, r.status === 201 && r.json?.account?.username === `${user}3`, r);
if (r.json?.account?.id) await owner('DELETE', `/api/admin/accounts/${r.json.account.id}`, { reason: 'smoke test cleanup' });

// ------------------------------------------------------------------ activity, analytics, logout, lockout
r = await owner('GET', '/api/admin/activity');
const acts = JSON.stringify(r.json || {});
check('activity log records the actions', r.status === 200 && /account\.create/.test(acts) && /archive\.restore/.test(acts), r);
r = await owner('GET', '/api/admin/analytics?range=30');
check('analytics dashboard → 200', r.status === 200, r);
r = await owner('GET', '/api/admin/analytics?range=12');
check('analytics with a bad range → 400', r.status === 400, r);
r = await owner('POST', '/api/auth/logout');
check('logout → 200', r.status === 200, r);
r = await owner('GET', '/api/admin/summary');
check('after logout the admin API is closed (401)', r.status === 401, r);
r = await fetch(`${base}/api/admin/summary`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
check('state-changing request without Origin is refused (403)', r.status === 403);
const stranger = client();
let last;
for (let i = 0; i < 6; i++) last = await stranger('POST', '/api/auth/login', { username: 'nosuchuser', password: 'wrong-password-123' });
check('lockout after repeated failures (429)', last.status === 429, last);

const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exitCode = failed ? 1 : 0;
