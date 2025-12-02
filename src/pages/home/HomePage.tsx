import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

const HomePage: React.FC = () => {
  return (
    <div className="home-content">
      <section className="block pink">
        <h2>Эликсиры</h2>
        <p>Переход на страницу с API с библиотекой эликсиров</p>
        <Link to="/wizards" className="btn">К эликсирам</Link>
      </section>

      <section className="block blue">
        <h2>Фрукты</h2>
        <p>Переход на страницу с API с информацией о фруктах</p>
        <Link to="/fruits" className="btn">К фруктам</Link>
      </section>

      <section className="block yellow">
        <h2>Праздники</h2>
        <p>Переход на страницу с API с информацией о праздниках</p>
        <Link to="/holidays" className="btn">К праздникам</Link>
      </section>
    </div>
  )
}

export default HomePage