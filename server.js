const sass = require("node-sass");

sass.render({
    file: "./node_modules/bootstrap/scss/bootstrap.scss",
    outputStyle: "compressed"
}, (err, result) => {
    console.log(result);

    if (err) {
        console.error(err);
        throw err;
    }

    console.log(result.css);
});