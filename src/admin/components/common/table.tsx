import { useMemo } from "react"
import { Table as UiTable } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"

export type TableProps = {
  columns: {
    key: string
    label?: string
    render?: (value: any) => React.ReactNode
  }[]
  data: Record<string, unknown>[]
  limit: number
  count: number
  currentPage: number
  link?: string
  setCurrentPage: (value: number) => void
}

export const Table = ({
  columns,
  data,
  limit,
  count,
  currentPage,
  link,
  setCurrentPage,

}: TableProps) => {
  const navigate = useNavigate();
  const pageCount = useMemo(() => {
    return Math.ceil(count / limit)
  }, [data, limit])

  const canNextPage = useMemo(() => {
    return currentPage < pageCount - 1
  }, [currentPage, pageCount])
  
  const canPreviousPage = useMemo(() => {
    return currentPage - 1 >= 0
  }, [currentPage])

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden !border-t-0">
      <UiTable>
        <UiTable.Header>
          <UiTable.Row>
            {columns.map((column, index) => (
              <UiTable.HeaderCell key={index}>
                {column.label || column.key}
              </UiTable.HeaderCell>
            ))}
          </UiTable.Row>
        </UiTable.Header>
        <UiTable.Body>
          {data.map((item, index) => {
            const rowIndex = "id" in item ? item.id as string : index
            return (
                <UiTable.Row key={rowIndex} onClick={link ? () => navigate(`${link}/${item.id}`) : undefined}>
                {columns.map((column, index) => (
                  <UiTable.Cell key={`${rowIndex}-${index}`}>
                  <>
                    {column.render ? column.render(item[column.key]) : item[column.key] as string}
                  </>
                  </UiTable.Cell>
                ))}
                </UiTable.Row>
            )
          })}
        </UiTable.Body>
      </UiTable>
      <UiTable.Pagination
        count={count}
        pageSize={limit}
        pageIndex={currentPage}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </div>
  )
}