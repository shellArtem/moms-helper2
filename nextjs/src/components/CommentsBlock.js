'use client';

import { useState } from 'react';
import styles from './CommentsBlock.module.css'; // Создайте этот CSS-модуль

export default function CommentsBlock({ articleSlug, initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !commentText.trim()) {
            setError('Имя и комментарий не могут быть пустыми.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, comment: commentText, slug: articleSlug }),
            });

            if (!response.ok) {
                throw new Error('Не удалось отправить комментарий. Попробуйте позже.');
            }

            const newComment = await response.json();

            // Оптимистичное обновление UI: добавляем коммент сразу
            setComments(prevComments => [newComment, ...prevComments]);
            setName('');
            setCommentText('');
            setSuccess('Спасибо за Ваш комментарий.');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.commentsSection}>
            <h2>Комментарии ({comments.length})</h2>
            
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                <h3>Оставить комментарий</h3>
                {success && <p className={styles.success}>{success}</p>}
                
                <div className={styles.formGroup}>
                    <label htmlFor="name">Ваше имя:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="comment">Ваш комментарий:</label>
                    <textarea id="comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} rows="5" required />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
            </form>

            <div className={styles.commentList}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <p className={styles.commentAuthor}>{comment.name}</p>
                            <p className={styles.commentText}>{comment.text}</p>
                            <p className={styles.commentDate}>
                                {new Date(comment.createdAt).toLocaleString('ru-RU')}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Комментариев пока нет. Будьте первым!</p>
                )}
            </div>
        </section>
    );
}