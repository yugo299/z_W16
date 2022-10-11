--■■■■ video_00（test） ■■■■
ALTER VIEW channel_00 AS
SELECT
	vy.ch AS id,
	vz.rc AS rc,
	vz.id AS vd,
	vz.cat AS cat,
	cy.title AS title,
	cz.rn AS rn
FROM
	video_z AS vz
	LEFT JOIN video_y AS vy ON vz.id = vy.id
	LEFT JOIN channel_y AS cy ON vy.ch = cy.id
	LEFT JOIN channel_z AS cz ON vy.ch = cz.id AND vz.rc = cz.rc

--■■■■ channel_00（test） ■■■■
ALTER VIEW channel_00 AS
SELECT
	vy.ch AS id,
	vz.rc AS rc,
	vz.id AS vd,
	vz.cat AS cat,
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
	LEFT JOIN channel_z AS z ON vy.ch = z.id AND vz.rc = z.rc

SELECT row_number() OVER w AS increment_id, *
FROM channel_00
WINDOW w AS ()

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
ALTER VIEW channel_80 AS
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
	LEFT JOIN channel_z AS z ON vy.ch = z.id AND vz.rc = z.rc
WHERE
	vz.flag = 80;


