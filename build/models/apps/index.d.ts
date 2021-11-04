/// <reference types="mongoose" />
declare const _default: {
    App: import("mongoose").Model<import("./apps").IApp, {}, {}, {}> & {
        LinkAccountTypes: {
            ALL: "all";
            PERSONAL: "personal";
            BUSINESS: "business";
        };
    };
};
export default _default;
