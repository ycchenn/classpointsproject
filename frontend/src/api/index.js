const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const getStudents = async (since) => {
  const url = since
    ? `${BASE_URL}/students?since=${since}`
    : `${BASE_URL}/students`
  const res = await fetch(url)
  if (!res.ok) throw new Error('取得學生失敗')
  return res.json()
}

export const changePoints = async (studentId, amount, reason) => {
  const res = await fetch(`${BASE_URL}/students/${studentId}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, reason }),
  });
  if (!res.ok) throw new Error('更新分數失敗');
  return res.json();
};

export const batchChangePoints = async (studentIds, amount, reason) => {
  const res = await fetch(`${BASE_URL}/students/batch-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentIds, amount, reason }),
  });
  if (!res.ok) throw new Error('批次更新失敗');
  return res.json();
};

export const getStudentLogs = async (studentId, since) => {
  const url = since
    ? `${BASE_URL}/students/${studentId}/logs?since=${since}`
    : `${BASE_URL}/students/${studentId}/logs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('取得紀錄失敗');
  return res.json();
};

export const deleteLog = async (logId, studentId, amount) => {
  const res = await fetch(`${BASE_URL}/students/logs/${logId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, amount }),
  });
  if (!res.ok) throw new Error('撤回失敗');
  return res.json();
};