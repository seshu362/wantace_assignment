# AI Usage Log (AI_LOG.md)

**Project:** Config-Driven Estimator & Owner Panel  
**Tools Used:** Antigravity AI Coding Assistant (Gemini 3.6 Flash), Node.js, Vite  

---

## 1. Summary of AI Tool Utilization

AI assistance was utilized for boilerplate generation, schema definition, and dynamic UI component composition. The primary goal was rapidly scaffolding a clean, robust, and deployable architecture while maintaining strict human oversight over formula correctness and dynamic database constraints.

---

## 2. Specific Instance of Weak/Incorrect AI Output & Rework

### Issue: String Float Handling in Calculation Engine
- **Initial AI Output:** Early code generation attempted direct multiplication on option values (`opt.multiplier * roofArea`). In the client's seed data (Config Version 3), `medium` pitch multiplier was exported as a string (`"1.12"`). While JavaScript coerces `"1.12" * 100`, edge cases like `+opt.multiplier` or empty string values in non-strict comparisons resulted in unexpected `NaN` or incorrect precision rounding in mid-point estimate ranges.
- **Correction Applied:** I created a dedicated `safeNumber(val, fallback)` utility function inside `server/src/services/calculator.js` that explicitly parses strings, validates against `isNaN()`, and applies `Math.round()` at defined formula steps.

### Issue: Hardcoded Question Keys in Table Component
- **Initial AI Output:** The initial AI suggestion for `LeadsTable.jsx` expected fixed key names (`lead.answers.roof_area`, `lead.answers.material`).
- **Correction Applied:** I refactored the expanded lead view to dynamically map over `Object.entries(lead.answers)` so that historical leads (such as `ld_0917` with legacy fields like `chimney_count`) render cleanly without broken table layout.

---

## 3. Key Codebase Components Handled Directly / Reworked

1. **`server/src/services/calculator.js`**: Formula implementation, input validation, and boundary checking.
2. **`server/src/config/db.js`**: Hybrid database connection adapter supporting both cloud MongoDB Atlas and zero-setup in-memory fallback.
3. **`client/src/components/dynamic/QuestionField.jsx`**: Dynamic input renderer enforcing total decoupling from static question definitions.
4. **`client/src/components/owner/ConfigEditor.jsx`**: Custom form state handling allowing real-time rate adjustments and live database publishing.
