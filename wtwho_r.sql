--■■■■ 用途 ■■■■
a_01 : 動画-ランキング最高順位（現在）
a_02 : 動画-ランキング最高順位（通期）
a_03 : 動画-レシオ（現在/期間別）
a_06 : チャンネル-ランキング最高順位（現在）
a_07 : チャンネル-ランキング最高順位（通期）
a_08 : チャンネル-レシオ（現在/期間別）
a_11 : 急上昇ランキング（トップ/カテゴリ別）
a_61 : スタッツ-再生回数
a_62 : スタッツ-高評価数
a_63 : スタッツ-コメント
a_78 : チャンネル-詳細（個別ページ用）
a_79 : 動画-一覧（個別ページ用）
a_89 : メタタグ-動画/チャンネル

--■■■■ video_y ■■■■
CREATE TABLE IF NOT EXISTS `video_y` (
  `id` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ch` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'channel',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime DEFAULT NULL COMMENT 'publishedAt',
  `dur` time DEFAULT NULL COMMENT 'duration',
  `des` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'description',
  `tags` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'thumbnails_medium',
  `vw` bigint(20) unsigned DEFAULT NULL COMMENT 'viewCount',
  `vw_a` int(10) unsigned NOT NULL DEFAULT 0,
  `vw_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_ah` int(10) unsigned DEFAULT NULL,
  `vw_ad` int(10) unsigned DEFAULT NULL,
  `vw_aw` int(10) unsigned DEFAULT NULL,
  `vw_am` int(10) unsigned DEFAULT NULL,
  `lk` int(10) unsigned DEFAULT NULL COMMENT 'like',
  `lk_a` int(10) unsigned NOT NULL DEFAULT 0,
  `lk_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lk_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lk_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lk_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `lk_ah` int(10) DEFAULT NULL,
  `lk_ad` int(10) DEFAULT NULL,
  `lk_aw` int(10) DEFAULT NULL,
  `lk_am` int(10) DEFAULT NULL,
  `cm` int(10) unsigned DEFAULT NULL COMMENT 'comment',
  `cm_a` int(10) unsigned NOT NULL DEFAULT 0,
  `cm_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_ah` int(10) DEFAULT NULL,
  `cm_ad` int(10) DEFAULT NULL,
  `cm_aw` int(10) DEFAULT NULL,
  `cm_am` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--■■■■ video_z ■■■■
CREATE TABLE IF NOT EXISTS `video_z` (
  `id` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `rc` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'regionCode',
  `cat` tinyint(2) unsigned NOT NULL DEFAULT 0 COMMENT 'category',
  `flag` tinyint(2) unsigned NOT NULL DEFAULT 24,
  `rn` tinyint(3) unsigned DEFAULT NULL COMMENT 'rank',
  `rn_i` datetime DEFAULT NULL,
  `rn_b` tinyint(3) unsigned DEFAULT 101,
  `rn_t` datetime DEFAULT NULL,
  `rn_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt` decimal(10,4) unsigned NOT NULL DEFAULT 0.0000 COMMENT 'ratio',
  `rt_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_ah` decimal(10,4) unsigned DEFAULT NULL,
  `rt_ad` decimal(10,4) unsigned DEFAULT NULL,
  `rt_aw` decimal(10,4) unsigned DEFAULT NULL,
  `rt_am` decimal(10,4) unsigned DEFAULT NULL,
  `pd` smallint(5) unsigned DEFAULT 0 COMMENT 'period',
  `pd_f` datetime DEFAULT NULL,
  `pd_l` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--■■■■ channel_y ■■■■
CREATE TABLE IF NOT EXISTS `channel_y` (
  `id` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime DEFAULT NULL COMMENT 'publishedAt',
  `des` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'description',
  `handle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'customUrl',
  `img` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'thumbnails_medium',
  `banner` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vw` bigint(20) unsigned DEFAULT NULL COMMENT 'viewCount',
  `vw_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vw_ah` int(10) unsigned DEFAULT NULL,
  `vw_ad` int(10) unsigned DEFAULT NULL,
  `vw_aw` int(10) unsigned DEFAULT NULL,
  `vw_am` int(10) unsigned DEFAULT NULL,
  `sb` int(10) unsigned DEFAULT NULL COMMENT 'subscriberCount',
  `sb_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sb_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sb_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sb_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sb_ah` int(10) DEFAULT NULL,
  `sb_ad` int(10) DEFAULT NULL,
  `sb_aw` int(10) DEFAULT NULL,
  `sb_am` int(10) DEFAULT NULL,
  `vc` int(10) unsigned DEFAULT NULL COMMENT 'videoCount',
  `vc_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vc_ah` int(10) DEFAULT NULL,
  `vc_ad` int(10) DEFAULT NULL,
  `vc_aw` int(10) DEFAULT NULL,
  `vc_am` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--■■■■ channel_z ■■■■
CREATE TABLE IF NOT EXISTS `channel_z` (
  `id` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `rc` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'regionCode',
  `rn_b` tinyint(3) unsigned DEFAULT 101,
  `rn_t` datetime DEFAULT NULL,
  `rn_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rn_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_h` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_w` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_m` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pd` smallint(5) unsigned DEFAULT 0 COMMENT 'period',
  `pd_n` smallint(5) unsigned NOT NULL DEFAULT 0,
  `pd_f` datetime DEFAULT NULL,
  `pd_l` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--■■■■ stats ■■■■
CREATE TABLE IF NOT EXISTS `result` (
  `date` date NOT NULL,
  `rc` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'regionCode',
  `cat` tinyint(2) unsigned NOT NULL DEFAULT 0,
  `type` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `5` int(10) unsigned NOT NULL DEFAULT 0,
  `6` int(10) unsigned NOT NULL DEFAULT 0,
  `7` int(10) unsigned NOT NULL DEFAULT 0,
  `8` int(10) unsigned NOT NULL DEFAULT 0,
  `9` int(10) unsigned NOT NULL DEFAULT 0,
  `10` int(10) unsigned NOT NULL DEFAULT 0,
  `11` int(10) unsigned NOT NULL DEFAULT 0,
  `12` int(10) unsigned NOT NULL DEFAULT 0,
  `13` int(10) unsigned NOT NULL DEFAULT 0,
  `14` int(10) unsigned NOT NULL DEFAULT 0,
  `15` int(10) unsigned NOT NULL DEFAULT 0,
  `16` int(10) unsigned NOT NULL DEFAULT 0,
  `17` int(10) unsigned NOT NULL DEFAULT 0,
  `18` int(10) unsigned NOT NULL DEFAULT 0,
  `19` int(10) unsigned NOT NULL DEFAULT 0,
  `20` int(10) unsigned NOT NULL DEFAULT 0,
  `21` int(10) unsigned NOT NULL DEFAULT 0,
  `22` int(10) unsigned NOT NULL DEFAULT 0,
  `23` int(10) unsigned NOT NULL DEFAULT 0,
  `0` int(10) unsigned NOT NULL DEFAULT 0,
  `1` int(10) unsigned NOT NULL DEFAULT 0,
  `2` int(10) unsigned NOT NULL DEFAULT 0,
  `3` int(10) unsigned NOT NULL DEFAULT 0,
  `4` int(10) unsigned NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--■■■■ video_00（test） ■■■■
ALTER VIEW video_00 AS
SELECT * FROM
( SELECT
	count(*),
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	MAX(z.flag) AS flag,
	MAX(y.ch) AS ch,
	MAX(y.date) AS date,
	MAX(y.dur) AS dur,
	MAX(y.link) AS link,
	MAX(y.vw) AS vw,
	MAX(y.vw_h) AS vw_h,
	MAX(y.vw_ah) AS vw_ah,
	MAX(y.lk) AS lk,
	MAX(y.lk_h) AS lk_h,
	MAX(y.lk_ah) AS lk_ah,
	MAX(y.cm) AS cm,
	MAX(y.cm_h) AS cm_h,
	MAX(y.cm_ah) AS cm_ah,
	MIN(z.rn) AS rn,
	MAX(z.rn_i) AS rn_i,
	MIN(z.rn_b) AS rn_b,
	MAX(z.rn_t) AS rn_t,
	MAX(z.rn_h) AS rn_h,
	SUM(NVL(z.rt, 0)) AS rt,
	MAX(z.rt_h) AS rt_h,
	MAX(z.rt_ah) AS rt_ah,
	MAX(z.pd) AS pd,
	MAX(z.pd_f) AS pd_f,
	MAX(z.pd_l) AS pd_l,
	MAX(z.pd_b) AS pd_b,
	MAX(z.pd_s) AS pd_s,
	MAX(z.pd_e) AS pd_e
FROM
	video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
WHERE
	ch = 'UCh990JFF8shUqSRhCvvztQg'
GROUP BY id, rc, cat WITH ROLLUP
) AS t
ORDER BY id, rc, cat ASC;

ALTER VIEW video_00 AS
SELECT * FROM
(SELECT
	count(*),
	z.rc AS rc,
	z.cat AS cat,
	SUM(NVL(z.rt, 0)) AS rt
FROM
	video_z AS z
GROUP BY rc, cat WITH ROLLUP) AS t
ORDER BY cat ASC;

--■■■■ channel_00（test） ■■■■
ALTER VIEW channel_00 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	vrn.flag AS flag,
	y.title AS title,
	y.date AS date,
	y.des AS des,
	y.link AS link,
	y.img_m AS img_m,
	y.img_s AS img_s,
	y.vw AS vw,
	y.vw_h AS vw_h,
	y.vw_d AS vw_d,
	y.vw_w AS vw_w,
	y.vw_m AS vw_m,
	y.vw_ah AS vw_ah,
	y.vw_ad AS vw_ad,
	y.vw_aw AS vw_aw,
	y.vw_am AS vw_am,
	y.sb AS sb,
	y.sb_h AS sb_h,
	y.sb_d AS sb_d,
	y.sb_w AS sb_w,
	y.sb_m AS sb_m,
	y.sb_ah AS sb_ah,
	y.sb_ad AS sb_ad,
	y.sb_aw AS sb_aw,
	y.sb_am AS sb_am,
	y.vc AS vc,
	y.vc_h AS vc_h,
	y.vc_d AS vc_d,
	y.vc_w AS vc_w,
	y.vc_m AS vc_m,
	y.vc_ah AS vc_ah,
	y.vc_ad AS vc_ad,
	y.vc_aw AS vc_aw,
	y.vc_am AS vc_am,
	vrn.rn AS rn,
	z.rn_b AS rn_b,
	z.rn_t AS rn_t,
	z.rn_h AS rn_h,
	z.rn_d AS rn_d,
	z.rn_w AS rn_w,
	z.rn_m AS rn_m,
	vrt.rt AS rt,
	z.rt_h AS rt_h,
	z.rt_d AS rt_d,
	z.rt_w AS rt_w,
	z.rt_m AS rt_m,
	vrt.rt_ah AS rt_ah,
	vrt.rt_ad AS rt_ad,
	vrt.rt_aw AS rt_aw,
	vrt.rt_am AS rt_am,
	z.pd AS pd,
	z.pd_f AS pd_f,
	z.pd_l AS pd_l,
	z.pd_b AS pd_b,
	z.pd_s AS pd_s,
	z.pd_e AS pd_e
FROM channel_z AS z
	LEFT JOIN channel_y AS y ON z.id = y.id
	LEFT JOIN (
		SELECT
			vyrn.ch AS ch,
			vzrn.rc AS rc,
			MIN(vzrn.flag) AS flag,
			vzrn.rn AS rn,
			vzrn.vd AS vd
		FROM (
			SELECT id AS vd, rc, cat, flag, rn FROM (
				SELECT id, rc, cat, flag, rn, RANK() OVER (PARTITION BY id, rc ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn ASC) AS num FROM video_z
			) AS vz WHERE vz.num = 1
		) AS vzrn
			LEFT JOIN video_y AS vyrn ON vzrn.vd = vyrn.id
		GROUP BY ch, rc
	) AS vrn ON z.id = vrn.ch AND z.rc = vrn.rc
	LEFT JOIN (
		SELECT
			vyrt.ch AS ch,
			vzrt.rc AS rc,
			SUM(vzrt.rt) AS rt,
			SUM(vzrt.rt_ah) AS rt_ah,
			SUM(vzrt.rt_ad) AS rt_ad,
			SUM(vzrt.rt_aw) AS rt_aw,
			SUM(vzrt.rt_am) AS rt_am
		FROM (
			SELECT
				id AS vd, rc, SUM(rt) AS rt,
				SUM(rt_ah) AS rt_ah, SUM(rt_ad) AS rt_ad, SUM(rt_aw) AS rt_aw, SUM(rt_am) AS rt_am
			FROM video_z GROUP BY id, rc
		) AS vzrt
		LEFT JOIN video_y AS vyrt ON vzrt.vd = vyrt.id
		GROUP BY ch, rc
	) AS vrt ON z.id = vrt.ch AND z.rc = vrt.rc
WHERE vrn.flag <= 24
ORDER BY z.id ASC

--■■■■ a_00（test） ■■■■
ALTER VIEW a_00 AS
SELECT ch, rc, rn, vd, cat
FROM (
	SELECT ch, rc, rn, vd, cat, RANK() OVER (PARTITION BY ch, rc ORDER BY rn ASC) AS num
	FROM (
		SELECT y.ch AS ch, z.rc AS rc, z.rn AS rn, z.id AS vd, z.cat AS cat, y.date AS date
		FROM video_z AS z
			LEFT JOIN video_y AS y ON z.id = y.id
		WHERE rn IS NOT NULL
		ORDER BY ch, rc, date DESC
	) AS c
) AS t WHERE num = 1

--■■■■ video_24 ■■■■
ALTER VIEW video_24 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	z.flag AS flag,
	y.ch AS ch,
	y.title AS title,
	c.title AS t_c,
	y.date AS date,
	y.dur AS dur,
	y.des AS des,
	y.tags AS tags,
	y.img AS img,
	y.vw AS vw,
	y.vw_a AS vw_a,
	y.vw_h AS vw_h,
	y.vw_d AS vw_d,
	y.vw_w AS vw_w,
	y.vw_m AS vw_m,
	y.vw_ah AS vw_ah,
	y.vw_ad AS vw_ad,
	y.vw_aw AS vw_aw,
	y.vw_am AS vw_am,
	y.lk AS lk,
	y.lk_a AS lk_a,
	y.lk_h AS lk_h,
	y.lk_d AS lk_d,
	y.lk_w AS lk_w,
	y.lk_m AS lk_m,
	y.lk_ah AS lk_ah,
	y.lk_ad AS lk_ad,
	y.lk_aw AS lk_aw,
	y.lk_am AS lk_am,
	y.cm AS cm,
	y.cm_a AS cm_a,
	y.cm_h AS cm_h,
	y.cm_d AS cm_d,
	y.cm_w AS cm_w,
	y.cm_m AS cm_m,
	y.cm_ah AS cm_ah,
	y.cm_ad AS cm_ad,
	y.cm_aw AS cm_aw,
	y.cm_am AS cm_am,
	z.rn AS rn,
	z.rn_i AS rn_i,
	z.rn_b AS rn_b,
	z.rn_t AS rn_t,
	z.rn_h AS rn_h,
	z.rn_d AS rn_d,
	z.rn_w AS rn_w,
	z.rn_m AS rn_m,
	z.rt AS rt,
	z.rt_h AS rt_h,
	z.rt_d AS rt_d,
	z.rt_w AS rt_w,
	z.rt_m AS rt_m,
	z.rt_ah AS rt_ah,
	z.rt_ad AS rt_ad,
	z.rt_aw AS rt_aw,
	z.rt_am AS rt_am,
	z.pd AS pd,
	z.pd_f AS pd_f,
	z.pd_l AS pd_l
FROM
	video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
	LEFT JOIN channel_y AS c ON y.ch = c.id
WHERE
	z.flag <= 24;

--■■■■ channel_24 ■■■■
ALTER VIEW channel_24 AS
SELECT
	vrn.ch AS id,
	vrn.rc AS rc,
	vrn.flag AS flag,
	y.title AS title,
	y.date AS date,
	y.des AS des,
	y.handle AS handle,
	y.img AS img,
	y.vw AS vw,
	y.vw_h AS vw_h,
	y.vw_d AS vw_d,
	y.vw_w AS vw_w,
	y.vw_m AS vw_m,
	y.vw_ah AS vw_ah,
	y.vw_ad AS vw_ad,
	y.vw_aw AS vw_aw,
	y.vw_am AS vw_am,
	y.sb AS sb,
	y.sb_h AS sb_h,
	y.sb_d AS sb_d,
	y.sb_w AS sb_w,
	y.sb_m AS sb_m,
	y.sb_ah AS sb_ah,
	y.sb_ad AS sb_ad,
	y.sb_aw AS sb_aw,
	y.sb_am AS sb_am,
	y.vc AS vc,
	y.vc_h AS vc_h,
	y.vc_d AS vc_d,
	y.vc_w AS vc_w,
	y.vc_m AS vc_m,
	y.vc_ah AS vc_ah,
	y.vc_ad AS vc_ad,
	y.vc_aw AS vc_aw,
	y.vc_am AS vc_am,
	vrn.rn AS rn,
	z.rn_b AS rn_b,
	z.rn_t AS rn_t,
	z.rn_h AS rn_h,
	z.rn_d AS rn_d,
	z.rn_w AS rn_w,
	z.rn_m AS rn_m,
	vrt.rt AS rt,
	z.rt_h AS rt_h,
	z.rt_d AS rt_d,
	z.rt_w AS rt_w,
	z.rt_m AS rt_m,
	vrt.rt_ah AS rt_ah,
	vrt.rt_ad AS rt_ad,
	vrt.rt_aw AS rt_aw,
	vrt.rt_am AS rt_am,
	z.pd AS pd,
	z.pd_n AS pd_n,
	z.pd_f AS pd_f,
	z.pd_l AS pd_l
FROM (
	SELECT
		vyrn.ch AS ch,
		vzrn.rc AS rc,
		MIN(vzrn.flag) AS flag,
		vzrn.rn AS rn,
		vzrn.vd AS vd
	FROM (
		SELECT id AS vd, rc, cat, flag, rn FROM (
			SELECT id, rc, cat, flag, rn, RANK() OVER (PARTITION BY id, rc ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn ASC) AS num FROM video_z
		) AS vz WHERE vz.num = 1
	) AS vzrn
		LEFT JOIN video_y AS vyrn ON vzrn.vd = vyrn.id
	GROUP BY ch, rc
) AS vrn
	LEFT JOIN (
		SELECT
			vyrt.ch AS ch,
			vzrt.rc AS rc,
			SUM(vzrt.rt) AS rt,
			SUM(vzrt.rt_ah) AS rt_ah,
			SUM(vzrt.rt_ad) AS rt_ad,
			SUM(vzrt.rt_aw) AS rt_aw,
			SUM(vzrt.rt_am) AS rt_am
		FROM (
			SELECT
				id AS vd, rc, SUM(rt) AS rt,
				SUM(rt_ah) AS rt_ah, SUM(rt_ad) AS rt_ad, SUM(rt_aw) AS rt_aw, SUM(rt_am) AS rt_am
			FROM video_z GROUP BY id, rc
		) AS vzrt
		LEFT JOIN video_y AS vyrt ON vzrt.vd = vyrt.id
		GROUP BY ch, rc
	) AS vrt ON vrn.ch = vrt.ch AND vrn.rc = vrt.rc
	LEFT JOIN channel_y AS y ON vrn.ch = y.id
	LEFT JOIN channel_z AS z ON vrn.ch = z.id AND vrn.rc = z.rc
WHERE flag <= 24
ORDER BY id ASC

--■■■■ a_01 : 動画-ランキング最高順位（現在） ■■■■
ALTER VIEW a_01 AS
SELECT id AS vd, rc, cat, rn FROM (
SELECT id, rc, cat, rn, RANK() OVER (PARTITION BY id, rc ORDER BY rn ASC) AS num FROM video_z
) AS z WHERE z.num = 1;

--■■■■ a_02 : 動画-ランキング最高順位（通期） ■■■■
ALTER VIEW a_02 AS
SELECT id AS vd, rc, cat, rn_b, rn_t FROM (
SELECT id, rc, cat, rn_b, rn_t, RANK() OVER (PARTITION BY id, rc ORDER BY rn_b ASC) AS num FROM video_z
) AS z WHERE z.num = 1;

--■■■■ a_03 : 動画-レシオ（現在/期間別） ■■■■
ALTER VIEW a_03 AS
SELECT
	id AS vd, rc, SUM(rt) AS rt,
	SUM(rt_ah) AS rt_ah, SUM(rt_ad) AS rt_ad, SUM(rt_aw) AS rt_aw, SUM(rt_am) AS rt_am
FROM video_z GROUP BY id, rc

--■■■■ a_06 : チャンネル-ランキング最高順位（現在） ■■■■
ALTER VIEW a_06 AS
SELECT ch, rc, rn, vd, cat
FROM (
	SELECT ch, rc, rn, vd, cat, RANK() OVER (PARTITION BY ch, rc ORDER BY rn ASC) AS num
	FROM (
		SELECT y.ch AS ch, z.rc AS rc, z.rn AS rn, z.id AS vd, z.cat AS cat, y.date AS date
		FROM video_z AS z
			LEFT JOIN video_y AS y ON z.id = y.id
		WHERE rn IS NOT NULL
		ORDER BY ch, rc, date DESC
	) AS c
) AS t WHERE num = 1

--■■■■ a_07 : チャンネル-ランキング最高順位（通期） ■■■■
ALTER VIEW a_07 AS
SELECT ch, rc, rn_b, vd, cat, rn_t
FROM (
	SELECT ch, rc, rn_b, vd, cat, rn_t, RANK() OVER (PARTITION BY ch, rc ORDER BY rn_b ASC) AS num
	FROM (
		SELECT y.ch AS ch, z.rc AS rc, z.rn_b AS rn_b, z.id AS vd, z.cat AS cat, z.rn_t AS rn_t
		FROM video_z AS z
			LEFT JOIN video_y AS y ON z.id = y.id
		WHERE rn_b IS NOT NULL AND rn_t IS NOT NULL
		ORDER BY ch, rc, rn_t DESC
	) AS c
) AS t WHERE num = 1

--■■■■ a_08 : チャンネル-レシオ（現在/期間別） ■■■■
ALTER VIEW a_08 AS
SELECT
	y.ch AS ch,
	z.rc AS rc,
	SUM(z.rt) AS rt,
	SUM(z.rt_ah) AS rt_ah,
	SUM(z.rt_ad) AS rt_ad,
	SUM(z.rt_aw) AS rt_aw,
	SUM(z.rt_am) AS rt_am
FROM (
	SELECT
		id AS vd, rc, SUM(rt) AS rt,
		SUM(rt_ah) AS rt_ah, SUM(rt_ad) AS rt_ad, SUM(rt_aw) AS rt_aw, SUM(rt_am) AS rt_am
	FROM video_z GROUP BY id, rc
) AS z
	LEFT JOIN video_y AS y ON z.vd = y.id
GROUP BY ch, rc

--■■■■ a_11 : 急上昇ランキング（トップ/カテゴリ別） ■■■■
ALTER VIEW a_11 AS
SELECT
	z.id AS vd,
	z.rc AS rc,
	z.cat AS cat,
	z.flag AS flag,
	y.ch AS ch,
	y.title AS t_v,
	c.title AS t_c,
	y.date AS date,
	y.dur AS dur,
	y.des AS des,
	y.img AS img,
	y.vw AS vw,
	y.vw_ah AS vw_ah,
	y.lk AS lk,
	y.lk_ah AS lk_ah,
	y.cm AS cm,
	y.cm_ah AS cm_ah,
	z.rn AS rn,
	z.rt AS rt,
	z.pd AS pd
FROM
	video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
	LEFT JOIN channel_y AS c ON y.ch = c.id
WHERE
	z.flag < 24
ORDER BY
	z.rn ASC

--■■■■ a_78 : チャンネル-詳細（個別ページ用） ■■■■
ALTER VIEW a_78 AS
SELECT
	y.title AS t_c,
	y.sb AS sb,
	y.vw AS vw,
	y.vc AS vc,
	c.rt AS rt,
	y.des AS des,
	y.img AS img,
	y.banner AS banner,
	z.id AS ch,
	z.rc AS rc
FROM channel_z AS z
	LEFT JOIN channel_y AS y ON z.id = y.id
	LEFT JOIN (
		SELECT
			vy.ch AS ch,
			vz.rc AS rc,
			SUM(vz.rt) AS rt
		FROM (SELECT id AS vd, rc, SUM(rt) AS rt FROM video_z GROUP BY id, rc) AS vz
			LEFT JOIN video_y AS vy ON vz.vd = vy.id
		GROUP BY ch, rc
	) AS c ON z.id = c.ch

--■■■■ a_79 : 動画-詳細（個別ページ用） ■■■■
ALTER VIEW a_79 AS
SELECT
	z.id AS vd,
	z.rc AS rc,
	z.cat AS cat,
	MIN(z.flag) AS flag,
	y.title AS t_v,
	y.des AS des,
	y.ch AS ch,
	c.title AS t_c,
	MIN(z.rn) AS rn,
	SUM(z.rt) AS rt,
	y.vw AS vw,
	y.lk AS lk,
	y.cm AS cm,
	y.date AS date,
	y.dur AS dur,
	y.img AS img
FROM (SELECT * FROM video_z ORDER BY rn DESC) AS z
	LEFT JOIN video_y AS y ON z.id = y.id
	LEFT JOIN channel_y AS c ON y.ch = c.id
GROUP BY vd, rc, cat WITH ROLLUP

--■■■■ a_89 : メタタグ-動画/チャンネル ■■■■
ALTER VIEW a_89 AS
SELECT
	z.id AS vd,
	z.rc AS rc,
	z.flag AS flag,
	y.title AS t_v,
	y.date AS d_v,
	y.ch AS ch,
	c.title AS t_c,
	c.date AS d_c,
	c.sb AS sb,
	c.vw AS v_c,
	y.vw AS v_v,
	y.lk AS lk,
	z.rn AS rn,
	z.cat AS cat,
	v.rn_b AS rn_b
FROM video_z AS z
	LEFT JOIN ( SELECT id, rc, MIN(rn_b) AS rn_b FROM video_z GROUP BY id, rc ) AS v ON v.id = z.id AND v.rc = z.rc
	LEFT JOIN video_y AS y ON v.id = y.id
	LEFT JOIN channel_y AS c ON y.ch = c.id
ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn

--■■■■ MEMO ■■■■

LIMIT 10;


ALTER VIEW video_00 AS
SELECT * FROM
(SELECT
	count(*),
	z.rc AS rc,
	z.cat AS cat,
	SUM(NVL(z.rt, 0)) AS rt
FROM
	video_z AS z
GROUP BY rc, cat WITH ROLLUP) AS t
ORDER BY cat ASC;

ALTER VIEW a_88 AS
SELECT * FROM
( SELECT
	count(*),
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	MAX(z.flag) AS flag,
	MAX(y.ch) AS ch,
	MAX(y.date) AS date,
	MAX(y.dur) AS dur,
	MAX(y.link) AS link,
	MAX(y.vw) AS vw,
	MAX(y.vw_h) AS vw_h,
	MAX(y.vw_ah) AS vw_ah,
	MAX(y.lk) AS lk,
	MAX(y.lk_h) AS lk_h,
	MAX(y.lk_ah) AS lk_ah,
	MAX(y.cm) AS cm,
	MAX(y.cm_h) AS cm_h,
	MAX(y.cm_ah) AS cm_ah,
	MIN(z.rn) AS rn,
	MAX(z.rn_i) AS rn_i,
	MIN(z.rn_b) AS rn_b,
	MAX(z.rn_t) AS rn_t,
	MAX(z.rn_h) AS rn_h,
	SUM(NVL(z.rt, 0)) AS rt,
	MAX(z.rt_h) AS rt_h,
	MAX(z.rt_ah) AS rt_ah,
	MAX(z.pd) AS pd,
	MAX(z.pd_f) AS pd_f,
	MAX(z.pd_l) AS pd_l,
	MAX(z.pd_b) AS pd_b,
	MAX(z.pd_s) AS pd_s,
	MAX(z.pd_e) AS pd_e
FROM
	video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
GROUP BY id, rc, cat WITH ROLLUP
) AS t
ORDER BY id, rc, cat ASC;

ALTER VIEW video_00 AS
SELECT * FROM
(SELECT
	count(*),
	z.rc AS rc,
	z.cat AS cat,
	SUM(NVL(z.rt, 0)) AS rt
FROM
	video_z AS z
GROUP BY rc, cat WITH ROLLUP) AS t
ORDER BY cat ASC;
