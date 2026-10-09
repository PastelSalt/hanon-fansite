-- seed.sql — initial public content (idempotent: safe to run more than once).
-- Sources (researched 2026-10-09, see FORHANON.md §7/§13 and docs/PROGRESS.md decisions): Hanon's YouTube channel,
-- lit.link, hakoniwalily.jp news/release pages, Wikipedia (JA) ハコニワリリィ, MusicBrainz (Vox mini-album dates).
-- Text is single-field and shown as typed in both languages (owner decision). Official Japanese wording is used
-- where it exists; short summaries written by the developer are listed in docs/JA_REVIEW_LIST.md.
-- Rows shared with the Kotoha fan site (unit news/releases) reuse its wording.
-- NO credentials here: the Owner account is created by `npm run admin:bootstrap`.

-- ---------------------------------------------------------------------------
-- Latest works (videos) — newest works; stream replays excluded (dates = YouTube publish dates)
-- ---------------------------------------------------------------------------
insert into videos (youtube_id, title, posted_on, status, published_at)
values
  ('ev4W3pNB66k', 'CLEAR／坂本真綾【Covered by Hanon】', '2026-09-25', 'published', now()),
  ('FLH4EoRCgSQ', '劇薬中毒 /＝LOVE（イコールラブ）【Covered by Hanon×Kotoha】', '2026-09-24', 'published', now()),
  ('-aZ5pArxNW0', 'My Dearest／supercell【Covered by Hanon】', '2026-09-07', 'published', now()),
  ('BUMqSPEQAuE', 'only my railgun／fripSide【Hanon×Kotoha】', '2026-08-25', 'published', now()),
  ('1ee-apkUVwo', '星が瞬くこんな夜に／supercell【Hanon×Kotoha】', '2026-08-16', 'published', now()),
  ('UN0pPZ_hXrA', 'mosi mosi?／楽音【Covered by Hanon】', '2026-07-26', 'published', now()),
  ('PTAGxi1Fmkc', 'オトメノホンキ／Hanon solo ver. 【Music Video】', '2026-07-24', 'published', now()),
  ('Hvzkn-E1mv0', 'ふらすとれーしょん・がーる／Hanon【Music Video】', '2026-07-20', 'published', now())
on conflict (youtube_id) do nothing;

-- ---------------------------------------------------------------------------
-- News
-- ---------------------------------------------------------------------------
insert into news (posted_on, headline, summary, links, status, published_at)
select v.posted_on::date, v.headline, v.summary, v.links::jsonb, 'published', now()
from (values
  ('2026-10-06',
   '「影響力∞アイドル」リリース記念キャンペーン、開催決定！',
   'HoneyWorks feat.ハコニワリリィ「影響力∞アイドル」のリリース記念キャンペーンが決定しました。',
   '[{"url":"https://hakoniwalily.jp/news/20261006-2000/","label_key":"details"}]'),
  ('2026-09-25',
   'CLEAR／坂本真綾【Covered by Hanon】公開！',
   'Hanonの歌ってみた最新作がYouTubeで公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=ev4W3pNB66k","label_key":"watch"}]'),
  ('2026-09-24',
   '劇薬中毒 /＝LOVE【Covered by Hanon×Kotoha】公開！',
   'HanonとKotohaによるカバー動画がKotohaのチャンネルで公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=FLH4EoRCgSQ","label_key":"watch"}]'),
  ('2026-09-15',
   'HoneyWorks feat.ハコニワリリィ、2nd EVENT「Wonder Greeting」チケット2次先行 申込開始！',
   '2nd EVENT「Wonder Greeting」のチケット2次先行の申込受付がスタートしました。詳細は公式サイトをチェック！',
   '[{"url":"https://hakoniwalily.jp/news/20260915-2000/","label_key":"tickets"}]'),
  ('2026-09-07',
   'My Dearest／supercell【Covered by Hanon】公開！',
   '大好きなアーティストの楽曲をカバーした新作が公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=-aZ5pArxNW0","label_key":"watch"}]'),
  ('2026-08-27',
   'TVアニメ「世界最強の魔女、始めました」のOP主題歌がHoneyWorks feat.ハコニワリリィ「影響力∞アイドル」に決定！10月7日デジタルリリース！',
   '新曲「影響力∞アイドル」がTVアニメのOP主題歌に決定。10月7日にデジタルリリース予定です。',
   '[{"url":"https://hakoniwalily.jp/news/20260827-1200/","label_key":"details"}]'),
  ('2026-08-25',
   'only my railgun／fripSide【Hanon×Kotoha】公開！',
   'ハコリリの2人によるカバー動画が公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=BUMqSPEQAuE","label_key":"watch"}]'),
  ('2026-08-15',
   'HoneyWorks feat.ハコニワリリィ、2nd EVENT「Wonder Greeting」開催決定！',
   'HoneyWorks feat.ハコニワリリィの2nd EVENT「Wonder Greeting」の開催が決定しました。',
   '[{"url":"https://hakoniwalily.jp/news/20260815-1615/","label_key":"details"}]'),
  ('2026-07-24',
   'オトメノホンキ（Hanon solo ver.）Music Video公開！',
   'TVアニメ『乙女怪獣キャラメリゼ』EDテーマのHanon solo ver. MVが公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=PTAGxi1Fmkc","label_key":"watch"}]'),
  ('2026-07-20',
   'Hanonオリジナル曲「ふらすとれーしょん・がーる」MV公開！',
   'ENPITUさんとのボカデュオ参加曲がMVとして公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=Hvzkn-E1mv0","label_key":"watch"}]'),
  ('2026-07-17',
   'StellaPhizz「エレクトリック・シティ」MV公開！',
   'HanonがボーカルをつとめるStellaPhizzの新曲MVが公開されました。',
   '[{"url":"https://www.youtube.com/watch?v=ErJpQeiwzhw","label_key":"watch"}]'),
  ('2026-07-15',
   'ハコリリ夏祭りにてCD購入キャンペーン開催！',
   '『ハコリリ夏祭り2026』の会場でCD購入キャンペーンが開催されました。',
   '[{"url":"https://hakoniwalily.jp/news/20260715-2215/","label_key":"details"}]'),
  ('2026-07-03',
   '「HoneyWorks Presents ハニフェス 2026 ～女子校文化祭 ハロウィンパーティ～」出演決定！',
   'ハコニワリリィの「ハニフェス 2026」への出演が決定しました。',
   '[{"url":"https://hakoniwalily.jp/news/post-0107/","label_key":"details"}]'),
  ('2026-06-07',
   'TVアニメ『乙女怪獣キャラメリゼ』エンディングテーマがHoneyWorks feat.ハコニワリリィ「オトメノホンキ」に決定！7月8日デジタルリリース！',
   '新曲「オトメノホンキ」がTVアニメのEDテーマに決定。7月8日にデジタルリリースされました。',
   '[{"url":"https://hakoniwalily.jp/release/%e3%82%aa%e3%83%88%e3%83%a1%e3%83%8e%e3%83%9b%e3%83%b3%e3%82%ad/","label_key":"details"}]'),
  ('2026-05-25',
   '『ハコリリ夏祭り2026』キービジュアル＆チケット情報解禁！',
   '『ハコリリ夏祭り2026』のキービジュアルとチケット情報が公開されました。',
   '[{"url":"https://hakoniwalily.jp/news/post-106/","label_key":"details"}]')
) as v(posted_on, headline, summary, links)
where not exists (
  select 1 from news n where n.headline = v.headline and n.posted_on = v.posted_on::date
);

-- ---------------------------------------------------------------------------
-- Achievements — compiled (Hanon has no official 実績 list). Unverified items are left out
-- (ソロライブ「アイオライト」, the exact 2018 start date, the THE FIRST TAKE appearance) until a source is found.
-- 「誓いはキュンと。」 is NOT listed: the anime OP is sung by HoneyWorks feat.鈴木愛理; ハコニワリリィ released a cover.
-- ---------------------------------------------------------------------------
insert into achievements (achieved_on, text, status, published_at)
select v.achieved_on::date, v.text, v.status, case when v.status = 'published' then now() end
from (values
  ('2026-10-07', 'TVアニメ「世界最強の魔女、始めました」OP主題歌「影響力∞アイドル」歌唱担当（HoneyWorks feat.ハコニワリリィ）', 'published'),
  ('2026-09-01', 'ハコニワリリィ メジャーデビュー5周年', 'published'),
  ('2026-07-17', 'StellaPhizz「エレクトリック・シティ」MV公開', 'published'),
  ('2026-07-08', 'TVアニメ『乙女怪獣キャラメリゼ』EDテーマ「オトメノホンキ」歌唱担当（HoneyWorks feat.ハコニワリリィ）', 'published'),
  ('2026-03-31', '米津玄師, 宇多田ヒカル「JANE DOE」Hanon × Tani Yuuki カバー動画投稿', 'published'),
  ('2026-03-11', 'ハコニワリリィ 1st ALBUM『フローライト』発売', 'published'),
  ('2026-01-07', 'TVアニメ『29歳独身中堅冒険者の日常』OPテーマ「君が灯してくれた光を今」歌唱担当（HoneyWorks feat.Hanon）', 'published'),
  ('2025-10-06', 'TVアニメ「笑顔のたえない職場です。」OPテーマ「絶対称賛！」歌唱担当（HoneyWorks feat.ハコニワリリィ）', 'published'),
  ('2025-05-31', 'ハコニワリリィ 1st EVENT「Floral Greeting」（竹芝ニューピアホール）', 'published'),
  ('2025-02-22', 'TVアニメ『忍者と殺し屋のふたりぐらし』ED主題歌「にんころダンス」歌唱担当', 'published'),
  ('2025-02-15', 'StellaPhizz「Stella Symphony」MV公開', 'published'),
  ('2025-01-19', 'CeVIO AI ボイスライブラリ「箱庭ハノ・コト」発売', 'published'),
  ('2025-01-16', 'TVアニメ『男女の友情は成立する？（いや、しないっ!!）』OP主題歌「質問、恋って何でしょうか？」歌唱担当', 'published'),
  ('2024-08-16', 'TVアニメ「結婚するって、本当ですか」OPテーマ「キラキラ」歌唱担当', 'published'),
  ('2024-08-09', '3人組音楽ユニット StellaPhizz としてデビュー（「沈む世界の片隅で」配信）', 'published'),
  ('2024-06-02', '「ハニフェス～女子校文化祭」渋谷公演（LINE CUBE SHIBUYA）出演', 'published'),
  ('2024-04-29', '「ハニフェス～女子校文化祭」日比谷公演（日比谷野外音楽堂）出演', 'published'),
  ('2023-07-09', 'VTuberとして初配信（AiceClass アーティスト科）', 'published'),
  ('2022-11-18', 'ハコニワリリィ Live Tour「Lily''s Plage」（名古屋・東京・神戸）', 'published'),
  ('2022-09-28', 'ハコニワリリィ 1st ALBUM『Lily''s Plage』発売（オリコン最高20位）', 'published'),
  ('2022-06-25', 'ハコニワリリィ「Lily''s Garden Party」（品川インターシティホール）', 'published'),
  ('2022-06-01', 'TVアニメ「阿波連さんははかれない」EDテーマ『キョリ感』歌唱担当', 'published'),
  ('2021-09-01', 'TVアニメ「SDガンダムワールド ヒーローズ」EDテーマ『コガネゾラ』でメジャーデビュー（ハコニワリリィ）', 'published'),
  ('2020-08-23', '「ワタシノミカタ（ワタシノテンシ -another story-）／HoneyWorks feat. Hanon」公開', 'published'),
  ('2019-12-19', 'HoneyWorks feat. Hanon×Kotoha 1st ALBUM『恋色同盟』発売', 'published')
) as v(achieved_on, text, status)
where not exists (
  select 1 from achievements a where a.achieved_on = v.achieved_on::date and a.text = v.text
);

-- ---------------------------------------------------------------------------
-- Discography — covers come from youtube_id (placeholder shown when null;
-- admins can add the MV link later from the dashboard). Scope (owner, Q7): unit works, StellaPhizz,
-- "HoneyWorks feat. Hanon" works and Hanon solo vers (as notes); Kotoha-only works excluded.
-- Vox mini-album dates: Winter 2022-12-30 (CD; digital 2023-01-20), Summer 2023-08-13 (MusicBrainz; the official
-- page says it follows Winter Vox, so Wikipedia's "2022-08-13" is a year typo), Spring 2023-12-30, Autumn 2024-08-12.
-- ---------------------------------------------------------------------------
insert into discography_items (title, release_type, released_on, note, youtube_id, links, status, published_at)
select v.title, v.release_type, v.released_on::date, v.note, v.youtube_id, v.links::jsonb, 'published', now()
from (values
  ('影響力∞アイドル', 'tie_in', '2026-10-07',
   'HoneyWorks feat.ハコニワリリィ / TVアニメ「世界最強の魔女、始めました」OP主題歌', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%bd%b1%e9%9f%bf%e5%8a%9b%e2%88%9e%e3%82%a2%e3%82%a4%e3%83%89%e3%83%ab/","label_key":"details"}]'),
  ('ふらすとれーしょん・がーる', 'other', '2026-07-20',
   'Hanon オリジナル曲（Music：ENPITU）/ MV公開日', 'Hvzkn-E1mv0',
   '[{"url":"https://www.youtube.com/watch?v=Hvzkn-E1mv0","label_key":"watch"}]'),
  ('エレクトリック・シティ', 'other', '2026-07-17',
   'StellaPhizz / MV公開日', 'ErJpQeiwzhw',
   '[{"url":"https://www.youtube.com/watch?v=ErJpQeiwzhw","label_key":"watch"}]'),
  ('オトメノホンキ', 'tie_in', '2026-07-08',
   'HoneyWorks feat.ハコニワリリィ / TVアニメ『乙女怪獣キャラメリゼ』EDテーマ（Hanon solo ver. MVあり）', 'PTAGxi1Fmkc',
   '[{"url":"https://hakoniwalily.jp/release/%e3%82%aa%e3%83%88%e3%83%a1%e3%83%8e%e3%83%9b%e3%83%b3%e3%82%ad/","label_key":"details"},{"url":"https://www.youtube.com/watch?v=PTAGxi1Fmkc","label_key":"watch"}]'),
  ('誓いはキュンと。', 'cover', '2026-05-09',
   'HoneyWorks feat.ハコニワリリィ カバー（原曲：TVアニメ『逃がした魚は大きかったが釣りあげた魚が大きすぎた件』OP）/ Hanon solo ver. MV公開日', 'f-Ouq_OCbxU',
   '[{"url":"https://www.youtube.com/watch?v=f-Ouq_OCbxU","label_key":"watch"},{"url":"https://lnk.to/chikaihakyunto_hakoniwalily","label_key":"listen"}]'),
  ('フローライト', 'album', '2026-03-11',
   'ハコニワリリィ 1st ALBUM', null,
   '[{"url":"https://hakoniwalily.jp/release/727/","label_key":"details"}]'),
  ('君が灯してくれた光を今', 'tie_in', '2026-01-07',
   'HoneyWorks feat.Hanon / TVアニメ『29歳独身中堅冒険者の日常』OPテーマ', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%90%9b%e3%81%8c%e7%81%af%e3%81%97%e3%81%a6%e3%81%8f%e3%82%8c%e3%81%9f%e5%85%89%e3%82%92%e4%bb%8a/","label_key":"details"}]'),
  ('絶対称賛！', 'tie_in', '2025-10-06',
   'TVアニメ「笑顔のたえない職場です。」OPテーマ（Hanon solo ver. MVあり）', 'gULXfNvUqyo',
   '[{"url":"https://hakoniwalily.jp/release/%e7%b5%b6%e5%af%be%e7%a7%b0%e8%b3%9b%ef%bc%81/","label_key":"details"}]'),
  ('にんころダンス', 'tie_in', '2025-02-22',
   'TVアニメ『忍者と殺し屋のふたりぐらし』ED主題歌', null,
   '[{"url":"https://hakoniwalily.jp/release/%e3%81%ab%e3%82%93%e3%81%93%e3%82%8d%e3%83%80%e3%83%b3%e3%82%b9/","label_key":"details"}]'),
  ('Stella Symphony', 'other', '2025-02-15',
   'StellaPhizz / MV公開日', 'myCfO_Akky0',
   '[{"url":"https://www.youtube.com/watch?v=myCfO_Akky0","label_key":"watch"}]'),
  ('質問、恋って何でしょうか？', 'tie_in', '2025-01-16',
   'TVアニメ『男女の友情は成立する？（いや、しないっ!!）』OP主題歌', null,
   '[{"url":"https://hakoniwalily.jp/release/%e8%b3%aa%e5%95%8f%e3%80%81%e6%81%8b%e3%81%a3%e3%81%a6%e4%bd%95%e3%81%a7%e3%81%97%e3%82%87%e3%81%86%e3%81%8b%ef%bc%9f/","label_key":"details"}]'),
  ('キラキラ', 'tie_in', '2024-08-16',
   'TVアニメ「結婚するって、本当ですか」OPテーマ', null,
   '[{"url":"https://hakoniwalily.jp/release/%e3%82%ad%e3%83%a9%e3%82%ad%e3%83%a9/","label_key":"details"}]'),
  ('Autumn Vox', 'ep', '2024-08-12',
   'ハコニワリリィ 同人5th MINI ALBUM（書き下ろし6曲）', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%90%8c%e4%ba%ba5th-mini-album-autumn-vox/","label_key":"details"}]'),
  ('沈む世界の片隅で', 'single', '2024-08-09',
   'StellaPhizz デビュー曲', null, '[]'),
  ('Spring Vox', 'ep', '2023-12-30',
   'ハコニワリリィ 同人4th MINI ALBUM（書き下ろし6曲）', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%90%8c%e4%ba%ba4th-mini-album-spring-vox/","label_key":"details"}]'),
  ('Summer Vox', 'ep', '2023-08-13',
   'ハコニワリリィ 同人3rd MINI ALBUM（決戦スピリット カバー収録）', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%90%8c%e4%ba%ba3rd-mini-album-summer-vox/","label_key":"details"}]'),
  ('Winter Vox', 'ep', '2022-12-30',
   'ハコニワリリィ 同人2nd MINI ALBUM', null,
   '[{"url":"https://hakoniwalily.jp/release/%e5%90%8c%e4%ba%ba2nd-mini-album-winter-vox/","label_key":"details"}]'),
  ('Lily''s Plage', 'album', '2022-09-28',
   'ハコニワリリィ 1st ALBUM（メジャー）', null,
   '[{"url":"https://hakoniwalily.jp/release/1st-album-lilys-plage-%e3%82%b3%e3%83%b3%e3%83%97%e3%83%aa%e3%83%bc%e3%83%88%e7%9b%a4/","label_key":"details"}]'),
  ('キョリ感', 'single', '2022-06-01',
   'TVアニメ「阿波連さんははかれない」EDテーマ（Hanon盤あり）', null,
   '[{"url":"https://hakoniwalily.jp/release/239/","label_key":"details"}]'),
  ('コガネゾラ', 'single', '2021-09-01',
   'TVアニメ「SDガンダムワールド ヒーローズ」EDテーマ / メジャーデビュー（Hanon盤あり）', null,
   '[{"url":"https://hakoniwalily.jp/release/1st-single-%e3%82%b3%e3%82%ac%e3%83%8d%e3%82%be%e3%83%a9%e3%80%80%ef%bd%9ehanon%e7%9b%a4%ef%bd%9e/","label_key":"details"}]'),
  ('Mirage Vox', 'ep', '2021-06-19',
   'ハコニワリリィ 同人1st MINI ALBUM', null,
   '[{"url":"https://hakoniwalily.jp/release/1st-minialbum/","label_key":"details"}]'),
  ('水声少女', 'album', '2020-10-10',
   'HoneyWorks feat. Hanon×Kotoha 同人2nd ALBUM（ワタシノミカタ Hanon×Kotoha ver. 収録）', null,
   '[{"url":"https://hakoniwalily.jp/release/2nd-album/","label_key":"details"}]'),
  ('恋色同盟', 'album', '2019-12-19',
   'HoneyWorks feat. Hanon×Kotoha 同人1st ALBUM', null,
   '[{"url":"https://hakoniwalily.jp/release/1st-album/","label_key":"details"}]')
) as v(title, release_type, released_on, note, youtube_id, links)
where not exists (
  select 1 from discography_items d where d.title = v.title and d.released_on = v.released_on::date
);
