export const CATEGORIES = [
  { name: 'Двигатель', image: '/images/categories/engine.png' },
  { name: 'Тормоза', image: '/images/categories/brakes.png' },
  { name: 'Подвеска', image: '/images/categories/suspension.png' },
  { name: 'Электрика', image: '/images/categories/electrics.png' },
  { name: 'Масла и жидкости', image: '/images/categories/oils.png' },
  { name: 'Фильтры', image: '/images/categories/filters.png' },
  { name: 'Аксессуары', image: '/images/categories/accessories.png' },
]

export const CARS = {
  Toyota: ['Camry', 'Land Cruiser', 'Corolla'],
  Honda: ['Civic', 'CR-V', 'Fit'],
  'Mercedes-Benz': ['E-Class', 'Sprinter'],
  Lexus: ['RX 350', 'LX 570'],
}

// fits: '*' — универсальная деталь, иначе список "Марка Модель"
export const PRODUCTS = [
  { id: 1, image: '/images/products/brake-pads.jpg', description: 'Керамические передние тормозные колодки: тихая работа, мало пыли и стабильное торможение.', name: 'Тормозные колодки передние', article: 'BR-4412', brand: 'Brembo', category: 'Тормоза', price: 4200, rating: 4.8, seller: 'Автодеталь Плюс', stock: 12, fits: ['Toyota Camry', 'Toyota Corolla', 'Lexus RX 350'], specs: { Позиция: 'Передняя ось', Материал: 'Керамика', Гарантия: '12 месяцев' } },
  { id: 2, image: '/images/products/brake-disc.jpg', description: 'Вентилируемый тормозной диск с антикоррозийным покрытием. Хорошее охлаждение и долгий срок службы.', name: 'Тормозной диск вентилируемый', article: 'BD-2207', brand: 'ATE', category: 'Тормоза', price: 5900, rating: 4.7, seller: 'Garage 24', stock: 6, fits: ['Honda Civic', 'Honda CR-V'], specs: { Диаметр: '300 мм', Тип: 'Вентилируемый', Гарантия: '12 месяцев' } },
  { id: 3, image: '/images/products/oil-filter.jpg', description: 'Масляный фильтр с высокой степенью очистки. Защищает двигатель от износа.', name: 'Масляный фильтр', article: 'OF-1180', brand: 'Mann', category: 'Фильтры', price: 650, rating: 4.9, seller: 'Автодеталь Плюс', stock: 40, fits: ['*'], specs: { Тип: 'Накручиваемый', Страна: 'Германия' } },
  { id: 4, image: '/images/products/air-filter.jpg', description: 'Панельный воздушный фильтр: чистый воздух для двигателя и экономичный расход топлива.', name: 'Воздушный фильтр', article: 'AF-3321', brand: 'Bosch', category: 'Фильтры', price: 900, rating: 4.6, seller: 'Garage 24', stock: 25, fits: ['Toyota Camry', 'Lexus RX 350'], specs: { Тип: 'Панельный', Страна: 'Венгрия' } },
  { id: 5, image: '/images/products/engine-oil.jpg', description: 'Синтетическое моторное масло 5W-30 для бензиновых и дизельных двигателей. Канистра 4 литра.', name: 'Моторное масло 5W-30, 4 л', article: 'OL-5304', brand: 'Castrol', category: 'Масла и жидкости', price: 3800, rating: 4.9, seller: 'Масла KG', stock: 30, fits: ['*'], specs: { Вязкость: '5W-30', Объём: '4 л', Тип: 'Синтетика' } },
  { id: 6, image: '/images/products/shock-absorber.jpg', description: 'Газомасляный передний амортизатор для комфортной и устойчивой езды.', name: 'Амортизатор передний', article: 'SH-7710', brand: 'Sachs', category: 'Подвеска', price: 7400, rating: 4.5, seller: 'Garage 24', stock: 8, fits: ['Toyota Land Cruiser', 'Lexus LX 570'], specs: { Позиция: 'Передний', Тип: 'Газомасляный', Гарантия: '24 месяца' } },
  { id: 7, image: '/images/products/spark-plugs.jpg', description: 'Комплект иридиевых свечей зажигания: уверенный запуск и долгий ресурс.', name: 'Свечи зажигания, комплект 4 шт', article: 'SP-0904', brand: 'NGK', category: 'Двигатель', price: 1800, rating: 4.8, seller: 'Автодеталь Плюс', stock: 20, fits: ['Honda Civic', 'Honda Fit', 'Toyota Corolla'], specs: { Тип: 'Иридиевые', Количество: '4 шт' } },
  { id: 8, image: '/images/products/battery.jpg', description: 'Аккумулятор 60 Ач с высоким пусковым током для надёжного запуска в мороз.', name: 'Аккумулятор 60 Ач', article: 'AK-6012', brand: 'Varta', category: 'Электрика', price: 8900, rating: 4.7, seller: 'Электро Центр', stock: 5, fits: ['*'], specs: { Ёмкость: '60 Ач', Пусковой_ток: '540 А', Гарантия: '24 месяца' } },
]

export const money = (n) => n.toLocaleString('ru-RU') + ' сом'
