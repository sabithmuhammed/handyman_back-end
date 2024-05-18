export default interface IFileOperations {
    deleteFile(paths: string[] | string): Promise<void>;
}
