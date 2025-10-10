CREATE DATABASE IF NOT EXISTS musique_db;
USE musique_db;


CREATE TABLE Artist (
    ID_Artist INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50),
    Style VARCHAR(50),
    Country VARCHAR(50),
    Start_Date DATE
);

CREATE TABLE Album (
    ID_Album INT AUTO_INCREMENT PRIMARY KEY,
    Album_Title VARCHAR(50),
    Album_Release_Date DATE,
    Album_Type VARCHAR(50),
    Record_Company VARCHAR(50),
    ID_Artist INT,
    FOREIGN KEY (ID_Artist) REFERENCES Artist(ID_Artist)
);

CREATE TABLE Song (
    ID_Song INT AUTO_INCREMENT PRIMARY KEY,
    Song_Title VARCHAR(50),
    Song_Release_Date DATE,
    Duration TIME,
    Language VARCHAR(50),
    Nb_Listening INT,
    ID_Album INT,
    FOREIGN KEY (ID_Album) REFERENCES Album(ID_Album)
);

-- Artists
INSERT INTO Artist (Name, Style, Country, Start_Date) VALUES
('Nujabes', 'Hip-Hop/Jazz Rap', 'Japan', '1996-01-01'),
('Radiohead', 'Alternative Rock', 'UK', '1985-01-01'),
('La Rvfleuze', 'Rap/Trap', 'France', '2020-01-01'),
('A$AP Rocky', 'Hip-Hop', 'USA', '2011-01-01'),
('Ateyaba', 'Rap', 'France', '2010-01-01');

-- Albums
INSERT INTO Album (Album_Title, Album_Release_Date, Album_Type, Record_Company, ID_Artist) VALUES

-- NUJABES
('Metaphorical Music', '2003-08-21', 'Hip-Hop/Jazz Rap', 'Hydeout', 1),
('Modal Soul', '2005-11-11', 'Hip-Hop/Jazz Rap', 'Hydeout', 1),

-- RADIOHEAD
('OK Computer', '1997-05-21', 'Alternative Rock', 'Parlophone', 2),
('Kid A', '2000-10-02', 'Experimental Rock', 'Parlophone', 2),

-- LA RVFLEUZE
('Serrure', '2023-01-01', 'Rap/Trap', 'Indépendant', 3),

-- A$AP ROCKY
('Long.Live.A$AP', '2013-01-15', 'Hip-Hop', 'RCA', 4),
('At.Long.Last.A$AP', '2015-05-26', 'Hip-Hop', 'RCA', 4),

-- ATEYABA
('Ateyaba', '2014-06-02', 'Rap', 'Def Jam', 5);

-- Songs

INSERT INTO Song (Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album) VALUES
-- NUJABES
('Lady Brown', '2003-08-21', '00:04:39', 'English', 500000, 1),
('Aruarian Dance', '2003-08-21', '00:04:10', 'Instrumental', 750000, 1),
('Feather', '2005-11-11', '00:04:30', 'English', 1200000, 2),

-- RADIOHEAD
('Karma Police', '1997-05-21', '00:04:21', 'English', 3000000, 3),
('No Surprises', '1997-05-21', '00:03:48', 'English', 2500000, 3),
('Everything In Its Right Place', '2000-10-02', '00:04:11', 'English', 1800000, 4),

-- LA RVFLEUZE
('Serrure #1', '2023-01-01', '00:03:15', 'French', 800000, 5),
('Serrure #3', '2023-01-01', '00:03:40', 'French', 600000, 5),
('Serrure #5', '2023-01-01', '00:03:22', 'French', 500000, 5),

-- A$AP ROCKY
('Sundress', '2013-01-15', '00:02:38', 'English', 2200000, 6),
('Fuckin Problems', '2013-01-15', '00:03:57', 'English', 2800000, 6),
('L$D', '2015-05-26', '00:03:58', 'English', 2600000, 7),
('Everyday', '2015-05-26', '00:04:21', 'English', 2100000, 7),

-- ATEYABA
('Harakuju', '2014-06-02', '00:03:46', 'French', 900000, 8),
('Pharaon', '2014-06-02', '00:03:42', 'French', 700000, 8),
('Triumph', '2014-06-02', '00:04:15', 'French', 600000, 8);
