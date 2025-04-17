import { useState, useEffect } from 'react';

const AIRTABLE_BASE_ID = "appWwMDCKHXWWvvDo";
const AIRTABLE_TABLE_NAME = "Presentielijst";
const AIRTABLE_API_KEY = "patdrGdjfFcgheSrE.f0ca83205db927a98ff1b2d7466a00000e77d6dbc5c711e159da5824d4fd6565";

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

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState("Renzo Choreo int/adv");
  const [presence, setPresence] = useState({});

  useEffect(() => {
    fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?view=Grid%20view`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`
      }
    })
      .then((res) => res.json())
      .then((result) => {
        const db = {};
        result.records.forEach((rec) => {
          if (rec.fields["Leerling kort"]) {
            db[rec.fields["Leerling kort"]] = {
              id: rec.id,
              ...rec.fields
            };
          }
        });
        setPresence(db);
      });
  }, []);

  const togglePresence = (name, week) => {
    const record = presence[name];
    if (!record) return;

    const newValue = !record[week];

    fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${record.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          [week]: newValue
        }
      })
    }).then(() => {
      setPresence((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          [week]: newValue
        }
      }));
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
          <span>Leerling</span>
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
                checked={!!presence[student]?.[`WK${i + 1}`]}
                onChange={() => togglePresence(student, `WK${i + 1}`)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
