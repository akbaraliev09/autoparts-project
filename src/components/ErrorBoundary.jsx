import { Component } from 'react'

// окно ошибки

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="wrap page">
        <h1 className="h1s">Что-то пошло не так</h1>
        <p className="muted">Попробуйте обновить страницу или вернуться на главную.</p>
        <button className="btn" onClick={() => window.location.assign('/')}>На главную</button>
      </div>
    )
  }
}
