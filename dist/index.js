"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = __importDefault(require("./infrastructure/config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startServer = () =>
    __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            const app = app_1.httpServer;
            const PORT = process.env.PORT || 8000;
            app.listen(PORT, () => {
                console.log(`connected to server => ${PORT}`);
            });
        } catch (error) {
            console.log(error);
        }
    });
startServer();
//# sourceMappingURL=index.js.map

module.exports = {
    apps: [
        {
            name: "my-app",
            script: "src/index.ts",
            interpreter: "./node_modules/.bin/ts-node",
            env: {
                NODE_ENV: "production",
                CORS_URL: "https://handyman-lovat.vercel.app",
                MONGO_URI:
                    "mongodb+srv://sabithmuhammed:BdfOxYRTvHrivXOK@cluster0.nfxur9h.mongodb.net/handyman",
                PORT: 5000,
                MAIL_USERNAME: "sabithmuhammed136@gmail.com",
                MAIL_PASSWORD: "srbp tctr wktc fdud",
                JWT_KEY:
                    "58yeX71WxS4UXoUB8Dk3lh+rkK0twXSIc7ALUrBs1pEErOrsubSoSOWzf+kQh+6u",
                CLOUDINARY_CLOUD: "dw8hgp7bc",
                CLOUDINARY_API_KEY: "992758859685376",
                CLOUDINARY_API_SECRET: "5l4KV2TaXMzbh5O9angb9c3FAmk",
                RAZORPAY_ID_KEY: "rzp_test_ek96OXEhD4RQx2",
                RAZORPAY_SECRET_KEY: "L9BfTyBD7U1AczDq3xw0hcue",
            },
        },
    ],
};
