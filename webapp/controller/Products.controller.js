sap.ui.define([
    "../controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "com/alfa/ui5appmodelo/model/models",
    "com/alfa/ui5appmodelo/model/formatter"
], (BaseController, MessageToast, MessageBox, JSONModel, models, formatter) => {
    "use strict";

    return BaseController.extend("com.alfa.ui5appmodelo.controller.Products", {
        formatter: formatter,
        onInit() {
            this.getUser();
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

            if (!this._createDialog) {
                this._createDialog = sap.ui.xmlfragment(viewId, "com.alfa.ui5appmodelo.view.fragments.CreateProduct", this);
                this.getView().addDependent(this._createDialog)
            };

            this._createDialog.open();
        },
        onCreateProduct() {
            this.setBusy(true);
            const oCreateModel = this.getModel('createProduct');
            const oData = oCreateModel.getData();
            const oModel = this.getView().getModel();
            models.createProduct(oData)
                .then((res) => {
                    oModel.refresh();
                    MessageBox.success(`Produto '${res.Name}' foi criado com sucesso!`);
                })
                .catch((oError) => {
                    MessageBox.error(oError);
                })
                .finally(() => {
                    this._createDialog.close();
                    this.setBusy(false);
                })
        },
        handleDeleteProduct(oEvent) {
            this.setBusy(true);
            const oSelectedItem = oEvent.getSource();
            const sProduct = oSelectedItem.getBindingContext().getProperty('ID');
            const oModel = this.getModel();
            MessageBox.confirm("Tem certeza que deseja excluir este produto?", {
                title: "Alerta",
                icon: MessageBox.Icon.WARNING,
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        models.deleteProduct(sProduct)
                            .then(() => {
                                oModel.refresh();
                                MessageBox.success(`Produto removido com sucesso!`)
                            })
                            .catch((oError) => {
                                MessageBox.error(oError);
                            })
                            .finally(() => {
                                this.setBusy(false);
                            })
                    }
                }
            })
        },
        handleEditProduct(oEvent) {
            const oSelectedItem = oEvent.getSource();
            const oProduct = oSelectedItem.getBindingContext().getObject();

            const oEditModel = new JSONModel(oProduct);
            this.getView().setModel(oEditModel, "editProduct");

            if (!this._editDialog) {
                this._editDialog = sap.ui.xmlfragment(this.getView().getId(), "com.alfa.ui5appmodelo.view.fragments.EditProduct", this);
                this.getView().addDependent(this._editDialog);
            };

            this._editDialog.open();
        },
        onEditProduct: function () {
            this.setBusy(true);
            const oEditModel = this.getView().getModel("editProduct");
            const oData = oEditModel.getData();

            const oUpdatedData = { ...oData, ReleaseDate: "/Date(-2208988800000)/" };

            const oModel = this.getModel();

            models.updateProduct(oUpdatedData.ID, oUpdatedData)
                .then(() => {
                    oModel.refresh();
                    MessageBox.success(`Produto atualizado com sucesso!`);
                })
                .catch((oError) => {
                    MessageBox.error(oError);
                })
                .finally(() => {
                    this._editDialog.close();
                    this.setBusy(false);
                });
        },
        onCloseDialog(oEvent) {
            const dialog = oEvent.getSource().getParent();
            dialog.close();
        },
        async getUser() {
            const oComponent = this.getOwnerComponent();
            const baseUrl = oComponent.getManifestObject().resolveUri('user-api/currentUser');
            await fetch(baseUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(String(response.status));
                    }
                    return response.json();
                }).then((data) => {
                    this.setModel(data, 'user');
                })
                .catch((error) => {
                    this.setModel({}, 'user');
                    // this.setModel({ scopes: ["FIORI_APP_MODELO_ADMIN"] }, 'user');
                    MessageBox.error("Erro ao buscar informações do usuario", { details: error.message });
                })
        }
    });
});