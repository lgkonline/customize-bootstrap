const fs = require("fs");
const path = require("path");
const dirToJson = require("dir-to-json");

const bootstrapDirOutputPath = path.resolve(__dirname, "src/data/bootstrap.dir.json");
const bootstrapVariablesOutputPath = path.resolve(__dirname, "src/data/bootstrap.variables.json");

const bootstrapTypesPath = path.resolve(__dirname, "src/data/bootstrap.types.json");
let bootstrapTypes = require(bootstrapTypesPath);
bootstrapTypes.boolean = [];

/**
 * Save Bootstrap directory structure as JSON
 */

dirToJson("./node_modules/bootstrap/scss", (err, dirTree) => {
    if (err) {
        throw err;
    }
    else {
        console.log("Write file to " + bootstrapDirOutputPath);
        fs.writeFileSync(bootstrapDirOutputPath, JSON.stringify(dirTree));
    }
});


/**
 * Convert Sass variables to JSON
 */

const scss = fs.readFileSync("./node_modules/bootstrap/scss/_variables.scss").toString();
const lines = scss.split("\n");

const sections = [
    "Color system",
    "Options",
    "Spacing",
    "Body",
    "Links",
    "Paragraphs",
    "Grid breakpoints",
    "Grid containers",
    "Grid columns",
    "Components",
    "Fonts",
    "Tables",
    "Buttons + Forms",
    "Buttons",
    "Forms",
    "Form validation",
    "Dropdowns",
    "Z-index master list",
    "Navs",
    "Navbar",
    "Pagination",
    "Jumbotron",
    "Cards",
    "Tooltips",
    "Popovers",
    "Toasts",
    "Badges",
    "Modals",
    "Alerts",
    "Progress bars",
    "List group",
    "Image thumbnails",
    "Figures",
    "Breadcrumbs",
    "Carousel",
    "Spinners",
    "Close",
    "Code",
    "Utilities",
    "Printing"
];

const outputObjects = {};

let i = 0;
let j = "";
lines.forEach(line => {
    // lines[i + 1].substring(0, 2) == "//" && !lines[i + 1][2]

    if (
        line.substring(0, 2) == "//"
    ) {
        // Is section begin
        const sectionName = line.replace("//", "").trim();

        if (sections.join("---").toLowerCase().indexOf(sectionName.toLowerCase()) > -1 && sectionName !== "") {
            j = sectionName;

            outputObjects[j] = {
            };
        }
    }

    let currentSection = outputObjects[j];

    if (line[0] == "$") {
        // Is variable
        const match = line.match(/\$(.*?):(.*?);/);

        if (match && match[1] && match[2]) {
            let name = "$" + match[1];
            let value = match[2].trim();
            currentSection[name] = value;

            if (value === "false !default" || value === "true !default") {
                // is boolean
                bootstrapTypes.boolean.push(name);
            }
        }
    }

    i++;
});

console.log("Write file to " + bootstrapVariablesOutputPath);
fs.writeFileSync(bootstrapVariablesOutputPath, JSON.stringify(outputObjects));



console.log("Write file to " + bootstrapTypesPath);
fs.writeFileSync(bootstrapTypesPath, JSON.stringify(bootstrapTypes));