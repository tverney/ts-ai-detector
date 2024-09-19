import { OpenaiDetector } from './detector';
import { describe, test, expect, jest } from '@jest/globals';

jest.mock('axios');

describe('OpenaiDetector', () => {
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
