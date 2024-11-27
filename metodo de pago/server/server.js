import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

// Configuración del token directamente en el cliente
mercadopago.configurations.setAccessToken("APP_USR-5181144483191244-112522-0efaa87f0cd0094623fd5b1719dc6acf-2093424471");

const app = express();
const port = 8080;

// Middleware
// Habilitar CORS para tu frontend (ajusta el origen si es necesario)
app.use(cors({
  origin: "http://localhost:5173", // Cambia esto según tu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Funcionando en el puerto 8080 ''");
});

// Ruta para crear una preferencia
app.post("/create_preference", async (req, res) => {
  try {
    const { title, quantity, price } = req.body; // Recibiendo parámetros desde el frontend
    const preference = {
      items: [
        {
          title: title || "Producto Genérico",
          quantity: Number(quantity) || 1,
          unit_price: Number(price) || 1000,
          currency_id: "COP",
        },
      ],
      payer: {
        email: "test_user_925634084@testuser.com", // Email de prueba obligatorio
      },
      back_urls: {
        success: "https://planta-vida-git-develop-tatianiita2005gmailcoms-projects.vercel.app/",
        failure: "https://planta-vida-git-develop-tatianiita2005gmailcoms-projects.vercel.app/shopping-cart",
        pending: "https://planta-vida-git-develop-tatianiita2005gmailcoms-projects.vercel.app/shopping-cart",
      },
      auto_return: "approved",
    };

    // Crear preferencia en Mercado Pago
    const result = await mercadopago.preferences.create(preference);

    res.json({
      id: result.body.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear la preferencia :(",
    });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
