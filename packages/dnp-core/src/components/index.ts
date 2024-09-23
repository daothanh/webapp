import type { App } from 'vue';
import mixins from '../mixins'
import CollapseCriteria from './base/collapse-criteria.vue'
import ModalConfirmEdit from './base/modal-confirm-edit.vue'
import FormatPrice from './base/format-price.vue'
import ModalImportFile from './base/modal-import-file.vue'
import ModalProgressImportFile from './base/modal-progress-import-file.vue'
import ModalSentOtp from './base/modal-sent-otp.vue'
import OtpInput from './base/otp-input.vue'
import SelectBranch from './base/select-branch.vue'
import UploadFile from './base/upload-file.vue'
import UploadImage from './base/upload-image.vue'
import ValidationInput from './base/validation-input.vue'
import BarChart from './common/bar-chart.vue'
import LineChart from './common/line-chart.vue'
import Breadcrumb from './common/breadcrumb.vue'
import Table from './common/table.vue'
import Input from './common/input.vue'
import Button from './common/button.vue'
import CCheckbox from './common/checkbox.vue'
import Select from './common/select.vue'
import DirectoryTree from './common/directory-tree.vue'
import DatePicker from './common/range-date-picker.vue'
import InputNumber from './common/input-number.vue'
import CDropdown from './common/dropdown.vue'
import FullScreenModal from './common/full-screen-modal.vue'
import LoadingCircle from './common/loading-circle.vue'
import LoadingDots from './common/loading-dots.vue'
import SingleOtpInput from './common/single-otp-input.vue'

export default {
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