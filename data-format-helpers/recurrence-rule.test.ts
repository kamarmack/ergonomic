import {
	isRecurrenceRuleData,
	getRecurrenceRuleData,
	getRecurrenceRuleString,
	RecurrenceRuleData,
} from './recurrence-rule.js';

describe('Recurrence Rule Tests', () => {
	// Tests for isRecurrenceRuleData
	describe('isRecurrenceRuleData', () => {
		it('should return true for valid RecurrenceRuleData', () => {
			const data: RecurrenceRuleData = {
				FREQ: 'MONTHLY',
				DTSTART: '20220211T000000Z',
				COUNT: 10,
			};
			expect(isRecurrenceRuleData(data)).toBe(true);
		});

		it('should return false for invalid frequency', () => {
			const data = {
				FREQ: 'INVALID_FREQ',
				DTSTART: '20220211T000000Z',
			};
			expect(isRecurrenceRuleData(data as RecurrenceRuleData)).toBe(false);
		});

		it('should return false for missing DTSTART', () => {
			const data = {
				FREQ: 'MONTHLY',
			};
			expect(isRecurrenceRuleData(data as RecurrenceRuleData)).toBe(false);
		});

		it('should return false for invalid COUNT type', () => {
			const data = {
				FREQ: 'WEEKLY',
				DTSTART: '20220211T000000Z',
				COUNT: 'not-a-number',
			};
			expect(isRecurrenceRuleData(data as unknown as RecurrenceRuleData)).toBe(
				false,
			);
		});

		it('should return true if UNTIL is a valid string', () => {
			const data = {
				FREQ: 'YEARLY',
				DTSTART: '20220211T000000Z',
				UNTIL: '20230501T000000Z',
			};
			expect(isRecurrenceRuleData(data as RecurrenceRuleData)).toBe(true);
		});
	});

	// Tests for getRecurrenceRuleData
	describe('getRecurrenceRuleData', () => {
		it('should parse a valid recurrence rule string with COUNT', () => {
			const ruleString = 'FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36';
			const expectedData: RecurrenceRuleData = {
				FREQ: 'MONTHLY',
				DTSTART: '20220211T000000Z',
				COUNT: 36,
			};
			expect(getRecurrenceRuleData(ruleString)).toEqual(expectedData);
		});

		it('should parse a valid recurrence rule string with UNTIL', () => {
			const ruleString =
				'FREQ=MONTHLY;DTSTART=20220211T000000Z;UNTIL=20230501T000000Z';
			const expectedData: RecurrenceRuleData = {
				FREQ: 'MONTHLY',
				DTSTART: '20220211T000000Z',
				UNTIL: '20230501T000000Z',
			};
			expect(getRecurrenceRuleData(ruleString)).toEqual(expectedData);
		});

		it('should parse a valid recurrence rule string with only FREQ and DTSTART', () => {
			const ruleString = 'FREQ=WEEKLY;DTSTART=20230307T000000Z';
			const expectedData: RecurrenceRuleData = {
				FREQ: 'WEEKLY',
				DTSTART: '20230307T000000Z',
			};
			expect(getRecurrenceRuleData(ruleString)).toEqual(expectedData);
		});

		it('should return null for invalid frequency in rule string', () => {
			const ruleString = 'FREQ=INVALID;DTSTART=20220211T000000Z;COUNT=10';
			expect(getRecurrenceRuleData(ruleString)).toBeNull();
		});

		it('should return null for missing DTSTART in rule string', () => {
			const ruleString = 'FREQ=DAILY;COUNT=10';
			expect(getRecurrenceRuleData(ruleString)).toBeNull();
		});
	});

	// Tests for getRecurrenceRuleString
	describe('getRecurrenceRuleString', () => {
		it('should convert RecurrenceRuleData with COUNT to a valid rule string', () => {
			const data: RecurrenceRuleData = {
				FREQ: 'MONTHLY',
				DTSTART: '20220211T000000Z',
				COUNT: 36,
			};
			const expectedString = 'FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36';
			expect(getRecurrenceRuleString(data)).toBe(expectedString);
		});

		it('should convert RecurrenceRuleData with UNTIL to a valid rule string', () => {
			const data: RecurrenceRuleData = {
				FREQ: 'YEARLY',
				DTSTART: '20230307T000000Z',
				UNTIL: '20240524T000000Z',
			};
			const expectedString =
				'FREQ=YEARLY;DTSTART=20230307T000000Z;UNTIL=20240524T000000Z';
			expect(getRecurrenceRuleString(data)).toBe(expectedString);
		});

		it('should convert RecurrenceRuleData without COUNT or UNTIL to a valid rule string', () => {
			const data: RecurrenceRuleData = {
				FREQ: 'DAILY',
				DTSTART: '20230307T000000Z',
			};
			const expectedString = 'FREQ=DAILY;DTSTART=20230307T000000Z';
			expect(getRecurrenceRuleString(data)).toBe(expectedString);
		});

		it('should handle edge case with both COUNT and UNTIL', () => {
			const data: RecurrenceRuleData = {
				FREQ: 'WEEKLY',
				DTSTART: '20230307T000000Z',
				COUNT: 10,
				UNTIL: '20230507T000000Z',
			};
			const expectedString =
				'FREQ=WEEKLY;DTSTART=20230307T000000Z;COUNT=10;UNTIL=20230507T000000Z';
			expect(getRecurrenceRuleString(data)).toBe(expectedString);
		});
	});
});
