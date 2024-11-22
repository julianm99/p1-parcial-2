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
        actualizarVistaModal(); // Actualiza el modal después de cada cambio
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
        actualizarVistaModal()
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

    actualizarVista(){
        const contador = document.querySelector('#contador-productos');
        const total = document.querySelector('#total-precio');
        const totalProductos = this.productos.reduce((a, item) => a + item.cantidad, 0);
        const totalPrecio = this.productos.reduce((a, item) => a + item.precio * item.cantidad, 0);
        contador.textContent = totalProductos;
        total.textContent = `$${totalPrecio}`;
    }
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
    contenedor.innerHTML = '';
    listaProductos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto';
        tarjeta.innerHTML = `
            <img src='${producto.imagen}' alt='${producto.nombre}'>
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick='carrito.agregarProducto(${producto.id})'>Agregar al Carrito</button>
            <button onclick='carrito.eliminarProducto(${producto.id})'>Eliminar del Carrito</button>
            <button onclick='detalleModal(${producto.id})'>Ver Detalle</button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function detalleModal(id) {
    const producto = productos.find(p => p.id === id);
    const modal = document.createElement('div');
    modal.className = 'modal';

    const listado_descripciones = producto.descripcion.map(item =>`<li>${item}</li>`).join('');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="cerrarModal()">x</span>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <ul>${listado_descripciones}<ul>
            <p>Precio: $${producto.precio}</p>
            <button onclick="carrito.agregarProducto(${producto.id})">Agregar al Carrito</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
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
    const lista = document.getElementById('carrito-lista');
    const totalProductos = document.getElementById('modal-contador-productos');
    const totalPrecio = document.getElementById('modal-total-precio');

    // Limpiar contenido previo
    lista.innerHTML = '';

    // Llenar con los productos del carrito
    carrito.productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'producto-item';
        item.innerHTML = `
            <div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <strong>${producto.nombre}</strong>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Total: $${producto.precio * producto.cantidad}</p>
            </div>
            <div>
                <button onclick="carrito.eliminarProducto(${producto.id})">-</button>
                <button onclick="carrito.agregarProducto(${producto.id})">+</button>
            </div>
        `;
        lista.appendChild(item);
    });

    // Actualizar totales
    totalProductos.textContent = carrito.productos.reduce((a, item) => a + item.cantidad, 0);
    totalPrecio.textContent = `$${carrito.productos.reduce((a, item) => a + item.precio * item.cantidad, 0)}`;

    // Mostrar modal
    modal.style.display = 'flex';
}
function cerrarCarritoModal() {
    const modal = document.getElementById('carrito-modal');
    modal.style.display = 'none';
}
function actualizarVistaModal() {
    const modal = document.getElementById('carrito-modal');
    const lista = document.getElementById('carrito-lista');
    const totalProductos = document.getElementById('modal-contador-productos');
    const totalPrecio = document.getElementById('modal-total-precio');

    // Limpiar el contenido anterior
    lista.innerHTML = '';

    // Llenar el modal con los productos del carrito
    carrito.productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'producto-item';
        item.innerHTML = `
            <div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <strong>${producto.nombre}</strong>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Total: $${producto.precio * producto.cantidad}</p>
            </div>
            <div>
                <button onclick="carrito.eliminarProducto(${producto.id})">-</button>
                <button onclick="carrito.agregarProducto(${producto.id})">+</button>
            </div>
        `;
        lista.appendChild(item);
        
    });

    // Actualizar los totales
    totalProductos.textContent = carrito.productos.reduce((a, item) => a + item.cantidad, 0);
    totalPrecio.textContent = `$${carrito.productos.reduce((a, item) => a + item.precio * item.cantidad, 0)}`;

    // Si el carrito está vacío, cerramos el modal
    if (carrito.productos.length === 0) {
        cerrarCarritoModal();
    }
}


function abrirCarritoModal() {
    const modal = document.getElementById('carrito-modal');
    actualizarVistaModal();  // Actualiza el modal antes de mostrarlo
    modal.style.display = 'flex';
}


document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    document.getElementById('categorias').addEventListener('change', ordenarYFiltrarProductos);
    document.getElementById('ordenar').addEventListener('change', ordenarYFiltrarProductos);
});