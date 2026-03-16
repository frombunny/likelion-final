INSERT INTO vote_winners (sector, name)
SELECT 'VITALITY_AWARD', '최유성'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'VITALITY_AWARD' AND name = '최유성'
);

INSERT INTO vote_winners (sector, name)
SELECT 'VITALITY_AWARD', '박성훈'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'VITALITY_AWARD' AND name = '박성훈'
);

INSERT INTO vote_winners (sector, name)
SELECT 'CONTRIBUTION_AWARD', '임혜정'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'CONTRIBUTION_AWARD' AND name = '임혜정'
);

INSERT INTO vote_winners (sector, name)
SELECT 'CONTRIBUTION_AWARD', '권기남'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'CONTRIBUTION_AWARD' AND name = '권기남'
);

INSERT INTO vote_winners (sector, name)
SELECT 'EXCELLENCE_AWARD', '구혁모'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'EXCELLENCE_AWARD' AND name = '구혁모'
);

INSERT INTO vote_winners (sector, name)
SELECT 'EXCELLENCE_AWARD', '권기남'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'EXCELLENCE_AWARD' AND name = '권기남'
);

INSERT INTO vote_winners (sector, name)
SELECT 'GROWTH_AWARD', '김예나'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'GROWTH_AWARD' AND name = '김예나'
);

INSERT INTO vote_winners (sector, name)
SELECT 'GROWTH_AWARD', '구혁모'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'GROWTH_AWARD' AND name = '구혁모'
);

INSERT INTO vote_winners (sector, name)
SELECT 'GROWTH_AWARD', '이준석'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'GROWTH_AWARD' AND name = '이준석'
);

INSERT INTO vote_winners (sector, name)
SELECT 'GROWTH_AWARD', '천성진'
WHERE NOT EXISTS (
    SELECT 1 FROM vote_winners WHERE sector = 'GROWTH_AWARD' AND name = '천성진'
);
