import("./src")
    .then((module) => module.default())
    .catch((error) => {
        alert("Failed to load pyoncord. " + error.message);
        console.error(error);
    });