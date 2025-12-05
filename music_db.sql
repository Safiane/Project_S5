CREATE DATABASE IF NOT EXISTS music_db;
USE music_db;

-- TABLE Artist
CREATE TABLE Artist (
  ID_Artist INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50),
  Style VARCHAR(50),
  Country VARCHAR(50),
  Gender VARCHAR(50),
  Start_Date DATE
);

-- TABLE Album
CREATE TABLE Album (
  ID_Album INT AUTO_INCREMENT PRIMARY KEY,
  Album_Title VARCHAR(50),
  Album_Release_Date DATE,
  Album_Type VARCHAR(50),
  Record_Company VARCHAR(50),
  Collaborations VARCHAR(255),
  ID_Artist INT,
  FOREIGN KEY (ID_Artist) REFERENCES Artist(ID_Artist)
);

-- TABLE Song
CREATE TABLE Song (
  ID_Song INT AUTO_INCREMENT PRIMARY KEY,
  Song_Title VARCHAR(50),
  Song_Release_Date DATE,
  Duration VARCHAR(20),
  Language VARCHAR(50),
  Nb_Listening INT,
  ID_Album INT,
  FOREIGN KEY (ID_Album) REFERENCES Album(ID_Album)
);

-- DONNÉES ARTISTES
INSERT INTO Artist (Name, Style, Country, Gender, Start_Date) VALUES
('Nujabes','Hip-Hop/Jazz Rap','Japan','Male','1996-01-01'),
('Radiohead','Alternative Rock','UK','Group','1985-01-01'),
('La Rvfleuze','Rap/Trap','France','Male','2020-01-01'),
('A$AP Rocky','Hip-Hop','USA','Male','2011-01-01'),
('Ateyaba','Rap','France','Male','2010-01-01'),
('Kaaris','Rap/Trap','France','Male','2011-01-01'),
('Tame Impala','Psychedelic Rock','Australia','Group','2007-01-01'),
('Booba','Rap','France','Male','1995-01-01'),
('Kendrick Lamar','Hip-Hop','USA','Male','2004-01-01'),
('Travis Scott','Hip-Hop','USA','Male','2012-01-01');

-- DONNÉES ALBUMS
INSERT INTO Album (Album_Title, Album_Release_Date, Album_Type, Record_Company, Collaborations, ID_Artist) VALUES
('Metaphorical Music','2003-08-21','Hip-Hop/Jazz Rap','Hydeout',NULL,1),
('Modal Soul','2005-11-11','Hip-Hop/Jazz Rap','Hydeout',NULL,1),

('OK Computer','1997-05-21','Alternative Rock','Parlophone',NULL,2),
('Kid A','2000-10-02','Experimental Rock','Parlophone',NULL,2),

('Serrure','2023-01-01','Rap/Trap','Indépendant',NULL,3),
('Code 404','2024-02-15','Rap/Trap','Indépendant',NULL,3),

('Long.Live.A$AP','2013-01-15','Hip-Hop','RCA','feat. Drake, 2 Chainz, Kendrick Lamar',4),
('At.Long.Last.A$AP','2015-05-26','Hip-Hop','RCA','feat. Kanye West, M.I.A.',4),

('Ateyaba','2014-06-02','Rap','Def Jam',NULL,5),
('Tokyo','2018-05-15','Rap','Def Jam',NULL,5),

('Or Noir','2013-10-21','Rap/Trap','Capitol',NULL,6),
('Dozo','2017-11-17','Rap/Trap','Capitol',NULL,6),

('Lonerism','2012-10-05','Psychedelic Rock','Modular',NULL,7),
('Currents','2015-07-17','Psychedelic Rock','Modular',NULL,7),

('Temps Mort','2002-01-22','Rap','45 Scientific',NULL,8),
('Trône','2017-12-01','Rap','Tallac Records',NULL,8),

('good kid, m.A.A.d city','2012-10-22','Hip-Hop','Top Dawg','feat. Drake, Dr. Dre',9),
('DAMN.','2017-04-14','Hip-Hop','Top Dawg',NULL,9),

('Rodeo','2015-09-04','Hip-Hop','Grand Hustle','feat. Future, Justin Bieber',10),
('Astroworld','2018-08-03','Hip-Hop','Cactus Jack','feat. Drake, Kid Cudi, The Weeknd',10);

-- ==========================================================
-- Songs
-- ==========================================================
INSERT INTO Song (Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album) VALUES
-- Nujabes - Metaphorical Music
('Lady Brown', '2003-08-21', '00:04:39', 'English', 500000, 1),
('Aruarian Dance', '2003-08-21', '00:04:10', 'Instrumental', 750000, 1),
('Beat Laments the World', '2003-08-21', '00:05:24', 'Instrumental', 300000, 1),
('The Final View', '2003-08-21', '00:03:38', 'Instrumental', 250000, 1),
('Eclipse', '2003-08-21', '00:04:20', 'Instrumental', 200000, 1),

-- Nujabes - Modal Soul
('Feather', '2005-11-11', '00:04:30', 'English', 1200000, 2),
('Luv Sic Pt3', '2005-11-11', '00:04:15', 'English', 800000, 2),
('Music is Mine', '2005-11-11', '00:04:22', 'Instrumental', 500000, 2),
('World’s End Rhapsody', '2005-11-11', '00:05:43', 'Instrumental', 300000, 2),
('Reflection Eternal', '2005-11-11', '00:05:37', 'Instrumental', 400000, 2),

-- Radiohead - OK Computer
('Karma Police', '1997-05-21', '00:04:21', 'English', 3000000, 3),
('No Surprises', '1997-05-21', '00:03:48', 'English', 2500000, 3),
('Paranoid Android', '1997-05-21', '00:06:27', 'English', 2700000, 3),
('Exit Music', '1997-05-21', '00:04:25', 'English', 2300000, 3),
('Lucky', '1997-05-21', '00:04:19', 'English', 1900000, 3),

-- Radiohead - Kid A 
('Everything In Its Right Place', '2000-10-02', '00:04:11', 'English', 1800000, 4),
('Kid A', '2000-10-02', '00:04:44', 'English', 1400000, 4),
('The National Anthem', '2000-10-02', '00:05:51', 'English', 1600000, 4),
('How to Disappear Completely', '2000-10-02', '00:05:56', 'English', 2000000, 4),
('Idioteque', '2000-10-02', '00:05:09', 'English', 2500000, 4),

-- La Rvfleuze - Serrure 
('Serrure #1', '2023-01-01', '00:03:15', 'French', 800000, 5),
('Serrure #3', '2023-01-01', '00:03:40', 'French', 600000, 5),
('Serrure #5', '2023-01-01', '00:03:22', 'French', 500000, 5),
('Intro', '2023-01-01', '00:02:15', 'French', 300000, 5),
('Outro', '2023-01-01', '00:02:50', 'French', 350000, 5),

-- La Rvfleuze - Code 404 
('Code 404', '2024-02-15', '00:03:20', 'French', 600000, 6),
('Bug', '2024-02-15', '00:03:45', 'French', 550000, 6),
('Fatal Error', '2024-02-15', '00:02:58', 'French', 500000, 6),
('Glitch', '2024-02-15', '00:03:33', 'French', 650000, 6),
('Virus', '2024-02-15', '00:03:18', 'French', 400000, 6),

-- A$AP Rocky - Long.Live.A$AP 
('Sundress', '2013-01-15', '00:02:38', 'English', 2200000, 7),
('Fuckin Problems', '2013-01-15', '00:03:57', 'English', 2800000, 7),
('Goldie', '2013-01-15', '00:03:41', 'English', 1500000, 7),
('Wild for the Night', '2013-01-15', '00:03:30', 'English', 1700000, 7),
('Fashion Killa', '2013-01-15', '00:03:57', 'English', 2000000, 7),

-- A$AP Rocky - At.Long.Last.A$AP 
('L$D', '2015-05-26', '00:03:58', 'English', 2600000, 8),
('Everyday', '2015-05-26', '00:04:21', 'English', 2100000, 8),
('Canal St.', '2015-05-26', '00:03:46', 'English', 1400000, 8),
('Jukebox Joints', '2015-05-26', '00:05:23', 'English', 1300000, 8),
('Excuse Me', '2015-05-26', '00:03:46', 'English', 1500000, 8),

-- Ateyaba - Ateyaba
('Harakuju', '2014-06-02', '00:03:46', 'French', 900000, 9),
('Pharaon', '2014-06-02', '00:03:42', 'French', 700000, 9),
('Triumph', '2014-06-02', '00:04:15', 'French', 600000, 9),
('Omega', '2014-06-02', '00:03:30', 'French', 500000, 9),
('Requiem', '2014-06-02', '00:03:40', 'French', 450000, 9),

-- Ateyaba - Tokyo 
('Tokyo', '2018-05-15', '00:03:25', 'French', 600000, 10),
('Senshi', '2018-05-15', '00:03:18', 'French', 550000, 10),
('Vortex', '2018-05-15', '00:03:40', 'French', 400000, 10),
('Samurai', '2018-05-15', '00:04:00', 'French', 450000, 10),
('Neon', '2018-05-15', '00:03:36', 'French', 500000, 10),

-- Kaaris - Or Noir
('Bambou', '2013-10-21', '00:03:25', 'French', 800000, 11),
('Zoo', '2013-10-21', '00:03:50', 'French', 700000, 11),
('Or Noir', '2013-10-21', '00:04:00', 'French', 600000, 11),
('Chargé', '2013-10-21', '00:03:15', 'French', 550000, 11),
('Sombre', '2013-10-21', '00:03:35', 'French', 500000, 11),

-- Kaaris - Dozo 
('Dozo', '2017-11-17', '00:03:20', 'French', 650000, 12),
('Tchoin', '2017-11-17', '00:03:50', 'French', 1000000, 12),
('Diarabi', '2017-11-17', '00:03:25', 'French', 400000, 12),
('Glock', '2017-11-17', '00:03:05', 'French', 500000, 12),
('Bling Bling', '2017-11-17', '00:03:45', 'French', 550000, 12),

-- Tame Impala - Lonerism
('Apocalypse Dreams', '2012-10-05', '00:05:56', 'English', 700000, 13),
('Elephant', '2012-10-05', '00:03:31', 'English', 1200000, 13),
('Feels Like We Only Go Backwards', '2012-10-05', '00:03:12', 'English', 1500000, 13),
('Mind Mischief', '2012-10-05', '00:04:31', 'English', 600000, 13),
('Music to Walk Home By', '2012-10-05', '00:05:12', 'English', 400000, 13),

-- Tame Impala - Currents 
('Let It Happen', '2015-07-17', '00:07:47', 'English', 2000000, 14),
('The Less I Know the Better', '2015-07-17', '00:03:36', 'English', 3000000, 14),
('Yes I’m Changing', '2015-07-17', '00:04:30', 'English', 900000, 14),
('Eventually', '2015-07-17', '00:05:19', 'English', 1200000, 14),
('New Person, Same Old Mistakes', '2015-07-17', '00:06:03', 'English', 2500000, 14),

-- Booba - Temps Mort 
('Repose en paix', '2002-01-22', '00:04:10', 'French', 600000, 15),
('Jusqu’ici tout va bien', '2002-01-22', '00:04:00', 'French', 500000, 15),
('Strass et paillettes', '2002-01-22', '00:03:50', 'French', 550000, 15),
('Le bitume avec une plume', '2002-01-22', '00:03:45', 'French', 700000, 15),
('Mauvais garçon', '2002-01-22', '00:03:30', 'French', 650000, 15),

-- Booba - Trône 
('Friday', '2017-12-01', '00:03:35', 'French', 900000, 16),
('Petite fille', '2017-12-01', '00:03:40', 'French', 850000, 16),
('113', '2017-12-01', '00:03:20', 'French', 800000, 16),
('Drapeau noir', '2017-12-01', '00:03:10', 'French', 750000, 16),
('PGP', '2017-12-01', '00:03:25', 'French', 1000000, 16),

-- Kendrick Lamar - good kid, m.A.A.d city 
('Bitch, Don’t Kill My Vibe', '2012-10-22', '00:05:11', 'English', 7000000, 17),
('Money Trees', '2012-10-22', '00:06:26', 'English', 5000000, 17),
('Swimming Pools', '2012-10-22', '00:03:40', 'English', 8000000, 17),
('Poetic Justice', '2012-10-22', '00:05:00', 'English', 6000000, 17),
('m.A.A.d city', '2012-10-22', '00:05:50', 'English', 7500000, 17),

-- Kendrick Lamar - DAMN.
('DNA.', '2017-04-14', '00:03:05', 'English', 10000000, 18),
('HUMBLE.', '2017-04-14', '00:02:57', 'English', 12000000, 18),
('LOVE.', '2017-04-14', '00:03:33', 'English', 9000000, 18),
('LOYALTY.', '2017-04-14', '00:03:47', 'English', 9500000, 18),
('ELEMENT.', '2017-04-14', '00:03:29', 'English', 8700000, 18),

-- Travis Scott - Rodeo
('Antidote', '2015-09-04', '00:04:22', 'English', 13000000, 19),
('90210', '2015-09-04', '00:05:39', 'English', 8000000, 19),
('3500', '2015-09-04', '00:07:41', 'English', 6000000, 19),
('Oh My Dis Side', '2015-09-04', '00:05:51', 'English', 7500000, 19),
('Nightcrawler', '2015-09-04', '00:05:21', 'English', 7000000, 19),

-- Travis Scott - ASTROWORLD 
('STARGAZING', '2018-08-03', '00:04:30', 'English', 12000000, 20),
('SICKO MODE', '2018-08-03', '00:05:13', 'English', 30000000, 20),
('STOP TRYING TO BE GOD', '2018-08-03', '00:05:38', 'English', 9000000, 20),
('YOSEMITE', '2018-08-03', '00:02:31', 'English', 8500000, 20),
('BUTTERFLY EFFECT', '2018-08-03', '00:03:11', 'English', 9500000, 20);