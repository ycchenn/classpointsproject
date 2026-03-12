# classpointsproject - HelpingMyMama: Evidence-Based Classroom Point Credit Record System

> **I believe that the true value of information technology lies in its ability to empower and solve real-world challenges!**
> 
> This project is a tailored classroom management solution developed for my mother, a professional educator. It transforms fragmented paper-based records into a transparent, real-time, and evidence-based digital ecosystem.

---

## Project Motivation
As a teacher, my mother faced a recurring challenge: "Merit Disputes." Students often contested their scores due to a lack of transparency in traditional tallying. To address this, I took full ownership of the product lifecycle:
* **Requirement Engineering**: Conducted in-depth interviews with the primary stakeholder (my mother) to define core functional requirements.
* **UX/UI Design**: Developed a mobile-first interface optimized for teachers navigating a busy classroom environment.
* **Technical Implementation**: Deployed a full-stack cloud architecture ensuring data integrity and real-time synchronization.

---

## Key Features
* **Real-time Leaderboard**: Implemented via Firebase `onSnapshot` listeners for zero-refresh, reactive UI updates.
* **Atomic Batch Operations**: Leveraged **Firestore Write Batches** to handle point adjustments for multiple students simultaneously, maximizing operational efficiency.
* **Logical Weekly Reset (Temporal Filtering)**: Engineered a "View-Filtering" mechanism that allows for weekly fresh starts while preserving full-semester raw data for final grading.
* **Atomic Rollback System**: Integrated a synchronized deletion and balance correction logic to ensure data consistency when reverting entries.
* **Composite Query Optimization**: Configured custom **Composite Indexes** to support complex sorting: points (descending) + seat number (ascending).

---

## Tech Stack
* **Frontend:** Tailwind CSS, JavaScript (ES6+), Responsive Design.
* **Backend:** Google Firebase Firestore (NoSQL Database).
* **Architecture:** BaaS (Backend-as-a-Service).
* **Deployment:** GitHub Pages.

---

## Technical Highlights
1. **Data Consistency & Atomicity**:
   By using `writeBatch`, the system ensures that "Log Deletion" and "Score Deduction" are treated as a single atomic transaction. This prevents data corruption or mismatched balances in high-frequency update scenarios.

2. **Temporal Data Architecture**:
   Instead of physically deleting records for a "Weekly Reset," the system utilizes time-based query filtering. This follows industrial best practices in data auditing, ensuring that an immutable audit trail is maintained for the entire semester.

3. **User-Centric Agile Iteration**:
   Responded to real-world user feedback (UX pain points) by rapidly deploying the "Rollback" and "Weekly Reset" features, demonstrating the value of Agile development in a real-world setting.

---

## Developer's Reflection
While the scope of this project is focused, it serves as a robust validation of my ability to bridge the gap between information technology and real-world problem-solving. It proves that a great system doesn't have to be complex; it just needs to be effective and user-centric.