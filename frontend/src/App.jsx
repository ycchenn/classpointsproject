console.log('API URL:', import.meta.env.VITE_API_URL)
import { useEffect, useState } from 'react'
import { getStudents } from './api/index'
import BatchModal from './components/BatchModal'
import DetailModal from './components/DetailModal'
import StudentList from './components/StudentList'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(
    localStorage.getItem('selectedStartDate') || '2026-03-16'
  )
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showBatchModal, setShowBatchModal] = useState(false)

  const fetchStudents = async () => {
    try {
      const data = await getStudents(startDate)
      const sorted = data.sort(
        (a, b) => b.weeklyScore - a.weeklyScore || a.seat_number - b.seat_number
      )
      setStudents(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [startDate])

  const handleDateChange = (e) => {
    const val = e.target.value
    localStorage.setItem('selectedStartDate', val)
    setStartDate(val)
  }

  const handleSelectStudent = (student) => {
    console.log('選到學生:', student)
    setSelectedStudent(student)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-orange-500 text-white p-5 shadow-lg sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold">三桂 榮譽榜</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs">起算日:</span>
          <input
            type="date"
            value={startDate}
            onChange={handleDateChange}
            className="text-gray-800 text-xs p-1 rounded border-none outline-none"
          />
        </div>
      </nav>

      <div className="text-xs text-orange-500 font-bold mb-2 px-4 pt-2">
        成績結算週期：{startDate} 至今
      </div>

      {/* 學生列表 */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-xl">連線雲端中...</div>
        ) : (
          <StudentList
            students={students}
            onSelectStudent={handleSelectStudent}
          />
        )}
      </div>

      {/* 批次加扣分按鈕 */}
      <button
        onClick={() => setShowBatchModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl text-3xl font-bold z-40 active:scale-90 transition-transform"
      >
        ＋
      </button>

      {/* Modals */}
      {selectedStudent && (
        <DetailModal
          student={selectedStudent}
          startDate={startDate}
          onClose={() => setSelectedStudent(null)}
          onPointsChanged={fetchStudents}
        />
      )}

      {showBatchModal && (
        <BatchModal
          students={students}
          onClose={() => setShowBatchModal(false)}
          onPointsChanged={fetchStudents}
        />
      )}
    </div>
  )
}

export default App