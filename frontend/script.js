const API = "http://localhost:3000/productos";

async function cargarDatos() {
    const res = await fetch(API);
    const data = await res.json();

    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    data.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                    <input type="number" value="${p.stock}" id="stock-${p.id}" class="form-control">
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="actualizar('${p.id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminar('${p.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function crearProducto() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, stock })
    });

    cargarDatos();
}

async function actualizar(id) {
    const stock = document.getElementById(`stock-${id}`).value;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock })
    });

    cargarDatos();
}

async function eliminar(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargarDatos();
}

cargarDatos();
