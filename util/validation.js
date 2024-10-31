const { body, validationResult } = require("express-validator");

const validate = {};

// Reglas de validación para la colección de categorías
validate.categoryRules = () => {
    return [
        body("category")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Por favor proporciona el nombre de la categoría")
            .isLength({ min: 1 })
            .withMessage("El nombre de la categoría debe tener al menos 1 carácter"),

        body("initialQuantity")
            .isInt({ min: 0 })
            .withMessage("La cantidad inicial debe ser un número entero positivo"),

        body("availableStock")
            .isInt({ min: 0 })
            .withMessage("El stock disponible debe ser un número entero positivo")
            .custom((value, { req }) => {
                if (value > req.body.initialQuantity) {
                    throw new Error("El stock disponible no puede ser mayor que la cantidad inicial");
                }
                return true;
            }),

        body("productIds")
            .isArray({ min: 1 })
            .withMessage("Debes proporcionar al menos un ID de producto")
            .custom((ids) => {
                for (let id of ids) {
                    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
                        throw new Error("Cada ID de producto debe ser un ID de MongoDB válido");
                    }
                }
                return true;
            }),
    ];
};

// Reglas de validación para la colección de pedidos
validate.orderRules = () => {
    return [
        body("product")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("El producto es obligatorio")
            .isLength({ min: 1 })
            .withMessage("El nombre del producto debe tener al menos 1 carácter"),

        body("quantity")
            .isInt({ min: 1 })
            .withMessage("La cantidad debe ser un número entero positivo mayor a 0"),

        body("price")
            .isFloat({ min: 0 })
            .withMessage("El precio debe ser un número decimal positivo"),

        body("userId")
            .notEmpty()
            .withMessage("El ID del usuario es obligatorio")
            .matches(/^[a-fA-F0-9]{24}$/)
            .withMessage("El ID del usuario debe ser un ID de MongoDB válido"),
    ];
};


validate.tieRules = () => {
    return [
        body("name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("El nombre de la corbata es obligatorio")
            .isLength({ min: 1 })
            .withMessage("El nombre de la corbata debe tener al menos 1 carácter"),

        body("description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("La descripción de la corbata es obligatoria"),

        body("price")
            .isFloat({ min: 0 })
            .withMessage("El precio debe ser un número decimal positivo"),

        body("quantity")
            .optional() // Este campo es opcional
            .isInt({ min: 0 })
            .withMessage("La cantidad debe ser un número entero positivo o cero"),
    ];
};

validate.userRules = () => {
    return [
      body("userName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 1 })
        .withMessage("El nombre de usuario debe tener al menos 1 carácter"),
  
      body("userEmail")
        .trim()
        .escape()
        .isEmail()
        .withMessage("Debes proporcionar un correo electrónico válido")
        .normalizeEmail(),
  
      body("userPassword")
        .trim()
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
    ];
  };



// Middleware para manejar los errores de validación
validate.checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validate;


