<template>
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
</template>
<script lang="ts" setup>
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
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
  }
})
const initChart = () => {
  am4core.useTheme(am4themes_animated)

  const chart = am4core.create(props.chartId, am4charts.XYChart)
  chart.hiddenState.properties.opacity = 0
  if (chart.logo) {
    chart.logo.disabled = true
  }

  const chartData = props.listData.labels.map((label, index) => {
    const dataItem = { category: label }

    props.listData.datasets.forEach((dataset, datasetIndex) => {
      dataItem[`value${datasetIndex + 1}`] = dataset.data[index]
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

  const tooltip = new am4core.Tooltip()
  tooltip.label.interactionsEnabled = true
  tooltip.pointerOrientation = 'vertical'
  chart.tooltip = tooltip

  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  categoryAxis.dataFields.category = 'category'
  categoryAxis.renderer.grid.template.location = 0
  categoryAxis.renderer.minGridDistance = 20

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.min = 0
  valueAxis.calculateTotals = true
  valueAxis.renderer.minWidth = 50

  const valueAxisRight = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxisRight.min = 0
  valueAxisRight.calculateTotals = true
  valueAxisRight.renderer.minWidth = 50
  valueAxisRight.renderer.opposite = true
  valueAxisRight.renderer.grid.template.disabled = true

  categoryAxis.renderer.labels.template.fontSize = 12
  valueAxis.renderer.labels.template.fontSize = 12
  valueAxisRight.renderer.labels.template.fontSize = 12

  categoryAxis.renderer.cellStartLocation = 0.2
  categoryAxis.renderer.cellEndLocation = 0.8

  // Create series dynamically based on the datasets
  props.listData.datasets.forEach((dataset, index) => {
    const series = chart.series.push(new am4charts.ColumnSeries())
    series.name = dataset.label
    series.dataFields.categoryX = 'category'
    series.dataFields.valueY = `value${index + 1}`
    series.dataItems.template.locations.categoryX = 0.5
    series.stacked = false
    series.columns.template.width = am4core.percent(100)
    series.tooltip.pointerOrientation = 'vertical'
    series.columns.template.tooltipText = `{name}: {valueY} {dataset.unit || ''}`
    series.columns.template.tooltipHTML = `
  <div style="text-align: center; font-size:12px">
    {categoryX} <br>
    <strong>{name}</strong>: {valueY} {dataset.unit || ''} <br>
    ${
        dataset.listPercent && dataset.listPercent.length
            ? `<strong>Tỷ lệ so với ĐH nguồn cấp</strong>: {valuePercent${index + 1}}%`
            : ''
    }
  </div>
`

    if (dataset?.axisY === 'left') {
      series.yAxis = valueAxis
    } else if (dataset?.axisY === 'right') {
      series.yAxis = valueAxisRight
    }

    if (dataset.backgroundColor) {
      series.columns.template.adapter.add('fill', (fill, target) => {
        return am4core.color(dataset.backgroundColor)
      })
    }
    series.columns.template.strokeOpacity = 0

    const bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.label.text = `{valueY.formatNumber("#,###")} ${dataset?.unit || ''}`
    bullet.label.fill = am4core.color('#000000')
    bullet.label.fontSize = 10
    bullet.dy = -10
    bullet.adapter.add('disabled', (disabled, target) => {
      const valueY = target.dataItem?.valueY || 0
      return valueY === 0
    })

    if (dataset.listPercent && dataset.listPercent.length) {
      const percentBullet = series.bullets.push(new am4charts.LabelBullet())
      percentBullet.label.text = `{valuePercent${index + 1}}%`
      percentBullet.label.fill = am4core.color('#ffffff')
      percentBullet.label.fontSize = 10
      percentBullet.label.fontWeight = 700
      percentBullet.locationY = 0.5
    }

    series.columns.template.events.on('hit', (event) => {
      const label = event.target.dataItem.categoryX
      const value = event.target.dataItem.valueY

      const data = {
        label,
        value
      }
      if (props.isClickChart) {
        context.emit('onClick', data)
      }
    })

    series.columns.template.events.on('over', (event) => {
      if (props.isClickChart) {
        event.target.column.strokeOpacity = 1
        event.target.column.stroke = am4core.color('#1999E3')
      }
    })

    series.columns.template.events.on('out', (event) => {
      if (props.isClickChart) {
        event.target.column.strokeOpacity = 0
      }
    })
  })

  const legend = new am4charts.Legend()
  chart.legend = legend
  legend.position = 'bottom'
  legend.data.push({ name: series.name })

  chart.scrollbarX = new am4core.Scrollbar()
}

const createTooltip = (dataItem, dataset, index) => {
  let tooltipHTML = `<div style="text-align: center;">${dataItem.categoryX}<br><strong>${
      dataset.label
  }:</strong> {valueY} ${dataset.unit || ''}`

  if (dataItem[`valuePercent${index + 1}`] !== 0) {
    tooltipHTML += `<br><strong>Phần trăm:</strong> {valuePercent${index + 1}}%`
  }

  tooltipHTML += '</div>'
  return tooltipHTML
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
