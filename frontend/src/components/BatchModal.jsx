import { useState } from 'react'
import { batchChangePoints } from '../api/index'

function BatchModal({ students, onClose, onPointsChanged }) {
  const [amount, setAmount] = useState(1)
  const [reason, setReason] = useState('')
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)

  const sortedStudents = [...students].sort((a, b) => a.seat_number - b.seat_number)

  const toggleStudent = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (selected.length === 0) return alert('請至少選擇一位學生')
    const finalReason = reason || (amount > 0 ? '表現優良' : '秩序不佳')
    setLoading(true)
    try {
      await batchChangePoints(selected, amount, finalReason)
      alert(`已更新 ${selected.length} 位學生分數`)
      setReason('')
      setSelected([])
      onPointsChanged()
      onClose()
    } catch (err) {
      alert('更新失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">批量操作</h2>
          <button onClick={onClose} className="text-gray-400 text-3xl">&times;</button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAmount(1)}
              className={`flex-1 py-4 rounded-xl font-bold text-xl border-2 ${amount === 1 ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400'}`}
            >
              ＋1 分
            </button>
            <button
              onClick={() => setAmount(-1)}
              className={`flex-1 py-4 rounded-xl font-bold text-xl border-2 ${amount === -1 ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-200 text-gray-400'}`}
            >
              －1 分
            </button>
          </div>

          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="請輸入理由"
            className="w-full p-4 border rounded-xl mb-6 outline-orange-400 text-lg"
          />

          <h3 className="font-bold text-gray-500 mb-3 text-sm">選擇學生：</h3>
          <div className="space-y-2">
            {sortedStudents.map(s => (
              <label
                key={s.id}
                className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer active:bg-orange-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="text-gray-400 font-bold w-8">#{s.seat_number}</span>
                <span className="text-lg font-medium">{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-xl active:scale-95 shadow-lg disabled:opacity-50"
          >
            {loading ? '正在儲存...' : '確認送出'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BatchModal