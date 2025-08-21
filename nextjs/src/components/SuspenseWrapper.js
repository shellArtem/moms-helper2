// src/components/SuspenseWrapper.js
'use client' // Этот компонент должен быть клиентским

import { Suspense } from 'react'

export function SuspenseWrapper({ children }) {
  // Вы можете добавить сюда любой fallback, например, спиннер
  return <Suspense fallback={null}>{children}</Suspense>
}