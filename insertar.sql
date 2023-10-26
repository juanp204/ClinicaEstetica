insert into servicios(titulo, descripcion, imagen)
values ('Lipoescultura', 'Esculpe tu cuerpo según tus deseos con nuestra lipoescultura de vanguardia.', 'images/Lipoescultura.jpg'),
('Abdominoplastia', 'Dile adiós a las preocupaciones y hola a un abdomen firme. Nuestra abdominoplastia redefine tu silueta para que te sientas seguro y fabuloso.', 'images/Abdominoplastia.jpg'),
('Blefaroplastia', 'Abre tus ojos a un nuevo mundo de juventud y vitalidad. Nuestra blefaroplastia rejuvenecedora te hará brillar con una mirada radiante.', 'images/Blefaroplastia.jpg'),
('Rinoplastia', 'Define tu identidad con una nariz que refleje tu verdadera belleza. Nuestra rinoplastia artística resalta lo mejor de ti.', 'images/Rinoplastia.jpg'),
('Aumento de Glúteos', 'Consigue las curvas con las que has soñado y luce tus jeans favoritos como nunca antes con nuestro aumento de glúteos. ¡Destaca entre la multitud!', 'images/aumentodegluteos.jpg'),
('Tratamiento contra las estrías', 'Descubre tratamientos efectivos para reducir la apariencia de estrías en la piel. Desde cremas y aceites tópicos hasta terapias láser y microdermoabrasión.', 'images/estrias.jpg'),
('Bótox', 'Descubre la belleza atemporal con nuestros tratamientos de Botox. Elimina arrugas y rejuvenece tu piel de manera segura y efectiva. ¡Resalta tu mejor versión con nosotros!', 'images/botox.jpg'),
('Disminución de ojeras', 'Logra una mirada radiante con nuestros tratamientos para disminución de ojeras. Despídete de la fatiga y revela una piel revitalizada. ¡Descubre la frescura en tu mirada con nosotros!', 'images/ojeras.jpg');

insert into tipousuario(usuario)
values ('admin'), ('normal'), ('inactivo');

insert into usuarios(nombres, apellidos, passwd, tipousuario_idtipousuario, correo) values ('admin', 'admin', '123', 1, 'admin');

