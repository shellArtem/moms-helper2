import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Определяем путь к нашему JSON-файлу
const articlesFilePath = path.join(process.cwd(), 'data', 'articles.json');

// Хелпер для чтения статей
const readArticles = () => {
    const jsonData = fs.readFileSync(articlesFilePath, 'utf-8');
    return JSON.parse(jsonData);
};

// Хелпер для записи статей
const writeArticles = (data) => {
    const jsonData = JSON.stringify(data, null, 2); // null, 2 для красивого форматирования
    fs.writeFileSync(articlesFilePath, jsonData, 'utf-8');
};

// Функция для обработки POST-запроса (добавление нового комментария)
export async function POST(request) {
    try {
        const { name, comment, slug } = await request.json();

        if (!name || !comment || !slug) {
            return NextResponse.json({ error: 'Имя, комментарий и slug обязательны' }, { status: 400 });
        }

        const articles = readArticles();
        
        // Находим статью, к которой относится комментарий
        const articleIndex = articles.findIndex(article => article.slug === slug);

        if (articleIndex === -1) {
            return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
        }

        // Создаем новый комментарий
        const newComment = {
            id: crypto.randomUUID(), // Уникальный ID для ключа в React
            name: name,
            text: comment,
            createdAt: new Date().toISOString(),
            // Вы можете добавить поле "status": "pending" для модерации
        };

        // Добавляем комментарий в массив. Убедимся, что массив существует.
        if (!articles[articleIndex].comments) {
            articles[articleIndex].comments = [];
        }
        articles[articleIndex].comments.unshift(newComment); // unshift добавляет в начало

        // Перезаписываем весь файл с обновленными данными
        writeArticles(articles);

        return NextResponse.json(newComment, { status: 201 });

    } catch (error) {
        console.error("Ошибка при сохранении комментария:", error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}