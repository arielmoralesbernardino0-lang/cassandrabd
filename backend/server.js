const express = require("express");
const cors = require("cors");
const cassandra = require("cassandra-driver");

const app = express();
app.use(cors());
app.use(express.json());

const client = new cassandra.Client({
    contactPoints: ["localhost"], // o la IP de WSL
    localDataCenter: "datacenter1",
    keyspace: "tienda"
});


app.get("/productos", async (req, res) => {
    const result = await client.execute("SELECT * FROM productos");
    res.json(result.rows);
});

app.post("/productos", async (req, res) => {
    const { nombre, precio, stock } = req.body;
    const query = "INSERT INTO productos (id, nombre, precio, stock) VALUES (uuid(), ?, ?, ?);";
    await client.execute(query, [nombre, precio, stock], { prepare: true });
    res.json({ mensaje: "Producto agregado" });
});

app.put("/productos/:id", async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    const query = "UPDATE productos SET stock = ? WHERE id = ?;";
    await client.execute(query, [stock, id], { prepare: true });
    res.json({ mensaje: "Producto actualizado" });
});

app.delete("/productos/:id", async (req, res) => {
    const { id } = req.params;
    await client.execute("DELETE FROM productos WHERE id = ?;", [id], { prepare: true });
    res.json({ mensaje: "Producto eliminado" });
});

app.listen(3000, () => console.log("Backend en http://localhost:3000"));
