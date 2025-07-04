// src/App.tsx

import { useEffect, useState } from "react";
import "./App.css";

type Recap = { rid: number; course: string };
type GradeAverage = { grade: string; total: number; per: number };

// The App component fetches data from the server and displays it in a structured way
// It allows users to select a year, semester, batch, and course recap
// The selected parameters are displayed in JSON format for debugging purposes
function App() {
	const [index, setIndex] = useState(0);
	const [years, setYears] = useState<{ year: string }[]>([]);
	const [semesters, setSemesters] = useState<{ semester: string }[]>([]);
	const [batches, setBatches] = useState<{ class: string }[]>([]);
	const [recaps, setRecaps] = useState<Recap[]>([]);
	const [grades, setGrades] = useState<GradeAverage[]>([]);
	const [params, setParams] = useState<{ year: string; semester: string; batch: string; course: Recap | null }>({ year: "", semester: "", batch: "", course: null });

	//console.log(Object.entries(params).reduce((p, [k, v], i) => ({ ...p, [k]: i <= 3 ? v : '' }), {}));

    const handleClick = (n: number) => {
			setParams(
				Object.entries(params).reduce(
					(p, [k, v], i) => ({
						...p,
						[k]: i <= n ? v : (k === "course" ? null : "")
					}),
					{ year: "", semester: "", batch: "", course: null }
				)
			);
            setIndex(n+1);
            //console.log(params)
    }

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
        handleClick(0);
	}, [params.year]);

	useEffect(() => {
		if (params.semester.length > 0) {
			fetch(`/batch/${params.year}/${params.semester}`)
				.then((res) => res.json() as Promise<{ class: string }[]>)
				.then((data) => setBatches(data));
		}
        handleClick(1);
	}, [params.semester]);
	useEffect(() => {
		if (params.batch.length > 0) {
			fetch(`/batch/${params.year}/${params.semester}/${params.batch}`)
				.then((res) => res.json() as Promise<Recap[]>)
				.then((data) => setRecaps(data));
		}
        handleClick(2);
	}, [params.batch]);
	useEffect(() => {
		if (params.course !== null) {
			fetch(`/recap/${params.course.rid}`)
				.then((res) => res.json() as Promise<GradeAverage[]>)
				.then((data) => setGrades(data));
		}
        handleClick(3);
	}, [params.course]);

	//Object.entries(params).forEach(([k, v], i) => console.log(k[i]));
	//console.log(`params:`, params);

	return (
		<>
			<h4>Years</h4>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{years.map((year) => (
					<div
						key={year.year}
						style={{ cursor: "pointer", backgroundColor: params.year === year.year ? "#42fd84" : "", padding: "0 10px" }}
						onClick={() => setParams({ ...params, year: year.year })}
					>
						{year.year}
					</div>
				))}
			</div>
			{params.year.length !== 0 && (
				<>
					<h4>Semesters</h4>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{semesters.map((semester) => (
							<div
								key={semester.semester}
								style={{ cursor: "pointer", backgroundColor: params.semester === semester.semester ? "#42fd84" : "", padding: "0 10px" }}
								onClick={() => setParams({ ...params, semester: semester.semester })}
							>
								{semester.semester}
							</div>
						))}
					</div>
				</>
			)}
			{params.semester.length !== 0 && (
				<>
					<h4>Batches</h4>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{batches.map((batch) => (
							<div
								key={batch.class}
								style={{ cursor: "pointer", backgroundColor: params.batch === batch.class ? "#42fd84" : "", padding: "0 10px" }}
								onClick={() => setParams({ ...params, batch: batch.class })}
							>
								{batch.class}
							</div>
						))}
					</div>
				</>
			)}
			{params.batch.length !== 0 && (
				<>
					<h4>Recaps</h4>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{recaps.map((recap) => (
							<div key={recap.rid}
								style={{ cursor: "pointer", backgroundColor: params.course && params.course.rid === recap.rid ? "#42fd84" : "", padding: "0 10px" }}
								onClick={() => setParams({ ...params, course: recap })}
							>
								{recap.course}
							</div>
						))}
					</div>
				</>
			)}
			{params.course !== null && (
				<>
					<h4>Grade Average</h4>
					<table>
						<thead>
							<tr>
								<th>Grade</th>
								<th>Total</th>
								<th>Percentage(%)</th>
							</tr>
						</thead>
						<tbody>
							{grades.map((grade, index) => (
								<tr key={index}>
									<td>{grade.grade}</td>
									<td>{grade.total}</td>
									<td>{grade.per}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
			<pre style={{ textAlign: "left", color: '#d3d3d3' }}>{JSON.stringify({ index, params }, null, 4)}</pre>
		</>
	);
}

export default App;
