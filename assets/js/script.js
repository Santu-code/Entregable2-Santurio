//SCRIPT:

//Variables y constantes

let inventario = {
  productos: [],
};

const agregar = document.getElementById("agregar");
const eliminar = document.getElementById("eliminar");
const buscar = document.getElementById("buscar");

const pedirProducto = () => prompt("Introduce el producto.");

const pedirStock(){
  const pedir = prompt("Introduce la cantidad de producto.");
  if(!pedir) return null;

  const nueroStock = parseInt(pedir);
  if(isNan(nueroStock)){
    alert("La cantidad tiene que ser un numero.");
    return null;
  }
  return nueroStock;
} 

//CARGA DEL LOCAL STORAGE:

const inventarioSave = JSON.parse(localStorage.getItem("inventario"));  // Esto sirve para recuperar del localStorage lo guardado y que lo muestre en el Dom al abrir la pagina.
if(inventarioSave){
    inventario = inventarioSave;
    inventario.productos.forEach(articulo => {
      if(!articulo.nombre) return; // Evita que carge articulos sin valor definido.
      actualizarDomAgregar(articulo.nombre, articulo.cantidad);
    })

}


//FUNCIONES:

      //AGREGAR:

function guardarLocalStorage() {
  localStorage.setItem("inventario", JSON.stringify(inventario));//Guarda en localStorage la lista.
}

function actualizarDomAgregar(producto, stock) {
  if(!producto) return;// Evita  articulos sin valor definido.
  const ul = document.getElementById("lista");
  const li = document.createElement("li");
  li.textContent = ` Nombre: ${producto}, Stock: ${stock}.`; //Esto modifica el DOM.
  li.dataset.producto = producto.toLowerCase(); // Esto crea un identificador del li con el nombre del producto.
  ul.appendChild(li);//Esto lo añade al HTML.
}

function añadirProducto() {
  let producto = pedirProducto();
  if (!producto) return;// Evita  articulos sin valor definido.

  let stock = pedirStock();
  if(stock === null) return;
  inventario.productos.push({ nombre: producto, cantidad: stock });

  console.log(`Producto ${producto} con ${stock} de stock actualizado.`);

  actualizarDomAgregar(producto, stock);

  guardarLocalStorage();
}

agregar.addEventListener("click", añadirProducto);//Evento de agregar.


      //BUSCAR:

function actualizarDomBuscar(producto) {
  const li = document.querySelector(`[data-producto="${producto.toLowerCase()}"]`);
  if(li){
    li.style.fontWeight = "bold";
    li.style.fontStyle= "italic";
    li.style.marginLeft= "90px";
  }
}


function mirarProducto() {
  let producto = pedirProducto();
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

buscar.addEventListener("click", mirarProducto);//Evento de busqueda.

//ELIMINAR:

function quitarProducto() {
  let producto = pedirProducto();
  if (!producto) return;// Evita  articulos sin valor definido.

  let confirma = confirm(`¿Seguro quires borrar el producto ${producto}?`);
  if (confirma) {
    let ubicacion = inventario.productos.findIndex(
      (p) => p.nombre.toLowerCase() === producto.toLowerCase()
    );
    if (ubicacion !== -1) {

      const li = document.querySelector(`[data-producto="${producto.toLowerCase()}"]`);//Elimina lo guardado en el Dom.
      if(li){
        li.remove();
      }

      inventario.productos.splice(ubicacion, 1);
      alert(`El producto ${producto} a sido borrado del inventario.`);
      guardarLocalStorage()
    }
  }
}

eliminar.addEventListener("click",quitarProducto);//Evento de eliminar.