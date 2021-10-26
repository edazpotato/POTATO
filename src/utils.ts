import { Database, open } from "sqlite";

import path from "path";
import sqlite3 from "sqlite3";

export function missingEnvVarError(
	variable: string,
	whereToGetTokenFrom: string,
) {
	return new Error(
		`Missing environment variable ${variable.toUpperCase()}. Make sure it's set in your .env file. Get your token ${whereToGetTokenFrom}`,
	);
}

export async function openDatabase(): Promise<
	Database<sqlite3.Database, sqlite3.Statement>
> {
	return new Promise((resolve, reject) => {
		open({
			filename: path.join("data", "informationpedestal.db"),
			driver: sqlite3.Database,
		})
			.then(async (db) => resolve(db))
			.catch(async (err) => reject(err));
	});
}
