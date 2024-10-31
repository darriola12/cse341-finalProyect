const mongoDb = require("../database/connection");
const { ObjectId } = require("mongodb");

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
    try {
        const categories = await mongoDb.getDatabase().collection("Category").find().toArray();
        console.log(categories);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res) => {
    try {
        const categoryId = new ObjectId(req.params.id);
        const category = await mongoDb.getDatabase().collection("Category").findOne({ _id: categoryId });
        
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
    const newCategory = {
        category: req.body.category,
        initialQuantity: req.body.initialQuantity,
        availableStock: req.body.availableStock,
        productIds: req.body.productIds.map(id => new ObjectId(id)),
        // Agrega otros campos necesarios para la categoría
    };

    try {
        const response = await mongoDb.getDatabase().collection("Category").insertOne(newCategory);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Categoría creada exitosamente",
                categoryId: response.insertedId
            });
        } else {
            res.status(500).json({ error: "Ocurrió un error al insertar los datos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Actualizar una categoría
const updateCategory = async (req, res) => {
    const categoryId = new ObjectId(req.params.id);
    const updatedCategory = {
        category: req.body.category,
        initialQuantity: req.body.initialQuantity,
        availableStock: req.body.availableStock,
        productIds: req.body.productIds.map(id => new ObjectId(id)),
        // Agrega otros campos que deseas actualizar
    };

    try {
        const response = await mongoDb.getDatabase().collection("Category").updateOne(
            { _id: categoryId },
            { $set: updatedCategory }
        );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Categoría actualizada exitosamente", categoryId });
        } else {
            res.status(404).json({ error: "Categoría no encontrada o no se realizaron cambios" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    const categoryId = new ObjectId(req.params.id);

    try {
        const response = await mongoDb.getDatabase().collection("Category").deleteOne({ _id: categoryId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Categoría eliminada exitosamente", categoryId });
        } else {
            res.status(404).json({ error: "Categoría no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
