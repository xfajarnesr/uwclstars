# Plantilles UWCL 2026/27 segons les pàgines de plantilla de uefa.com (consultades el 7/11/2026).
# Llista A + jugadores de la llista B que ja han estat titulars en aquesta Champions.
# Format: dorsal nom (una per línia) dins de cada posició.

CLUBS = {
 "BAR": dict(nom="FC Barcelona", curt="Barça", pais="ESP", c1="#a50044", c2="#004d98", t="#ffffff", base=80),
 "OLL": dict(nom="OL Lyonnes", curt="Lyon", pais="FRA", c1="#1c3f94", c2="#e3101d", t="#ffffff", base=80),
 "CHE": dict(nom="Chelsea", curt="Chelsea", pais="ENG", c1="#034694", c2="#dba111", t="#ffffff", base=79),
 "ARS": dict(nom="Arsenal", curt="Arsenal", pais="ENG", c1="#db0007", c2="#ffffff", t="#ffffff", base=79),
 "MCI": dict(nom="Manchester City", curt="Man City", pais="ENG", c1="#6cabdd", c2="#1c2c5b", t="#0b1a3d", base=78),
 "BAY": dict(nom="Bayern München", curt="Bayern", pais="GER", c1="#dc052d", c2="#0066b2", t="#ffffff", base=77),
 "RMA": dict(nom="Real Madrid", curt="Madrid", pais="ESP", c1="#f2f2f2", c2="#5b2a86", t="#2a1747", base=75),
 "PSG": dict(nom="Paris Saint-Germain", curt="PSG", pais="FRA", c1="#004170", c2="#da291c", t="#ffffff", base=74),
 "JUV": dict(nom="Juventus", curt="Juventus", pais="ITA", c1="#1a1a1a", c2="#f2f2f2", t="#ffffff", base=73),
 "ROM": dict(nom="Roma", curt="Roma", pais="ITA", c1="#8e1f2f", c2="#f0bc42", t="#ffffff", base=71),
 "PFC": dict(nom="Paris FC", curt="Paris FC", pais="FRA", c1="#1d2f6f", c2="#7fb3e3", t="#ffffff", base=70),
 "BEN": dict(nom="Benfica", curt="Benfica", pais="POR", c1="#e30613", c2="#ffffff", t="#ffffff", base=70),
 "INT": dict(nom="Inter", curt="Inter", pais="ITA", c1="#0068a8", c2="#111111", t="#ffffff", base=69),
 "HAC": dict(nom="BK Häcken", curt="Häcken", pais="SWE", c1="#ffd400", c2="#111111", t="#111111", base=67),
 "HBK": dict(nom="HB Køge", curt="Køge", pais="DEN", c1="#0b1f4d", c2="#ffffff", t="#ffffff", base=64),
 "SER": dict(nom="Servette", curt="Servette", pais="SUI", c1="#8b1a2b", c2="#ffffff", t="#ffffff", base=63),
 "OHL": dict(nom="OH Leuven", curt="Leuven", pais="BEL", c1="#e2001a", c2="#ffffff", t="#ffffff", base=62),
 "AUS": dict(nom="Austria Wien", curt="Austria", pais="AUT", c1="#5a2d81", c2="#ffffff", t="#ffffff", base=61),
}

PLANTILLES = {
"BAR": """
POR
1 Gemma Font
13 Cata Coll
25 Tyler McCamey
DEF
2 Irene Paredes
3 Renee van Asten
5 Laia Aleixandri
8 Marta Torrejón
24 Martina Fernández
26 Julia Torres
MIG
12 Patri Guijarro
14 Aitana Bonmatí
16 Clara Serrajordi
19 Vicky López
21 Carla Julià
29 Carolina Ferrera
DAV
6 Sydney Schertenleib
7 Kerolin
9 Clàudia Pina
10 Caroline Graham Hansen
17 Ewa Pajor
18 Kika Nazareth
22 Esmee Brugts
34 Liv Pennock
36 Nikoline Nielsen
45 Giulia Galli
""",
"OLL": """
POR
1 Christiane Endler
25 Maria-Luisa Grohs
DEF
3 Wendie Renard
4 Selma Bacha
5 Elma Junttila Nelhage
12 Ashley Lawrence
33 Tarciane
MIG
6 Melchie Dumornay
8 Korbin Shrader
10 Ines Benyahia
13 Damaris Egurrola
15 Ingrid Engen
20 Lily Yohannes
23 Caroline Weir
24 Julie Swierot
74 Ainhoa Sagna
DAV
7 Vicki Becho
9 Marie-Antoinette Katoto
11 Tabitha Chawinga
14 Ada Hegerberg
19 Johanna Rytting Kaneryd
29 Jule Brand
30 Giovanna Waksman
31 Liana Joseph
77 Salma Paralluelo
""",
"CHE": """
POR
1 Livia Peng
24 Hannah Hampton
38 Rebecca Spencer
DEF
2 Ellie Carpenter
4 Naomi Girma
5 Veerle Buurman
14 Nathalie Björn
17 Nelly Las
22 Lucy Bronze
26 Kadeisha Buchanan
42 Chloe Sarwie
MIG
6 Sjoeke Nüsken
8 Erin Cuthbert
16 Giulia Dragoni
19 Wieke Kaptein
21 Keira Walsh
23 Maika Hamano
29 Manaka Matsukubo
32 Alexia Potter
DAV
7 Mayra Ramírez
9 Melvine Malard
10 Lauren James
11 Sandy Baltimore
12 Alyssa Thompson
15 Katie McCabe
33 Aggie Beever-Jones
""",
"ARS": """
POR
16 Misa Rodríguez
28 Anneke Borbe
40 Isabella Damm
DEF
2 Emily Fox
3 Lotte Wubben-Moy
5 Elisa De Almeida
6 Leah Williamson
7 Steph Catley
22 Ona Batlle
26 Katie Reid
31 Smilla Holmberg
MIG
4 Georgia Stanway
8 Mariona Caldentey
10 Kim Little
12 Frida Maanum
24 Taylor Hinds
32 Kyra Cooney-Cross
DAV
9 Caitlin Foord
11 Olivia Smith
14 Géraldine Reuteler
18 Chloe Kelly
19 Lisa Baum
23 Alessia Russo
25 Stina Blackstenius
29 Selina Cerci
""",
"MCI": """
POR
1 Eartha Cumings
14 Anna Moorhouse
31 Ayaka Yamashita
DEF
2 Risa Shimizu
4 Jade Rose
5 Alex Greenwood
18 Kerstin Casparij
21 Niamh Charles
27 Rebecca Knaak
28 Gracie Prior
MIG
6 Grace Clinton
17 Samantha Coffey
19 Laura Blindkilde Brown
22 Sydney Lohmann
25 Yui Hasegawa
DAV
7 Beth Mead
8 Mary Fowler
9 Khadija Shaw
10 Vivianne Miedema
11 Lauren Hemp
20 Aoba Fujino
24 Iman Beney
37 Carlotta Wamser
""",
"BAY": """
POR
1 Ena Mahmutovic
22 Regina van Eijk
38 Anna Klink
DEF
2 Vanessa Gilles
3 Stine Ballisager
4 Glódís Viggósdóttir
5 Magdalena Eriksson
7 Giulia Gwinn
19 Katharina Naschenweng
45 Jana Kappes
MIG
6 Kassandra Potsi
10 Linda Dallmann
11 Sarah Mattner
14 Alara Şehitler
15 Bernadette Kakounan
17 Klara Bühl
20 Franziska Kett
25 Sarah Zadrazil
28 Barbara Dunst
DAV
9 Jovana Damnjanović
18 Momoko Tanikawa
21 Pernille Harder
23 Sophie Proost
29 Edna Imade
""",
"RMA": """
POR
1 Merle Frohms
13 Laia López
DEF
2 Noemi
3 Janou Levels
4 Silvia Cristóbal
14 María Méndez
21 Sara Holmgaard
22 Bella Andersson
23 Maëlle Lakrar
29 Noelia Llamas
MIG
8 Sara Däbritz
15 Irune Dorado
16 Filippa Angeldahl
17 Andreia Jacinto
20 Elisa Senss
24 Arianna Caruso
31 Oihane San Martín
DAV
5 Pau Comendador
7 Lotte Keukelaar
9 Signe Bruun
10 Athenea del Castillo
11 Lineth Beerensteyn
12 Felicia Schröder
18 Linda Caicedo
19 Eva Navarro
""",
"PSG": """
POR
1 Katarzyna Kiedrzynek
16 Oliwia Szperkowska
25 Maren Groothoff
33 Océane Toussaint
40 Camille Masson
DEF
2 Thiniba Samoura
3 Andjela Krstić
4 Paulina Dudek
7 Sakina Karchaoui
12 Isabela Chagas
20 Tara Elimbi Gilbert
26 Anaïs Ebayilin
29 Griedge Mbock Bathy
77 Olga Carmona
MIG
6 Jennifer Echegini
8 Vitória Yaya
11 Florianne Jourde
14 Jackie Groenen
28 Jade Le Guilly
30 Emilie Østerås
34 Alyssa Charlier
DAV
10 Rasheedat Ajibade
17 Romée Leuchter
18 Naomie Feller
19 Merveille Kanjinga
57 Léa Morissaint
""",
"JUV": """
POR
1 Danielle de Jong
21 Larissa Rusek
DEF
3 Estela Carbonell
4 Kysha Sylla
8 Martina Rosucci
23 Cecilia Salvai
27 Federica D'Auria
71 Martina Lenzini
MIG
6 Eva Schatzer
14 Júlia Bartel
15 Annamaria Serturini
16 Danique Noordman
17 Emma Stølen Godø
19 Matilde Pavan
26 Lea Khelifi
29 Tatiana Pinto
30 Manaka Hayashi
46 Cris Librán
DAV
9 Chiara Beccari
20 Alba Redondo
22 Remina Chiba
28 Ornella Graziani
77 Amaiur Sarriegi
""",
"ROM": """
POR
1 Lana Klobučarević
24 Rachele Baldi
36 Valentina Soggiu
DEF
4 Winonah Heatley
5 Maya Antoine
12 Ella Ottey
13 Elisabetta Oliviero
19 Shukurat Oladipo
23 Valentina Bergamaschi
29 Annalena Rieke
32 Bianca Vergani
78 Magda Piekarska
MIG
6 Maya Doms
8 Kayleigh Van Dooren
10 Manuela Giugliano
14 Giada Pellegrino Cimò
20 Giada Greggi
22 Marta Pandini
25 Frederikke Thøgersen
DAV
7 Sofia Jahnukainen
11 Alayah Pilgrim
16 Alice Corelli
18 Martina Piemonte
30 Rinsola Babajide
""",
"PFC": """
POR
16 Mylène Chavas
22 Kinga Seweryn
30 Rafaela Mendonça
40 Clélia Ducreux
DEF
2 Célina Ould Hocine
3 Manoly Baquerizo
5 Hillary Diaz
13 Íris Fernandes
18 Melween N'Dongala
19 Théa Greboval
23 Saki Ishizaka
26 Fiona Liaigre
33 Hajar Saïd
MIG
4 Kaja Korošec
8 Daphne Corboz
11 Sheika Scott
21 Océane Picard
24 Anaële Le Moguédec
27 Maeline Mendy
31 Kenza Dufour
DAV
7 Mariam Toloba
10 Clara Mateo
14 Evelyne Viens
15 Hawa Sangare
20 Klaudia Jedlińska
25 Karla Torres
34 Aurélie Reynders
""",
"BEN": """
POR
1 Lena Pauels
46 Michaely Bihina
DEF
3 Inês Meninas
4 Blessing Demehin
5 Marit Bratberg Lund
11 Ana Borges
14 Anna Csiki
19 Catarina Amado
22 Diana Gomes
31 Tinkara Testen
56 Carolina Simões
MIG
8 Andreia Norton
16 Clara Oliveira
21 Pauleta
23 Carolina Tristão
DAV
7 Frøya Dorsin
9 Nycole Raysla
10 Caroline Møller
13 Lucia Alves
18 Flourish Sabastine
24 Janet Akekoromowei
25 Chandra Davidson
26 Shao Ziqin
77 Neide Guedes
""",
"INT": """
POR
1 Cecilía Rúnarsdóttir
12 Camilla Forcinella
99 Elena Belli
DEF
2 Emma Kullberg
4 Samantha van Diemen
5 Ivana Andrés
6 Irene Santi
14 Chiara Robustellini
15 Sheila García
33 Elisa Bartoli
MIG
8 Karólína Vilhjálmsdóttir
10 Lina Magull
16 Maša Tomašević
20 Marie Detruyer
24 Marija Milinković
29 Rachele Giudici
DAV
7 Haley Bugeja
9 Elisa Polli
11 Clarisse Le Bihan
17 Toni Payne
18 Benedetta Glionna
22 Olivia Schough
26 Brittany Raphino
36 Michela Cambiaghi
""",
"HAC": """
POR
13 Jennifer Falk
29 Hanna Karlsson
DEF
3 Aivi Luik
4 Emma Östlund
12 Stine Sandbech
14 Tilde Karlsson
15 Alva Selerud
18 Lisa Löwing
19 Nesrin Akgün
20 Josefine Rybrink
22 Ella McBride
28 Halimatu Ayinde
MIG
5 Laney Egbuka
7 Pernille Sanvig
21 Jóhanna Fossdalsá
26 Nathalie Staaf
DAV
6 Joy Omewa
9 Maja Bodin
10 Anna Anvegård
11 Tuva Ölvestad
17 Faith Chinzimu
24 Tabitha Tindell
27 Thelma Pálmadóttir
""",
"HBK": """
POR
1 Alberte Vingum
30 Emilie Møller
66 Lauren Kozal
DEF
2 Maria Uhre
4 Yukina Sakabe
5 Sydney Jones
15 Ida Marie Jørgensen
19 Aissatou Fall
25 Augusta Callesen
27 Andrea Termansen
28 Simone Boye Sørensen
32 Emma Flick
MIG
6 Aemu Oyama
12 Sarah Thygesen
13 Catherine Paulson
23 Mille Gejl
24 Laura Hermann
88 Zuzanna Witek
DAV
3 Macy Schultz
7 Kyra Carusa
8 Mai Wendicke
9 Nadia Nadim
10 Mercy Chipasula
17 Rikke Madsen
22 Emelía Óskarsdóttir
33 Mwanalima Jereko
""",
"SER": """
POR
13 Jacintha Weimar
30 Manon Le Page
DEF
3 Daïna Bourma
14 Laia Ballesté
20 Chiara Wallin
22 Amanda Chaney
23 Amina Muratovic
24 Joana Marchão
28 Noémie Carage
78 Benedicte Simon
MIG
6 Paola Hernández
10 Ghoutia Karchouni
19 Paula Serrano
21 Laura Strik
64 Stefanie De Alem
66 Elodie Nakkach
DAV
7 Natasha Andonova
9 Gloria Marinelli
11 Magdalena Sobal
12 Mickaella Cardia
25 Meriame Terchoun
""",
"OHL": """
POR
1 Faye Lammertijn
24 Lieke Cremers
29 Lowiese Seynhaeve
DEF
2 Saar Janssen
3 Kim Everaerts
4 Virág Nagy
5 Kimberley Smit
15 Amélie Van Holderbeke
21 Flo Hermans
25 Agathe Ollivier
28 Sterre Gielen
31 Norah Buijsrogge
MIG
7 Alixe Bosteels
8 Manon Van Raay
10 Camille Lafaix
18 Lily Hoekx
19 Jeslynn Kuijpers
23 Lili Verstrepen
30 Julie Biesmans
DAV
6 Linnea Strömberg
9 Jada Conijnenberg
11 Ioanna Papatheodorou
16 Kadhiya De Ceuster
26 Isabella Dekker
32 Anna Corneillie
""",
"AUS": """
POR
1 Jasmin Pal
12 Emma Goetz
DEF
4 Chiara Pucci
5 Tatjana Weiss
8 Katharina Schiechtl
13 Virginia Kirchberger
18 Verena Hanshaw
23 Carina Wenninger
24 Yvonne Weilharter
MIG
2 Louise Schöffel
6 Lotta Cordes
7 Elisa Pfattner
10 Andrea Glibo
11 Almedina Sisic
15 Patricia Pfanner
21 Lucia Orkić
28 Nina-Katrin Pichler
29 Valentina Pötzl
38 Dominika Škorvánková
DAV
14 Sandra Jakobsen
22 Modesta Uka
""",
}

# Valors estimats per a jugadores conegudes (estimació pròpia, no oficial).
VALORS = {
 # Barça
 "Aitana Bonmatí":95,"Caroline Graham Hansen":92,"Ewa Pajor":91,"Patri Guijarro":91,"Clàudia Pina":90,
 "Cata Coll":89,"Vicky López":86,"Irene Paredes":85,"Kerolin":85,"Kika Nazareth":84,"Laia Aleixandri":84,
 "Esmee Brugts":83,"Martina Fernández":82,"Sydney Schertenleib":81,"Marta Torrejón":79,"Clara Serrajordi":79,
 "Renee van Asten":77,"Gemma Font":74,"Tyler McCamey":72,"Carla Julià":71,"Nikoline Nielsen":69,
 "Giulia Galli":67,"Carolina Ferrera":66,"Liv Pennock":66,"Julia Torres":64,
 # Lyon
 "Melchie Dumornay":92,"Salma Paralluelo":90,"Marie-Antoinette Katoto":89,"Ada Hegerberg":88,"Wendie Renard":88,
 "Selma Bacha":88,"Christiane Endler":88,"Tabitha Chawinga":86,"Jule Brand":85,"Vicki Becho":84,"Caroline Weir":84,
 "Lily Yohannes":83,"Ingrid Engen":82,"Damaris Egurrola":82,"Korbin Shrader":82,"Ashley Lawrence":82,"Tarciane":81,
 "Johanna Rytting Kaneryd":81,"Maria-Luisa Grohs":80,"Ines Benyahia":79,"Elma Junttila Nelhage":77,
 "Giovanna Waksman":75,"Liana Joseph":73,"Julie Swierot":72,"Ainhoa Sagna":66,
 # Chelsea
 "Lauren James":90,"Naomi Girma":88,"Hannah Hampton":88,"Keira Walsh":87,"Lucy Bronze":86,"Mayra Ramírez":86,
 "Ellie Carpenter":85,"Alyssa Thompson":84,"Sjoeke Nüsken":84,"Katie McCabe":84,"Erin Cuthbert":83,"Wieke Kaptein":83,
 "Kadeisha Buchanan":82,"Nathalie Björn":82,"Melvine Malard":82,"Sandy Baltimore":82,"Veerle Buurman":80,
 "Maika Hamano":80,"Livia Peng":80,"Aggie Beever-Jones":80,"Giulia Dragoni":78,"Manaka Matsukubo":77,"Nelly Las":77,
 "Rebecca Spencer":76,"Alexia Potter":72,"Chloe Sarwie":70,
 # Arsenal
 "Alessia Russo":93,"Mariona Caldentey":89,"Ona Batlle":89,"Leah Williamson":88,"Emily Fox":87,"Georgia Stanway":87,
 "Olivia Smith":86,"Chloe Kelly":85,"Frida Maanum":84,"Géraldine Reuteler":84,"Kyra Cooney-Cross":83,"Kim Little":82,
 "Caitlin Foord":82,"Stina Blackstenius":81,"Misa Rodríguez":81,"Steph Catley":80,"Lotte Wubben-Moy":80,
 "Elisa De Almeida":79,"Selina Cerci":77,"Taylor Hinds":76,"Anneke Borbe":75,"Smilla Holmberg":74,"Katie Reid":70,
 "Lisa Baum":68,"Isabella Damm":58,
 # Man City
 "Khadija Shaw":92,"Alex Greenwood":86,"Vivianne Miedema":86,"Lauren Hemp":86,"Yui Hasegawa":85,"Ayaka Yamashita":85,
 "Aoba Fujino":84,"Grace Clinton":84,"Beth Mead":84,"Mary Fowler":83,"Kerstin Casparij":82,"Jade Rose":81,
 "Samantha Coffey":81,"Risa Shimizu":80,"Sydney Lohmann":80,"Iman Beney":80,"Laura Blindkilde Brown":79,
 "Rebecca Knaak":79,"Niamh Charles":78,"Carlotta Wamser":78,"Anna Moorhouse":76,"Eartha Cumings":74,"Gracie Prior":70,
 # Bayern
 "Pernille Harder":89,"Klara Bühl":88,"Giulia Gwinn":87,"Glódís Viggósdóttir":85,"Magdalena Eriksson":84,
 "Linda Dallmann":82,"Momoko Tanikawa":82,"Vanessa Gilles":82,"Sarah Zadrazil":81,"Ena Mahmutovic":81,
 "Jovana Damnjanović":81,"Franziska Kett":81,"Stine Ballisager":78,"Katharina Naschenweng":77,"Bernadette Kakounan":76,
 "Alara Şehitler":74,"Sarah Mattner":74,"Barbara Dunst":74,"Sophie Proost":73,"Edna Imade":72,"Kassandra Potsi":72,
 "Jana Kappes":70,"Regina van Eijk":70,"Anna Klink":66,
 # Real Madrid
 "Linda Caicedo":89,"Athenea del Castillo":86,"Lineth Beerensteyn":85,"Maëlle Lakrar":84,"Merle Frohms":82,
 "Filippa Angeldahl":81,"Arianna Caruso":80,"Elisa Senss":80,"Felicia Schröder":80,"Eva Navarro":80,"María Méndez":79,
 "Sara Däbritz":79,"Bella Andersson":78,"Andreia Jacinto":78,"Sara Holmgaard":76,"Signe Bruun":76,"Janou Levels":73,
 "Lotte Keukelaar":72,"Silvia Cristóbal":72,"Irune Dorado":70,"Pau Comendador":66,"Oihane San Martín":66,"Noemi":66,
 "Noelia Llamas":64,"Laia López":62,
 # PSG
 "Sakina Karchaoui":85,"Katarzyna Kiedrzynek":82,"Jennifer Echegini":82,"Olga Carmona":82,"Rasheedat Ajibade":81,
 "Jackie Groenen":80,"Paulina Dudek":80,"Thiniba Samoura":80,"Naomie Feller":80,"Griedge Mbock Bathy":79,
 "Romée Leuchter":79,"Merveille Kanjinga":78,"Emilie Østerås":77,"Florianne Jourde":77,"Tara Elimbi Gilbert":77,
 "Oliwia Szperkowska":76,"Jade Le Guilly":76,"Isabela Chagas":76,"Vitória Yaya":75,"Andjela Krstić":74,
 "Maren Groothoff":72,"Léa Morissaint":70,"Anaïs Ebayilin":70,"Alyssa Charlier":70,"Océane Toussaint":70,"Camille Masson":64,
 # Juventus
 "Alba Redondo":81,"Danielle de Jong":79,"Eva Schatzer":78,"Júlia Bartel":77,"Tatiana Pinto":77,"Annamaria Serturini":77,
 "Estela Carbonell":76,"Cecilia Salvai":76,"Remina Chiba":76,"Amaiur Sarriegi":77,"Manaka Hayashi":76,
 "Martina Rosucci":75,"Federica D'Auria":75,"Martina Lenzini":75,"Emma Stølen Godø":75,"Kysha Sylla":74,
 "Danique Noordman":74,"Chiara Beccari":74,"Matilde Pavan":73,"Lea Khelifi":72,"Larissa Rusek":72,"Cris Librán":71,
 "Ornella Graziani":68,
 # Roma
 "Manuela Giugliano":81,"Giada Greggi":77,"Valentina Bergamaschi":76,"Elisabetta Oliviero":75,"Rachele Baldi":75,
 "Martina Piemonte":75,"Frederikke Thøgersen":74,"Annalena Rieke":74,"Kayleigh Van Dooren":74,"Alayah Pilgrim":74,
 "Rinsola Babajide":74,"Maya Doms":73,"Shukurat Oladipo":73,"Winonah Heatley":72,"Maya Antoine":72,"Marta Pandini":72,
 "Alice Corelli":71,"Giada Pellegrino Cimò":70,"Ella Ottey":69,"Sofia Jahnukainen":68,"Bianca Vergani":66,
 "Valentina Soggiu":64,"Magda Piekarska":63,"Lana Klobučarević":58,
 # Paris FC
 "Clara Mateo":79,"Mylène Chavas":78,"Kaja Korošec":76,"Evelyne Viens":76,"Daphne Corboz":75,"Mariam Toloba":75,
 "Théa Greboval":74,"Célina Ould Hocine":74,"Anaële Le Moguédec":74,"Kinga Seweryn":73,"Melween N'Dongala":72,
 "Hawa Sangare":72,"Aurélie Reynders":71,"Maeline Mendy":71,"Manoly Baquerizo":70,"Hillary Diaz":70,"Sheika Scott":70,
 "Klaudia Jedlińska":70,"Saki Ishizaka":69,"Océane Picard":68,"Íris Fernandes":67,"Karla Torres":67,"Fiona Liaigre":66,
 "Kenza Dufour":65,"Hajar Saïd":64,"Rafaela Mendonça":62,"Clélia Ducreux":60,
 # Benfica
 "Lena Pauels":76,"Chandra Davidson":76,"Caroline Møller":76,"Pauleta":75,"Lucia Alves":75,"Diana Gomes":74,
 "Ana Borges":74,"Andreia Norton":74,"Anna Csiki":73,"Catarina Amado":73,"Marit Bratberg Lund":72,"Frøya Dorsin":72,
 "Tinkara Testen":71,"Carolina Tristão":71,"Nycole Raysla":71,"Blessing Demehin":70,"Shao Ziqin":70,
 "Flourish Sabastine":69,"Neide Guedes":68,"Clara Oliveira":67,"Janet Akekoromowei":66,"Inês Meninas":65,
 "Carolina Simões":63,"Michaely Bihina":60,
 # Inter
 "Lina Magull":77,"Haley Bugeja":76,"Cecilía Rúnarsdóttir":76,"Olivia Schough":74,"Elisa Bartoli":73,
 "Michela Cambiaghi":73,"Karólína Vilhjálmsdóttir":74,"Ivana Andrés":74,"Toni Payne":73,"Emma Kullberg":72,
 "Samantha van Diemen":72,"Elisa Polli":72,"Maša Tomašević":72,"Marija Milinković":71,"Sheila García":71,
 "Clarisse Le Bihan":70,"Irene Santi":70,"Chiara Robustellini":69,"Benedetta Glionna":69,"Marie Detruyer":69,
 "Brittany Raphino":67,"Rachele Giudici":64,"Camilla Forcinella":62,"Elena Belli":60,
 # Häcken
 "Anna Anvegård":74,"Jennifer Falk":73,"Aivi Luik":72,"Pernille Sanvig":72,"Josefine Rybrink":71,"Thelma Pálmadóttir":71,
 "Tabitha Tindell":70,"Maja Bodin":70,"Laney Egbuka":70,"Emma Östlund":69,"Alva Selerud":69,"Stine Sandbech":68,
 "Joy Omewa":68,"Hanna Karlsson":67,"Jóhanna Fossdalsá":66,"Lisa Löwing":66,"Ella McBride":65,"Tilde Karlsson":64,
 "Tuva Ölvestad":64,"Faith Chinzimu":64,"Nathalie Staaf":63,"Halimatu Ayinde":65,"Nesrin Akgün":62,
 # HB Køge
 "Nadia Nadim":73,"Alberte Vingum":71,"Kyra Carusa":70,"Simone Boye Sørensen":70,"Maria Uhre":68,"Mille Gejl":68,
 "Macy Schultz":67,"Mwanalima Jereko":67,"Rikke Madsen":66,"Emma Flick":66,"Catherine Paulson":66,"Aemu Oyama":66,
 "Sarah Thygesen":65,"Zuzanna Witek":65,"Lauren Kozal":65,"Emelía Óskarsdóttir":64,"Yukina Sakabe":63,
 "Sydney Jones":63,"Laura Hermann":62,"Mercy Chipasula":62,"Mai Wendicke":60,"Ida Marie Jørgensen":59,
 "Aissatou Fall":58,"Augusta Callesen":58,"Andrea Termansen":57,"Emilie Møller":56,
 # Servette
 "Paola Hernández":70,"Jacintha Weimar":69,"Paula Serrano":68,"Natasha Andonova":68,"Gloria Marinelli":68,
 "Meriame Terchoun":67,"Ghoutia Karchouni":67,"Magdalena Sobal":66,"Joana Marchão":66,"Noémie Carage":65,
 "Daïna Bourma":64,"Laia Ballesté":64,"Benedicte Simon":64,"Amina Muratovic":63,"Elodie Nakkach":63,
 "Mickaella Cardia":63,"Laura Strik":61,"Stefanie De Alem":61,"Manon Le Page":60,"Chiara Wallin":58,"Amanda Chaney":58,
 # OH Leuven
 "Lowiese Seynhaeve":67,"Julie Biesmans":66,"Jeslynn Kuijpers":66,"Jada Conijnenberg":66,"Isabella Dekker":64,
 "Kim Everaerts":64,"Kimberley Smit":64,"Sterre Gielen":64,"Camille Lafaix":64,"Alixe Bosteels":63,
 "Ioanna Papatheodorou":63,"Agathe Ollivier":62,"Virág Nagy":61,"Saar Janssen":61,"Kadhiya De Ceuster":60,
 "Flo Hermans":58,"Manon Van Raay":60,"Linnea Strömberg":60,"Lily Hoekx":57,"Faye Lammertijn":57,"Lili Verstrepen":55,
 "Amélie Van Holderbeke":55,"Norah Buijsrogge":54,"Anna Corneillie":54,"Lieke Cremers":53,
 # Austria Wien
 "Modesta Uka":68,"Jasmin Pal":66,"Carina Wenninger":65,"Katharina Schiechtl":64,"Virginia Kirchberger":64,
 "Verena Hanshaw":64,"Patricia Pfanner":64,"Elisa Pfattner":63,"Lotta Cordes":63,"Tatjana Weiss":62,
 "Dominika Škorvánková":62,"Louise Schöffel":61,"Sandra Jakobsen":61,"Andrea Glibo":60,"Yvonne Weilharter":60,
 "Chiara Pucci":59,"Valentina Pötzl":59,"Lucia Orkić":58,"Almedina Sisic":57,"Emma Goetz":55,"Nina-Katrin Pichler":54,
}
