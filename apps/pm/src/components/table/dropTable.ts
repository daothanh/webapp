export default <T>(dataSource: Array<T>) => {
  let dragItem: T
  let targItem: T
  const customRow = (record: T) => {
    return {
      draggable: true,
      ondrag() {
        dragItem = record
      },
      ondrop() {
        targItem = record
      },
      ondragend() {
        if (dragItem !== targItem) {
          const dragItemIndex = dataSource.indexOf(dragItem)
          const targItemIndex = dataSource.indexOf(targItem)
          ;[dataSource[dragItemIndex], dataSource[targItemIndex]] = [
            dataSource[targItemIndex],
            dataSource[dragItemIndex]
          ]
        }
      },
      ondragover() {
        return false
      }
    }
  }

  return {
    customRow
  }
}
