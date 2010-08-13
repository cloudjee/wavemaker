USE aghr;

SET AUTOCOMMIT=0;
INSERT INTO employee (first_name, last_name, email) values 
                     ('Chloe', 'Jackson', 'cjackson@activegrid.com');
INSERT INTO employee (first_name, last_name, email) values 
                     ('Wendy', 'Schott', 'wschott@activegrid.com');
INSERT INTO employee (first_name, last_name, email) values 
                     ('Geremy', 'Cohen', 'internets@activegrid.com');
INSERT INTO employee (first_name, last_name, email) values 
                     ('Ed', 'Callahan', 'ecallahan@activegrid.com');
COMMIT;


INSERT INTO compkey (id1, id2, name) values (0, 0, 'name1');
INSERT INTO compkey (id1, id2, name) values (0, 1, 'name2');
INSERT INTO compkey (id1, id2, name) values (0, 2, 'name3');

COMMIT;

