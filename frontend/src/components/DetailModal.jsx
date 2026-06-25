import { useEffect, useState } from 'react'
import { changePoints, deleteLog, getStudentLogs } from '../api/index'

function DetailModal({ student, startDate, onClose, onPointsChanged }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      const data = await getStudentLogs(student.id, startDate)
      setLogs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [student.id])

  const handleChangePoints = async (amount) => {
    const reason = prompt(
      `請輸入給 ${student.name} ${amount > 0 ? '加' : '扣'}分的理由：`,
      amount > 0 ? '表現優良' : '秩序不佳'
    )
    if (reason === null) return
    try {
      await changePoints(student.id, amount, reason)
      onPointsChanged()
      fetchLogs()
    } catch (err) {
      alert('更新失敗')
    }
  }

  const handleDeleteLog = async (log) => {
    if (!confirm('確定要撤回這筆紀錄嗎？')) return
    try {
      await deleteLog(log.id, student.id, log.amount)
      onPointsChanged()
      fetchLogs()
    } catch (err) {
      alert('撤回失敗')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">&times;</button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleChangePoints(1)}
              className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold text-xl active:scale-95 shadow-lg"
            >
              +1 分
            </button>
            <button
              onClick={() => handleChangePoints(-1)}
              className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold text-xl active:scale-95 shadow-lg"
            >
              -1 分
            </button>
          </div>

          <h3 className="font-bold text-gray-500 mb-4 border-l-4 border-orange-400 pl-2 text-sm">
            歷史加扣分紀錄
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-sm">
            {loading ? (
              <p className="text-center text-gray-400 py-4">載入中...</p>
            ) : logs.length === 0 ? (
              <p className="text-center text-gray-400 py-4">尚無紀錄</p>
            ) : (
              logs.map(log => (
                <div
                  key={log.id}
                  className={`flex justify-between items-start bg-gray-50 p-3 rounded-lg border-l-4 ${log.amount > 0 ? 'border-green-400' : 'border-red-400'}`}
                >
                  <div>
                    <div className="font-bold text-gray-700">{log.reason}</div>
                    <div className="text-[10px] text-gray-400">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '讀取中'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`font-bold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.amount > 0 ? '+' : ''}{log.amount}
                    </div>
                    <button
                      onClick={() => handleDeleteLog(log)}
                      className="text-red-400 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailModal