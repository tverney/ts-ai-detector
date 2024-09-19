import { OpenaiDetector } from './detector';
import { describe, test, expect, jest } from '@jest/globals';

jest.mock('axios');

describe('OpenaiDetector', () => {
	test('constructor initializes header with provided token', () => {
		const token =
			'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJwd2RfYXV0aF90aW1lIjoxNzI2NzcyNjg2OTk0LCJzZXNzaW9uX2lkIjoicGdXMVJXNG9nOHk2TElwZFdISW00WlMtQlBmSE80TGoiLCJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ0aGlhZ28udmVybmV5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAzMjAxNzU3NDI4MjUyOTg4NTU1IiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcyNjc3MjY4OCwiZXhwIjoxNzI3NjM2Njg4LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwiYXpwIjoiRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0QifQ.go2NQCIkXSxng3l-zsKp7Srkzvn7DysLHwszXExZeTqoC6CWXrm50QL3FW_F1dkcauxOENgpGqwsdNTYdS6UEfFUOPXG2kGmW2PcsaYxQI5YPF2Ll9dzDyG2lY6uc-7Cl_HANRxOWjwFTYEPrCzv8C9uijPtMXAhgmrVDQwgW9MVUeSwzsM8yTDo-9zS8aS2nl2qXmi_vOGa07LusVD5obAwAQIu6I-K-jLBrXCDGH0gOdano0cjavSYPlQfOPpihhcVu23NSjKej2wko2Gz8NI-s-sUvuQKCFhrMfaCxmVR-qiIbzbUU3fIqYolE4fueKCq6gAO6AuOWYC8xR-hBA';
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
