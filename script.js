/* constructor Producto*/

 
const productos = [];                         ///Array p/ guardar catálogo de productos

class Producto {
    constructor(id, nombre, precio, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}

const elementosCarrito = cargarCarritoLocalStorage();           //Array p/ guardar elementos en carrito

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

//Cargar productos desde JSON
async function cargarProductos() {
    const response = await fetch('./productos.json');
    const data = await response.json();
    data.productos.forEach((producto) => {
    productos.push(new Producto(producto.id, producto.nombre, producto.precio, producto.foto));
    });
  }

  console.log(productos);



//DOM
const contenedorProductos = document.getElementById('contenedor-productos');

const contenedorCarrito = document.querySelector("#items")

const contenedorFooterCarrito = document.querySelector("#footer");


// Ejecuto las funciones
cargarCarrito();        
armarCarrito();
armarCatalogoProductos();



// Defino Funciones
                             
//Fx 1                                             // Muestra los productos cargados desde JSON

function cargarCarrito() {
    
}

//Fx 2: Armado del Carrito                                 // Arma el carrito

function armarCarrito() {
    contenedorCarrito.innerHTML = "";

    elementosCarrito.forEach(
        (elemento) => {
            let renglonesCarrito= document.createElement("tr");
            
            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="500" step="1" style="width: 50px;"/></td>
                <td> ${elemento.producto.precio}</td>
                <td>$ ${elemento.producto.precio*elemento.cantidad}</td>
                <td><button id="eliminar-producto-${elemento.producto.id}" type="button"> Eliminar <i class="bi bi-trash-fill"></i></button></td>`
                ;

                contenedorCarrito.appendChild(renglonesCarrito);

        
//Evento en carrito que modifica cantidad de un mismo producto
            
     let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
            inputCantidadProducto.addEventListener('change', (ev) => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;
                    
                    armarCarrito();
                    
            });

    //Evento en carrito para eliminar producto del carrito

      let botonEliminarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);
      botonEliminarProducto.addEventListener('click', () => {

                let indiceEliminar =  elementosCarrito.indexOf(elemento);
                elementosCarrito.splice(indiceEliminar,1);
                                
                armarCarrito();

              //guardar en localstorage

           localStorage.setItem("Carrito", JSON.stringify(elementosCarrito));


     });

          
localStorage.setItem("Carrito", JSON.stringify(elementosCarrito));

    }

    );

     //suma del carrito    

    const valorInicial = 0
    const totalCompra = elementosCarrito.reduce(
        (valorPrevio, valorActual) => valorPrevio + valorActual.producto.precio*valorActual.cantidad,
        valorInicial);
     
   // operadores ternarios reemplazo el if 
    elementosCarrito.length == 0 ?
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6"> El carrito está vacío </th>` :
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Total de la compra: $ ${totalCompra}</th>`;

    };


//Fx para eliminar producto del Carrito

function removerProductoCarrito(elementoAEliminar) {
    const elementosAMantener = elementosCarrito.filter((elemento) => elementoAEliminar.producto.id != elemento.producto.id);
    elementosCarrito.length = 0;

    elementosAMantener.forEach((elemento) => elementosCarrito.push(elemento));

}
        
armarCarrito();
 

//Card de Producto

function crearCard(producto) {
    
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-warning";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCard = document.createElement("div");
    cuerpoCard.className = "card-body";
    cuerpoCard.innerHTML = `
        <h4>${producto.nombre}</h4>
        <p> $ ${producto.precio} </p>
    `;
    cuerpoCard.append(botonAgregar);

    //Card Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;

    //Card
    let card = document.createElement("div");
    card.className = "card m-2 p-2";
    card.style = "width: 18rem";                
    card.append(imagen);
    card.append(cuerpoCard);


    //Agrego evento => agrego producto al Carrito

    botonAgregar.onclick = () => {
        

        let elementoExistente = 
            elementosCarrito.find((elem) => elem.producto.id == producto.id);
        
        if(elementoExistente) {
            elementoExistente.cantidad+=1;
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);
        }

        armarCarrito();
      cargarCarritoLocalStorage();


       // Sweet alert: Aviso producto agregado

        swal({
            title: '¡Producto agregado exitosamente!',
            text: `${producto.nombre} se agregó al carrito`,
            icon: 'success',
            buttons: {
                cerrar: {
                    text: 'Seguir comprando',
                    value: false
                },
                carrito: {
                    text: 'Ir al Carrito',
                    value: true,
                }
            }

        }).then((decision) => {
            if(decision) {
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: true});
                const modalToggle = document.getElementById('toggleMyModal'); 
                myModal.show(modalToggle);
            } else {
                swal("Elige el siguiente producto");
            }
        });
    }
   
    return card;
}


/*Fx*/


async function armarCatalogoProductos() {
    contenedorProductos.innerHTML = "";
    await cargarProductos()
    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );

}

//Fx para guardar y traer Local Storage

function cargarCarritoLocalStorage() {
    if (!localStorage.getItem("Carrito")) {
        localStorage.setItem("Carrito", JSON.stringify([]));   //Crea LS Carrito
    }
    
    return JSON.parse(localStorage.getItem("Carrito"));
}
    