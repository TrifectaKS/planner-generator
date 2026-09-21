Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.

# Weekly Planner Generator

A Figma plugin that automatically creates weekly planner copies from selected templates.

The plugin takes a **start date** and **end date**, then generates one planner copy for every complete Monday–Sunday week between those dates.

---

## Features

* Generates weekly planner copies automatically.
* Weeks always run **Monday → Sunday**.
* Automatically expands partial date ranges to complete weeks.
* Updates the dates inside each generated planner.
* Supports weeks that cross:
  * Months
  * Years
* Automatically displays the month and year based on the **Sunday/end date** of each week.
* Generated planners are stacked vertically below the template.
* Preserves the original template.
* **Multiple template selections**: Select multiple templates to contribute different layers.
* **All matching nodes updated**: When multiple nodes share the same layer name, all are updated.
* **Optional visibility toggling**: Automatic month and week selection visibility in calendars section.

---

# 1. Set Up the Figma Template

Before running the plugin, create a planner design in Figma.

Your planner should be inside **one or more parent frames/components/groups** that will act as the templates.

For example (single template):

```text
Template
├── day1
├── day2
├── day3
├── day4
├── day5
├── day6
├── day7
├── week-range
└── month
```

Or (multiple templates):

```text
Selection 1                    Selection 2
├── Header                     ├── day3
│   ├── month                  ├── day4
│   └── week-range             ├── day5
└── Days row                   ├── day6
    ├── day1                   └── day7
    └── day2
```

The layers can be nested inside other frames or groups. They do **not** have to be direct children of `Template`.

The plugin searches recursively for the required text layers.

---

# 2. Required Text Layers

The template must contain the following **TEXT layers** with these exact names:

| Layer name   | Purpose        | Example              |
| ------------ | -------------- | -------------------- |
| `day1`       | Monday         | `28.12.`             |
| `day2`       | Tuesday        | `29.12.`             |
| `day3`       | Wednesday      | `30.12.`             |
| `day4`       | Thursday       | `31.12.`             |
| `day5`       | Friday         | `01.01.`             |
| `day6`       | Saturday       | `02.01.`             |
| `day7`       | Sunday         | `03.01.`             |
| `week-range` | Week range     | `Week 28.12.-03.01.` |
| `month`      | Month and year | `January 2027`       |

### Important

The names must match **exactly**.

For example:

```text
day1
```

is correct.

```text
Day1
```

is not.

Likewise:

```text
week-range
```

is correct.

```text
week range
```

is not.

---

# 3. Multiple Template Selections

You can select **multiple templates** to contribute different layers.

For example:

```text
Selection 1: Contains day1, day2, week-range, month
Selection 2: Contains day3, day4, day5, day6, day7
```

The plugin aggregates all layers from all selections and updates them across all generated clones.

Generated clones are placed side-by-side horizontally with **10px spacing**.

---

# 4. All Matching Nodes Updated

When multiple nodes share the same layer name (e.g., multiple `day1` layers), **all** matching nodes are updated with the correct date.

This is useful when your template design has the same date appearing in multiple places.

---

# 5. Recommended Template Structure

You can organize the visual design however you want.

For example:

```text
Template
│
├── Header
│   ├── month
│   └── week-range
│
├── Monday
│   └── day1
│
├── Tuesday
│   └── day2
│
├── Wednesday
│   └── day3
│
├── Thursday
│   └── day4
│
├── Friday
│   └── day5
│
├── Saturday
│   └── day6
│
└── Sunday
    └── day7
```

This is only an example.

The plugin does not require this exact structure.

The important part is that the required text layers exist somewhere inside the selected templates.

---

# 6. Layer Names

A simple way to set up the template is to create your text layers and rename them:

```text
day1
day2
day3
day4
day5
day6
day7
week-range
month
```

For example, the visual design could look like:

```text
┌─────────────────────────────────────┐
│           January 2027              │
│        Week 28.12.-03.01.           │
│                                     │
│  MON   TUE   WED   THU   FRI   SAT  SUN
│  28.   29.   30.   31.   01.   02.  03.
│  12.   12.   12.   12.   01.   01.  01.
│                                     │
└─────────────────────────────────────┘
```

The actual design is completely up to you.

---

# 7. Template Container

Select one or more parent nodes containing the planner elements.

For example:

```text
Template
```

This can be a:

* Frame
* Component
* Component set child
* Instance
* Group
* Other Figma scene node that contains children

The plugin uses these selected nodes as the source for the generated copies.

### Important

You must select **at least one template** before clicking Generate.

---

# 8. Date Formatting

The plugin automatically replaces the contents of the date layers.

The seven day layers use:

```text
DD.MM.
```

For example:

```text
01.03.
02.03.
03.03.
04.03.
05.03.
06.03.
07.03.
```

Leading zeros are included.

So:

```text
1.3.
```

becomes:

```text
01.03.
```

---

# 9. Week Range

The `week-range` layer is automatically populated with:

```text
Week DD.MM.-DD.MM.
```

For example:

```text
Week 28.12.-03.01.
```

The year is intentionally not displayed in the week range.

---

# 10. Month

The `month` layer displays the **month name and year**.

The month is determined by the **Sunday/end date of the week**.

For example:

### Week within one month

Monday:

```text
28.12.2026
```

Sunday:

```text
03.01.2027
```

The month layer becomes:

```text
January 2027
```

### Week crossing months (same year)

Monday:

```text
29.03.2027
```

Sunday:

```text
04.04.2027
```

The month layer becomes:

```text
March/April 2027
```

### Week crossing a year

Monday:

```text
28.12.2026
```

Sunday:

```text
03.01.2027
```

The month layer becomes:

```text
December 2026/January 2027
```

---

# 11. How Date Ranges Work

The plugin always generates **complete Monday–Sunday weeks**.

For example, if you enter:

```text
Start: 30.12.2026
End: 02.01.2027
```

The plugin does not generate only those four days.

Instead, it generates the complete week:

```text
Monday 28.12.2026
        ↓
Sunday 03.01.2027
```

The result is:

```text
28.12.  29.12.  30.12.  31.12.  01.01.  02.01.  03.01.
 Mon     Tue     Wed     Thu     Fri     Sat     Sun
```

---

# 12. Multiple Weeks

If the selected date range covers multiple weeks, the plugin creates one copy per week.

For example:

```text
Start: 30.12.2026
End:   15.01.2027
```

The generated weeks are:

```text
Week 28.12.-03.01.
Week 04.01.-10.01.
Week 11.01.-17.01.
```

The final week is included because it contains the selected end date.

---

# 13. Generated Layout

The original template is not modified.

Instead, the plugin clones all selected templates for each week.

The generated copies are placed:

- **Vertically**: Each week is stacked below the previous with **50px spacing**
- **Horizontally**: Multiple template selections are placed side-by-side with **10px spacing**

For example, with 2 template selections:

```text
Week 1:  [Template1]  10px  [Template2]
           ↓ 50px
Week 2:  [Template1]  10px  [Template2]
           ↓ 50px
Week 3:  [Template1]  10px  [Template2]
```

---

# 14. Optional Calendars Section

The plugin can optionally toggle visibility of month and week selection components.

### Calendars Section

If a `calendars` section exists inside the template, the plugin will:

1. Look for child components named after months (e.g., `january`, `february`)
2. Hide all month components
3. Unhide only the component matching the current month

Example structure:

```text
Template
├── calendars
│   ├── january
│   ├── february
│   ├── march
│   └── ...
└── ...
```

### Week Selection

If week selection components exist, the plugin will:

1. Look for components matching the pattern `week{N}/{total}-selection` (e.g., `week1/5-selection`, `week3/4-selection`)
2. Hide all week selections
3. Unhide only the selection matching the current week

Example structure:

```text
Template
├── calendars
│   ├── week1/5-selection
│   ├── week2/5-selection
│   ├── week3/5-selection
│   ├── week4/5-selection
│   ├── week5/5-selection
│   └── ...
└── ...
```

Supported patterns:
- `week{N}/4-selection` (4-week month)
- `week{N}/5-selection` (5-week month)
- `week{N}/6-selection` (6-week month)

### Important

This feature is **completely optional**. If the `calendars` section or week selection components are not found, the plugin continues without error.

---

# 15. Installing the Plugin for Development

If you are developing the plugin locally:

### Step 1 — Create the plugin

In Figma:

**Plugins → Development → Import plugin from manifest...**

Select the plugin's:

```text
manifest.json
```

---

### Step 2 — Compile the TypeScript

The plugin source is written in:

```text
code.ts
```

The compiled plugin file is:

```text
code.js
```

Make sure the TypeScript compiler generates `code.js` before running the plugin.

The manifest should point to:

```json
{
  "main": "code.js"
}
```

---

### Step 3 — Run the plugin

In Figma:

**Plugins → Development → Weekly Planner Generator**

---

# 16. Using the Plugin

### Step 1

Create your planner template(s).

### Step 2

Make sure the required text layers exist:

```text
day1
day2
day3
day4
day5
day6
day7
week-range
month
```

### Step 3

Select one or more templates.

For example:

```text
Selection 1: Template with day1, day2, day3, week-range, month
Selection 2: Template with day4, day5, day6, day7
```

### Step 4

Run the plugin.

### Step 5

Choose a start date.

### Step 6

Choose an end date.

### Step 7

Click:

```text
Generate
```

The plugin will create the required weekly copies.

---

# 17. Example

Suppose you select a template and enter:

```text
Start date: 29.12.2026
End date:   12.01.2027
```

The plugin calculates the surrounding Monday–Sunday weeks.

It generates:

### Week 1

```text
Monday    28.12.2026
Tuesday   29.12.2026
Wednesday 30.12.2026
Thursday  31.12.2026
Friday    01.01.2027
Saturday  02.01.2027
Sunday    03.01.2027
```

```text
week-range: Week 28.12.-03.01.
month: December 2026/January 2027
```

### Week 2

```text
Monday    04.01.2027
Tuesday   05.01.2027
Wednesday 06.01.2027
Thursday  07.01.2027
Friday    08.01.2027
Saturday  09.01.2027
Sunday    10.01.2027
```

```text
week-range: Week 04.01.-10.01.
month: January 2027
```

### Week 3

```text
Monday    11.01.2027
Tuesday   12.01.2027
Wednesday 13.01.2027
Thursday  14.01.2027
Friday    15.01.2027
Saturday  16.01.2027
Sunday    17.01.2027
```

```text
week-range: Week 11.01.-17.01.
month: January 2027
```

---

# 18. Troubleshooting

## "Please select at least one Template."

Make sure at least one node is selected before generating.

Select the parent template rather than an individual text layer.

---

## "Missing layers: day1, day2..."

The plugin could not find one or more required text layers.

Check that the layers are named exactly:

```text
day1
day2
day3
day4
day5
day6
day7
week-range
month
```

Also make sure they are **TEXT** layers.

---

## Dates are not changing

Check that:

1. The layers are actually TEXT layers.
2. Their names are correct.
3. At least one template is selected.
4. The plugin is running the latest compiled `code.js`.
5. The TypeScript source has been compiled after the latest changes.

The plugin also loads the required fonts before replacing text.

---

## The month looks wrong

The month is based on the **Sunday/end date** of the week.

For example:

```text
Monday 28.12.2026
Sunday 03.01.2027
```

will display:

```text
December 2026/January 2027
```

This is intentional for weeks spanning two months.

---

# 19. Template Checklist

Before using the plugin, verify:

* [ ] At least one parent template exists.
* [ ] `day1` exists as a TEXT layer (in any selection).
* [ ] `day2` exists as a TEXT layer (in any selection).
* [ ] `day3` exists as a TEXT layer (in any selection).
* [ ] `day4` exists as a TEXT layer (in any selection).
* [ ] `day5` exists as a TEXT layer (in any selection).
* [ ] `day6` exists as a TEXT layer (in any selection).
* [ ] `day7` exists as a TEXT layer (in any selection).
* [ ] `week-range` exists as a TEXT layer (in any selection).
* [ ] `month` exists as a TEXT layer (in any selection).
* [ ] All required layers are somewhere inside the selected templates.
* [ ] At least one template is selected before running the plugin.

---

# 20. Required Layer Names — Quick Reference

Copy these names exactly:

```text
day1
day2
day3
day4
day5
day6
day7
week-range
month
```

---

## Summary

The workflow is:

```text
Create Template(s)
      ↓
Add required TEXT layers
      ↓
Name layers correctly
      ↓
Select Template(s)
      ↓
Run Plugin
      ↓
Choose Start Date
      ↓
Choose End Date
      ↓
Generate
      ↓
Weekly planner copies
```

The original template remains unchanged, and the plugin creates complete Monday–Sunday planner copies for the selected date range.
