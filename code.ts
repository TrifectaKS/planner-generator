const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Inter, sans-serif;
      padding: 16px;
      margin: 0;
    }

    h2 {
      margin-top: 0;
      font-size: 18px;
    }

    label {
      display: block;
      margin-top: 12px;
      margin-bottom: 5px;
      font-size: 12px;
      font-weight: 600;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 13px;
    }

    .info {
      margin-top: 12px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.5;
    }

    .buttons {
      display: flex;
      gap: 8px;
      margin-top: 18px;
    }

    button {
      flex: 1;
      padding: 9px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 13px;
    }

    #cancel {
      background: #eee;
    }

    #generate {
      background: #18a0fb;
      color: white;
    }
  </style>
</head>

<body>

  <h2>Weekly Planner Generator</h2>

  <label for="startDate">Start date</label>
  <input type="date" id="startDate">

  <label for="endDate">End date</label>
  <input type="date" id="endDate">

  <div class="info">
    Weeks run from Monday to Sunday.<br><br>
    The first week includes the complete Monday–Sunday
    week containing the start date.<br><br>
    The last week includes the complete Monday–Sunday
    week containing the end date.
  </div>

  <div class="buttons">
    <button id="cancel">Cancel</button>
    <button id="generate">Generate</button>
  </div>

  <script>
    document.getElementById("cancel").onclick = () => {
      parent.postMessage(
        { pluginMessage: { type: "cancel" } },
        "*"
      );
    };

    document.getElementById("generate").onclick = () => {

      const startDate =
        document.getElementById("startDate").value;

      const endDate =
        document.getElementById("endDate").value;

      if (!startDate || !endDate) {
        alert("Please select both dates.");
        return;
      }

      parent.postMessage(
        {
          pluginMessage: {
            type: "generate",
            startDate,
            endDate
          }
        },
        "*"
      );
    };
  </script>

</body>
</html>
`;

figma.showUI(html, {
  width: 320,
  height: 400
});


// --------------------------------------------------
// DATE HELPERS
// --------------------------------------------------

function parseDate(
  value: string
): Date | null {

  if (!value) {
    return null;
  }

  const parts =
    value.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]) - 1;

  const day =
    Number(parts[2]);

  const date =
    new Date(
      year,
      month,
      day
    );

  if (isNaN(date.getTime())) {
    return null;
  }

  return normalizeDate(date);
}


function normalizeDate(
  date: Date
): Date {

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}


function addDays(
  date: Date,
  days: number
): Date {

  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return normalizeDate(result);
}


function getMonday(
  date: Date
): Date {

  const result =
    normalizeDate(date);

  const day =
    result.getDay();

  // Sunday = 0
  // Monday = 1
  // Tuesday = 2
  // ...
  // Saturday = 6

  const daysFromMonday =
    day === 0
      ? 6
      : day - 1;

  result.setDate(
    result.getDate() -
    daysFromMonday
  );

  return normalizeDate(result);
}


// --------------------------------------------------
// FORMATTING HELPERS
// --------------------------------------------------

function padNumber(
  number: number
): string {

  return String(
    number
  ).padStart(2, "0");
}


function getFormattedMonth(
  date: Date
): string {

  return padNumber(
    date.getMonth() + 1
  );
}


function getFormattedDay(
  date: Date
): string {

  return padNumber(
    date.getDate()
  );
}


function formatDate(
  date: Date
): string {

  const day =
    getFormattedDay(date);

  const month =
    getFormattedMonth(date);

  const year =
    date.getFullYear();

  return `${day}.${month}.${year}.`;
}


function formatDateNoYear(
  date: Date
): string {

  const day =
    getFormattedDay(date);

  const month =
    getFormattedMonth(date);

  return `${day}.${month}.`;
}


// --------------------------------------------------
// MONTH NAME
// --------------------------------------------------

function getMonthName(
  date: Date
): string {

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    months[date.getMonth()] +
    " " +
    date.getFullYear()
  );
}


function getMonthRangeName(
  monday: Date,
  sunday: Date
): string {

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const mondayMonth =
    months[monday.getMonth()];

  const mondayYear =
    monday.getFullYear();

  const sundayMonth =
    months[sunday.getMonth()];

  const sundayYear =
    sunday.getFullYear();

  const sameYear =
    mondayYear === sundayYear;

  const sameMonth =
    monday.getMonth() === sunday.getMonth();

  if (sameMonth && sameYear) {
    return `${sundayMonth} ${sundayYear}`;
  }

  if (sameYear) {
    return `${mondayMonth}/${sundayMonth} ${sundayYear}`;
  }

  return `${mondayMonth} ${mondayYear}/${sundayMonth} ${sundayYear}`;
}


// --------------------------------------------------
// FIND TEXT NODE
// --------------------------------------------------

function findTextNode(
  parent: ChildrenMixin,
  targetName: string
): TextNode | null {

  for (
    const child of parent.children
  ) {

    if (
      child.name === targetName &&
      child.type === "TEXT"
    ) {

      return child;
    }

    if ("children" in child) {

      const result: TextNode | null =
        findTextNode(
          child as ChildrenMixin,
          targetName
        );

      if (result) {
        return result;
      }
    }
  }

  return null;
}


function findDayTextNode(
  parent: ChildrenMixin,
  dayNumber: number
): TextNode | null {

  return findTextNode(
    parent,
    `day${dayNumber}`
  );
}


// --------------------------------------------------
// AGGREGATE LAYERS FROM SELECTIONS
// --------------------------------------------------

interface AggregatedLayers {
  dayNodes: TextNode[][];
  weekRangeNodes: TextNode[];
  monthNodes: TextNode[];
  missingLayers: string[];
}

function aggregateLayersFromSelections(
  selections: readonly SceneNode[]
): AggregatedLayers {

  const dayNodes: TextNode[][] = Array.from({ length: 7 }, () => []);
  const weekRangeNodes: TextNode[] = [];
  const monthNodes: TextNode[] = [];
  const missingLayers: string[] = [];

  for (
    const selection of selections
  ) {

    if (!("children" in selection)) {
      continue;
    }

    const node = selection as SceneNode & ChildrenMixin;

    for (let i = 1; i <= 7; i++) {
      const found = findDayTextNode(node, i);
      if (found) {
        dayNodes[i - 1].push(found);
      }
    }

    const weekRangeFound = findTextNode(node, "week-range");
    if (weekRangeFound) {
      weekRangeNodes.push(weekRangeFound);
    }

    const monthFound = findTextNode(node, "month");
    if (monthFound) {
      monthNodes.push(monthFound);
    }
  }

  for (let i = 1; i <= 7; i++) {
    if (dayNodes[i - 1].length === 0) {
      missingLayers.push(`day${i}`);
    }
  }

  if (weekRangeNodes.length === 0) {
    missingLayers.push("week-range");
  }

  if (monthNodes.length === 0) {
    missingLayers.push("month");
  }

  return {
    dayNodes,
    weekRangeNodes,
    monthNodes,
    missingLayers
  };
}


// --------------------------------------------------
// LOAD FONT
// --------------------------------------------------

async function loadTextFont(
  textNode: TextNode
): Promise<void> {

  if (
    textNode.fontName !== figma.mixed
  ) {

    await figma.loadFontAsync(
      textNode.fontName as FontName
    );

    return;
  }


  const fonts =
    textNode.getRangeAllFontNames(
      0,
      textNode.characters.length
    );


  for (
    const font of fonts
  ) {

    await figma.loadFontAsync(
      font
    );
  }
}


// --------------------------------------------------
// POPULATE WEEK
// --------------------------------------------------

async function populateWeek(
  dayNodes: TextNode[][],
  weekRangeNodes: TextNode[],
  monthNodes: TextNode[],
  monday: Date
): Promise<void> {

  const sunday =
    addDays(
      monday,
      6
    );


  // ----------------------------------------------
  // DAY 1 - DAY 7
  // ----------------------------------------------

  for (
    let i = 1;
    i <= 7;
    i++
  ) {

    const date =
      addDays(
        monday,
        i - 1
      );


    const nodes =
      dayNodes[i - 1];


    if (nodes.length === 0) {

      console.warn(
        `Could not find day${i}`
      );

      continue;
    }


    const newDateText =
      `${getFormattedDay(date)}.${getFormattedMonth(date)}.`;


    for (const textNode of nodes) {

      await loadTextFont(textNode);

      textNode.characters = newDateText;

      console.log(
        `day${i} → ${textNode.characters}`
      );
    }
  }


  // ----------------------------------------------
  // WEEK RANGE
  // ----------------------------------------------

  if (weekRangeNodes.length > 0) {

    const rangeText =
      `Week ${formatDateNoYear(monday)} - ${formatDateNoYear(sunday)}`;


    for (const weekRangeNode of weekRangeNodes) {

      await loadTextFont(weekRangeNode);

      weekRangeNode.characters = rangeText;

      console.log(
        `week-range → ${rangeText}`
      );
    }

  } else {

    console.warn(
      "Could not find week-range"
    );
  }


  // ----------------------------------------------
  // MONTH
  // ----------------------------------------------

  if (monthNodes.length > 0) {

    const monthName =
      getMonthRangeName(
        monday,
        sunday
      );


    for (const monthNode of monthNodes) {

      await loadTextFont(monthNode);

      monthNode.characters = monthName;

      console.log(
        `month → ${monthName}`
      );
    }

  } else {

    console.warn(
      "Could not find month"
    );
  }
}


// --------------------------------------------------
// CREATE WEEK COPY
// --------------------------------------------------

async function createWeek(
  templates: readonly SceneNode[],
  monday: Date,
  weekIndex: number
): Promise<SceneNode[]> {

  const clones: (SceneNode & ChildrenMixin)[] = [];
  const baseX = templates[0].x;
  const baseY = templates[0].y;
  let maxHeight = 0;
  const NODE_HORIZONTAL_SPACING = 10;

  for (
    let i = 0;
    i < templates.length;
    i++
  ) {
    const template = templates[i];
    const clonedNode = template.clone();
    const clone = clonedNode as SceneNode & ChildrenMixin;

    clone.x =
      baseX +
      (template.width + NODE_HORIZONTAL_SPACING) * i;

    clone.y = baseY;

    maxHeight = Math.max(maxHeight, template.height);

    clones.push(clone);
  }

  const WEEK_VERTICAL_SPACING = 50;
  for (const clone of clones) {
    clone.y =
      baseY +
      (maxHeight + WEEK_VERTICAL_SPACING) *
      (weekIndex + 1);
  }

  const dayNodes: TextNode[][] = Array.from({ length: 7 }, () => []);
  for (let i = 1; i <= 7; i++) {
    for (const clone of clones) {
      const found = findDayTextNode(clone, i);
      if (found) {
        dayNodes[i - 1].push(found);
      }
    }
  }

  const weekRangeNodes: TextNode[] = [];
  for (const clone of clones) {
    const found = findTextNode(clone, "week-range");
    if (found) {
      weekRangeNodes.push(found);
    }
  }

  const monthNodes: TextNode[] = [];
  for (const clone of clones) {
    const found = findTextNode(clone, "month");
    if (found) {
      monthNodes.push(found);
    }
  }

  await populateWeek(
    dayNodes,
    weekRangeNodes,
    monthNodes,
    monday
  );

  return clones;
}


// --------------------------------------------------
// PLUGIN MESSAGE HANDLER
// --------------------------------------------------

figma.ui.onmessage =
  async (msg) => {

    // --------------------------------------------
    // CANCEL
    // --------------------------------------------

    if (
      msg.type === "cancel"
    ) {

      figma.closePlugin();

      return;
    }


    // --------------------------------------------
    // GENERATE
    // --------------------------------------------

    if (
      msg.type === "generate"
    ) {

      const startDate =
        parseDate(
          msg.startDate
        );


      const endDate =
        parseDate(
          msg.endDate
        );


      // ------------------------------------------
      // VALIDATE DATES
      // ------------------------------------------

      if (
        !startDate ||
        !endDate
      ) {

        figma.notify(
          "Please enter valid dates."
        );

        return;
      }


      if (
        startDate > endDate
      ) {

        figma.notify(
          "Start date must be before end date."
        );

        return;
      }


      // ------------------------------------------
      // VALIDATE SELECTION
      // ------------------------------------------

      const selection =
        figma.currentPage.selection;


      if (
        selection.length === 0
      ) {

        figma.notify(
          "Please select at least one Template."
        );

        return;
      }


      const validSelections =
        selection.filter(
          (node): node is SceneNode & ChildrenMixin =>
            "children" in node
        );


      if (
        validSelections.length === 0
      ) {

        figma.notify(
          "No valid template selected."
        );

        return;
      }


      // ------------------------------------------
      // AGGREGATE LAYERS FROM SELECTIONS
      // ------------------------------------------

      const {
        dayNodes,
        weekRangeNodes,
        monthNodes,
        missingLayers
      } = aggregateLayersFromSelections(validSelections);


      if (
        missingLayers.length > 0
      ) {

        figma.notify(
          `Missing layers: ${missingLayers.join(", ")}`
        );

        return;
      }


      // ------------------------------------------
      // FIRST MONDAY
      // ------------------------------------------

      let monday =
        getMonday(
          startDate
        );


      // ------------------------------------------
      // LAST MONDAY
      // ------------------------------------------

      const lastMonday =
        getMonday(
          endDate
        );


      // ------------------------------------------
      // CREATE WEEKS
      // ------------------------------------------

      const generatedNodes:
        SceneNode[] = [];


      let weekIndex =
        0;


      while (
        monday <= lastMonday
      ) {

        const weeks =
          await createWeek(
            validSelections,
            monday,
            weekIndex
          );

        for (const clone of weeks) {
          generatedNodes.push(clone);
        }


        monday =
          addDays(
            monday,
            7
          );


        weekIndex++;
      }


      // ------------------------------------------
      // SELECT GENERATED WEEKS
      // ------------------------------------------

      figma.currentPage.selection =
        generatedNodes;


      // ------------------------------------------
      // ZOOM
      // ------------------------------------------

      if (
        generatedNodes.length > 0
      ) {

        figma.viewport.scrollAndZoomIntoView(
          generatedNodes
        );
      }


      // ------------------------------------------
      // DONE
      // ------------------------------------------

      figma.notify(
        `Generated ${generatedNodes.length} week${
          generatedNodes.length === 1
            ? ""
            : "s"
        }.`
      );


      console.log(
        `Generated ${generatedNodes.length} weeks.`
      );
    }
  };