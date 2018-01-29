const fs = require("fs");
const dirToJson = require("dir-to-json");

dirToJson("./node_modules/bootstrap/scss", (err, dirTree) => {
    if (err) {
        throw err;
    }
    else {
        console.log(dirTree);

        fs.writeFileSync("./src/bootstrap.json", JSON.stringify(dirTree));
    }
});