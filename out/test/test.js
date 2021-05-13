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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var config_json_1 = __importDefault(require("../secret/config.json"));
var IUniswapV2Router02_json_1 = __importDefault(require("../src/config/IUniswapV2Router02.json"));
var UniswapV2Factory_json_1 = __importDefault(require("../src/config/UniswapV2Factory.json"));
console.log("Test:");
var chainUrl = "https://http-mainnet.hecochain.com";
var addrRouterv2 = "0x00eFB96dBFE641246E961b472C0C3fC472f6a694";
var addrFactory = "0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a";
var provider = new ethers_1.ethers.providers.JsonRpcProvider(chainUrl);
var walletProvider = new ethers_1.ethers.Wallet(config_json_1.default.secret, provider);
function loopRouter() {
    return __awaiter(this, void 0, void 0, function () {
        var contract, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\nCheck v2Router contract:");
                    contract = new ethers_1.ethers.Contract(addrRouterv2, IUniswapV2Router02_json_1.default.abi, walletProvider);
                    return [4 /*yield*/, contract.factory()];
                case 1:
                    result = _a.sent();
                    console.log("factory: ", result);
                    return [4 /*yield*/, contract.WHT()];
                case 2:
                    result = _a.sent();
                    console.log("WHT:", result);
                    return [2 /*return*/];
            }
        });
    });
}
function loopFactory() {
    return __awaiter(this, void 0, void 0, function () {
        var contract, result, pairsLength, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\nCheck v2Factory contract:");
                    contract = new ethers_1.ethers.Contract(addrFactory, UniswapV2Factory_json_1.default.abi, walletProvider);
                    return [4 /*yield*/, contract.feeTo()];
                case 1:
                    result = _a.sent();
                    console.log("feeTo: ", result);
                    return [4 /*yield*/, contract.feeToSetter()];
                case 2:
                    result = _a.sent();
                    console.log("feeToSetter: ", result);
                    return [4 /*yield*/, contract.migrator()];
                case 3:
                    result = _a.sent();
                    console.log("migrator: ", result);
                    return [4 /*yield*/, contract.allPairsLength()];
                case 4:
                    result = _a.sent();
                    console.log("allpairsLength: ", result.toString());
                    pairsLength = parseInt(result.toString());
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < pairsLength)) return [3 /*break*/, 8];
                    return [4 /*yield*/, contract.allPairs(i)];
                case 6:
                    result = _a.sent();
                    console.log(result);
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loopRouter()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loopFactory()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
