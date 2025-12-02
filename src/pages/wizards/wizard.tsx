import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import './wizard.css'

interface Ingredient {
  id?: string
  name?: string
}

interface Elixir {
  id: string
  name: string
  sideEffects?: string
  difficulty?: string
  time?: string
  ingredients?: Ingredient[]
}

const WizardsPage: React.FC = () => {
  const [elixirs, setElixirs] = useState<Elixir[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredElixirs, setFilteredElixirs] = useState<Elixir[]>([])

  const API_URL = 'https://wizard-world-api.herokuapp.com/Elixirs'

  const loadAllElixirs = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setElixirs(data)
      setFilteredElixirs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchElixirs = useCallback(async () => {
    if (!searchText.trim()) {
      setFilteredElixirs(elixirs)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const allElixirs = await response.json()
      const foundElixirs = allElixirs.filter((elixir: Elixir) =>
        elixir.name.toLowerCase().includes(searchText.toLowerCase())
      )

      if (foundElixirs.length === 0) {
        setError('Эликсир не найден')
        setFilteredElixirs([])
      } else {
        setFilteredElixirs(foundElixirs)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setFilteredElixirs([])
    } finally {
      setLoading(false)
    }
  }, [searchText, elixirs])

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchElixirs()
    }
  }

  useEffect(() => {
    loadAllElixirs()
  }, [loadAllElixirs])

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Подождите! Загружаем...</div>
    }

    if (error) {
      return <div className="no_elixir">{error}</div>
    }

    if (filteredElixirs.length === 0) {
      return <div className="no_elixir">Эликсиры не найдены</div>
    }

    return (
      <div className="elixirs_container">
        {filteredElixirs.map(elixir => (
          <div key={elixir.id} className="elixir_card">
            <h2 className="elixir_name">{elixir.name || 'Неизвестно'}</h2>
            <p><strong>Побочные эффекты: </strong>{elixir.sideEffects || 'Неизвестно'}</p>
            <p><strong>Сложность приготовления: </strong>{elixir.difficulty || 'Неизвестно'}</p>
            <p><strong>Время приготовления: </strong>{elixir.time || 'Неизвестно'}</p>

            <div className="ingredients">
              <p><strong>Ингредиенты: </strong></p>
              <ul>
                {elixir.ingredients && elixir.ingredients.length > 0 
                  ? elixir.ingredients.map((ingredient, index) => (
                      <li key={ingredient.id || index}>
                        {ingredient.name || 'Неизвестный ингредиент'}
                      </li>
                    ))
                  : <li>Не указаны</li>
                }
              </ul>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="wizards-page">
      <nav className="navigation">
        <Link to="/">Главная страница</Link>
      </nav>

      <div className="container">
        <h1>Библиотека эликсиров</h1>

        <div className="search_bar">
          <input
            type="text"
            id="search_input"
            placeholder="Введите название эликсира"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="search_wizard" onClick={searchElixirs}>
            Найти
          </button>
          <button id="find_all" onClick={loadAllElixirs}>
            Вывести всё
          </button>
        </div>

        <div id="elixir_container">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default WizardsPage