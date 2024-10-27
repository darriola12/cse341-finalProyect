
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoDb = require("../database/connection");
require("dotenv").config()


const register = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    
    const existingUser = await mongoDb
      .getDatabase()
      .collection("Users")
      .findOne({ userEmail });

    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    
    const newUser = {
      userName,
      userEmail,
      userPassword: hashedPassword,
    };

    await mongoDb.getDatabase().collection("Users").insertOne(newUser);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Ocurrió un error" });
  }
};



const login = async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body;
  
      // Buscar al usuario en la base de datos
      const user = await mongoDb
        .getDatabase()
        .collection("Users")
        .findOne({ userEmail });
  
      if (!user) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }
  
      // Comparar la contraseña
      const isMatch = await bcrypt.compare(userPassword, user.userPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }
  
      // Crear un token JWT
      const token = jwt.sign(
        { id: user._id, email: user.userEmail },
        process.env.ACCESS_TOKEN_SECRET, // Debes usar una clave secreta segura, preferiblemente en una variable de entorno
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message || "Ocurrió un error" });
    }
};


module.exports = {login, register}
