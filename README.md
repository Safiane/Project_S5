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
    title Use cases functions (29/08/2025 - 12/12/2025)
    dateFormat  YYYY-MM-DD

    %% WEEK 1
    section Week1
    register (Peio)              :w1_uc1, 2025-08-29, 2d
    login (Peio)                 :w1_uc1b, 2025-08-31, 1d
    writecomment (Safiane)       :w1_uc2, 2025-08-29, 2d
    manageartists (Johnny)       :w1_uc3, 2025-08-29, 3d

    %% WEEK 2
    section Week2
    browsecontent (Peio)         :w2_uc1, 2025-09-05, 3d
    searchcontent (Peio)         :w2_uc1b, 2025-09-08, 2d
    viewalbum (Safiane)          :w2_uc2, 2025-09-05, 2d
    managesongs (Johnny)         :w2_uc3, 2025-09-05, 3d

    %% WEEK 3
    section Week3
    viewsong (Peio)              :w3_uc1, 2025-09-12, 2d
    viewartist (Peio)            :w3_uc1b, 2025-09-14, 1d
    rate (Safiane)               :w3_uc2, 2025-09-12, 3d
    managealbums (Johnny)        :w3_uc3, 2025-09-12, 3d

    %% WEEK 4
    section Week4
    listentosong (Peio)          :w4_uc1, 2025-09-19, 3d
    increaselistingcounter (Peio):w4_uc1b, 2025-09-22, 1d
    editcomment (Safiane)        :w4_uc2, 2025-09-19, 2d
    managecollaborations (Johnny):w4_uc3, 2025-09-19, 3d

    %% WEEK 5
    section Week5
    createplaylist (Peio)        :w5_uc1, 2025-09-26, 2d
    addsongtoplaylist (Peio)     :w5_uc1b, 2025-09-28, 2d
    deletecomment (Safiane)      :w5_uc2, 2025-09-26, 2d
    moderateplaylist (Johnny)    :w5_uc3, 2025-09-26, 3d

    %% WEEK 6
    section Week6
    shareplaylist (Peio)         :w6_uc1, 2025-10-03, 2d
    addtofavorites (Peio)        :w6_uc1b, 2025-10-05, 2d
    reportcomment (Safiane)      :w6_uc2, 2025-10-03, 2d
    reviewreportedcomments (Johnny):w6_uc3, 2025-10-03, 3d

    %% WEEK 7
    section Week7
    viewsongfromfavorite (Peio)  :w7_uc1, 2025-10-10, 2d
    viewalbumfromfavorite (Peio) :w7_uc1b, 2025-10-12, 1d
    viewartistfromfavorite (Peio):w7_uc1c, 2025-10-13, 1d
    moderatecomment (Johnny)     :w7_uc3, 2025-10-10, 3d
    hidecomment (Johnny)         :w7_uc3b, 2025-10-13, 1d

    %% WEEK 8
    section Week8
    verifyemail (Peio)           :w8_uc1, 2025-10-17, 2d
    improveRate (Safiane)        :w8_uc2, 2025-10-17, 3d
    deletecommentadmin (Johnny)  :w8_uc3, 2025-10-17, 2d
    restorecomment (Johnny)      :w8_uc3b, 2025-10-19, 1d

    %% WEEK 9
    section Week9
    viewsongtests (Peio)         :w9_uc1, 2025-10-24, 2d
    viewalbumtests (Peio)        :w9_uc1b, 2025-10-26, 1d
    writecommenttests (Safiane)  :w9_uc2, 2025-10-24, 2d
    adminlogin (Johnny)          :w9_uc3, 2025-10-24, 2d

    %% WEEK 10
    section Week10
    listentosongtests (Peio)     :w10_uc1, 2025-10-31, 2d
    addtofavoritestests (Peio)   :w10_uc1b, 2025-11-02, 1d
    ratetests (Safiane)          :w10_uc2, 2025-10-31, 2d
    adminbugfix (Johnny)         :w10_uc3, 2025-10-31, 3d

    %% WEEK 11
    section Week11
    integrationUC1 (Peio)        :w11_uc1, 2025-11-07, 3d
    integrationUC2 (Safiane)     :w11_uc2, 2025-11-07, 3d
    integrationUC3 (Johnny)      :w11_uc3, 2025-11-07, 3d

    %% WEEK 12
    section Week12
    bugfixUC1 (Peio)             :w12_uc1, 2025-11-14, 3d
    bugfixUC2 (Safiane)          :w12_uc2, 2025-11-14, 3d
    bugfixUC3 (Johnny)           :w12_uc3, 2025-11-14, 3d

    %% WEEK 13
    section Week13
    documentationUC1 (Peio)      :w13_uc1, 2025-11-21, 3d
    documentationUC2 (Safiane)   :w13_uc2, 2025-11-21, 3d
    documentationUC3 (Johnny)    :w13_uc3, 2025-11-21, 3d

    %% WEEK 14
    section Week14
    Test (Peio/Safiane/Johnny) :w14_all, 2025-11-28, 5d

  
```
```mermaid
gantt
    title Timeline des commits (Oct 17 – Dec 11, 2025)
    dateFormat  YYYY-MM-DD

    %% OCTOBRE
    section Oct 17 2025
    Add_Frontend_Folder            :done, oct17_1, 2025-10-17, 1d
    Update_README_Johnny_4         :done, oct17_2, 2025-10-17, 1d

    section Oct 30 2025
    Update_README_Johnny_3         :done, oct30_1, 2025-10-30, 1d

    %% NOVEMBRE
    section Nov 3 2025
    Add_albums_songs_artists       :done, nov3_1, 2025-11-03, 1d
    Upload_Files_Remove_PDF        :done, nov3_2, 2025-11-03, 1d

    section Nov 20 2025
    Server_Skeleton_Glatinor       :done, nov20_1, 2025-11-20, 1d

    section Nov 21 2025
    ServerJS_Update_Safiane        :done, nov21_1, 2025-11-21, 1d
    CRUD_v2_Safiane                :done, nov21_2, 2025-11-21, 1d
    Update_Diagram_Glatinor        :done, nov21_3, 2025-11-21, 1d

    section Nov 27 2025
    API_Cleanup_Glatinor           :done, nov27_1, 2025-11-27, 1d
    Resolve_Conflicts_Glatinor     :done, nov27_2, 2025-11-27, 1d

    section Nov 28 2025
    Frontend_Backend_CRUD_Safiane  :done, nov28_1, 2025-11-28, 1d
    Push_PDF_Glatinor              :done, nov28_2, 2025-11-28, 1d
    Resolve_Backend_Merge_Safiane  :done, nov28_3, 2025-11-28, 1d

    %% DÉCEMBRE
    section Dec 5 2025
    Modified_PDF_Glatinor          :done, dec5_1, 2025-12-05, 1d
    Backend_Merge_CRUD_Safiane     :done, dec5_2, 2025-12-05, 1d
    Update_README_Johnny_2         :done, dec5_3, 2025-12-05, 1d

    section Dec 6 2025
    Cleanup_Frontend_Merges_Safiane:done, dec6_1, 2025-12-06, 1d

    section Dec 7 2025
    Auth_Register_LoginView_Safiane:done, dec7_1, 2025-12-07, 1d

    section Dec 11 2025
    Update_README_Johnny           :done, dec11_1, 2025-12-11, 
    Modif_home_Glatinor            :done, dec11_2, 2025-12-11, 
    Fix_auth_CRUD_Safiane          :done, dec11_3, 2025-12-11, 
```

Thank you for taking the time to read this, and enjoy using our project!

