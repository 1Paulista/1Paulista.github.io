export const courses = [
  { id: 1, title: "HTML & CSS", category: "Фронтенд", level: "Початковий", duration: 6, teacher: "Максим Арзубов", img: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=600", status: "completed", description: "Основи веброзробки — від структури HTML до сучасних CSS технік. Навчишся верстати адаптивні сторінки з нуля." },
  { id: 2, title: "JavaScript", category: "Фронтенд", level: "Середній", duration: 8, teacher: "Ірина Піх", img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600", status: "active", description: "DOM маніпуляції, події, асинхронний JS, fetch API. Після курсу зможеш писати повноцінні інтерактивні вебдодатки." },
  { id: 3, title: "Python", category: "Бекенд", level: "Початковий", duration: 10, teacher: "Роман Мельник", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600", status: "active", description: "Синтаксис Python, структури даних, функції, ООП. Ідеальний старт для бекенд розробки та Data Science." },
  { id: 4, title: "React", category: "Фронтенд", level: "Просунутий", duration: 12, teacher: "Олена Сорока", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600", status: null, description: "Компоненти, хуки, стан, маршрутизація. Побудуй повноцінний SPA додаток з нуля використовуючи сучасний React." },
  { id: 5, title: "Node.js", category: "Бекенд", level: "Просунутий", duration: 10, teacher: "Василь Гречко", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600", status: null, description: "Серверна розробка на JavaScript. REST API, робота з базами даних, автентифікація, деплой." },
  { id: 6, title: "SQL", category: "Бази даних", level: "Середній", duration: 7, teacher: "Марія Коваль", img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600", status: null, description: "Проєктування баз даних, складні запити, JOIN, індекси, транзакції. Працюємо з PostgreSQL та MySQL." },
];

export const schedule = [
  { id: 1, course: "HTML & CSS", days: "Пн, Ср", time: "18:00", room: "Онлайн" },
  { id: 2, course: "JavaScript", days: "Вт, Чт", time: "17:00", room: "Онлайн" },
  { id: 3, course: "Python", days: "Пт, Сб", time: "16:00", room: "Аудиторія 3" },
  { id: 4, course: "React", days: "Пн, Пт", time: "19:00", room: "Онлайн" },
  { id: 5, course: "Node.js", days: "Ср, Сб", time: "10:00", room: "Аудиторія 1" },
  { id: 6, course: "SQL", days: "Вт, Чт", time: "20:00", room: "Онлайн" },
];

export const studentProgress = [
  { course: "HTML & CSS", percent: 100, status: "Завершено" },
  { course: "JavaScript", percent: 70, status: "В процесі" },
  { course: "Python", percent: 30, status: "В процесі" },
];