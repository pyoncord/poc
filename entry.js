import("./src")
    .then(({ default: init }) => init())
    .catch((error) => {
        alert("Failed to load pyoncord. " + error.message);
        console.error(error);
    });