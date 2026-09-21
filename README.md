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

A quick and dirty Figma plugin that automatically creates weekly planner copies from a selected template.

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

---

# 1. Set Up the Figma Template

Before running the plugin, create a planner design in Figma.

Your planner should be inside **one parent frame/component/group** that will act as the template.

For example:

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

# 3. Recommended Template Structure

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

The important part is that the required text layers exist somewhere inside the selected template.

---

# 4. Layer Names

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

# 5. Template Container

Select one parent node containing all of the planner elements.

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

The plugin uses this selected node as the source for the generated copies.

### Important

You must select **exactly one template** before clicking Generate.

---

# 6. Date Formatting

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

# 7. Week Range

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

# 8. Month

The `month` layer displays the **full month name and year**.

The month is determined by the **Sunday/end date of the week**.

For example:

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
January 2027
```

### Week crossing a month

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
April 2027
```

This means the displayed month always represents the month containing the end of the planner week.

---

# 9. How Date Ranges Work

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

# 10. Multiple Weeks

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

# 11. Generated Layout

The original template is not modified.

Instead, the plugin clones it.

The generated copies are placed vertically below the original template.

The current spacing is:

```text
50px
```

between each planner.

For example:

```text
Template
   ↓
   50px
   ↓
Week 1
   ↓
   50px
   ↓
Week 2
   ↓
   50px
   ↓
Week 3
```

---

# 12. Installing the Plugin for Development

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

# 13. Using the Plugin

### Step 1

Create your planner template.

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

Select the entire template.

For example:

```text
Template
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

# 14. Example

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
month: January 2027
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

# 15. Troubleshooting

## "Please select exactly one Template."

Make sure exactly one node is selected before generating.

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
3. The template is selected.
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
January 2027
```

This is intentional.

---

# 16. Template Checklist

Before using the plugin, verify:

* [ ] One parent template exists.
* [ ] `day1` exists as a TEXT layer.
* [ ] `day2` exists as a TEXT layer.
* [ ] `day3` exists as a TEXT layer.
* [ ] `day4` exists as a TEXT layer.
* [ ] `day5` exists as a TEXT layer.
* [ ] `day6` exists as a TEXT layer.
* [ ] `day7` exists as a TEXT layer.
* [ ] `week-range` exists as a TEXT layer.
* [ ] `month` exists as a TEXT layer.
* [ ] All required layers are somewhere inside the template.
* [ ] Exactly one template is selected before running the plugin.

---

# 17. Required Layer Names — Quick Reference

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
Create Template
      ↓
Add required TEXT layers
      ↓
Name layers correctly
      ↓
Select Template
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
