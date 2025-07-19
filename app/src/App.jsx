import { useState, useEffect } from 'react'
import questions from './data/questions'
import './App.css'

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'sequential')
  const [order, setOrder] = useState(() => {
    const saved = localStorage.getItem('order')
    if (saved) return JSON.parse(saved)
    const arr = questions.map((_, idx) => idx)
    return mode === 'random' ? shuffle(arr) : arr
  })
  const [current, setCurrent] = useState(() => Number(localStorage.getItem('current')) || 0)
  const [score, setScore] = useState(() => Number(localStorage.getItem('score')) || 0)
  const [answered, setAnswered] = useState(() => Number(localStorage.getItem('answered')) || 0)
  const [selected, setSelected] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    localStorage.setItem('mode', mode)
    localStorage.setItem('order', JSON.stringify(order))
    localStorage.setItem('current', current)
    localStorage.setItem('score', score)
    localStorage.setItem('answered', answered)
  }, [mode, order, current, score, answered])

  const qIndex = order[current] % questions.length
  const q = questions[qIndex]

  const handleSubmit = () => {
    if (!selected) return
    const correct = selected === q.answer
    if (correct) setScore(score + 1)
    setAnswered(answered + 1)
    setShowAnalysis(true)
  }

  const handleNext = () => {
    setSelected('')
    setShowAnalysis(false)
    if (current + 1 < order.length) {
      setCurrent(current + 1)
    } else {
      // restart
      const arr = questions.map((_, idx) => idx)
      const newOrder = mode === 'random' ? shuffle(arr) : arr
      setOrder(newOrder)
      setCurrent(0)
      setScore(0)
      setAnswered(0)
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'random' ? 'sequential' : 'random'
    setMode(newMode)
    const arr = questions.map((_, idx) => idx)
    const newOrder = newMode === 'random' ? shuffle(arr) : arr
    setOrder(newOrder)
    setCurrent(0)
    setScore(0)
    setAnswered(0)
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <span>题号 {qIndex + 1}/{questions.length}</span>
        <span> 正确率: {answered ? Math.round((score / answered) * 100) : 0}%</span>
      </div>
      <div className="mode-switch">
        <label>
          <input type="checkbox" checked={mode === 'random'} onChange={toggleMode} />
          随机模式
        </label>
      </div>
      <div className="hand">手牌区: [{q.hand.join(' ')}]</div>
      {q.river.length > 0 && <div className="river">牌河: [{q.river.join(' ')}]</div>}
      <div className="select">请选择要切的牌:</div>
      <div className="buttons">
        {q.hand.map((tile, idx) => (
          <button
            key={idx}
            className={selected === tile ? 'selected' : ''}
            onClick={() => setSelected(tile)}
          >
            {tile}
          </button>
        ))}
      </div>
      <div className="actions">
        <button onClick={handleSubmit} disabled={!selected || showAnalysis}>提交答案</button>
        <button onClick={handleNext}>下一题</button>
        <button onClick={() => setShowAnalysis(!showAnalysis)}>查看解析</button>
      </div>
      {showAnalysis && (
        <div className="analysis">
          正确答案：{q.answer} <br />
          {q.analysis}
        </div>
      )}
      <div className="footer">已答 {answered}/{questions.length} | 正确率 {answered ? Math.round((score / answered) * 100) : 0}%</div>
    </div>
  )
}

export default App
