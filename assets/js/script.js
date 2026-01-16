            //SCRIPT:
            //Variables y constantes principales

let inventario = {
  productos: [],
};


async function pedirProductoSwal(){
    const { value } = await Swal.fire({
    title: "Introduce el Producto",
    input: "text",
    inputLabel: "Nombre del producto",
    inputPlaceholder: "Ej: Manzana",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || !value.trim()) return "Tienes que escribir un nombre";
    }
  });

  return value ? value.trim() : null;
}


async function pedirStockSwal() {
  const res = await Swal.fire({
    title: "Cantidad",
    input: "number",
    inputLabel: "Introduce la cantidad",
    inputPlaceholder: "Ej: 10",
    showCancelButton: true,
    inputAttributes: { min: 0, step: 1 },
    inputValidator: (value) => {
      if (value === "" || value === null) return "La cantidad es obligatoria";
      const n = Number(value);
      if (!Number.isInteger(n) || n < 0) return "Introduce un número válido (0 o más)";
    }
  });

  if (!res.isConfirmed) return null; 
  return Number(res.value);  
}

            //Cargar datos 

async function preCarga() {
      const ul = document.getElementById("lista");
      if (ul) ul.innerHTML ="";
      
      //CARGA DEL LOCAL STORAGE:

const inventarioSave = JSON.parse(localStorage.getItem("inventario"));

if (inventarioSave && Array.isArray(inventarioSave.productos)) {
  inventario = inventarioSave;
} else {
  const data = await fetch("../assets/data.json")
  .then(respuesta => respuesta.json())
  .catch(() => null);
  inventario.productos = Array.isArray(data?.productos) ? data.productos : [];
  guardarLocalStorage();
}


inventario.productos.forEach((articulo) => {
    if (!articulo?.nombre) return; // Evita que carge articulos sin valor definido.
    actualizarDomAgregar(articulo.nombre, articulo.cantidad);
  });
}

document.addEventListener("DOMContentLoaded", () => {
preCarga().catch(() => {});
});
            //Modificar titulo: ---------------falta por meter al git.
    
    async function cambiarTitulo() {
  const { value } = await Swal.fire({
    title: "Cambiar título",
    input: "text",
    inputLabel: "Nuevo título ",
    inputPlaceholder: "Ej: Lista de la compra",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "El título no puede estar vacío";
      }
    }
  });

  if (!value) return;

  const tituloActualizado = document.getElementById("titulo-lista");
  if (tituloActualizado) {
    tituloActualizado.textContent = value.trim();
  }

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Título actualizado",
    showConfirmButton: false,
    timer: 1200
  });
}
    
    
    let tituloActualizado = document.getElementById("titulo-lista");
    if(tituloActualizado){
    tituloActualizado.addEventListener("click", cambiarTitulo)
    }






            //FUNCIONES:

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

function actualizarDomStock(nombre,cantidadActualizada){
  const li = document.querySelector(`[data-producto="${nombre.toLowerCase()}"]`);
  if(!li) return;
  li.textContent = `Nombre: ${nombre}, Stock: ${cantidadActualizada}.`;

}

async function añadirProducto() {
  const nombre = await pedirProductoSwal();
  if (!nombre) return;

  const existente = inventario.productos.find(
    p => (p.nombre)?.toLowerCase() === nombre.toLowerCase()
  );

  if (existente) {
    const confirmacion = await Swal.fire({
      title: "Producto existente",
      text: `El producto ${nombre} ya existe. ¿Quieres actualizar el stock?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    const stock = await pedirStockSwal();
    if (stock === null) return;

    existente.cantidad = stock;
    actualizarDomStock(nombre, stock);
  } else {
  const stock = await pedirStockSwal();
  if (stock === null) return;

  inventario.productos.push({ nombre, cantidad: stock });
  actualizarDomAgregar(nombre, stock);
  }

  guardarLocalStorage();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: `Producto ${nombre} guardado`,
    showConfirmButton: false,
    timer: 1200
  });
}


            //BUSCAR:

function actualizarDomBuscar(producto) {

  document.querySelectorAll(".productoMarcado").forEach(li => li.classList.remove("productoMarcado"));

  const li = document.querySelector(
    `[data-producto="${producto.toLowerCase()}"]`
  );
  if (li) li.classList.add ("productoMarcado");
}

  async function mirarProducto() {
  const nombre = await pedirProductoSwal();
  if (!nombre) return;

  const busqueda = inventario.productos.find(
    (p) => (p.nombre)?.toLowerCase() === nombre.toLowerCase()
  );

  if (busqueda) {
    const nombreReal = busqueda.nombre;

    Swal.fire({
      icon: "info",
      title: "Producto encontrado",
      text: `${nombreReal} tiene ${busqueda.cantidad} unidades`
    });

    actualizarDomBuscar(nombreReal);
  } else {
    Swal.fire({
      icon: "error",
      title: "No existe",
      text: `No existe el producto ${nombre}`
    });
  }
}




            //ELIMINAR:

async function quitarProducto() {
  const nombre = await pedirProductoSwal();
  if (!nombre) return;

  Swal.fire({
    title: "¿Seguro?",
    text: `¿Quieres borrar el producto ${nombre}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (!result.isConfirmed) return;

    const ubicacion = inventario.productos.findIndex(
      p => (p.nombre)?.toLowerCase() === nombre.toLowerCase()
    );

    if (ubicacion === -1) {
      Swal.fire("Error", `El producto ${nombre} no existe`, "error");
      return;
    }

    document
      .querySelector(`[data-producto="${nombre.toLowerCase()}"]`)
      ?.remove();

    inventario.productos.splice(ubicacion, 1);
    guardarLocalStorage();

    Swal.fire("Borrado", `El producto ${nombre} ha sido eliminado`, "success");
  });
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


