import User from "../../domain/user";

export default interface UserRepositoryInterface {
    save(user: User): Promise<any>;
}
