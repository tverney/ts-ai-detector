import { OpenaiDetector } from './detector';
import * as readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function main() {
	rl.question('Enter your OpenAI API token: ', (token) => {
		const detector = new OpenaiDetector(token);

		rl.question('Enter the text to analyze: ', (text) => {
			detector
				.detect(text)
				.then((result: any) => {
					console.log('Detection result:', result);
					rl.close();
				})
				.catch((error: any) => {
					console.error('Error:', error);
					rl.close();
				});
		});
	});
}

if (require.main === module) {
	main();
}
