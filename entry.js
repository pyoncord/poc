import("./src")
    .then((module) => module.default())
    .catch((error) => {
        alert("Failed to load Usagicord. " + error.message);
        console.error(error);
    });