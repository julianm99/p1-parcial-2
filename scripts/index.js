'use strict';

class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarVista();
    }

    agregarProducto(id) {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;
    
        const item = this.productos.find(p => p.id === producto.id);
    
        if (item && item.cantidad >= producto.stock) {
            alert("No hay más stock disponible para este producto");
            return;
        }
    
        if (item) {
            item.cantidad++;
        } else {
            this.productos.push({ ...producto, cantidad: 1 });
        }
    
        this.actualizar();
    }
    eliminarProducto(id) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos[index].cantidad--;
            if (this.productos[index].cantidad === 0) {
                this.productos.splice(index, 1);
            }
        }
        this.actualizar();
        
    }

    vaciarCarrito() {
        this.productos = [];
        this.actualizar();
        actualizarVistaModal();
    }

    actualizar() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
        this.actualizarVista();
    }

        actualizarVista = () => {
        const contador = document.querySelector('#contador-productos');
        const total = document.querySelector('#total-precio');
        const totalProductos = this.productos.reduce((a, item) => a + item.cantidad, 0);
        const totalPrecio = this.productos.reduce((a, item) => a + item.precio * item.cantidad, 0);
        contador.textContent = totalProductos;
        total.textContent = `$${totalPrecio}`;
        actualizarVistaModal(this);
    };
}

const carrito = new Carrito();
let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) throw new Error('Error al cargar los productos');
        productos = await response.json();
        mostrarProductos(productos);

    } catch (error) {
        console.error('No se pudieron cargar los productos:', error);
        document.getElementById('productos').innerHTML = '<p>Error al cargar los productos.</p>';
    }
}

function mostrarProductos(listaProductos) {
    const contenedor = document.getElementById('productos');
    contenedor.textContent = ''; 

    listaProductos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto';

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;

        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;

        const precio = document.createElement('p');
        precio.textContent = `Precio: $${producto.precio}`;

        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = 'Agregar al Carrito';
        btnAgregar.classList.add('boton-agregar');
        btnAgregar.addEventListener('click', () => carrito.agregarProducto(producto.id));

        const btnDetalle = document.createElement('button');
        btnDetalle.textContent = 'Ver Detalle';
        btnDetalle.classList.add('boton-detalle');
        btnDetalle.addEventListener('click', () => detalleModal(producto.id));

        tarjeta.appendChild(img);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(btnAgregar);
        tarjeta.appendChild(btnDetalle);
        contenedor.appendChild(tarjeta);
    });
}
function actualizarVistaModal(carrito) {
    const lista = document.getElementById('carrito-lista');
    const totalProductos = document.getElementById('modal-contador-productos');
    const totalPrecio = document.getElementById('modal-total-precio');

    lista.innerHTML = '';

    carrito.productos.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('producto-item');

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;

        const nombre = document.createElement('strong');
        nombre.textContent = producto.nombre;

        const cantidad = document.createElement('p');
        cantidad.textContent = `Cantidad: ${producto.cantidad}`;

        const total = document.createElement('p');
        total.textContent = `Total: $${producto.precio * producto.cantidad}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '-';
        btnEliminar.addEventListener('click', () => carrito.eliminarProducto(producto.id));

        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = '+';
        btnAgregar.addEventListener('click', () => carrito.agregarProducto(producto.id));

        item.appendChild(img);
        item.appendChild(nombre);
        item.appendChild(cantidad);
        item.appendChild(total);
        item.appendChild(btnEliminar);
        item.appendChild(btnAgregar);
        lista.appendChild(item);
    });

    totalProductos.textContent = carrito.productos.reduce((a, item) => a + item.cantidad, 0);
    totalPrecio.textContent = `$${carrito.productos.reduce((a, item) => a + item.precio * item.cantidad, 0)}`;
}
function detalleModal(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const nombre = document.createElement('h3');
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement('p');
    precio.textContent = `Precio: $${producto.precio}`;

    const btnAgregar = document.createElement('button');
    btnAgregar.textContent = 'Agregar al Carrito';
    btnAgregar.addEventListener('click', () => carrito.agregarProducto(producto.id));

    const btnCerrar = document.createElement('span');
    btnCerrar.textContent = '×'; 
    btnCerrar.classList.add('cerrar-modal');
    btnCerrar.addEventListener('click', cerrarModal);

    modalContent.appendChild(btnCerrar);
    modalContent.appendChild(img);
    modalContent.appendChild(nombre);
    modalContent.appendChild(descripcion);
    modalContent.appendChild(precio);
    modalContent.appendChild(btnAgregar);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
    modal.classList.add('mostrar');

    
}

function cerrarModal() {
    const modal = document.querySelector('.modal.mostrar');
    if (modal) modal.remove(); 
}
function ordenarYFiltrarProductos() {
    const categoria = document.getElementById('categorias').value;
    const orden = document.getElementById('ordenar').value;

    let productosFiltrados = productos.filter(p =>
        categoria === 'Todos' || p.categoría === categoria
    );

    if (orden === 'precio-asc') {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(productosFiltrados);
}


function abrirCarritoModal() {
    const modal = document.getElementById('carrito-modal');
    actualizarVistaModal(carrito);  
    modal.style.display = 'flex';
}

function cerrarCarritoModal() {
    const modal = document.getElementById('carrito-modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const categoriasSelect = document.getElementById('categorias');
    const ordenarSelect = document.getElementById('ordenar');
    categoriasSelect.addEventListener('change', ordenarYFiltrarProductos);
    ordenarSelect.addEventListener('change', ordenarYFiltrarProductos);

    const abrirCarritoBtn = document.getElementById('abrir-carrito');
    abrirCarritoBtn.addEventListener('click', abrirCarritoModal);

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    vaciarCarritoBtn.addEventListener('click', () => carrito.vaciarCarrito());

    const vaciarCarritoModalBtn = document.getElementById('vaciar-carrito-modal');
    vaciarCarritoModalBtn.addEventListener('click', () => carrito.vaciarCarrito());

    const cerrarCarritoModalBtn = document.getElementById('cerrar-carrito-modal');
    cerrarCarritoModalBtn.addEventListener('click', cerrarCarritoModal);

    cargarProductos();  
});