export default {
    source: ["src/tokens.json"],
    platforms: {
        css: {
            transformGroup: "css",
            buildPath: "build/css/",
            files: [
                {
                    destination: "variables.scss",
                    format: "scss/variables",
                },
            ],
        },
        js: {
            transformGroup: "js",
            buildPath: "build/js/",
            files: [
                {
                    destination: "tokens.js",
                    format: "javascript/es6",
                },
            ],
        },
    },
};