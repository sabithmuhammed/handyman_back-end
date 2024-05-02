export default interface HashPassword {
    createHash(password: string): Promise<string>;
    compare(password: string, HashPassword: string): Promise<boolean>;
}

