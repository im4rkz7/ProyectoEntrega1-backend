# Primera entrega del proyecto final

Se deberá entregar el estado de avance de tu aplicación eCommerce Backend, que implemente un servidor de aplicación basado en la plataforma Node.js y el módulo express. El servidor implementará dos conjuntos de rutas agrupadas en routers, uno con la url base '/productos' y el otro con '/carrito'. El puerto de escucha será el 8080 para desarrollo.

## Aspectos a incluir en el entregable

El router base '/api/productos' implementará cuatro funcionalidades:

- GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores).
- POST: '/' - Para incorporar productos al listado (disponible para administradores).
- PUT: '/:id' - Actualiza un producto por su id (disponible para administradores).
- DELETE: '/:id' - Borra un producto por su id (disponible para administradores).

El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:

- POST: '/' - Crea un carrito y devuelve su id.
- DELETE: '/:id' - Vacía un carrito y lo elimina.
- GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito.
- POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto.
- DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto.

Crear una variable booleana administrador, cuyo valor será configurado más adelante con el sistema de login. Según su valor (true ó false) permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. El status http de la respuesta debe ser 403. Ejemplo:

```json
{ "error": -1, "description": "ruta 'x' método 'y' no autorizada" }
```

Un producto dispondrá de los siguientes campos: id, timestamp, name, descritcion, code, photo (url), price, stock. El carrito de compras tendrá la siguiente estructura: id, timestamp, productos: [id]. El timestamp puede implementarse con Date.now().

Realizar la persistencia de productos y del carrito de compras en el filesystem.

## A tener en cuenta

- Probar con postman cada uno de los endpoints (productos y carrito) y su operación en conjunto.
- En todos los casos, el diálogo entre el frontend y el backend debe ser en formato JSON. El servidor no debe generar ninguna vista.
- En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error: ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}, status code: 404.
- La estructura de programación será ECMAScript. Más adelante se implementará el desarrollo en capas.
- Realizar la prueba de funcionalidad completa en el ámbito local (puerto 8080).
