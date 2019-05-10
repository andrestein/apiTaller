select id,nombre_local, email, telefono, direccion,
(select count(r.id) from reserva r where r.restaurante_id = res.id ) as nro_reservas
from restaurante res