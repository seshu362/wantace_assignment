import { calculateEstimate } from '../services/calculator.js';

const mockConfig = {
  config_version: 3,
  questions: [
    { key: 'roof_area', label: 'Roof Area', type: 'number', required: true, min: 300, max: 12000, active: true },
    {
      key: 'material',
      label: 'Material',
      type: 'select',
      required: true,
      active: true,
      options: [
        { value: 'asphalt_3tab', label: '3-tab', rate_per_sqft: 4.25 },
        { value: 'asphalt_arch', label: 'Architectural', rate_per_sqft: 5.90 }
      ]
    },
    {
      key: 'pitch',
      label: 'Pitch',
      type: 'select',
      required: true,
      active: true,
      options: [
        { value: 'low', label: 'Low', multiplier: 1.0 },
        { value: 'medium', label: 'Medium', multiplier: "1.12" } // string float
      ]
    },
    {
      key: 'layers',
      label: 'Layers',
      type: 'select',
      required: true,
      active: true,
      options: [
        { value: '1', label: 'One layer', tear_off_per_sqft: 1.15 }
      ]
    },
    {
      key: 'stories',
      label: 'Stories',
      type: 'select',
      required: true,
      active: true,
      options: [
        { value: '2', label: 'Two storeys', multiplier: 1.08 }
      ]
    }
  ],
  modifiers: {
    waste_factor: 0.10,
    permit_flat_fee: 350,
    range_spread_pct: 12
  }
};

const sampleAnswers = {
  roof_area: 2100,
  material: 'asphalt_arch',
  pitch: 'medium',
  layers: '1',
  stories: '2'
};

console.log("=== Testing Pricing Calculation Engine ===");
const result = calculateEstimate(mockConfig, sampleAnswers);
console.log("Calculation Result:", JSON.stringify(result, null, 2));

if (result.error) {
  console.error("Test Failed: Error returned for valid inputs");
  process.exit(1);
}

if (typeof result.estimate_low !== 'number' || typeof result.estimate_high !== 'number') {
  console.error("Test Failed: estimate_low or estimate_high is not a number");
  process.exit(1);
}

if (result.estimate_low >= result.estimate_high) {
  console.error("Test Failed: estimate_low must be strictly less than estimate_high");
  process.exit(1);
}

console.log("✓ Pricing calculator test passed successfully!");
