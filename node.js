const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Reemplaza con tu Access Token de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'TU_ACCESS_TOKEN_TEST' });

app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const body = {
            items: req.body.items.map(i => ({
                title: i.name,
                unit_price: Number(i.price),
                quantity: 1,
                currency_id: 'USD'
            })),
            back_urls: {
                success: "http://localhost:5500/index.html",
                failure: "http://localhost:5500/index.html"
            },
            auto_return: "approved",
        };

        const result = await preference.create({ body });
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al generar el pago" });
    }
});

app.listen(3000, () => console.log("Servidor iniciado en puerto 3000"));