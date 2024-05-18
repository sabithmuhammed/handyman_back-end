export default interface ICloudinary {
    saveToCloudinary(file: any): Promise<string>;
}
