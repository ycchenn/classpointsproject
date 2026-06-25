import StudentCard from './StudentCard'

function StudentList({ students, onSelectStudent }) {
  if (students.length === 0) {
    return <div className="text-center py-20 text-gray-500">尚無學生資料</div>
  }

  return (
    <div className="space-y-4">
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onClick={() => onSelectStudent(student)}
        />
      ))}
    </div>
  )
}

export default StudentList