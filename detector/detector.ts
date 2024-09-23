import axios, { AxiosResponse } from 'axios';

export class OpenaiDetector {
	private header: Record<string, string>;
	private possible_classes: string[];
	private class_max: number[];

	constructor(private token: string) {
		this.header = {
			Accept: '*/*',
			'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
			Authorization: `Bearer ${token}`,
			Connection: 'keep-alive',
			'Content-Type': 'application/json',
			Origin: 'https://platform.openai.com',
			Referer: 'https://platform.openai.com/',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-site',
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
			'sec-ch-ua':
				'"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
		};

		this.possible_classes = [
			'very unlikely',
			'unlikely',
			'unclear if it is',
			'possibly',
			'likely',
		];
		this.class_max = [10, 45, 90, 98, 99];
	}

	public detect(text: string, all_probs = false): any {
		const data = {
			prompt: text + '».\n<|disc_score|>',
			max_tokens: 1,
			temperature: 1,
			top_p: 1,
			n: 1,
			logprobs: 5,
			stop: '\n',
			stream: false,
			model: 'model-detect-v2',
		};

		return axios
			.post('https://api.openai.com/v1/completions', data, {
				headers: this.header,
			})
			.then((response: AxiosResponse) => {
				if (response.status === 200) {
					const choices = response.data.choices[0];
					const logprobs = choices.logprobs.top_logprobs[0];
					const probs: Record<string, number> = Object.entries(logprobs).reduce(
						(acc, [key, value]) => ({
							...acc,
							[key]: 100 * Math.E ** (value as number),
						}),
						{},
					);
					const key_prob = probs['"'];

					let class_label: string;
					if (
						this.class_max[0] < key_prob &&
						key_prob < this.class_max[this.class_max.length - 1]
					) {
						const val = Math.max(...this.class_max.filter((i) => i < key_prob));
						class_label = this.possible_classes[this.class_max.indexOf(val)];
					} else if (this.class_max[0] > key_prob) {
						class_label = this.possible_classes[0];
					} else {
						class_label =
							this.possible_classes[this.possible_classes.length - 1];
					}

					const top_prob = {
						Class: class_label,
						'AI-Generated Probability': key_prob,
					};
					return all_probs ? [probs, top_prob] : top_prob;
				}
			})
			.catch((error) => {
				console.error(error);
				return 'Check prompt, Length of sentence it should be more than 1,000 characters';
			});
	}
}
