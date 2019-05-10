select nombre_local, email, direccion,
(select count(r.id) from reserva r where r.restaurante_id = res.id ) as nro_reservas
from restaurante res
where res.id={{id}}