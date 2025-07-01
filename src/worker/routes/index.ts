import { Hono } from 'hono';
const indexRoute = new Hono();
import {sql} from '../db'; // Importing from db to ensure it's initialized


indexRoute.get('/api/', async(c) => c.json({ name: 'Cloudflare' }));

indexRoute.get('/years/', async(c) => {
    try {
        const years = await sql`SELECT DISTINCT(year) FROM recap ORDER BY Year;`;
        console.log(years)
        return c.json(years, 200);
    } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
    }
});

indexRoute.get('/semesters/:year', async(c) => {
    try {
        const semesters = await sql`SELECT DISTINCT(semester) FROM recap WHERE year = ${c.req.param('year')} ORDER BY semester;`;
        console.log(semesters)
        return c.json(semesters, 200);
    } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
    }
});

indexRoute.get('/batch/:year/:semester', async(c) => {

    try {
        const batches = await sql`SELECT DISTINCT(Class) FROM recap WHERE Year = ${c.req.param('year')} AND Semester = ${c.req.param('semester')} ORDER BY Class;`;
        batches.sort((a, b) => a.class.length - b.class.length);
        console.log(batches)
        return c.json(batches, 200);
    } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
    }
});

export default indexRoute;
