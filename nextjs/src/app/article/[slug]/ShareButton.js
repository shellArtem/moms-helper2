"use client";

import { useState, useEffect } from "react";
import styles from "./ShareButton.module.css";

export default function ShareButton() {
    const [menuOpen, setMenuOpen] = useState(false);


    const [shareLinks, setShareLinks] = useState({
        telegram: "",
        vk: "",
    });

    useEffect(() => {
        // Этот код выполнится только один раз на клиенте, когда компонент будет готов
        const currentUrl = window.location.href;
        const currentTitle = document.title;

        setShareLinks({
            telegram: `https://t.me/share/url?url=${encodeURIComponent(
                currentUrl
            )}&text=${encodeURIComponent(currentTitle)}`,
            vk: `https://vk.com/share.php?url=${encodeURIComponent(
                currentUrl
            )}&title=${encodeURIComponent(currentTitle)}`,
        });
    }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз после монтирования

    const handleShare = async () => {
        const url = window.location.href; // Это безопасно, т.к. вызывается по клику

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: "Посмотри эту статью 👇",
                    url,
                });
                return;
            } catch (err) {
                console.error("Ошибка при шаринге:", err);
            }
        }
        setMenuOpen((prev) => !prev);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        alert("Ссылка скопирована!");
        setMenuOpen(false);
    };


    return (
        <div className={styles["share-wrapper"]}>
            <button className={styles["share-button"]} onClick={handleShare}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span className={styles["share-text"]}>Поделиться</span>
            </button>

            {menuOpen && (
                <div className={styles["share-menu"]}>
                    <a
                        href={shareLinks.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        В Telegram
                    </a>
                    <a href={shareLinks.vk} target="_blank" rel="noopener noreferrer">
                        ВКонтакте
                    </a>
                    <button onClick={handleCopy}>Скопировать ссылку</button>
                </div>
            )}
        </div>
    );
}
