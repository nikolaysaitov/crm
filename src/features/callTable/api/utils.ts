export const formatPhoneNumber = (phone: string) => {
  // Оставляем только цифры и символы '*'
  const cleaned = phone.replace(/[^0-9*]/g, "");

  // Форматируем с учетом возможных '*'
  return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
};

export const getRandomString = () => {
  const options = ["Google", "Yandex", "Rabota.ru", "Санкт-Петербург"];
  return options[Math.floor(Math.random() * options.length)];
};
