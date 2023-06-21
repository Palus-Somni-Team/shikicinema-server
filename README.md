# Shikicinema Server Monorepo

## Описание

Репозиторий с серверной и админской частью проекта Shikicinema.

### Пользовательское приложение

Если вы искали пользовательское приложение (расширение для браузера / мобильный и десктопный клиент), оно находится [здесь](https://github.com/Smarthard/shikicinema).

## Структура проекта

Инструкции по установке / сборке / деплою подпроектов находятся в соответсвующих директориях:

- Админка
- [Сервер](https://github.com/Palus-Somni-Team/shikicinema-server/tree/master/projects/backend)
- [@shikicinema/types](https://github.com/Palus-Somni-Team/shikicinema-server/tree/master/projects/lib/shikicinema)

### Краткое описание структуры
```
/
├─ projects/
│  ├─ backend/              -- сервер
│  │  ├─ package.json
│  ├─ lib/                  -- смежные зависимости
│  │  ├─ shikicinema/       -- пакет @shikicinema/types с типами и интерфейсами
│  │  │  ├─ package.json
│  ├─ frontend/
│  │  ├─ admin/             -- админка (WIP)
│  │  │  ├─ package.json
│  │  ├─ client/            -- пользовательский сайт (WIP)
│  │  │  ├─ package.json
.nvmrc                      -- рекомендуемая версия node для NVM
package.json
```

## Сборка

Все команды из корня монорепозитория

1. `npm i` для установки 
2. `npm run build` произведет сборку всего проекта, дальнейшие инструкции по деплою смотреть в подпроектах
3. (опционально) `npm t` для тестирования
