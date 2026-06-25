function StudentCard({ student, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-95 transition-transform"
    >
      <div className="flex items-center gap-4">
        <span className="text-orange-200 font-bold">#{student.seat_number}</span>
        <span className="text-xl font-bold text-gray-800">{student.name}</span>
      </div>
      <div className="text-3xl font-black text-orange-600">
        {student.weeklyScore}
      </div>
    </div>
  )
}

export default StudentCard