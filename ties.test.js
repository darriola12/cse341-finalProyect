const mongoDb = require("./database/connection");
const tieController = require("./controllers/ties");
const { ObjectId } = require("mongodb");

// Mock de la base de datos
jest.mock("./database/connection");

describe("Endpoints GET de corbatas", () => {
    beforeEach(() => {
        mongoDb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue(["corbata1", "corbata2"]),
                }),
                findOne: jest.fn().mockResolvedValue({ name: "corbata1" }),
            }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /products - Obtener todas las corbatas", async () => {
        const req = {};
        const res = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await tieController.getAllTies(req, res);

        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(["corbata1", "corbata2"]);
    });

    test("GET /products/:id - Obtener una corbata por ID (éxito)", async () => {
        const req = { params: { id: new ObjectId().toString() } };
        const res = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await tieController.getTieById(req, res);

        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ name: "corbata1" });
    });

    test("GET /products/:id - Obtener una corbata por ID (no encontrada)", async () => {
        const req = { params: { id: new ObjectId().toString() } };
        const res = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Simular que la corbata no se encuentra en la base de datos
        mongoDb.getDatabase().collection().findOne.mockResolvedValue(null);

        await tieController.getTieById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Corbata no encontrada" });
    });

    test("GET /products - Error en el servidor al obtener todas las corbatas", async () => {
        const req = {};
        const res = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Simular un error de base de datos
        mongoDb.getDatabase().collection().find.mockImplementation(() => {
            throw new Error("Error en la base de datos");
        });

        await tieController.getAllTies(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error interno del servidor" });
    });
});
