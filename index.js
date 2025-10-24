const express = require('express'); // Importa el paquete express para crear el servidor y manejar rutas
const cors = require('cors');
const app = express(); // Crea la instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Define el puerto: usa la variable de entorno PORT o 3000 por defecto

app.use(express.json()); // Middleware: permite que Express parsee cuerpos JSON en las peticiones
app.use(cors());

// Variables globales
let nextId = 1; //autoincremental simple -> contador para asignar IDs únicos a los zapatos
let zapatos = []; // Arreglo en memoria donde almacenamos los objetos "zapato"

// Servidor escuchando
app.listen(PORT, () => { // Inicia el servidor y pone a la app a escuchar en el puerto definido
    console.log(`API lista en http://localhost:${PORT}`); // Mensaje en consola indicando que el servidor está activo
});

// Endpoint para crear un zapato
app.post('/zapatos', (req, res) => { // Ruta POST /zapatos para crear un nuevo zapato
  const { brand, model, size, color, price } = req.body; // Extrae propiedades esperadas del cuerpo JSON
  const stock = typeof req.body.stock === 'number' ? req.body.stock : 0; // Si stock es número úsalo, si no inicializa en 0
  const tags  = Array.isArray(req.body.tags) ? req.body.tags : []; // Si tags es un array úsalo, si no usa array vacío

  const nuevo = { // Crea el objeto nuevo con la estructura deseada
    id: nextId++, // Asigna el ID actual y luego incrementa el contador
    brand, model, size, color, price, stock, tags, // Propiedades del zapato (shorthand)
    createdAt: new Date().toISOString() // Fecha de creación en formato ISO
  };

  zapatos.push(nuevo); // Agrega el nuevo zapato al arreglo en memoria
  return res.status(201).json({ ok:true, data: nuevo }); // Responde con estado 201 y el objeto creado
});

// Endpoint para obtener un zapato por su ID
app.get('/zapatos/:id', (req, res) => {
  const id = +req.params.id; // Convierte el parámetro de la URL a número
  const zapato = zapatos.find(i => i.id === id); // Busca el zapato en el arreglo

  if (!zapato) {
    // Si no existe, devuelve error 404
    return res.status(404).json({ error: 'Zapato no encontrado' });
  }

  // Si lo encuentra, devuelve el zapato
  res.json({ ok: true, data: zapato });
});

// Endpoint para actualizar un zapato
app.put('/zapatos/:id', (req, res) => { // Ruta PUT /zapatos/:id para actualizar un zapato por su id
  const id = +req.params.id; // Convierte el parámetro id a número (unario +)
  const item = zapatos.find(i => i.id === id); // Busca en el arreglo el zapato con ese id
  if (!item) return res.status(404).json({ error: 'Item no encontrado' }); // Si no existe, responde 404

  const { brand, model, size, color, price, stock, tags } = req.body; // Extrae los campos que pueden actualizarse

  if (brand) item.brand = brand; // Si se envió brand, actualiza la propiedad brand
  if (model) item.model = model; // Si se envió model, actualiza la propiedad model
  if (size) item.size = size; // Si se envió size, actualiza la propiedad size
  if (color) item.color = color; // Si se envió color, actualiza la propiedad color
  if (price) item.price = price; // Si se envió price, actualiza la propiedad price
  if (typeof stock === 'number') item.stock = stock; // Si stock es número, actualiza stock (permitimos 0)
  if (Array.isArray(tags)) item.tags = tags; // Si tags es array, actualiza tags

  res.json({ ok:true, data:item }); // Responde con el objeto actualizado
});

// 🗑️ DELETE /zapatos/:id → Elimina un zapato por su id
app.delete('/zapatos/:id', (req, res) => { // Ruta DELETE /zapatos/:id para eliminar por id
  const id = +req.params.id; // Convierte el parámetro id a número
  const index = zapatos.findIndex(i => i.id === id); // Busca el índice del zapato en el arreglo
  if (index === -1) return res.status(404).json({ error: 'Item no encontrado' }); // Si no existe, responde 404

  const deleted = zapatos.splice(index, 1)[0]; // Elimina el elemento del arreglo y guarda el eliminado
  res.json({ ok:true, deleted }); // Responde con el objeto eliminado
});


//Obtener todos los zapatos del array:
app.get('/zapatos', (req, res) => {
  res.json({ok: true, data: zapatos});
});