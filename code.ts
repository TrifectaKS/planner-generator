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
// VALIDATE TEMPLATE
// --------------------------------------------------

function validateTemplate(
  template: SceneNode & ChildrenMixin
): string[] {

  const missing: string[] = [];

  for (
    let i = 1;
    i <= 7;
    i++
  ) {

    const node =
      findDayTextNode(
        template,
        i
      );

    if (!node) {
      missing.push(
        `day${i}`
      );
    }
  }


  const weekRange =
    findTextNode(
      template,
      "week-range"
    );

  if (!weekRange) {
    missing.push(
      "week-range"
    );
  }


  const month =
    findTextNode(
      template,
      "month"
    );

  if (!month) {
    missing.push(
      "month"
    );
  }

  return missing;
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
  clone: SceneNode & ChildrenMixin,
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


    const textNode =
      findDayTextNode(
        clone,
        i
      );


    if (!textNode) {

      console.warn(
        `Could not find day${i}`
      );

      continue;
    }


    await loadTextFont(
      textNode
    );


    // Examples:
    // 01.03.
    // 05.01.
    // 28.12.

    textNode.characters =
      `${getFormattedDay(date)}.${getFormattedMonth(date)}.`;


    console.log(
      `day${i} → ${textNode.characters}`
    );
  }


  // ----------------------------------------------
  // WEEK RANGE
  // ----------------------------------------------

  const weekRangeNode =
    findTextNode(
      clone,
      "week-range"
    );


  if (weekRangeNode) {

    await loadTextFont(
      weekRangeNode
    );


    const rangeText =
      `Week ${formatDateNoYear(monday)}-${formatDateNoYear(sunday)}`;


    weekRangeNode.characters =
      rangeText;


    console.log(
      `week-range → ${rangeText}`
    );

  } else {

    console.warn(
      "Could not find week-range"
    );
  }


  // ----------------------------------------------
  // MONTH
  // ----------------------------------------------
  //
  // Month is based on Sunday.
  //
  // 28.12.2026 - 03.01.2027
  //
  // Result:
  // January 2027
  //
  // ----------------------------------------------

  const monthNode =
    findTextNode(
      clone,
      "month"
    );


  if (monthNode) {

    await loadTextFont(
      monthNode
    );


    const monthName =
      getMonthName(
        sunday
      );


    monthNode.characters =
      monthName;


    console.log(
      `month → ${monthName}`
    );

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
  template: SceneNode & ChildrenMixin,
  monday: Date,
  weekIndex: number
): Promise<SceneNode> {

  const clonedNode =
    template.clone();


  const clone =
    clonedNode as SceneNode & ChildrenMixin;


  // ----------------------------------------------
  // POSITION
  // ----------------------------------------------

  const WEEK_VERTICAL_SPACING =
    50;


  clone.x =
    template.x;


  clone.y =
    template.y +
    (
      template.height +
      WEEK_VERTICAL_SPACING
    ) *
    (weekIndex + 1);


  // ----------------------------------------------
  // UPDATE CONTENT
  // ----------------------------------------------

  await populateWeek(
    clone,
    monday
  );


  return clone;
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
        selection.length !== 1
      ) {

        figma.notify(
          "Please select exactly one Template."
        );

        return;
      }


      const selected =
        selection[0];


      if (
        !("children" in selected)
      ) {

        figma.notify(
          "The selected node must contain the day layers."
        );

        return;
      }


      const template =
        selected as SceneNode & ChildrenMixin;


      // ------------------------------------------
      // VALIDATE TEMPLATE
      // ------------------------------------------

      const missing =
        validateTemplate(
          template
        );


      if (
        missing.length > 0
      ) {

        figma.notify(
          `Missing layers: ${missing.join(", ")}`
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

        const week =
          await createWeek(
            template,
            monday,
            weekIndex
          );


        generatedNodes.push(
          week
        );


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