sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/alfa/ui5appmodelo/model/models",
    "com/alfa/ui5appmodelo/connection/connector"
], (UIComponent, models, connector) => {
    "use strict";

    return UIComponent.extend("com.alfa.ui5appmodelo.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            connector.init(this);
        }
    });
});