const express = require('express');
const router = express.Router();
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// GET /api/students - 取得所有學生
router.get('/', async (req, res) => {
  try {
    const { since } = req.query
    const studentsSnap = await db.collection('students').get()

    const students = await Promise.all(
      studentsSnap.docs.map(async (doc) => {
        let weeklyScore = 0

        if (since) {
          const logsSnap = await db.collection('logs')
            .where('student_id', '==', doc.id)
            .where('timestamp', '>=', new Date(since))
            .get()
          logsSnap.forEach(l => { weeklyScore += l.data().amount })
        }

        return { id: doc.id, ...doc.data(), weeklyScore }
      })
    )

    res.json(students)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/students/:id/points - 加扣分
router.post('/:id/points', async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  if (!amount || !reason) {
    return res.status(400).json({ error: 'amount 和 reason 必填' });
  }

  try {
    const batch = db.batch();

    const studentRef = db.collection('students').doc(id);
    batch.update(studentRef, {
      total_points: FieldValue.increment(amount),
    });

    const logRef = db.collection('logs').doc();
    batch.set(logRef, {
      student_id: id,
      amount,
      reason,
      timestamp: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/logs/:logId - 撤回紀錄
router.delete('/logs/:logId', async (req, res) => {
  const { logId } = req.params;
  const { studentId, amount } = req.body;

  if (!studentId || amount === undefined) {
    return res.status(400).json({ error: 'studentId 和 amount 必填' });
  }

  try {
    const batch = db.batch();
    batch.delete(db.collection('logs').doc(logId));
    batch.update(db.collection('students').doc(studentId), {
      total_points: FieldValue.increment(-amount),
    });
    await batch.commit();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id/logs - 取得某學生的紀錄
router.get('/:id/logs', async (req, res) => {
  const { id } = req.params;
  const { since } = req.query; // ?since=2026-03-16

  try {
    let query = db.collection('logs').where('student_id', '==', id).orderBy('timestamp', 'desc');

    if (since) {
      query = query.where('timestamp', '>=', new Date(since));
    }

    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students/batch-points - 批次加扣分
router.post('/batch-points', async (req, res) => {
  const { studentIds, amount, reason } = req.body;

  if (!studentIds?.length || !amount || !reason) {
    return res.status(400).json({ error: 'studentIds、amount 和 reason 必填' });
  }

  try {
    const batch = db.batch();

    for (const id of studentIds) {
      const studentRef = db.collection('students').doc(id);
      batch.update(studentRef, {
        total_points: FieldValue.increment(amount),
      });

      const logRef = db.collection('logs').doc();
      batch.set(logRef, {
        student_id: id,
        amount,
        reason,
        timestamp: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    res.json({ success: true, updated: studentIds.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;