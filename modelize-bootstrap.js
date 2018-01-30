const fs = require("fs");
const path = require("path");
const dirToJson = require("dir-to-json");

const bootstrapDirOutputPath = path.resolve(__dirname, "src/bootstrap.dir.json");
const bootstrapVariablesOutputPath = path.resolve(__dirname, "src/bootstrap.variables.json");

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

const outputObjects = [];

let i = 0;
let j = -1;
lines.forEach(line => {
    if (
        line.substring(0, 2) == "//" &&
        lines[i + 1].substring(0, 2) == "//" && !lines[i + 1][2]
    ) {
        // Is section begin
        j++;

        outputObjects[j] = {
            sectionName: line.replace("//", "").trim(),
            variables: {}
        };
    }

    let currentSection = outputObjects[j];

    if (line[0] == "$") {
        // Is variable
        const match = line.match(/\$(.*?):(.*?);/);

        if (match && match[1] && match[2]) {
            currentSection.variables["$" + match[1]] = match[2].trim();
        }
    }

    i++;
});

console.log("Write file to " + bootstrapVariablesOutputPath);
fs.writeFileSync(bootstrapVariablesOutputPath, JSON.stringify(outputObjects));