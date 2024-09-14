import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Configura Mercado Pago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

app.post('/crear_preferencia', async (req, res) => {
    try {
        const preference = new Preference(client);

        // Crea la preferencia de pago
        const response = await preference.create({
            body: {
                items: [{
                    title: 'Producto Test',
                    unit_price: 100,
                    quantity: 1,
                    currency_id: 'ARS',
                }],
                back_urls: {
                    success: 'http://localhost:3000/success',
                    failure: 'http://localhost:3000/failure',
                    pending: 'http://localhost:3000/pending'
                },
                auto_return: 'approved',
            }
        });

        console.log('Respuesta de Mercado Pago:', response);

        // Accede al `id` directamente desde `response`
        const preferenceId = response.id;

        if (preferenceId) {
            res.json({ id: preferenceId });
        } else {
            res.status(500).send('Error al obtener el ID de la preferencia');
        }
    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error.response ? error.response.data : error.message);
        res.status(500).send('Error al crear la preferencia de pago');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
