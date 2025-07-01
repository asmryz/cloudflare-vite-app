import { Hono } from "hono";
const indexRoute = new Hono();
import { sql } from "../db"; // Importing from db to ensure it's initialized

indexRoute.get("/api/", async (c) => c.json({ name: "Cloudflare" }));

indexRoute.get("/years/", async (c) => {
	try {
		const years = await sql`SELECT DISTINCT(year) FROM recap ORDER BY Year;`;
		console.log(years);
		return c.json(years, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

indexRoute.get("/semesters/:year", async (c) => {
	try {
		const semesters = await sql`SELECT DISTINCT(semester) FROM recap WHERE year = ${c.req.param("year")} ORDER BY semester;`;
		console.log(semesters);
		return c.json(semesters, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

indexRoute.get("/batch/:year/:semester", async (c) => {
	try {
		const batches = await sql`SELECT DISTINCT(Class) FROM recap WHERE Year = ${c.req.param("year")} AND Semester = ${c.req.param("semester")} ORDER BY Class;`;
		batches.sort((a, b) => a.class.length - b.class.length);
		console.log(batches);
		return c.json(batches, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

indexRoute.get("/batch/:year/:semester/:batch", async (c) => {
	try {
		const {year, semester, batch } = c.req.param();
		const recaps = await sql`SELECT r.rid, c.title || ' ('|| c.theory || ', ' || c.lab ||')' as course FROM recap r, course c WHERE r.cid = c.cid AND Year = ${year} AND Semester = ${semester} AND Class = ${batch};`;
		console.log(recaps);
		return c.json(recaps, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});
indexRoute.get("/recap/:rid", async (c) => {
	try {
        const { rid } = c.req.param();
        const query = await sql`SELECT  grade, total, CAST(total AS FLOAT) * 100 / CAST(SUM AS FLOAT) Per
                                FROM (
                                    SELECT * , (
                                        SELECT SUM(total)
                                        FROM (
                                            SELECT g.grade, COUNT(g.grade) total 
                                            FROM cmarks m, grade g
                                            WHERE rid = A.rid
                                            AND hid = 246
                                            AND ROUND(marks) BETWEEN g.start AND g.end
                                            GROUP BY g.grade
                                        ) B
                                    ) SUM
                                    FROM (
                                    SELECT rid, g.grade, COUNT(g.grade) total 
                                    FROM cmarks m, grade g
                                    WHERE m.rid = ${rid}
                                    AND hid = 246
                                    AND ROUND(marks) BETWEEN g.start AND g.end
                                    GROUP BY m.rid, g.grade
                                    ) A
                                ) C`;
        console.log(query)
		return c.json(query, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

export default indexRoute;
