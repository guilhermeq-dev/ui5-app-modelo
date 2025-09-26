sap.ui.define([
    "../controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "com/alfa/ui5appmodelo/model/models"
], (BaseController, MessageToast, MessageBox, JSONModel, models) => {
    "use strict";

    return BaseController.extend("com.alfa.ui5appmodelo.controller.Products", {
        onInit() {
        },
        handleCreateProduct() {
            const viewId = this.getView().getId();

            const oData = {
                ID: "",
                Name: "",
                Description: "",
                Rating: "",
                Price: ""
            }
        
            this.setModel(oData, "createProduct")

            if(!this._createDialog) {
                this._createDialog = sap.ui.xmlfragment(viewId, "com.alfa.ui5appmodelo.view.fragments.CreateProduct", this);
                this.getView().addDependent(this._createDialog)
            };

            this._createDialog.open();
        },
        onCreateProduct() {
            const oCreateModel = this.getModel('createProduct');
            const oData = oCreateModel.getData();
            const oModel = this.getView().getModel();
            models.createProduct(oData)
                .then((res) => {
                    MessageBox.success(`Produto '${res.Name}' foi criado com sucesso!`);
                    oModel.refresh();
                    this._createDialog.close();
                })
                .catch((oError) => {
                    MessageBox.error(oError);
                });
        },
        handleDeleteProduct(oEvent) {
            const oSelectedItem = oEvent.getSource();
            const sProduct = oSelectedItem.getBindingContext().getProperty('ID');
            const oModel = this.getModel();
            MessageBox.confirm("Tem certeza que deseja excluir este produto?", {
                title: "Alerta", 
                icon: MessageBox.Icon.WARNING,
                onClose: (oAction) => {
                    if(oAction === MessageBox.Action.OK) {
                        models.deleteProduct(sProduct)
                            .then(() => {
                                oModel.refresh();
                                MessageBox.success(`Produto removido com sucesso!`)
                            })
                            .catch((oError) => {
                                MessageBox.error(oError);
                            })
                    }
                }
            })
        },
        onCloseDialog(oEvent) {
            const dialog = oEvent.getSource().getParent();
            dialog.close();
        }
    });
});