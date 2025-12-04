import React, { useEffect, useState } from 'react';
import './Holidays.css';

// Типы
interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  types?: string[];
}

interface CountryMap {
  [code: string]: string;
}

// Все страны
const countries: CountryMap = {
  AD: 'Андорра', AL: 'Албания', AM: 'Армения', AR: 'Аргентина', AT: 'Австрия', AU: 'Австралия',
  AX: 'Аландские острова', BA: 'Босния и Герцеговина', BB: 'Барбадос', BE: 'Бельгия', BG: 'Болгария',
  BJ: 'Бенин', BO: 'Боливия', BR: 'Бразилия', BS: 'Багамы', BW: 'Ботсвана', BY: 'Беларусь', BZ: 'Белиз',
  CA: 'Канада', CD: 'ДР Конго', CG: 'Конго', CH: 'Швейцария', CL: 'Чили', CN: 'Китай', CO: 'Колумбия',
  CR: 'Коста-Рика', CU: 'Куба', CY: 'Кипр', CZ: 'Чехия', DE: 'Германия', DK: 'Дания', DO: 'Доминиканская Республика',
  EC: 'Эквадор', EE: 'Эстония', EG: 'Египет', ES: 'Испания', FI: 'Финляндия', FO: 'Фарерские острова',
  FR: 'Франция', GA: 'Габон', GB: 'Великобритания', GD: 'Гренада', GE: 'Грузия', GG: 'Гернси', GI: 'Гибралтар',
  GL: 'Гренландия', GM: 'Гамбия', GR: 'Греция', GT: 'Гватемала', GY: 'Гайана', HK: 'Гонконг', HN: 'Гондурас',
  HR: 'Хорватия', HT: 'Гаити', HU: 'Венгрия', ID: 'Индонезия', IE: 'Ирландия', IM: 'Остров Мэн', IS: 'Исландия',
  IT: 'Италия', JE: 'Джерси', JM: 'Ямайка', JP: 'Япония', KE: 'Кения', KR: 'Южная Корея', KZ: 'Казахстан',
  LI: 'Лихтенштейн', LS: 'Лесото', LT: 'Литва', LU: 'Люксембург', LV: 'Латвия', MA: 'Марокко', MC: 'Монако',
  MD: 'Молдова', ME: 'Черногория', MG: 'Мадагаскар', MK: 'Северная Македония', MN: 'Монголия', MS: 'Монтсеррат',
  MT: 'Мальта', MX: 'Мексика', MZ: 'Мозамбик', NA: 'Намибия', NE: 'Нигер', NG: 'Нигерия', NI: 'Никарагуа',
  NL: 'Нидерланды', NO: 'Норвегия', NZ: 'Новая Зеландия', PA: 'Панама', PE: 'Перу', PG: 'Папуа-Новая Гвинея',
  PH: 'Филиппины', PL: 'Польша', PR: 'Пуэрто-Рико', PT: 'Португалия', PY: 'Парагвай', RO: 'Румыния', RS: 'Сербия',
  RU: 'Россия', SE: 'Швеция', SG: 'Сингапур', SI: 'Словения', SJ: 'Шпицберген и Ян-Майен', SK: 'Словакия',
  SM: 'Сан-Марино', SR: 'Суринам', SV: 'Сальвадор', TN: 'Тунис', TR: 'Турция', UA: 'Украина', US: 'США',
  UY: 'Уругвай', VA: 'Ватикан', VE: 'Венесуэла', VN: 'Вьетнам', ZA: 'Южная Африка', ZW: 'Зимбабве'
};

const API_BASE = 'https://date.nager.at/api/v3';

// API функция
async function getHolidays(year: number | string, countryCode: string): Promise<Holiday[]> {
  const res = await fetch(`${API_BASE}/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
  return res.json();
}

// Формат даты
function formatDate(dateString: string) {
  const [y, m, d] = dateString.split('-');
  const date = new Date(`${y}-${m}-${d}T00:00:00`);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Компонент
const Holidays: React.FC = () => {
  const [todayHolidays, setTodayHolidays] = useState<Holiday[]>([]);
  const [searchDate, setSearchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['RU']);
  const [searchResults, setSearchResults] = useState<Holiday[]>([]);
  const [loadingToday, setLoadingToday] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // <-- новое состояние для ошибок

  // Праздники сегодня
  useEffect(() => {
    async function loadToday() {
      try {
        const year = new Date().getFullYear();
        const holidays = await getHolidays(year, 'RU');
        const todayStr = new Date().toISOString().split('T')[0];
        setTodayHolidays(holidays.filter(h => h.date === todayStr));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  // Изменение выбора стран
  const handleCountryChange = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Поиск праздников
  const handleSearch = async () => {
    setErrorMessage(''); // сброс ошибки

    if (!searchDate) {
      setErrorMessage('Пожалуйста, выберите дату.');
      return;
    }

    if (selectedCountries.length === 0) {
      setErrorMessage('Пожалуйста, выберите хотя бы одну страну.');
      return;
    }

    setLoadingSearch(true);
    setSearchResults([]);
    const year = searchDate.split('-')[0];
    const results: Holiday[] = [];

    try {
      const promises = selectedCountries.map(c => getHolidays(year, c));
      const responses = await Promise.allSettled(promises);

      responses.forEach((res, idx) => {
        const country = selectedCountries[idx];
        if (res.status === 'fulfilled') {
          results.push(...res.value.filter(h => h.date === searchDate).map(h => ({ ...h, countryCode: country })));
        } else {
          console.error(`Ошибка для страны ${country}:`, res.reason);
        }
      });

      results.sort((a, b) => (countries[a.countryCode] || a.countryCode).localeCompare(countries[b.countryCode] || b.countryCode, 'ru'));
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setErrorMessage('Произошла ошибка при поиске праздников.');
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div>
      {/* Праздники сегодня */}
      <section className="block pink">
        <h2>Какие сегодня в России официальные праздники?</h2>
        <p>{formatDate(new Date().toISOString().split('T')[0])}</p>
        {loadingToday ? <div className="loading">Загрузка...</div> : (
          <div className="holiday-list">
            {todayHolidays.length ? todayHolidays.map(h => (
              <div key={h.name} className="holiday-item">
                <div className="holiday-name">{h.localName || h.name}</div>
                <div className="holiday-details">Дата: {formatDate(h.date)}</div>
              </div>
            )) : <div className="no-holidays">Праздники не найдены.</div>}
          </div>
        )}
      </section>

      {/* Поиск праздников */}
      <section className="block blue">
        <div className="form-group">
          <label htmlFor="holiday-date">Выберите дату:</label>
          <input type="date" id="holiday-date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Выберите страны:</label>
          <div className="checkbox-list">
            {Object.entries(countries).sort((a,b) => a[1].localeCompare(b[1], 'ru')).map(([code, name]) => (
              <label key={code}>
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(code)}
                  onChange={() => handleCountryChange(code)}
                />
                {name}
              </label>
            ))}
          </div>
          <small>Выберите как минимум 1 страну (по умолчанию Россия)</small>
        </div>

        <div className="form-group center-buttons">
          <button type="button" className="btn" onClick={() => setSelectedCountries(Object.keys(countries))}>Выбрать все</button>
          <button type="button" className="btn" onClick={() => setSelectedCountries([])}>Снять выделение</button>
        </div>

        <button className="btn" onClick={handleSearch} disabled={loadingSearch}>Показать праздники</button>


<div className="holiday-list">
  {loadingSearch && <div className="loading">Загрузка...</div>}

  {!loadingSearch && (
    <>
      {errorMessage ? (
        <div className="no-holidays">{errorMessage}</div> // <-- вывод ошибки здесь
      ) : searchResults.length > 0 ? (
        searchResults.map(h => (
          <div key={`${h.countryCode}-${h.name}`} className="holiday-item">
            <div className="holiday-name">{h.localName || h.name}</div>
            <div className="holiday-details">
              <span className="holiday-country">{countries[h.countryCode]}</span>
              {h.types && <span className="holiday-types">{Array.isArray(h.types) ? h.types.join(', ') : h.types}</span>}
            </div>
            {h.name !== h.localName && <div className="holiday-details">{h.name}</div>}
            <div className="holiday-details">Дата: {formatDate(h.date)}</div>
          </div>
        ))
      ) : (
        <div className="no-holidays">Праздники не найдены. Попробуйте сменить страну или дату</div>
      )}
    </>
  )}
</div>

      </section>
    </div>
  );
};

export default Holidays;
