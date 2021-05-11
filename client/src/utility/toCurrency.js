export const toCurrency = (text) =>
    new Intl.NumberFormat('ru-RU', {
        currency: 'kzt',
        style: 'currency',
    }).format(text)
