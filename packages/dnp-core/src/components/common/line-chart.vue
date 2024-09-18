<template>
  <div>
    <div
        v-if="loading"
        class="w-full flex items-center justify-center"
        :style="{ height: `${height}px` }"
    >
      <a-spin />
    </div>
    <div
        v-if="!loading && listData"
        :id="chartId"
        class="w-full flex justify-center"
        :class="{ 'cursor-pointer': isClickChart }"
        :style="{ height: `${height}px` }"
    ></div>
    <div
        v-if="!loading && !listData"
        class="w-full flex items-center justify-center"
        :style="{ height: `${height}px` }"
    >
      Không có dữ liệu
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4lang_vi_VN from "@amcharts/amcharts4/lang/vi_VN";
import moment from "moment/moment";
import {watch} from "vue";

const props = defineProps({
  listData: {
    type: Object,
    required: true
  },
  chartId: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    default: 400
  },
  loading: {
    type: Boolean,
    default: false
  },
  isClickChart: {
    type: Boolean,
    default: false
  },
  unitAxisLeft: {
    type: String,
    default: ''
  },
  unitAxisRight: {
    type: String,
    default: ''
  }
})
const initChart = () => {
  am4core.useTheme(am4themes_animated)

  const chart = am4core.create(props.chartId, am4charts.XYChart)
  chart.hiddenState.properties.opacity = 0
  chart.language.locale = am4lang_vi_VN

  if (chart.logo) {
    chart.logo.disabled = true
  }

  const legend = new am4charts.Legend()
  chart.legend = legend
  legend.position = 'bottom'

  const chartData = props.listData.labels.map((label, index) => {
    const dataItem = {
      dateTime: moment(label, 'DD/MM/YYYY HH:mm').format('HH:mm DD/MM/YYYY')
    }

    props.listData.datasets.forEach((dataset, datasetIndex) => {
      dataItem[`value${datasetIndex + 1}`] = dataset.data[index]?.toFixed(2)
      if (dataset.listPercent && dataset.listPercent.length) {
        dataItem[`valuePercent${datasetIndex + 1}`] = dataset.listPercent[index]
      }

      if (dataset.backgroundColor) {
        dataItem[`backgroundColor${datasetIndex + 1}`] = dataset.backgroundColor
      }
    })

    return dataItem
  })

  chart.data = chartData

  const categoryAxis = chart.xAxes.push(new am4charts.DateAxis())
  // categoryAxis.startLocation = 0.5
  // categoryAxis.endLocation = 0.5
  categoryAxis.renderer.minGridDistance = 50
  categoryAxis.dateFormats.setKey('minute', 'HH:mm')
  categoryAxis.periodChangeDateFormats.setKey('hour', '[bold]HH:mm dd/MM')
  categoryAxis.dateFormatter.dateFormat = 'HH:mm - dd/MM/yyyy'
  categoryAxis.dateFormatter.inputDateFormat = 'HH:mm - dd/MM/yyyy'
  categoryAxis.tooltipDateFormat = 'HH:mm - dd/MM/yyyy'

  const axisTooltip = categoryAxis.tooltip
  axisTooltip.background.strokeWidth = 0

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.title.text = props.unitAxisLeft || 'm'
  valueAxis.title.fontWeight = 'bold'
  valueAxis.title.fill = am4core.color('#4196F0')
  valueAxis.min = 0
  valueAxis.cursorTooltipEnabled = false

  const valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxisRight.title.text = props.unitAxisRight || 'm3/h'
  valueAxisRight.renderer.opposite = true
  valueAxisRight.title.fontWeight = 'bold'
  valueAxisRight.title.fill = am4core.color('#4196F0')
  valueAxisRight.min = 0
  valueAxisRight.cursorTooltipEnabled = false

  valueAxis.renderer.labels.template.fontSize = 12
  valueAxisRight.renderer.labels.template.fontSize = 12
  const axisLine = valueAxis.renderer.line
  axisLine.strokeOpacity = 1
  axisLine.stroke = am4core.color('#D9D9D9')
  axisLine.strokeWidth = 1

  const axisLineRight = valueAxisRight.renderer.line
  axisLineRight.strokeOpacity = 1
  axisLineRight.stroke = am4core.color('#D9D9D9')
  axisLineRight.strokeWidth = 1

  // Create series dynamically based on the datasets
  props.listData.datasets.forEach((dataset, index) => {
    const series = chart.series.push(new am4charts.LineSeries())
    series.name = dataset.label
    series.dataFields.dateX = 'dateTime'
    series.dataFields.valueY = `value${index + 1}`
    series.strokeWidth = 2
    series.fillOpacity = 0
    series.tooltipText = `{name}: {valueY} ${dataset.unit || ''}`
    series.minBulletDistance = 10
    series.tooltip.getFillFromObject = false

    if (dataset?.axisY === 'left') {
      series.yAxis = valueAxis
    } else if (dataset?.axisY === 'right') {
      series.yAxis = valueAxisRight
    }

    if (dataset.backgroundColor) {
      series.stroke = am4core.color(dataset.backgroundColor)
      series.tooltip.background.fill = am4core.color(dataset.backgroundColor)
    }
  })

  chart.scrollbarX = new am4core.Scrollbar()
  chart.cursor = new am4charts.XYCursor()
}

watch(
    () => props.listData,
    () => {
      if (props.listData && props.listData.labels && props.listData.datasets) {
        setTimeout(() => {
          initChart()
        }, 200)
      }
    }
)
</script>
