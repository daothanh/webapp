import type { App } from 'vue';
import CollapseCriteria from './src/components/base/collapse-criteria.vue'
import ModalConfirmEdit from './src/components/base/modal-confirm-edit.vue'
import FormatPrice from './src/components/base/format-price.vue'
import ModalImportFile from './src/components/base/modal-import-file.vue'
import ModalProgressImportFile from './src/components/base/modal-progress-import-file.vue'
import ModalSentOtp from './src/components/base/modal-sent-otp.vue'
import OtpInput from './src/components/base/otp-input.vue'
import SelectBranch from './src/components/base/select-branch.vue'
import UploadFile from './src/components/base/upload-file.vue'
import UploadImage from './src/components/base/upload-image.vue'
import ValidationInput from './src/components/base/validation-input.vue'
import BarChart from './src/components/common/bar-chart.vue'
import LineChart from './src/components/common/line-chart.vue'
import Breadcrumb from './src/components/common/breadcrumb.vue'
import Table from './src/components/common/table.vue'
import Input from './src/components/common/input.vue'
import Button from './src/components/common/button.vue'
import CCheckbox from './src/components/common/checkbox.vue'
import Select from './src/components/common/select.vue'
import DirectoryTree from './src/components/common/directory-tree.vue'
import DatePicker from './src/components/common/range-date-picker.vue'
import InputNumber from './src/components/common/input-number.vue'
import CDropdown from './src/components/common/dropdown.vue'
import FullScreenModal from './src/components/common/full-screen-modal.vue'
import LoadingCircle from './src/components/common/loading-circle.vue'
import LoadingDots from './src/components/common/loading-dots.vue'
import SingleOtpInput from './src/components/common/single-otp-input.vue'
import mixins from './src/mixins'

const _default = {
  install(app: App) {
    app.component('CBreadCrumb', Breadcrumb)
    app.component('BarChart', BarChart)
    app.component('LineChart', LineChart)
    app.component('CCheckbox', CCheckbox)
    app.component('CDropdown', CDropdown)
    app.component('FullScreenModal', FullScreenModal)
    app.component('CTable', Table)
    app.component('CInput', Input)
    app.component('CNumberInput', InputNumber)
    app.component('CollapseCriteria', CollapseCriteria)
    app.component('CButton', Button)
    app.component('CSelect', Select)
    app.component('CDirectoryTree', DirectoryTree)
    app.component('CRangePicker', DatePicker)
    app.component('ModalConfirmEdit', ModalConfirmEdit)
    app.component('FormatPrice', FormatPrice)
    app.component('ModalImportFile', ModalImportFile)
    app.component('ModalProgressImportFile', ModalProgressImportFile)
    app.component('ModalSentOtp', ModalSentOtp)
    app.component('OtpInput', OtpInput)
    app.component('SelectBranch', SelectBranch)
    app.component('UploadFile', UploadFile)
    app.component('UploadImage', UploadImage)
    app.component('ValidationInput', ValidationInput)
    app.component('LoadingCircle', LoadingCircle)
    app.component('LoadingDots', LoadingDots)
    app.component('SingleOtpInput', SingleOtpInput)

    app.mixin(mixins)
  }
}
export * from './src/composable'
export * from './src/layouts'
export default _default
