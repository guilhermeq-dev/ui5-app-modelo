sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "com/alfa/ui5appmodelo/connection/connector"
], 
function (JSONModel, Device, connector) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        createProduct: function (data) {
            return connector.create("/Products", data);
        },
        deleteProduct: function (sProductId) {
            return connector.delete(`/Products(${sProductId})`);
        },
        updateProduct: function (sProductId, data) {
            return connector.update(`/Products(${sProductId})`, data);
        }
    };

});