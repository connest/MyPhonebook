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
	
DROP TABLE IF EXISTS "Person";

CREATE TABLE "Person" (
  id_person SERIAL PRIMARY KEY,
  name varchar(255) default NULL,
  surname varchar(255) default NULL,
  login varchar(255) default NULL,
  password varchar(255) default NULL
);

INSERT INTO "Person" (id_person,name,surname,login,password) VALUES (1,'Hamilton','Wallace','sed,','neque'),(2,'Hu','Randolph','semper','orci.'),(3,'Kitra','Ray','vitae','nulla.'),(4,'Uriel','Vazquez','id','ullamcorper'),(5,'Gannon','Kidd','Aliquam','vitae'),(6,'Desirae','Mueller','dolor','Etiam'),(7,'Keegan','Perry','egestas','ac'),(8,'Marny','Parsons','porttitor','scelerisque'),(9,'Brady','Logan','vitae','malesuada'),(10,'Deacon','Graves','vehicula','Proin'),(11,'Tyrone','Houston','senectus','Nunc'),(12,'Sybill','Acosta','Cras','sagittis.'),(13,'Vaughan','Heath','malesuada','nunc'),(14,'Virginia','Durham','congue','vel'),(15,'Jescie','Hays','ipsum','sed'),(16,'Amela','Kaufman','Proin','ipsum.'),(17,'Macon','Cervantes','consectetuer','ligula.'),(18,'Wade','Johnson','consequat','ornare'),(19,'Elijah','Fuller','eros','In'),(20,'Ahmed','Michael','elit.','lacinia.')




DROP TABLE IF EXISTS "Contact";

CREATE TABLE "Contact" (
	  id_contact SERIAL PRIMARY KEY,
	  name varchar(255) default NULL,
	  surname varchar(255) default NULL,
	  id_person integer,
	  FOREIGN KEY (id_person) REFERENCES "Person" (id_person)
	  ON DELETE CASCADE
);

INSERT INTO "Contact" (id_contact,name,surname,id_person) VALUES (1,'Iola','Banks',17),(2,'Michael','Baldwin',2),(3,'Samuel','Odom',9),(4,'Alexander','Sanders',18),(5,'Jermaine','Campos',3),(6,'Wanda','Porter',5),(7,'Ashely','Guzman',1),(8,'Darius','Moon',2),(9,'Yardley','Nguyen',8),(10,'Gage','Strickland',11),(11,'Tucker','Griffin',13),(12,'Russell','Foley',8),(13,'Erin','Flynn',1),(14,'Mollie','Steele',9),(15,'August','Wilkinson',7),(16,'Wade','Wyatt',19),(17,'Maia','Hendricks',2),(18,'Kareem','Holman',9),(19,'Felix','Roth',12),(20,'Brett','Cunningham',10),(21,'David','Cummings',7),(22,'Byron','Bonner',2),(23,'Lucas','Burks',17),(24,'Kylee','Velez',6),(25,'Shannon','Lowery',12),(26,'Brenden','Bradshaw',1),(27,'Yeo','Gutierrez',14),(28,'Felix','Whitaker',7),(29,'Clayton','Calderon',4),(30,'Imelda','Lyons',20),(31,'Ferris','Wong',10),(32,'Evan','Willis',20),(33,'Anthony','Soto',20),(34,'Hadley','Pitts',19),(35,'Palmer','Rodriguez',3),(36,'Vladimir','Rosario',15),(37,'Desirae','Tate',15),(38,'Daryl','Byers',14),(39,'Gisela','Combs',12),(40,'Bert','Camacho',10),(41,'Maggy','Brady',16),(42,'Adara','Sargent',16),(43,'Bruno','Maldonado',5),(44,'Macey','Burris',17),(45,'Xenos','Carlson',9),(46,'Teegan','Watson',3),(47,'Ella','Newman',14),(48,'Merritt','Preston',16),(49,'Tiger','Mccoy',3),(50,'Althea','Paul',2),(51,'Martina','Leblanc',8),(52,'Fiona','Mckee',10),(53,'Colby','Hopper',6),(54,'Brandon','Santos',6),(55,'Sharon','Conway',10),(56,'Igor','Ballard',11),(57,'Janna','Baldwin',11),(58,'Hiroko','Merritt',4),(59,'Keaton','Cole',7),(60,'Colette','Knight',5),(61,'Uma','Benton',13),(62,'Garth','Schneider',13),(63,'Leilani','Gates',7),(64,'Galena','Caldwell',12),(65,'Yen','Mcpherson',18),(66,'Trevor','Kirk',9),(67,'Steven','Mccarty',14),(68,'Sonia','Mercado',8),(69,'Vivien','Mitchell',5),(70,'Arsenio','Hebert',5),(71,'Roanna','Bush',17),(72,'Adrian','Austin',16),(73,'Dolan','Powell',1),(74,'Risa','Aguilar',3),(75,'Ivan','Collins',14);


DROP TABLE IF EXISTS "Phone";

CREATE TABLE "Phone" (
	id_phone SERIAL PRIMARY KEY,
	phone_number varchar(100) default NULL,
	id_contact integer,
	FOREIGN KEY (id_contact) REFERENCES "Contact" (id_contact)
	ON DELETE CASCADE
);

INSERT INTO "Phone" (id_phone,phone_number,id_contact) VALUES (1,'+7 (856) 659-13-11',68),(2,'+7 (848) 553-06-76',45),(3,'+7 (296) 369-92-12',69),(4,'+7 (518) 325-58-62',57),(5,'+7 (353) 027-61-69',54),(6,'+7 (952) 829-41-49',66),(7,'+7 (695) 762-41-53',42),(8,'+7 (377) 372-23-08',73),(9,'+7 (172) 000-80-42',68),(10,'+7 (063) 700-95-73',32),(11,'+7 (737) 537-17-42',73),(12,'+7 (895) 768-88-55',25),(13,'+7 (490) 660-41-87',30),(14,'+7 (021) 422-80-75',25),(15,'+7 (625) 079-74-65',3),(16,'+7 (389) 743-14-77',8),(17,'+7 (414) 804-68-61',7),(18,'+7 (021) 667-72-12',14),(19,'+7 (757) 276-57-52',50),(20,'+7 (847) 000-43-17',55),(21,'+7 (014) 207-00-56',29),(22,'+7 (529) 997-81-63',35),(23,'+7 (986) 384-47-44',23),(24,'+7 (747) 778-38-62',3),(25,'+7 (883) 432-34-23',39),(26,'+7 (338) 995-82-78',11),(27,'+7 (397) 484-05-88',28),(28,'+7 (123) 888-25-24',27),(29,'+7 (724) 648-22-41',64),(30,'+7 (195) 342-10-78',59),(31,'+7 (383) 355-92-43',54),(32,'+7 (343) 841-33-67',28),(33,'+7 (053) 347-33-57',61),(34,'+7 (059) 257-83-74',12),(35,'+7 (467) 192-00-73',21),(36,'+7 (059) 188-15-27',12),(37,'+7 (080) 918-50-41',5),(38,'+7 (661) 895-39-56',14),(39,'+7 (293) 816-99-84',14),(40,'+7 (495) 407-75-55',41),(41,'+7 (529) 944-60-77',46),(42,'+7 (675) 102-04-18',45),(43,'+7 (170) 400-72-79',57),(44,'+7 (604) 038-65-46',1),(45,'+7 (229) 390-92-39',72),(46,'+7 (495) 758-88-04',14),(47,'+7 (347) 084-42-69',35),(48,'+7 (762) 538-40-02',69),(49,'+7 (838) 115-39-52',13),(50,'+7 (833) 266-59-70',36),(51,'+7 (704) 005-53-80',25),(52,'+7 (314) 088-79-80',53),(53,'+7 (045) 994-68-73',17),(54,'+7 (168) 162-17-57',12),(55,'+7 (392) 236-53-19',8),(56,'+7 (730) 330-24-45',73),(57,'+7 (693) 936-26-58',38),(58,'+7 (672) 439-43-93',6),(59,'+7 (736) 467-75-88',40),(60,'+7 (836) 100-15-46',43),(61,'+7 (971) 208-69-02',44),(62,'+7 (994) 195-13-32',31),(63,'+7 (683) 350-09-78',6),(64,'+7 (799) 743-90-83',18),(65,'+7 (405) 531-40-53',20),(66,'+7 (118) 535-67-53',18),(67,'+7 (340) 004-70-85',30),(68,'+7 (698) 072-90-38',66),(69,'+7 (183) 633-27-78',18),(70,'+7 (738) 347-39-12',60),(71,'+7 (572) 286-17-75',32),(72,'+7 (868) 676-48-07',4),(73,'+7 (823) 976-85-47',9),(74,'+7 (886) 628-07-43',48),(75,'+7 (923) 362-70-37',47),(76,'+7 (458) 681-70-69',10),(77,'+7 (324) 412-54-23',53),(78,'+7 (782) 104-71-30',36),(79,'+7 (059) 836-18-87',29),(80,'+7 (843) 381-96-57',47),(81,'+7 (013) 456-14-29',36),(82,'+7 (828) 424-35-39',55),(83,'+7 (131) 481-91-38',2),(84,'+7 (780) 833-95-07',17),(85,'+7 (119) 540-79-07',75),(86,'+7 (864) 265-55-13',41),(87,'+7 (140) 997-18-49',66),(88,'+7 (611) 660-12-13',46),(89,'+7 (417) 511-73-60',7),(90,'+7 (169) 856-12-98',55),(91,'+7 (475) 916-44-58',27),(92,'+7 (096) 186-91-97',28),(93,'+7 (708) 851-19-73',13),(94,'+7 (155) 102-08-65',69),(95,'+7 (267) 993-88-37',11),(96,'+7 (794) 098-61-43',11),(97,'+7 (715) 853-25-64',16),(98,'+7 (710) 160-65-66',1),(99,'+7 (067) 966-93-46',51),(100,'+7 (954) 934-03-74',74);
