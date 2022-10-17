--■■■■ 使用先 ■■■■
a_01 : 急上昇ランキング
a_78 : 詳細-チャンネル
a_79 : 詳細-動画
a_80 : 一覧-動画
a_88 : メタタグ-チャンネル
a_89 : メタタグ-動画

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
ALTER VIEW channel_90 AS
SELECT
	vy.ch AS id,
	vz.rc AS rc,
	vz.id AS vd,
	vz.cat AS cat,
	vz.flag AS flag,
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
	z.rn AS rn,
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
	z.pd_l AS pd_l,
	z.pd_b AS pd_b,
	z.pd_s AS pd_s,
	z.pd_e AS pd_e
FROM
	video_z AS vz
	LEFT JOIN video_y AS vy ON vz.id = vy.id
	LEFT JOIN channel_y AS y ON vy.ch = y.id
	LEFT JOIN channel_z AS z ON vy.ch = z.id
	AND vz.rc = z.rc
GROUP BY
	id,
	rc,
	cat
WHERE
	vz.flag <= 24;

--■■■■ a_00（test） ■■■■
ALTER VIEW a_00 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	y.ch AS ch,
	y.title AS title,
	y.date AS date,
	y.dur AS dur,
	y.des AS des,
	y.link AS link,
	y.img_m AS img_m,
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
WHERE
	z.flag < 24
ORDER BY
	z.rn ASC

--■■■■ video_24 ■■■■
ALTER VIEW video_24 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	z.flag AS flag,
	y.ch AS ch,
	y.title AS title,
	y.date AS date,
	y.dur AS dur,
	y.des AS des,
	y.tags AS tags,
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
	y.lk AS lk,
	y.lk_h AS lk_h,
	y.lk_d AS lk_d,
	y.lk_w AS lk_w,
	y.lk_m AS lk_m,
	y.lk_ah AS lk_ah,
	y.lk_ad AS lk_ad,
	y.lk_aw AS lk_aw,
	y.lk_am AS lk_am,
	y.cm AS cm,
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
	z.pd_l AS pd_l,
	z.pd_b AS pd_b,
	z.pd_s AS pd_s,
	z.pd_e AS pd_e
FROM
	video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
WHERE
	z.flag <= 24;

--■■■■ channel_24 ■■■■
ALTER VIEW channel_24 AS
SELECT
	v.ch AS id,
	v.rc AS rc,
	v.flag AS flag,
	v.rn AS rn_v,
	v.rt_ah AS rt_v,
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
	z.rn AS rn,
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
	z.pd_l AS pd_l,
	z.pd_b AS pd_b,
	z.pd_s AS pd_s,
	z.pd_e AS pd_e
FROM
( SELECT
		vy.ch AS ch,
		vz.rc AS rc,
		MIN(vz.flag) AS flag,
		MIN(vz.rn) AS rn,
		SUM(vz.rt_ah) AS rt_ah
	FROM
		video_z AS vz
	LEFT JOIN video_y AS vy ON vz.id = vy.id
	GROUP BY
		vy.ch,
		vz.rc
) AS v
	LEFT JOIN channel_y AS y ON v.ch = y.id
	LEFT JOIN channel_z AS z ON v.ch = z.id AND v.ch = z.rc
WHERE
	v.flag <= 24
ORDER BY
	v.ch ASC

--■■■■ a_01 (トップ,カテゴリ別ランキング) ■■■■
ALTER VIEW a_01 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.cat AS cat,
	z.flag AS flag,
	y.ch AS ch,
	y.title AS t_v,
	c.title AS t_c,
	y.date AS date,
	y.dur AS dur,
	y.des AS des,
	y.link AS l_v,
	c.link AS l_c,
	y.img_m AS img_m,
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

--■■■■ a_78（詳細-チャンネル） ■■■■
ALTER VIEW a_78 AS
SELECT
	y.title AS c_t,
	y.sb AS sb,
	y.vw AS vw,
	SUM(z.rt) AS rt,
	y.des AS des,
	y.img_s AS img_s,
	y.id AS id,
	z.rc AS rc,
	vz.id AS vd,
	vz.cat AS cat
FROM video_z AS vz
	LEFT JOIN video_y AS vy ON vz.id = vy.id
	LEFT JOIN channel_y AS y ON vy.ch = y.id
	LEFT JOIN channel_z AS z ON vy.ch = z.id
	GROUP BY vd, rc WITH ROLLUP
ORDER BY cat

--■■■■ a_79（詳細-動画） ■■■■
ALTER VIEW a_79 AS
SELECT
	y.title AS v_t,
	y.vw AS vw,
	z.rn AS rn,
	z.rt AS rt,
	z.cat AS cat,
	z.rn_b AS rn_b,
	y.des AS des,
	y.img_m AS img_m,
	z.id AS id,
	z.rc AS rc,
	y.ch AS ch
FROM video_z AS z
	LEFT JOIN video_y AS y ON z.id = y.id
ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn


--■■■■ a_80（一覧-動画） ■■■■
ALTER VIEW a_89 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.flag AS flag,
	y.title AS v_t,
	c.title AS c_t,
	y.vw AS vw,
	y.lk AS lk,
	z.rn AS rn,
	z.cat AS cat,
	v.rn_b AS rn_b
FROM video_z AS z
	LEFT JOIN ( SELECT id, rc, MIN(rn_b) AS rn_b FROM video_z GROUP BY id, rc ) AS v ON v.id = z.id AND v.rc = z.rc
	LEFT JOIN video_y AS y ON v.id = y.id
	LEFT JOIN channel_y AS c ON y.ch = c.id
ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn

--■■■■ a_88（メタタグ-チャンネル） ■■■■
ALTER VIEW a_88 AS
SELECT
	y.ch AS id,
	z.rc AS rc,
	z.cat AS cat,
	v.id AS vd,
	MIN(z.rn) AS rn
(
	SELECT y.ch AS id, z.id AS vd, z.rc AS rc, z.cat AS cat, MIN(z.rn) AS rn
	FROM video_z AS z LEFT JOIN video_y AS y ON z.id = y.id
	GROUP BY vd, rc WITH ROLLUP
) AS v

	( SELECT id, rc, MIN(rn_b) AS rn_b FROM video_z GROUP BY id, rc ) AS v ON v.id = z.id AND v.rc = z.rc

	LEFT JOIN channel_y AS c ON y.ch = c.id
ORDER BY CASE WHEN rn IS NULL THEN 1 ELSE 0 END, rn

SELECT
	z.id AS id,
	z.rc AS rc,
	z.flag AS flag,
	y.title AS v_t,
	c.title AS c_t,
	y.vw AS vw,
	y.lk AS lk,
	z.rn AS rn,
	z.cat AS cat,
	v.rn_b AS rn_b


--■■■■ a_89（メタタグ-動画） ■■■■
ALTER VIEW a_89 AS
SELECT
	z.id AS id,
	z.rc AS rc,
	z.flag AS flag,
	y.title AS v_t,
	y.ch AS ch,
	c.title AS c_t,
	y.vw AS vw,
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
