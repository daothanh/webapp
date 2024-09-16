import { App } from 'vue'
import Breadcrumb from './src/components/common/Breadcrumb.vue'
import Table from './src/components/common/Table.vue'
import Input from './src/components/common/Input.vue'
import CollapseCriteria from './src/components/base/CollapseCriteria.vue'
import Button from './src/components/common/Button.vue'
import Select from './src/components/common/Select.vue'
import DirectoryTree from './src/components/common/DirectoryTree.vue'
import DatePicker from './src/components/common/RangeDatePicker.vue'
import mixins from './src/mixins'
import InputNumber from './src/components/common/InputNumber.vue'

export default {
  install(app: App) {
    app.component('CBreadCrumb', Breadcrumb)
    app.component('CTable', Table)
    app.component('CInput', Input)
    app.component('CNumberInput', InputNumber)
    app.component('CollapseCriteria', CollapseCriteria)
    app.component('CButton', Button)
    app.component('CSelect', Select)
    app.component('CDirectoryTree', DirectoryTree)
    app.component('CRangePicker', DatePicker)

    app.mixin(mixins)
  }
}
