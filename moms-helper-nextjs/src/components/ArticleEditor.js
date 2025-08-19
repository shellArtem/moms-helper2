// src/components/admin/ArticleEditor.tsx
'use client'; // Обязательная директива, так как мы используем хуки

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Аналог useNavigate
// import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
import '@/styles/admin.css'; // Убедитесь, что стили импортированы

// URL API из переменных окружения
const API_URL = 'http://localhost:3001';



const ArticleEditor = ({ articleId }) => {
    const router = useRouter();
    const isEditing = Boolean(articleId);

    const [article, setArticle] = useState({
        title: '', slug: '', category: 'pregnancy', image: '', excerpt: '', content: ''
    });

    // --- Состояния для кроппера ---
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            axios.get(`${API_URL}/api/admin/articles/${articleId}`)
                .then(res => {
                    setArticle(res.data);
                })
                .catch(err => console.error("Ошибка при загрузке статьи:", err));
        }
    }, [articleId, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    };

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(String(reader.result)));
            reader.readAsDataURL(e.target.files[0]);
            setIsCropping(true);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const aspect = 16 / 9; // Ваше соотношение
        const crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
            width, height
        );
        setCrop(crop);
    };

    const handleUploadCrop = async () => {
        if (!completedCrop || !imgRef.current) {
            return;
        }
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = Math.floor(completedCrop.width * scaleX);
        canvas.height = Math.floor(completedCrop.height * scaleY);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }
        ctx.drawImage(
            image,
            completedCrop.x * scaleX, completedCrop.y * scaleY,
            completedCrop.width * scaleX, completedCrop.height * scaleY,
            0, 0,
            canvas.width, canvas.height
        );

        canvas.toBlob(async (blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            const formData = new FormData();
            formData.append('image', blob, 'cropped-image.webp');
            try {
                const response = await axios.post(`${API_URL}/api/admin/upload-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setArticle(prev => ({ ...prev, image: response.data.filePath }));
                setIsCropping(false);
                setImgSrc('');
            } catch (error) {
                console.error('Ошибка при загрузке изображения', error);
            }
        }, 'image/webp');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await axios.put(`${API_URL}/api/admin/articles/${articleId}`, article);
        } else {
            await axios.post(`${API_URL}/api/admin/articles`, article);
        }
        router.push('/admin/dashboard');
    };

    return (
        <div className="admin-container">
            <h2>{isEditing ? 'Редактировать статью' : 'Создать новую статью'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <label>Заголовок:</label>
                <input name="title" value={article.title} onChange={handleChange} required />

                <label>URL (slug):</label>
                <input name="slug" value={article.slug} onChange={handleChange} required />

                <label>Категория:</label>
                <select name="category" value={article.category} onChange={handleChange}>
                    <option value="pregnancy">Беременность</option>
                    <option value="childbirth">Роды</option>
                    <option value="first-year">Первый год</option>
                    <option value="child-health">Здоровье ребенка</option>
                    <option value="child-development">Развитие ребенка</option>
                </select>

                <label>Изображение статьи:</label>
                <input type="file" accept="image/*" onChange={onSelectFile} />
                {article.image && !isCropping && (
                    <div style={{ marginTop: '10px' }}>
                        <p>Текущее изображение:</p>
                        <img src={`${API_URL}${article.image}`} alt="preview" style={{ maxWidth: '300px', border: '1px solid #ccc' }} />
                    </div>
                )}

                {isCropping && imgSrc && (
                    <div className="cropper-container">
                        <h3>Обрежьте изображение (16:9)</h3>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={16 / 9}
                        >
                            <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop me" />
                        </ReactCrop>
                        <button type="button" className="admin-button" onClick={handleUploadCrop}>Обрезать и загрузить</button>
                        <button type="button" className="admin-button delete" onClick={() => setIsCropping(false)}>Отмена</button>
                    </div>
                )}

                <label>Краткое описание (excerpt):</label>
                <textarea name="excerpt" value={article.excerpt} onChange={handleChange} required />

                <label>Полное содержание (HTML):</label>
                <textarea name="content" value={article.content} onChange={handleChange} required style={{ minHeight: '400px' }} />

                <button type="submit" className="admin-button">
                    {isEditing ? 'Сохранить изменения' : 'Опубликовать'}
                </button>
            </form>
        </div>
    );
};

export default ArticleEditor;