<template>
  <div>
    <div class="master-detail-caption">{{ detailInfo }}</div>
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="true"
      :column-auto-width="true"
    >
      <DxColumn data-field="Subject"/>
      <DxColumn
        data-field="StartDate"
        data-type="date"
      />
      <DxColumn
        data-field="DueDate"
        data-type="date"
      />
      <DxColumn data-field="Priority"/>
      <DxColumn
        :calculate-cell-value="completedValue"
        data-type="boolean"
        caption="Completed"
      />
    </DxDataGrid>
  </div>
</template>
<script>

import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';

import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import service from './data.js';

const tasks = service.getTasks();

export default {
  components: { DxDataGrid, DxColumn },
  props: {
    templateData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const { FirstName, LastName } = this.templateData.data;
    return {
      dataSource: this.getTasks(this.templateData.key),
      detailInfo: `${FirstName} ${LastName}'s Tasks:`,
    };
  },
  methods: {
    completedValue(rowData) {
      return rowData.Status === 'Completed';
    },
    getTasks(key) {
      return new DataSource({
        store: new ArrayStore({
          data: tasks,
          key: 'ID',
        }),
        filter: ['EmployeeID', '=', key],
      });
    },
  },
};
</script>
<style>
.master-detail-caption {
  padding: 0 0 5px 10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
