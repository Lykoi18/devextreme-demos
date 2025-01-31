const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let treeView;

  const syncTreeViewSelection = function (treeViewInstance) {
    if (!treeViewInstance) return;

    if (!$scope.treeBoxValue) {
      treeViewInstance.unselectAll();
    } else {
      treeViewInstance.selectItem($scope.treeBoxValue);
    }
  };

  const makeAsyncDataSource = function (jsonFile) {
    return new DevExpress.data.CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return $.getJSON(`../../../../data/${jsonFile}`);
      },
    });
  };

  const treeDataSource = makeAsyncDataSource('treeProducts.json');
  const gridDataSource = makeAsyncDataSource('customers.json');

  $scope.treeBoxValue = '1_1';
  $scope.isGridBoxOpened = false;

  $scope.treeBoxOptions = {
    bindingOptions: {
      value: 'treeBoxValue',
      opened: 'isGridBoxOpened',
    },
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    dataSource: treeDataSource,
    onValueChanged() {
      syncTreeViewSelection(treeView);
    },
    treeView: {
      dataSource: treeDataSource,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      displayExpr: 'name',
      selectByClick: true,
      selectNodesRecursive: false,
      selectionMode: 'single',
      onContentReady(e) {
        treeView = e.component;

        syncTreeViewSelection(treeView);
      },
      onItemSelectionChanged(args) {
        $scope.treeBoxValue = args.component.getSelectedNodeKeys();
      },
      onItemClick() {
        $scope.isGridBoxOpened = false;
      },
    },
  };

  $scope.gridBoxValue = 3;
  $scope.gridSelectedRowKeys = [$scope.gridBoxValue];
  $scope.isTreeBoxOpened = false;

  $scope.gridBoxOptions = {
    bindingOptions: {
      value: 'gridBoxValue',
      opened: 'isTreeBoxOpened',
    },
    valueExpr: 'ID',
    deferRendering: false,
    placeholder: 'Select a value...',
    displayExpr(item) {
      return item && `${item.CompanyName} <${item.Phone}>`;
    },
    onValueChanged(e) {
      $scope.gridSelectedRowKeys = e.value || [];
    },
    showClearButton: true,
    dataSource: gridDataSource,
    dataGrid: {
      dataSource: gridDataSource,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      height: '100%',
      bindingOptions: {
        selectedRowKeys: 'gridSelectedRowKeys',
      },
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        $scope.gridBoxValue = (keys.length && keys[0]) || null;
        $scope.isTreeBoxOpened = false;
      },
    },
  };
});
