-- Database: phonebook
/*
-- DROP DATABASE phonebook;

CREATE DATABASE phonebook
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
	*/
	
DROP TABLE IF EXISTS "Person" CASCADE;

CREATE TABLE "Person" (
  id_person SERIAL PRIMARY KEY,
  login varchar(255) default NULL,
  password varchar(255) default NULL
);

INSERT INTO "Person" (login,password) VALUES ('sed,','neque'),('semper','orci.'),('vitae','nulla.'),('id','ullamcorper'),('Aliquam','vitae'),('dolor','Etiam'),('egestas','ac'),( 'porttitor','scelerisque'),('vitae','malesuada'),('vehicula','Proin'),('senectus','Nunc'),('Cras','sagittis.'),('malesuada','nunc'),('congue','vel'),('ipsum','sed'),('Proin','ipsum.'),('consectetuer','ligula.'),('consequat','ornare'),('eros','In'),('elit.','lacinia.');




DROP TABLE IF EXISTS "Contact" CASCADE;

CREATE TABLE "Contact" (
	  id_contact SERIAL PRIMARY KEY,
	  name varchar(255) default NULL,
	  surname varchar(255) default NULL,
	  id_person integer,
	  FOREIGN KEY (id_person) REFERENCES "Person" (id_person)
	  ON DELETE CASCADE
);

INSERT INTO "Contact" (name,surname,id_person) VALUES ('Iola','Banks',17),('Michael','Baldwin',2),('Samuel','Odom',9),('Alexander','Sanders',18),('Jermaine','Campos',3),('Wanda','Porter',5),('Ashely','Guzman',1),('Darius','Moon',2),('Yardley','Nguyen',8),('Gage','Strickland',11),('Tucker','Griffin',13),('Russell','Foley',8),('Erin','Flynn',1),('Mollie','Steele',9),('August','Wilkinson',7),('Wade','Wyatt',19),('Maia','Hendricks',2),('Kareem','Holman',9),('Felix','Roth',12),('Brett','Cunningham',10),('David','Cummings',7),('Byron','Bonner',2),('Lucas','Burks',17),('Kylee','Velez',6),('Shannon','Lowery',12),('Brenden','Bradshaw',1),('Yeo','Gutierrez',14),('Felix','Whitaker',7),('Clayton','Calderon',4),('Imelda','Lyons',20),('Ferris','Wong',10),('Evan','Willis',20),('Anthony','Soto',20),('Hadley','Pitts',19),('Palmer','Rodriguez',3),('Vladimir','Rosario',15),('Desirae','Tate',15),('Daryl','Byers',14),('Gisela','Combs',12),('Bert','Camacho',10),('Maggy','Brady',16),('Adara','Sargent',16),('Bruno','Maldonado',5),('Macey','Burris',17),('Xenos','Carlson',9),('Teegan','Watson',3),('Ella','Newman',14),('Merritt','Preston',16),('Tiger','Mccoy',3),('Althea','Paul',2),('Martina','Leblanc',8),('Fiona','Mckee',10),('Colby','Hopper',6),('Brandon','Santos',6),('Sharon','Conway',10),('Igor','Ballard',11),('Janna','Baldwin',11),('Hiroko','Merritt',4),('Keaton','Cole',7),('Colette','Knight',5),('Uma','Benton',13),('Garth','Schneider',13),('Leilani','Gates',7),('Galena','Caldwell',12),('Yen','Mcpherson',18),('Trevor','Kirk',9),('Steven','Mccarty',14),('Sonia','Mercado',8),('Vivien','Mitchell',5),('Arsenio','Hebert',5),('Roanna','Bush',17),('Adrian','Austin',16),('Dolan','Powell',1),('Risa','Aguilar',3),('Ivan','Collins',14);


DROP TABLE IF EXISTS "Phone" CASCADE;

CREATE TABLE "Phone" (
	id_phone SERIAL PRIMARY KEY,
	phone_number varchar(100) default NULL,
	id_contact integer,
	FOREIGN KEY (id_contact) REFERENCES "Contact" (id_contact)
	ON DELETE CASCADE
);

INSERT INTO "Phone" (phone_number,id_contact) VALUES ('+7 (856) 659-13-11',68),('+7 (848) 553-06-76',45),('+7 (296) 369-92-12',69),('+7 (518) 325-58-62',57),('+7 (353) 027-61-69',54),('+7 (952) 829-41-49',66),('+7 (695) 762-41-53',42),('+7 (377) 372-23-08',73),('+7 (172) 000-80-42',68),('+7 (063) 700-95-73',32),('+7 (737) 537-17-42',73),('+7 (895) 768-88-55',25),('+7 (490) 660-41-87',30),('+7 (021) 422-80-75',25),('+7 (625) 079-74-65',3),('+7 (389) 743-14-77',8),('+7 (414) 804-68-61',7),('+7 (021) 667-72-12',14),('+7 (757) 276-57-52',50),('+7 (847) 000-43-17',55),('+7 (014) 207-00-56',29),('+7 (529) 997-81-63',35),('+7 (986) 384-47-44',23),('+7 (747) 778-38-62',3),('+7 (883) 432-34-23',39),('+7 (338) 995-82-78',11),('+7 (397) 484-05-88',28),('+7 (123) 888-25-24',27),('+7 (724) 648-22-41',64),('+7 (195) 342-10-78',59),('+7 (383) 355-92-43',54),('+7 (343) 841-33-67',28),('+7 (053) 347-33-57',61),('+7 (059) 257-83-74',12),('+7 (467) 192-00-73',21),('+7 (059) 188-15-27',12),('+7 (080) 918-50-41',5),('+7 (661) 895-39-56',14),('+7 (293) 816-99-84',14),('+7 (495) 407-75-55',41),('+7 (529) 944-60-77',46),('+7 (675) 102-04-18',45),('+7 (170) 400-72-79',57),('+7 (604) 038-65-46',1),('+7 (229) 390-92-39',72),('+7 (495) 758-88-04',14),('+7 (347) 084-42-69',35),('+7 (762) 538-40-02',69),('+7 (838) 115-39-52',13),('+7 (833) 266-59-70',36),('+7 (704) 005-53-80',25),('+7 (314) 088-79-80',53),('+7 (045) 994-68-73',17),('+7 (168) 162-17-57',12),('+7 (392) 236-53-19',8),('+7 (730) 330-24-45',73),('+7 (693) 936-26-58',38),('+7 (672) 439-43-93',6),('+7 (736) 467-75-88',40),('+7 (836) 100-15-46',43),('+7 (971) 208-69-02',44),('+7 (994) 195-13-32',31),('+7 (683) 350-09-78',6),('+7 (799) 743-90-83',18),('+7 (405) 531-40-53',20),('+7 (118) 535-67-53',18),('+7 (340) 004-70-85',30),('+7 (698) 072-90-38',66),('+7 (183) 633-27-78',18),('+7 (738) 347-39-12',60),('+7 (572) 286-17-75',32),('+7 (868) 676-48-07',4),('+7 (823) 976-85-47',9),('+7 (886) 628-07-43',48),('+7 (923) 362-70-37',47),('+7 (458) 681-70-69',10),('+7 (324) 412-54-23',53),('+7 (782) 104-71-30',36),('+7 (059) 836-18-87',29),('+7 (843) 381-96-57',47),('+7 (013) 456-14-29',36),('+7 (828) 424-35-39',55),('+7 (131) 481-91-38',2),('+7 (780) 833-95-07',17),('+7 (119) 540-79-07',75),('+7 (864) 265-55-13',41),('+7 (140) 997-18-49',66),('+7 (611) 660-12-13',46),('+7 (417) 511-73-60',7),('+7 (169) 856-12-98',55),('+7 (475) 916-44-58',27),('+7 (096) 186-91-97',28),('+7 (708) 851-19-73',13),('+7 (155) 102-08-65',69),('+7 (267) 993-88-37',11),('+7 (794) 098-61-43',11),('+7 (715) 853-25-64',16),('+7 (710) 160-65-66',1),('+7 (067) 966-93-46',51),('+7 (954) 934-03-74',74);
