
import { useState } from 'react';

const data = {
  'Renzo Choreo int/adv': [
    'Gala J.',
    'Sammie J.',
    'Tatum G.',
    'Aaliyah G.',
    'Aliyza D.',
    'Odunayo A.',
    'Thanh T.',
    'Miriam B.',
    'Thijs V.',
    'Grace L.',
    'Lauryn B.',
    'Patrick L.'
  ],
  'Isabel Commercial Beginner': [
    'Guusje S.',
    'Tiromsara R.',
    'Kim N.',
    'Maartje V.',
    'Kyra K.',
    'Renske P.',
    'Pleun V.',
    'Jairo S.',
    'Lotte S.'
  ]
};

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState('Renzo Choreo int/adv');
  const [presence, setPresence] = useState({});

  const togglePresence = (name, week) => {
    setPresence((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [week]: !prev[name]?.[week]
      }
    }));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{ marginBottom: 20, padding: 10, fontSize: 16 }}
      >
        {Object.keys(data).map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 10 }}>
        {data[selectedCourse].map((student) => (
          <div
            key={student}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <span>{student}</span>
            <div style={{ display: 'flex', gap: 10 }}>
              {[...Array(8)].map((_, i) => (
                <input
                  key={i}
                  type="checkbox"
                  checked={presence[student]?.[`WK${i + 1}`] || false}
                  onChange={() => togglePresence(student, `WK${i + 1}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
