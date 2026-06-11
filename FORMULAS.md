# Coffee Profi — Математические формулы и вычисления

Этот документ описывает всю математику приложения: откуда берётся каждое число, как работают формулы и что происходит при изменении параметров.

---

## Входные данные

Приложение принимает два вида входных данных:

### Постоянные расходы (Fixed Costs) — в месяц

| Параметр | Переменная | Дефолт |
|---|---|---|
| Аренда | `rent` | $5 000 |
| Зарплаты | `salaries` | $8 000 |
| Коммунальные услуги | `utilities` | $800 |
| Амортизация оборудования | `equipmentAmortization` | $600 |
| Маркетинг | `marketing` | $400 |
| **Итого** | | **$14 800** |

### Продукты меню (Products)

Каждый продукт описывается тремя числами:

| Параметр | Описание |
|---|---|
| `pricePerUnit` | Цена продажи одной единицы ($) |
| `variableCostPerUnit` | Себестоимость одной единицы ($) — сырьё, упаковка |
| `unitsPerDay` | Сколько единиц продаётся в день |

Дефолтное меню:

| Продукт | Цена | Себестоимость | Продаж/день |
|---|---|---|---|
| Coffee | $6.00 | $1.25 | 60 |
| Tea | $4.50 | $0.60 | 25 |
| Dessert | $5.00 | $1.80 | 15 |
| **Итого** | — | — | **100** |

---

## Блок 1 — Базовые агрегаты

### Суммарные продажи в день

```
totalUnitsPerDay = Σ product.unitsPerDay
```

**Пример:** 60 + 25 + 15 = **100 units/day**

---

### Дневные постоянные расходы

Постоянные расходы задаются в месяц, поэтому делим на 30:

```
dailyFixedCosts = (rent + salaries + utilities + equipmentAmortization + marketing) / 30
```

**Пример:** (5000 + 8000 + 800 + 600 + 400) / 30 = 14 800 / 30 = **$493.33/день**

> Почему 30, а не 365/12 = 30.42? Упрощение для интуитивности. Месяц = 30 рабочих дней — привычная единица для малого бизнеса.

---

## Блок 2 — Смешанные (blended) показатели

Когда в меню несколько продуктов с разными ценами и себестоимостями, нам нужны **усреднённые** значения, взвешенные по доле продаж каждого продукта.

### Вес продукта в общих продажах

```
weight(i) = unitsPerDay(i) / totalUnitsPerDay
```

**Пример:**
- Coffee: 60 / 100 = **0.60** (60%)
- Tea: 25 / 100 = **0.25** (25%)
- Dessert: 15 / 100 = **0.15** (15%)

---

### Смешанная цена (Blended Revenue per unit)

Средневзвешенная цена одной проданной единицы:

```
blendedRevenue = Σ ( weight(i) × price(i) )
               = Σ ( unitsPerDay(i) / totalUnitsPerDay × pricePerUnit(i) )
```

**Пример:**
```
blendedRevenue = 0.60 × $6.00 + 0.25 × $4.50 + 0.15 × $5.00
              = $3.60 + $1.125 + $0.75
              = $5.475 / unit
```

---

### Смешанная себестоимость (Blended Variable Cost per unit)

Аналогично — средневзвешенная переменная стоимость:

```
blendedVariableCost = Σ ( weight(i) × variableCost(i) )
```

**Пример:**
```
blendedVariableCost = 0.60 × $1.25 + 0.25 × $0.60 + 0.15 × $1.80
                    = $0.75 + $0.15 + $0.27
                    = $1.17 / unit
```

---

### Смешанная маржа (Blended Margin per unit)

Сколько денег остаётся с каждой проданной единицы после оплаты переменных расходов:

```
blendedMargin = blendedRevenue − blendedVariableCost
```

**Пример:** $5.475 − $1.17 = **$4.305 / unit**

Именно эта маржа «гасит» постоянные расходы с каждой продажей.

---

## Блок 3 — Точка безубыточности (Break-Even)

### Логика

Каждая проданная единица даёт `blendedMargin` долларов на покрытие постоянных расходов. Точка безубыточности — это момент, когда накопленная маржа равна дневным постоянным расходам.

### Формула

```
breakEvenUnitsPerDay = dailyFixedCosts / blendedMargin
```

**Пример:**
```
breakEvenUnitsPerDay = $493.33 / $4.305 = 114.6 → ceil → 115 units/day
```

Функция возвращает `Math.ceil` (округление вверх) — нельзя продать 114.6 единиц, нужно минимум 115.

```
breakEvenUnitsPerMonth = ceil(breakEvenUnitsPerDay × 30)
                       = ceil(114.6 × 30) = ceil(3438) = 3438 units/month
```

### Граничный случай

Если `blendedMargin ≤ 0` (цена ≤ себестоимости) — точка безубыточности равна `Infinity`. Продавать в убыток нельзя покрыть постоянные расходы никаким объёмом продаж.

---

## Блок 4 — P&L (Отчёт о прибылях и убытках)

P&L рассчитывается в месячном разрезе.

### Выручка (Revenue)

На уровне каждого продукта:

```
monthlyRevenue(i) = pricePerUnit(i) × unitsPerDay(i) × 30
```

Суммарная выручка:

```
totalMonthlyRevenue = Σ monthlyRevenue(i)
```

**Пример:**
```
Coffee:  $6.00 × 60 × 30 = $10 800
Tea:     $4.50 × 25 × 30 =  $3 375
Dessert: $5.00 × 15 × 30 =  $2 250
──────────────────────────────────
Total:                      $16 425
```

---

### Переменные расходы (Variable Costs)

На уровне каждого продукта:

```
monthlyVariableCost(i) = variableCostPerUnit(i) × unitsPerDay(i) × 30
```

Суммарные переменные расходы:

```
totalMonthlyVariableCosts = Σ monthlyVariableCost(i)
```

**Пример:**
```
Coffee:  $1.25 × 60 × 30 = $2 250
Tea:     $0.60 × 25 × 30 =   $450
Dessert: $1.80 × 15 × 30 =   $810
──────────────────────────────────
Total:                       $3 510
```

---

### Валовая прибыль (Gross Profit)

```
grossProfit = totalMonthlyRevenue − totalMonthlyVariableCosts
```

**Пример:** $16 425 − $3 510 = **$12 915**

```
grossMarginPct = (grossProfit / totalMonthlyRevenue) × 100
```

**Пример:** (12 915 / 16 425) × 100 = **78.6%**

Валовая маржа показывает, какая доля выручки остаётся после оплаты сырья и прямых расходов — **до** постоянных расходов.

---

### Постоянные расходы (Fixed Costs)

```
monthlyFixedCosts = rent + salaries + utilities + equipmentAmortization + marketing
```

**Пример:** 5000 + 8000 + 800 + 600 + 400 = **$14 800**

---

### Чистая прибыль / убыток (Net Profit)

```
netProfit = grossProfit − monthlyFixedCosts
```

**Пример:** $12 915 − $14 800 = **−$1 885** (убыток)

```
netMarginPct = (netProfit / totalMonthlyRevenue) × 100
```

**Пример:** (−1 885 / 16 425) × 100 = **−11.5%**

---

## Блок 5 — Данные для графика

График строит кривые Revenue и Total Costs в зависимости от **гипотетического** числа проданных единиц (от 0 до maxUnits). Это не сценарий — это геометрическое построение для нахождения точки пересечения.

### Диапазон оси X

```
maxUnits = max(200, ceil(max(breakEvenUnitsPerDay, currentUnitsPerDay) × 1.8))
```

График всегда показывает точку безубыточности плюс ~80% запаса, но не менее 200 единиц.

### Шаг (step)

```
step = max(1, floor(maxUnits / 50))
```

Фиксированное количество точек ~50 штук независимо от масштаба, чтобы график был плавным.

### Для каждой точки X (units)

```
revenue(units)    = units × blendedRevenue
totalCosts(units) = dailyFixedCosts + units × blendedVariableCost
fixedCosts(units) = dailyFixedCosts  (горизонтальная линия)
```

**Пересечение** `revenue = totalCosts` — и есть точка безубыточности:

```
units × blendedRevenue = dailyFixedCosts + units × blendedVariableCost
units × (blendedRevenue − blendedVariableCost) = dailyFixedCosts
units × blendedMargin = dailyFixedCosts
units = dailyFixedCosts / blendedMargin   ← это и есть breakEvenUnitsPerDay
```

---

## Блок 6 — Сценарный анализ ("What if")

Сценарный анализ применяет **мультипликатор** к `unitsPerDay` каждого продукта и пересчитывает P&L. Постоянные расходы при этом не меняются (они постоянные).

```
scenarioUnitsPerDay(i) = unitsPerDay(i) × multiplier
```

Затем весь P&L (Блок 4) считается заново с масштабированными продуктами.

### Пресеты

| Кнопка | Мультипликатор | Смысл |
|---|---|---|
| Pessimistic | 0.70 | Продаём 70% от плана |
| Base | 1.00 | Текущий план |
| Optimistic | 1.50 | Продаём в 1.5 раза больше |

### Дельта к базе

```
delta = scenarioNetProfit − baseNetProfit
```

Показывает на сколько больше/меньше прибыли по сравнению с базовым сценарием.

---

## Сводная таблица всех формул

| Формула | Назначение |
|---|---|
| `Σ costs / 30` | Дневные постоянные расходы |
| `Σ unitsPerDay(i)` | Суммарные продажи/день |
| `Σ (units(i)/total × price(i))` | Blended цена за единицу |
| `Σ (units(i)/total × varCost(i))` | Blended себестоимость за единицу |
| `blendedRevenue − blendedVarCost` | Blended маржа за единицу |
| `dailyFixed / blendedMargin` | **Точка безубыточности (units/day)** |
| `price(i) × units(i) × 30` | Месячная выручка по продукту |
| `varCost(i) × units(i) × 30` | Месячные перем. расходы по продукту |
| `totalRevenue − totalVarCosts` | Валовая прибыль |
| `grossProfit − fixedCosts` | **Чистая прибыль/убыток** |
| `(netProfit / revenue) × 100` | Чистая маржа % |
| `units(i) × multiplier` | Сценарный объём продаж |
