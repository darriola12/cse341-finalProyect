const mongoDb = require("../database/connection");
const { ObjectId } = require("mongodb");

// Obtener todos los pedidos
const getAllOrders = async (req, res) => {
    try {
        const orders = await mongoDb.getDatabase().collection("Order").find().toArray();
        console.log(orders);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un pedido por ID
const getOrderById = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const order = await mongoDb.getDatabase().collection("Order").findOne({ _id: orderId });
        
        if (!order) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear un nuevo pedido
const createOrder = async (req, res) => {
    const newOrder = {
        product: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price,
        userId: req.body.userId,
        created_at: new Date(),
        // Agrega otros campos necesarios para el pedido, como "status", "delivery_date", etc.
    };

    try {
        const response = await mongoDb.getDatabase().collection("Order").insertOne(newOrder);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Pedido creado exitosamente",
                orderId: response.insertedId
            });
        } else {
            res.status(500).json({ error: "Ocurrió un error al insertar los datos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Actualizar un pedido
const updateOrder = async (req, res) => {
    const orderId = new ObjectId(req.params.id);
    const updatedOrder = {
        product: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price,
        // Agrega otros campos que deseas actualizar
    };

    try {
        const response = await mongoDb.getDatabase().collection("Order").updateOne(
            { _id: orderId },
            { $set: updatedOrder }
        );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Pedido actualizado exitosamente", orderId });
        } else {
            res.status(404).json({ error: "Pedido no encontrado o no se realizaron cambios" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Eliminar un pedido
const deleteOrder = async (req, res) => {
    const orderId = new ObjectId(req.params.id);

    try {
        const response = await mongoDb.getDatabase().collection("Order").deleteOne({ _id: orderId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Pedido eliminado exitosamente", orderId });
        } else {
            res.status(404).json({ error: "Pedido no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
