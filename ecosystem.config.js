module.exports = {
    apps: [
        {
            name: "project1", // Name of your application
            script: "./index.js", // Main file to run
            watch: true, // Watch for file changes and restart app
            env: {
                NODE_ENV: "development", // Set environment variables
                PORT: 5050,
            },
            log_date_format: "YYYY-MM-DD HH:mm Z",
        },
    ],
};
