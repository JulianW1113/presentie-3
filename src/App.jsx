import { useState, useEffect } from 'react';

const data = {
  "Isabel Commercial Beginner": ["Guusje S.", "Jairo S.", "Kim N.", "Kyra K.", "Lotte S.", "Maartje G.", "Pleun L.", "Renske P.", "Tirosmara R."],
  "Jason UC": ["Adia L.", "Esmée Z.", "Guusje S.", "Jairo S.", "Julia S.", "Kim N.", "Klara V.", "Lotte S.", "Renske P."],
  "Mark Commercial": ["Alicia A.", "Brandon D.", "Brittany S.", "David G.", "Elise H.", "Julia M.", "Maud W.", "Merijn B.", "Sayf E.", "Timothy B.", "Zoe V."],
  "Mark Hiphop": ["Brandon D.", "David G.", "Esmée Z.", "Julie H.", "Klara V.", "Lianne H.", "Muni O.", "Sanne O.", "Skye K.", "Timothy B."],
  "Merle & Charlie Dancehall": ["Aaliyah G.", "Alizya D.", "Anaïs P.", "Bloem K.", "Cherise J.", "Dunya R.", "Julia M.", "Julia S.", "Maud W.", "Merijn B.", "Robin S.", "Sayf E.", "Tosca S.", "Yasmine B.", "Zoe J.", "Zoe V."],
  "Renzo Choreo Adv+": ["Adinda M.", "Ayla C.", "Brandon D.", "Carmen R.", "Florien P.", "Iliana M.", "Indy S.", "Jade D.", "Jayne-Elja M.", "Lianne H.", "Lisette H.", "Lynn L.", "Nienke B.", "Rianne C.", "Robin S.", "Sanne T.", "Sara M.", "Tatum G.", "Tosca S.", "Zuzanna P."],
  "Renzo Choreo int/adv": ["Aaliyah G.", "Alizya D.", "Gala J.", "Grace L.", "Lauryn B.", "Miriam B.", "Odunayo A.", "Patrick L.", "Sammie J.", "Tatum G.", "Thanh T.", "Thijs V."],
  "Valery Hiphop Adv+": ["Brandon D.", "Indy S.", "Jade D.", "Jayne-Elja M.", "Lianne H.", "Lisette H.", "Lynn L.", "Nienke B.", "Robin S.", "Sara M.", "Tosca S.", "Zuzanna P."],
  "Valery Hiphop int/adv": ["Aaliyah G.", "Alicia A.", "Alizya D.", "Gala J.", "Grace L.", "Joshua I.", "Lauryn B.", "Miriam B.", "Patrick L.", "Thanh T.", "Thijs V.", "Zoe V."]
};

const AIRTABLE_BASE_ID = 'appZXtCuTGK6a6aws';
const AIRTABLE_API_KEY = 'patK7bUG61aWlDKPs.07db5c4bae2ac05b0ed4c923e73026ae6f8af87e50c9c0d39bc8926be55c2a91';
const AIRTABLE_TABLE_NAME = 'Presentielijsten';

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState("Renzo Choreo int/adv");
  const [presence, setPresence] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('presentie');
    if (stored) {
      setPresence(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('presentie', JSON.stringify(presence));
  }, [presence]);

  const updateAirtable = async (student, week, checked) => {
    const recordName = student; // Assumes 'Leerling kort' matches exactly
    const field = week;

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`
      }
    });
    const data = await response.json();

    const record = data.records.find(
      (r) => r.fields['Leerling kort'] === recordName && r.fields['Cursus'] === selectedCourse
    );

    if (record) {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${record.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            [field]: checked
          }
        })
      });
    }
  };

  const togglePresence = (name, week) => {
    const newValue = !presence[name]?.[week];
    setPresence((prev) => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          [week]: newValue
        }
      };
      updateAirtable(name, week, newValue);
      return updated;
    });
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(8, 1fr)', gap: 10, marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>
          <span></span>
          {[...Array(8)].map((_, i) => (
            <span key={`label-${i}`}>{`WK${i + 1}`}</span>
          ))}
        </div>

        {data[selectedCourse].map((student) => (
          <div
            key={student}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr repeat(8, 1fr)',
              gap: 10,
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <span>{student}</span>
            {[...Array(8)].map((_, i) => (
              <input
                key={i}
                type="checkbox"
                checked={presence[student]?.[`WK${i + 1}`] || false}
                onChange={() => togglePresence(student, `WK${i + 1}`)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
