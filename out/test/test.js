"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_json_1 = __importDefault(require("../secret/config.json"));
const IUniswapV2Router02_json_1 = __importDefault(require("../src/config/IUniswapV2Router02.json"));
const UniswapV2Factory_json_1 = __importDefault(require("../src/config/UniswapV2Factory.json"));
console.log("Test:");
const chainUrl = "https://http-mainnet.hecochain.com";
const addrRouterv2 = "0x00eFB96dBFE641246E961b472C0C3fC472f6a694";
const addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a";
const provider = new ethers_1.ethers.providers.JsonRpcProvider(chainUrl);
let walletProvider = new ethers_1.ethers.Wallet(config_json_1.default.secret, provider);
function loopRouter() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\nCheck v2Router contract:");
        let contract = new ethers_1.ethers.Contract(addrRouterv2, IUniswapV2Router02_json_1.default.abi, walletProvider);
        let result = yield contract.factory();
        console.log("factory: ", result);
        result = yield contract.WHT();
        console.log("WHT:", result);
    });
}
function loopFactory() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\nCheck v2Factory contract:");
        let contract = new ethers_1.ethers.Contract(addrFactory, UniswapV2Factory_json_1.default.abi, walletProvider);
        let result = yield contract.feeTo();
        console.log("feeTo: ", result);
        result = yield contract.feeToSetter();
        console.log("feeToSetter: ", result);
        result = yield contract.migrator();
        console.log("migrator: ", result);
        result = yield contract.allPairsLength();
        console.log("allpairsLength: ", result.toString());
        let pairsLength = parseInt(result.toString());
        for (let i = 0; i < pairsLength; i++) {
            result = yield contract.allPairs(i);
            console.log(result);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loopRouter();
        yield loopFactory();
    });
}
main();
//# sourceMappingURL=test.js.map