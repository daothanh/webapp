import CollapseCriteria from './src/components/base/CollapseCriteria.vue'
import ModalConfirmEdit from './src/components/base/ModalConfirmEdit.vue'
import FormatPrice from './src/components/base/FormatPrice.vue'
import ModalImportFile from './src/components/base/ModalImportFile.vue'
import ModalProgressImportFile from './src/components/base/ModalProgressImportFile.vue'
import ModalSentOtp from './src/components/base/ModalSentOtp.vue'
import OtpInput from './src/components/base/OtpInput.vue'
import SelectBranch from './src/components/base/SelectBranch.vue'
import UploadFile from './src/components/base/UploadFile.vue'
import UploadImage from './src/components/base/UploadImage.vue'
import ValidationInput from './src/components/base/ValidationInput.vue'
import BarChart from './src/components/common/BarChart.vue'
import LineChart from './src/components/common/LineChart.vue'
import Breadcrumb from './src/components/common/Breadcrumb.vue'
import Table from './src/components/common/Table.vue'
import Input from './src/components/common/Input.vue'
import Button from './src/components/common/Button.vue'
import CCheckbox from './src/components/common/Checkbox.vue'
import Select from './src/components/common/Select.vue'
import DirectoryTree from './src/components/common/DirectoryTree.vue'
import DatePicker from './src/components/common/RangeDatePicker.vue'
import InputNumber from './src/components/common/InputNumber.vue'
import CDropdown from './src/components/common/Dropdown.vue'
import FilterTags from './src/components/common/FilterTags.vue'
import FullScreenModal from './src/components/common/FullScreenModal.vue'
import LoadingCircle from './src/components/common/LoadingCircle.vue'
import LoadingDots from './src/components/common/LoadingDots.vue'
import SingleOtpInput from './src/components/common/SingleOtpInput.vue'
import mixins from './src/mixins'

export default {
  install(app, options) {
    app.component('CBreadCrumb', Breadcrumb)
    app.component('BarChart', BarChart)
    app.component('LineChart', LineChart)
    app.component('CCheckbox', CCheckbox)
    app.component('CDropdown', CDropdown)
    app.component('FilterTags', FilterTags)
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
