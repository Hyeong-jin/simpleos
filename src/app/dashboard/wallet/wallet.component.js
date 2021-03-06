"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var accounts_service_1 = require("../../accounts.service");
var eosjs_service_1 = require("../../eosjs.service");
var moment = require("moment");
var WalletComponent = /** @class */ (function () {
    function WalletComponent(aService, eos) {
        this.aService = aService;
        this.eos = eos;
        this.openTX = WalletComponent_1.openTXID;
        this.moment = moment;
        this.actions = [];
        this.tokens = [];
        this.headBlock = 0;
        this.fullBalance = 0;
        this.staked = 0;
        this.unstaked = 0;
        this.LIB = 0;
        this.blockTracker = null;
    }
    WalletComponent_1 = WalletComponent;
    WalletComponent.openTXID = function (value) {
        window['shell']['openExternal']('https://www.bloks.io/transaction/' + value);
    };
    WalletComponent.prototype.getInfo = function () {
        var _this = this;
        this.eos['eos']['getInfo']({}).then(function (info) {
            _this.headBlock = info['head_block_num'];
            _this.LIB = info['last_irreversible_block_num'];
        });
    };
    WalletComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.aService.lastUpdate.asObservable().subscribe(function (value) {
            if (value.account === _this.aService.selected.getValue().name) {
                _this.updateBalances();
            }
        });
        this.getInfo();
        if (!this.blockTracker) {
            this.blockTracker = setInterval(function () {
                _this.getInfo();
            }, 5000);
        }
    };
    WalletComponent.prototype.ngOnDestroy = function () {
        if (this.blockTracker) {
            clearInterval(this.blockTracker);
            this.blockTracker = null;
        }
    };
    WalletComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.aService.selected.asObservable().subscribe(function (sel) {
            if (sel['name']) {
                setImmediate(function () {
                    _this.fullBalance = sel.full_balance;
                    _this.staked = sel.staked;
                    _this.unstaked = sel.full_balance - sel.staked;
                    _this.tokens = [];
                    _this.aService.reloadActions(sel.name);
                    _this.aService.refreshFromChain();
                });
            }
        });
    };
    WalletComponent.prototype.updateBalances = function () {
        var sel = this.aService.selected.getValue();
        this.fullBalance = sel.full_balance;
        this.staked = sel.staked;
        this.unstaked = sel.full_balance - sel.staked;
    };
    WalletComponent.prototype.refresh = function () {
        this.aService.reloadActions(this.aService.selected.getValue().name);
        this.aService.refreshFromChain();
    };
    var WalletComponent_1;
    WalletComponent = WalletComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-wallet',
            templateUrl: './wallet.component.html',
            styleUrls: ['./wallet.component.css']
        }),
        __metadata("design:paramtypes", [accounts_service_1.AccountsService, eosjs_service_1.EOSJSService])
    ], WalletComponent);
    return WalletComponent;
}());
exports.WalletComponent = WalletComponent;
//# sourceMappingURL=wallet.component.js.map