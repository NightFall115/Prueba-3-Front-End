import { addProduct, getProducts, updateProduct, deleteProduct, isProductUnique } from './firestore.js';

document.getElementById('inventory-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('id_producto').value;
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const precio = parseFloat(document.getElementById('precio').value);
    const fecha = document.getElementById('fecha').value;
    const descripción = document.getElementById('descripción').value;
    const estado = document.querySelector('input[name="estado"]:checked').value;

    if (!(await isProductUnique(nombre))) {
        Swal.fire('Error', 'El nombre del producto debe ser único.', 'error');
        return;
    }

    const producto = { nombre, categoria, cantidad, precio, fecha, descripción, estado };

    try {
        if (id) {
            await updateProduct(id, producto);
            Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
        } else {
            const newId = await addProduct(producto);
            Swal.fire('Éxito', 'Producto agregado con ID: ' + newId, 'success');
        }
        document.getElementById('inventory-form').reset();
        document.getElementById('id_producto').value = '';
        loadProducts();
    } catch (e) {
        Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
    }
});
async function loadProducts() {
    const tableBody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    try {
        const products = await getProducts();
        products.forEach(producto => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = producto.id;
            row.insertCell(1).textContent = producto.nombre;
            row.insertCell(2).textContent = producto.categoria;
            row.insertCell(3).textContent = producto.cantidad;
            row.insertCell(4).textContent = producto.precio.toFixed(2);
            row.insertCell(5).textContent = producto.fecha;
            row.insertCell(6).textContent = producto.descripción;
            row.insertCell(7).textContent = producto.estado;

            const actionsCell = row.insertCell(8);
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('btn', 'btn-warning', 'btn-sm');
            editButton.addEventListener('click', () => editProduct(producto.id));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.addEventListener('click', () => deleteProductHandler(producto.id));
            actionsCell.appendChild(deleteButton);
        });
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

async function editProduct(id) {
    const product = await getProducts().then(products => products.find(p => p.id === id));
    if (!product) return;

    document.getElementById('id_producto').value = id;
    document.getElementById('nombre').value = product.nombre;
    document.getElementById('categoria').value = product.categoria;
    document.getElementById('cantidad').value = product.cantidad;
    document.getElementById('precio').value = product.precio;
    document.getElementById('fecha').value = product.fecha;
    document.getElementById('descripción').value = product.descripción;
    document.querySelector(`input[name="estado"][value="${product.estado}"]`).checked = true;

    document.getElementById('inventory-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, {
                name: document.getElementById('nombre').value,
                category: document.getElementById('categoria').value,
                quantity: parseInt(document.getElementById('cantidad').value, 10),
                price: parseFloat(document.getElementById('precio').value),
                date: document.getElementById('fecha').value,
                description: document.getElementById('descripción').value,
                status: document.querySelector('input[name="estado"]:checked').value
            });
            Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
            loadProducts();
        } catch (e) {
            Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        }
    }, { once: true });
}

async function deleteProductHandler(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
        await deleteProduct(id);
        Swal.fire('Éxito', 'Producto eliminado con éxito', 'success');
        loadProducts();
    } catch (e) {
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
