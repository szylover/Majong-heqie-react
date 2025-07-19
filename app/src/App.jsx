import { useState, useEffect } from 'react'
import questions from './data/questions'
import './App.css'

// Mapping from mahjong tile characters to SVG images
const tileImages = {
  '🀀': new URL('../assets/tenhuo/Ton.svg', import.meta.url).href,
  '🀁': new URL('../assets/tenhuo/Nan.svg', import.meta.url).href,
  '🀂': new URL('../assets/tenhuo/Shaa.svg', import.meta.url).href,
  '🀃': new URL('../assets/tenhuo/Pei.svg', import.meta.url).href,
  '🀄': new URL('../assets/tenhuo/Chun.svg', import.meta.url).href,
  '🀅': new URL('../assets/tenhuo/Hatsu.svg', import.meta.url).href,
  '🀆': new URL('../assets/tenhuo/Haku.svg', import.meta.url).href,
  '🀇': new URL('../assets/tenhuo/Man1.svg', import.meta.url).href,
  '🀈': new URL('../assets/tenhuo/Man2.svg', import.meta.url).href,
  '🀉': new URL('../assets/tenhuo/Man3.svg', import.meta.url).href,
  '🀊': new URL('../assets/tenhuo/Man4.svg', import.meta.url).href,
  '🀋': new URL('../assets/tenhuo/Man5.svg', import.meta.url).href,
  '🀌': new URL('../assets/tenhuo/Man6.svg', import.meta.url).href,
  '🀍': new URL('../assets/tenhuo/Man7.svg', import.meta.url).href,
  '🀎': new URL('../assets/tenhuo/Man8.svg', import.meta.url).href,
  '🀏': new URL('../assets/tenhuo/Man9.svg', import.meta.url).href,
  '🀐': new URL('../assets/tenhuo/Sou1.svg', import.meta.url).href,
  '🀑': new URL('../assets/tenhuo/Sou2.svg', import.meta.url).href,
  '🀒': new URL('../assets/tenhuo/Sou3.svg', import.meta.url).href,
  '🀓': new URL('../assets/tenhuo/Sou4.svg', import.meta.url).href,
  '🀔': new URL('../assets/tenhuo/Sou5.svg', import.meta.url).href,
  '🀕': new URL('../assets/tenhuo/Sou6.svg', import.meta.url).href,
  '🀖': new URL('../assets/tenhuo/Sou7.svg', import.meta.url).href,
  '🀗': new URL('../assets/tenhuo/Sou8.svg', import.meta.url).href,
  '🀘': new URL('../assets/tenhuo/Sou9.svg', import.meta.url).href,
  '🀙': new URL('../assets/tenhuo/Pin1.svg', import.meta.url).href,
  '🀚': new URL('../assets/tenhuo/Pin2.svg', import.meta.url).href,
  '🀛': new URL('../assets/tenhuo/Pin3.svg', import.meta.url).href,
  '🀜': new URL('../assets/tenhuo/Pin4.svg', import.meta.url).href,
  '🀝': new URL('../assets/tenhuo/Pin5.svg', import.meta.url).href,
  '🀞': new URL('../assets/tenhuo/Pin6.svg', import.meta.url).href,
  '🀟': new URL('../assets/tenhuo/Pin7.svg', import.meta.url).href,
  '🀠': new URL('../assets/tenhuo/Pin8.svg', import.meta.url).href,
  '🀡': new URL('../assets/tenhuo/Pin9.svg', import.meta.url).href,
}

const getTileImg = tile => tileImages[tile]

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
      <div className="hand">手牌区:
        {q.hand.map((t, i) => (
          <img key={i} src={getTileImg(t)} alt={t} className="tile-img" />
        ))}
      </div>
      {q.river.length > 0 && (
        <div className="river">牌河:
          {q.river.map((t, i) => (
            <img key={i} src={getTileImg(t)} alt={t} className="tile-img" />
          ))}
        </div>
      )}
      <div className="select">请选择要切的牌:</div>
      <div className="buttons">
        {q.hand.map((tile, idx) => (
          <button
            key={idx}
            className={selected === tile ? 'selected' : ''}
            onClick={() => setSelected(tile)}
          >
            <img src={getTileImg(tile)} alt={tile} className="tile-img" />
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
          正确答案：<img src={getTileImg(q.answer)} alt={q.answer} className="tile-img" /> <br />
          {q.analysis}
        </div>
      )}
      <div className="footer">已答 {answered}/{questions.length} | 正确率 {answered ? Math.round((score / answered) * 100) : 0}%</div>
    </div>
  )
}

export default App
