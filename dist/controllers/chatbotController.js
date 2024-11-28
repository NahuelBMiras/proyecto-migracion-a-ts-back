"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRecyclingQuestion = void 0;
const cohere_ai_1 = require("cohere-ai");
const question_json_1 = __importDefault(require("../utils/chatbot/question.json"));
const cohere = new cohere_ai_1.CohereClient({
    token: process.env.COHERE_API_KEY,
});
// Modificamos la firma para indicar que la función devuelve una Promise<void>
const handleRecyclingQuestion = async (req, res, next) => {
    try {
        const { question } = req.body;
        // Verificar la pregunta recibida
        console.log('Pregunta recibida:', question);
        const predefinedAnswer = question_json_1.default.find(q => question.toLowerCase().includes(q.question.toLowerCase()));
        if (predefinedAnswer) {
            res.json({ answer: predefinedAnswer.answer });
            return; // Finaliza la función aquí para evitar llamar a next()
        }
        // Consultar a Cohere sin historial
        const response = await cohere.chat({
            model: "command-r-plus-08-2024",
            message: question,
            preamble: "Eres un experto en reciclaje y el asistente oficial de nuestra aplicación 'Puntos Verdes'...",
            maxTokens: 150,
        });
        console.log('Respuesta de Cohere:', response);
        const aiResponse = response.text ? response.text.trim() : "No se pudo obtener una respuesta clara.";
        if (!aiResponse) {
            console.error('Error de Cohere: Respuesta vacía', response);
            res.status(500).json({ error: 'No se pudo obtener una respuesta de Cohere.', details: response });
            return;
        }
        res.json({ answer: aiResponse });
    }
    catch (error) {
        console.error('Error en el controlador:', error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
};
exports.handleRecyclingQuestion = handleRecyclingQuestion;
