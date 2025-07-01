// src/App.tsx

import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [years, setYears] = useState<{ year: string }[]>([]);
    const [semesters, setSemesters] = useState<{ semester: string }[]>([]);
    const [batches, setBatches] = useState<{ class: string }[]>([]);
    const [params, setParams] = useState({ year: "", semester: "", batch: "" });

    useEffect(() => {
        fetch("/years/")
            .then((res) => res.json() as Promise<{ year: string }[]>)
            .then((data) => setYears(data));
    }, []);
    useEffect(() => {
        if (params.year.length > 0) {
            fetch(`/semesters/${params.year}`)
                .then((res) => res.json() as Promise<{ semester: string }[]>)
                .then((data) => setSemesters(data));
        }
    }, [params.year]);

    useEffect(() => {
        if (params.semester.length > 0) {
            fetch(`/batch/${params.year}/${params.semester}`)
                .then((res) => res.json() as Promise<{ class: string }[]>)
                .then((data) => setBatches(data));
        }
    }, [params.semester]);
    
    return (
        <>
            <h4>Years</h4>
            <div style={{ display: "flex", gap: "1rem" }}>
                {years.map((year) => (
                    <div
                        key={year.year}
                        style={{ cursor: "pointer", backgroundColor: params.year === year.year ? "#42fd84" : "", padding: "0 5px" }}
                        onClick={() => setParams({ ...params, year: year.year })}
                    >
                        {year.year}
                    </div>
                ))}
            </div>
            {semesters.length > 0 && (
                <>
                    <h4>Semesters</h4>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {semesters.map((semester) => (
                            <div
                                key={semester.semester}
                                style={{ cursor: "pointer", backgroundColor: params.semester === semester.semester ? "#42fd84" : "", padding: "0 5px" }}
                                onClick={() => setParams({ ...params, semester: semester.semester })}
                            >
                                {semester.semester}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {batches.length > 0 && (
                <>
                    <h4>Batches</h4>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {batches.map((batch) => (
                            <div
                                key={batch.class}
                                style={{ cursor: "pointer", backgroundColor: params.batch === batch.class ? "#42fd84" : "", padding: "0 5px" }}
                                onClick={() => setParams({ ...params, batch: batch.class })}
                            >
                                {batch.class}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default App;
