import { OpenaiDetector } from './detector';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');

describe('OpenaiDetector', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	let detector: OpenaiDetector;

	beforeEach(() => {
		detector = new OpenaiDetector('mock-token');
	});

	test('detect function returns correct result for AI-generated text', async () => {
		const mockResponse = {
			status: 200,
			data: {
				choices: [
					{
						logprobs: {
							top_logprobs: [
								{
									'"': 1,
								},
							],
						},
					},
				],
			},
		};

		(axios.post as jest.Mock).mockResolvedValue(mockResponse);

		const result = await detector.detect(
			'Global Server Network: CDNs consist of a large number of servers (often called edge servers or points of presence) distributed across various locations worldwide.',
		);

		expect(result).toEqual({
			Class: 'likely',
			'AI-Generated Probability': expect.any(Number),
		});
		expect(result['AI-Generated Probability']).toBeGreaterThan(100);
		expect(result['AI-Generated Probability']).toBeLessThan(300);
	});

	test('detect function returns correct result for AI-generated text', async () => {
		const mockResponse = {
			status: 200,
			data: {
				choices: [
					{
						logprobs: {
							top_logprobs: [
								{
									'"': -0.5,
								},
							],
						},
					},
				],
			},
		};

		(axios.post as jest.Mock).mockResolvedValue(mockResponse);

		const result = await detector.detect('This is a test text');

		expect(result).toEqual({
			Class: 'unlikely',
			'AI-Generated Probability': expect.any(Number),
		});
		expect(result['AI-Generated Probability']).toBeGreaterThan(0);
		expect(result['AI-Generated Probability']).toBeLessThan(100);
	});

	test('detect function handles API error correctly', async () => {
		const errorMessage = 'API Error';
		(axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

		const result = await detector.detect('This is a test text');

		expect(result).toBe(
			'Check prompt, Length of sentence it should be more than 1,000 characters',
		);
	});

	test('detect function returns correct result for human-generated text', async () => {
		const mockResponse = {
			status: 200,
			data: {
				choices: [
					{
						logprobs: {
							top_logprobs: [
								{
									'"': -2.5,
								},
							],
						},
					},
				],
			},
		};

		(axios.post as jest.Mock).mockResolvedValue(mockResponse);

		const result = await detector.detect('This is a human-written text');

		expect(result).toEqual({
			Class: 'very unlikely',
			'AI-Generated Probability': expect.any(Number),
		});
		expect(result['AI-Generated Probability']).toBeGreaterThan(0);
		expect(result['AI-Generated Probability']).toBeLessThan(100);
	});

	test('constructor initializes header with provided token', () => {
		const token = 'test-token';
		const detector = new OpenaiDetector(token);
		expect(detector['header']['Authorization']).toBe(token);
	});

	test('constructor initializes possible_classes correctly', () => {
		const detector = new OpenaiDetector('token');
		expect(detector['possible_classes']).toEqual([
			'very unlikely',
			'unlikely',
			'unclear if it is',
			'possibly',
			'likely',
		]);
	});

	test('constructor initializes class_max correctly', () => {
		const detector = new OpenaiDetector('token');
		expect(detector['class_max']).toEqual([10, 45, 90, 98, 99]);
	});
});
