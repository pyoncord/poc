const {
    RTNFileManager
} = ReactNative.NativeModules;

/**
 * A wrapper to write to a file to the documents directory
 * @param path Path to the file
 * @param data String data to write to the file
 */
export async function writeFile(path: string, data: string, prefix = "pyoncord/"): Promise<void> {
    return void await RTNFileManager.writeFile("documents", `${prefix}${path}`, data, "utf8");
}

/**
 * A wrapper to read a file from the documents directory
 * @param path Path to the file
 * @param fallback Fallback data to return if the file doesn't exist, and will be written to the file
 */
export async function readFile(path: string, fallback: string, prefix = "pyoncord/"): Promise<string> {
    try {
        return await RTNFileManager.readFile(`${RTNFileManager.getConstants().DocumentsDirPath}/${prefix}${path}`, "utf8");
    } catch {
        writeFile(path, fallback);
        return fallback;
    }
}
