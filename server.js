const sass = require("node-sass");
const variables = require("bootstrap/scss/_variables.scss");

// sass.render({
//     file: "./node_modules/bootstrap/scss/bootstrap.scss",
//     outputStyle: "compressed"
// }, (err, result) => {
//     console.log(result);

//     if (err) {
//         console.error(err);
//         throw err;
//     }

//     console.log(result.css);
// });

console.log(variables);

const result = sass.renderSync({
    data: `
        $bg-color: #E74C3C;

        body {
            background-color: $bg-color;
        }
    `
});

console.log(result.css.toString());