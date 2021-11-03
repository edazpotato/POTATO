import { DatabaseType } from "./types";
import { open } from "sqlite";
import path from "path";
import sqlite3 from "sqlite3";

// import Git from "nodegit";


export function missingEnvVarError(
	variable: string,
	whereToGetTokenFrom: string,
) {
	return new Error(
		`Missing environment variable ${variable.toUpperCase()}. Make sure it's set in your .env file. Get your token ${whereToGetTokenFrom}`,
	);
}

export async function openDatabase(): Promise<DatabaseType> {
	return new Promise((resolve, reject) => {
		open({
			filename: path.join("data", "informationpedestal.db"),
			driver: sqlite3.Database,
		})
			.then(async (db) => resolve(db))
			.catch(async (err) => reject(err));
	});
}

const onlineTimstamp = Date.now();

// let gitCommit: {
// 	hash: { full: string; short: string };
// 	author: { name: string; email: string };
// 	message: string;
// 	date: Date;
// };
// Git.Repository.open(process.cwd())
// 	.then((repository) => {
// 		return repository.getHeadCommit();
// 	})
// 	.then((commit) => {
// 		const date = commit.date();
// 		const message = commit.message();

// 		const author = commit.author();
// 		gitCommit = {
// 			...gitCommit,
// 			author: { name: author.name(), email: author.email() },
// 			message,
// 			date,
// 		};
// 		return commit.sha();
// 	})
// 	.then((hash) => {
// 		gitCommit = {
// 			...gitCommit,
// 			hash: {
// 				full: hash,
// 				short: hash.slice(0, 7),
// 			},
// 		};
// 	});

export { onlineTimstamp };
