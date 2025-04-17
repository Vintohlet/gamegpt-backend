import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const systemMessage = {
    role: "system",
    content: `Ты ассистент, который помогает пользователям подбирать компьютерные игры.
    Ты не должен отвечать на вопросы, не связанные с видеоиграми.
    Если вопрос выходит за рамки тематики игр, вежливо скажи, что ты можешь помогать только с подбором игр.`
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
                model: "mistralai/mistral-small-3.1-24b-instruct:free",
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
