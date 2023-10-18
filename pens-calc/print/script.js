document.addEventListener("DOMContentLoaded", function() {
    const currentDate = new Date(); // Получаем текущую дату
    currentDate.setDate(currentDate.getDate()); // Увеличиваем дату на 1 день, например

    const day = currentDate.getDate(); // Получаем день
    const month = currentDate.getMonth() + 1; // Получаем месяц (месяцы начинаются с 0, поэтому добавляем 1)
    const year = currentDate.getFullYear(); // Получаем год

    function getMonthName(monthNumber) {
        const months = [
            '', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        return months[monthNumber];
    }
    
    // Формируем текст
    const outputText = `Ориентировочный расчёт на ${day} ${getMonthName(month)} ${year} г.`;

    // Вставляем текст в элемент с идентификатором "calculatedDate"
    document.getElementById("calculatedDate").textContent = outputText;
});
