## Music Information System

Advanced Web Programming & Object-Oriented Analysis and Design with UML Project

## Overview

The Music Information System is a web-based application designed to provide detailed information about musical artists and their works.
It allows users to search for artists, explore their albums and songs, and view metadata such as nationality, language, number of listens, and relationships between artists and productions.

This project demonstrates the integration of web technologies, database management, and object-oriented design principles using UML.

## Installation

You can find our project on GitHub by following this link: https://github.com/Safiane/Project_S5

## Technologies Used

- Database: MySQL
- UML Design: Visual Paradigm
- Version Control: Git & GitHub

## Authors & Contact

- Castets Peïo, peio.castets@efrei.net
- Ras El Qdim Safiane, safiane.ras-el-qdim@efrei.net
- Jin Johnny, johnny.jin@efrei.net

## License

This project is developed for academic purposes as part of the Advanced Web Programming and Object-Oriented Analysis and Design with UML courses.

## Credits and Acknowledgments:

We would like to thank the EFREI engineering school, the ESSCA school, and the teaching staff for providing us with the resources necessary to carry out this project.

```mermaid

gantt
    title Project Timeline – Music Information System
    dateFormat  YYYY-MM-DD
    excludes    weekends

    %% ─────────────────────────────
    %%       OCTOBRE
    %% ─────────────────────────────

    section OCT – Kickoff
    Project Start + Requirements (ALL)     :milestone, start, 2025-10-01, 1d

    section OCT – UML + Web Init
    Use Case + Planned Gantt (P)           :task, uc1, 2025-10-31, 2d
    UML Activity + Wireframes (S)          :task, a1, 2025-11-01, 3d
    UML Sequence + Class (J)               :task, seq1, 2025-11-01, 3d
    GoF Creational (P)                     :task, gof1, 2025-11-04, 2d

    Git repo + JSON page setup (J)         :task, git1, 2025-10-31, 2d
    Express.js + MVC base (S)              :task, ex1, 2025-11-01, 4d
    Middleware + DB Controller (P)         :task, mid1, 2025-11-05, 3d

    %% ─────────────────────────────
    %%       NOVEMBRE
    %% ─────────────────────────────
    section NOV – UML Dev
    UML Activity + Wireframes (S)          :active, a2, 2025-11-07, 3d
    UML Component + Class (J)              :task, comp1, 2025-11-07, 3d
    GoF Behavioral 1 (P)                   :task, gof2, 2025-11-10, 2d

    section NOV – Frontend
    Full frontend using JSON (J)           :task, front1, 2025-11-10, 5d
    REST API + Postman Testing (S)         :task, postman, 2025-11-12, 3d
    Auth Services (P)                      :task, auth1, 2025-11-14, 3d

    section NOV – UML Diagram Refinement
    UML Component + Class revision (J)     :task, comp2, 2025-11-21, 3d
    GoF Behavioral 2 (S)                   :task, gof3, 2025-11-22, 2d

    section NOV – Backend
    Server-side services (S)               :task, serv1, 2025-11-22, 3d
    Controllers + Auth merged (P)          :task, ctrl1, 2025-11-24, 3d

    %% ─────────────────────────────
    %%       DÉCEMBRE
    %% ─────────────────────────────
    section DEC – Final UML + Code
    UML Final (ALL)                        :task, umlf, 2025-12-01, 4d
    GoF Structural (J)                     :task, gof4, 2025-12-03, 3d

    CRUD + Server + Git Documentation (P)  :task, crud1, 2025-12-03, 3d
    CRUD + Frontend + Repo Check (S)       :task, crud2, 2025-12-05, 3d
    Testing + Code Review (J)              :task, test1, 2025-12-07, 3d

    section DEC – Final
    Documentation (ALL)                    :task, doc, 2025-12-09, 3d
    Final Defense + Submission (ALL)       :milestone, final, 2025-12-12, 1d

```
## End

Thank you for taking the time to read this, and enjoy using our project!

