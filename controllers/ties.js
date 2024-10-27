const mongoDb = require("../database/connection");
const { ObjectId } = require("mongodb");

// Obtener todas las corbatas
const getAllTies = async (req, res) => {
    try {
        const ties = await mongoDb.getDatabase().collection("Product").find().toArray();
        console.log(ties);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(ties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una corbata por ID
const getTieById = async (req, res) => {
    try {
        const tieId = new ObjectId(req.params.id);
        const tie = await mongoDb.getDatabase().collection("Product").findOne({ _id: tieId });
        
        if (!tie) {
            return res.status(404).json({ message: "Corbata no encontrada" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(tie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear una nueva corbata
const createTie = async (req, res) => {
    const newTie = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity || 0, // Si no se proporciona, se establece en 0
        created_at: new Date(),
        // Agrega otros campos necesarios para la corbata, como "color", "material", etc.
    };

    try {
        const response = await mongoDb.getDatabase().collection("Product").insertOne(newTie);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Corbata creada exitosamente",
                tieId: response.insertedId
            });
        } else {
            res.status(500).json({ error: "Ocurrió un error al insertar los datos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Actualizar una corbata
const updateTie = async (req, res) => {
    const tieId = new ObjectId(req.params.id);
    const updatedTie = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        // Agrega otros campos que deseas actualizar
    };

    try {
        const response = await mongoDb.getDatabase().collection("Product").updateOne(
            { _id: tieId },
            { $set: updatedTie }
        );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Corbata actualizada exitosamente", tieId });
        } else {
            res.status(404).json({ error: "Corbata no encontrada o no se realizaron cambios" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Eliminar una corbata
const deleteTie = async (req, res) => {
    const tieId = new ObjectId(req.params.id);

    try {
        const response = await mongoDb.getDatabase().collection("Product").deleteOne({ _id: tieId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Corbata eliminada exitosamente", tieId });
        } else {
            res.status(404).json({ error: "Corbata no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

module.exports = { getAllTies, getTieById, createTie, updateTie, deleteTie };
