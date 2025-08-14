// src/pages/admin/ArticleEditor.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './admin.css';

const API_URL = 'http://localhost:3001';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [article, setArticle] = useState({
    title: '', slug: '', category: 'pregnancy', image: '', excerpt: '', content: ''
  });

  // --- Состояния для кроппера ---
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef(null);

  // --- ИСПРАВЛЕННЫЙ useEffect ДЛЯ ЗАГРУЗКИ ДАННЫХ ---
  useEffect(() => {
    if (localStorage.getItem('isAdminAuth') !== 'true') {
      navigate('/admin');
    }
    if (isEditing) {
      // Запрашиваем одну конкретную статью, а не все
      axios.get(`${API_URL}/api/admin/articles/${id}`)
        .then(res => {
          setArticle(res.data);
        })
        .catch(err => console.error("Ошибка при загрузке статьи:", err));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  // --- Функции для работы с загрузкой и кропом изображения ---
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Сбрасываем кроп
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(String(reader.result));
        setIsCropping(true); // Показываем модальное окно/интерфейс кропа
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const aspect = 16 / 9;
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
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(completedCrop.width * scaleX);
    canvas.height = Math.floor(completedCrop.height * scaleY);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      canvas.width, canvas.height
    );

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'cropped-image.webp');
      try {
        const response = await axios.post(`${API_URL}/api/admin/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Обновляем поле image в нашей статье
        setArticle(prev => ({ ...prev, image: response.data.filePath }));
        setIsCropping(false); // Закрываем интерфейс кропа
        setImgSrc(''); // Очищаем источник
      } catch (error) {
        console.error('Ошибка при загрузке изображения', error);
      }
    }, 'image/webp');
  };

  // --- Обработчик отправки всей формы ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`${API_URL}/api/admin/articles/${id}`, article);
    } else {
      await axios.post(`${API_URL}/api/admin/articles`, article);
    }
    navigate('/admin/dashboard');
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

        {/* --- НОВЫЙ БЛОК ДЛЯ ЗАГРУЗКИ ИЗОБРАЖЕНИЯ --- */}
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
            <h3>Обрежьте изображение (5:1)</h3>
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