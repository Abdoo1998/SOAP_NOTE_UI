import { parseSoapNote } from '../soapParser';

describe('SOAP Note Parser', () => {
  it('correctly parses a complete SOAP note with ## headers', () => {
    const sampleNote = `## Subjective
Patient reports severe headache for the past 3 days
Pain level: 7/10
No previous history of migraines

## Objective
Temperature: 98.6°F
Blood Pressure: 120/80
Heart Rate: 72 bpm

## Assessment
Primary: Tension headache
Secondary: Stress-related symptoms

## Plan
1. Prescribed ibuprofen 400mg
2. Rest for 24 hours
3. Follow-up in 1 week`;

    const parsed = parseSoapNote(sampleNote);

    expect(parsed.subjective).toContain('Patient reports severe headache');
    expect(parsed.objective).toContain('Temperature: 98.6°F');
    expect(parsed.assessment).toContain('Primary: Tension headache');
    expect(parsed.plan).toContain('1. Prescribed ibuprofen');
  });

  it('handles empty sections', () => {
    const sampleNote = `## Subjective
Patient reports headache

## Objective

## Assessment
Tension headache

## Plan
Rest`;

    const parsed = parseSoapNote(sampleNote);

    expect(parsed.subjective).toBe('Patient reports headache');
    expect(parsed.objective).toBe('');
    expect(parsed.assessment).toBe('Tension headache');
    expect(parsed.plan).toBe('Rest');
  });

  it('ignores content before first section', () => {
    const sampleNote = `Some random content
## Subjective
Patient reports headache`;

    const parsed = parseSoapNote(sampleNote);
    expect(parsed.subjective).toBe('Patient reports headache');
  });
});