import IFileOperations from "../../use_case/interface/IFileOperations";
import fs from "fs/promises";

export default class FileOperations implements IFileOperations {
    async deleteFile(paths: string | string[]): Promise<void> {
        try {
            if (typeof paths === "string") {
                await fs.unlink(paths);
                console.log("file deleted successfully");
                return;
            }
            await Promise.all(
                paths.map(async (path) => {
                    await fs.unlink(path);
                })
            );
            console.log("files deleted successfully");
        } catch (error) {
            console.log("error while deleting file:", error);
        }
    }
}
