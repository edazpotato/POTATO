export function missingEnvVarError(
	variable: string,
	whereToGetTokenFrom: string,
) {
	return new Error(
		`Missing environment variable ${variable.toUpperCase()}. Make sure it's set in your .env file. Get your token ${whereToGetTokenFrom}`,
	);
}
