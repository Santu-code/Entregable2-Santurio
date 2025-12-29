//SCRIPT:

//Variables y constantes

let inventario = {
  productos: [],
};



const pedirProducto = () => prompt("Introduce el producto.");

function pedirStock() {
  const pedir = prompt("Introduce la cantidad de producto.");
  if (!pedir) return null;

  const numeroStock = parseInt(pedir);
  if (isNaN(numeroStock)) {
    alert("La cantidad tiene que ser un numero.");
    return null;
  }
  return numeroStock;
}

//CARGA DEL LOCAL STORAGE:

const inventarioSave = JSON.parse(localStorage.getItem("inventario")); // Esto sirve para recuperar del localStorage lo guardado y que lo muestre en el Dom al abrir la pagina.
if (inventarioSave) {
  inventario = inventarioSave;
  inventario.productos.forEach((articulo) => {
    if (!articulo.nombre) return; // Evita que carge articulos sin valor definido.
    actualizarDomAgregar(articulo.nombre, articulo.cantidad);
  });
}

//FUNCIONES:

//VALIDAR PRODUCTO:

function validarProducto(){

  const productoValido = pedirProducto();
  if (!productoValido) return null;

  const valido = productoValido.trim();
  if( valido === "") return null;
  return valido;
}

//AGREGAR:

function guardarLocalStorage() {
  localStorage.setItem("inventario", JSON.stringify(inventario)); //Guarda en localStorage la lista.
}

function actualizarDomAgregar(producto, stock) {
  if (!producto) return; // Evita  articulos sin valor definido.
  const ul = document.getElementById("lista");
  if(!ul) return;
  const li = document.createElement("li");
  li.textContent = ` Nombre: ${producto}, Stock: ${stock}.`; //Esto modifica el DOM.
  li.dataset.producto = producto.toLowerCase(); // Esto crea un identificador del li con el nombre del producto.
  ul.appendChild(li); //Esto lo añade al HTML.
}

function añadirProducto() {
  let producto = validarProducto();
  if (!producto) return; ;// Evita  articulos sin valor definido.

  let stock = pedirStock();
  if (stock === null) return;
  inventario.productos.push({ nombre: producto, cantidad: stock });

  console.log(`Producto ${producto} con ${stock} de stock actualizado.`);

  actualizarDomAgregar(producto, stock);

  guardarLocalStorage();
}



//BUSCAR:

function actualizarDomBuscar(producto) {

  document.querySelectorAll(".productoMarcado").forEach(li => li.classList.remove("productoMarcado"));

  const li = document.querySelector(
    `[data-producto="${producto.toLowerCase()}"]`
  );
  if (li) li.classList.add ("productoMarcado");
}

function mirarProducto() {
  let producto = validarProducto();
  if (!producto) return;// Evita  articulos sin valor definido.

  let busqueda = inventario.productos.find(
    (p) => p.nombre.toLowerCase() === producto.toLowerCase()
  );
  if (busqueda) {
    alert(`El producto ${busqueda.nombre} tiene ${busqueda.cantidad}`);
    actualizarDomBuscar(busqueda.nombre);
  } else {
    alert(`No existe el producto ${producto} de stock.`);
  }
}



//ELIMINAR:

function quitarProducto() {
  let producto = validarProducto();
  if (!producto) return;// Evita  articulos sin valor definido.

  let confirma = confirm(`¿Seguro quires borrar el producto ${producto}?`);
  if (confirma) {
    let ubicacion = inventario.productos.findIndex(
      (p) => p.nombre && p.nombre.toLowerCase() === producto.toLowerCase()
    );
    if (ubicacion !== -1) {
      const li = document.querySelector(
        `[data-producto="${producto.toLowerCase()}"]`
      ); //Elimina lo guardado en el Dom.
      if (li) {
        li.remove();
      }

      inventario.productos.splice(ubicacion, 1);
      alert(`El producto ${producto} a sido borrado del inventario.`);
      guardarLocalStorage();
    }
  }
}




//Llamadas de eventos para  Evitar errores en otras paginas y constantes :


const agregar = document.getElementById("agregar");
const eliminar = document.getElementById("eliminar");
const buscar = document.getElementById("buscar");

if (agregar) {
  agregar.addEventListener("click", añadirProducto);//Evento de agregar.
}

if (buscar) {
  buscar.addEventListener("click", mirarProducto);//Evento de busqueda.
}

if (eliminar) {
  eliminar.addEventListener("click", quitarProducto);//Evento de eliminar.
}