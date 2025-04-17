import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const systemMessage = {
    role: "system",
    content: `Ты — дружелюбный и информированный ассистент, специализирующийся на видеоиграх. Твоя задача — давать полезные, понятные и честные рекомендации по играм.
ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО на русском языке, без вставок иностранных слов или символов.
2. Следи за логикой изложения и грамматикой.
3. Используй только существующие термины из игровой индустрии.
4. Не создавай несуществующие игровые механики или функции.
5. Избегай фантазийных или бессмысленных окончаний в сообщениях.
6. Давай четкие, структурированные сравнения при необходимости.
Ты можешь:
- Объяснять различия между играми одного жанра
- Подсказывать игры на основе предпочтений пользователя
- Сравнивать игры по механикам, графике, геймплею и другим критериям
- Давать информацию о жанрах и особенностях игр

Если пользователь задаёт вопрос вне тематики видеоигр — вежливо объясни, что ты специализируешься только на играх.

Перед отправкой ответа проверь, что текст:
- Полностью на русском языке
- Логически связный и последовательный
- Содержит только достоверную информацию об играх
- Не содержит странных фраз или бессмысленных конструкций`
};

export const sendToLLM = async (messages) => {
    try {
        const formattedMessages = [];
        
        formattedMessages.push(systemMessage);
        
        for (const msg of messages) {
            formattedMessages.push({
                role: msg.sender === "assistant" ? "assistant" : "user",
                content: msg.text || msg 
            });
        }
        console.log("Отправляемые сообщения в LLM:", JSON.stringify(formattedMessages, null, 2));
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
                messages: formattedMessages,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API вернул ошибку ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.log("Полученные данные от LLM:", JSON.stringify(data, null, 2));

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const content = data.choices[0].message.content || "Извините, произошла проблема при формировании ответа. Попробуйте задать вопрос другим способом или выбрать другую игровую тему.";
            return content;
        } else {
            console.error("Неожиданная структура ответа:", JSON.stringify(data));
            return "Извините, не удалось получить подходящий ответ. Пожалуйста, попробуйте еще раз.";
        }
    } catch (error) {
        console.error("Ошибка при вызове LLM:", error);
        throw error;
    }
};
