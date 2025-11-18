"use client"

import { ArrowUpDown } from "lucide-react"
import {
  Cell as AriaCell,
  Column as AriaColumn,
  ResizableTableContainer as AriaResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  ColumnResizer,
  composeRenderProps,
  Group,
} from "react-aria-components"

import { cn } from "../../lib/utils"

const ResizableTableContainer = AriaResizableTableContainer

const Table = ({ className, ...props }) => (
  <AriaTable
    className={composeRenderProps(className, (className) =>
      cn(
        "w-full caption-bottom text-sm -outline-offset-2 data-[focus-visible]:outline-ring",
        className
      )
    )}
    {...props}
  />
)

const TableHeader = ({ className, ...props }) => (
  <AriaTableHeader
    className={composeRenderProps(className, (className) =>
      cn("[&_tr]:border-b [&_tr]:border-white/10", className)
    )}
    {...props}
  />
)

const Column = ({ className, children, isResizable, ...props }) => (
  <AriaColumn
    className={composeRenderProps(className, (className) =>
      cn(
        "h-11 text-left align-middle font-medium text-white/90 -outline-offset-2 data-[focus-visible]:outline-ring",
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children, { allowsSorting }) => (
      <div className="flex items-center">
        <Group
          role="presentation"
          tabIndex={-1}
          className={cn(
            "flex h-9 flex-1 items-center gap-1 overflow-hidden rounded-md px-3.5",
            allowsSorting &&
              "p-2 data-[hovered]:bg-neutral-800/50 data-[hovered]:text-white",
            "focus-visible:outline-none data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-ring [&:has([slot=selection])]:pr-0"
          )}
        >
          <span className="truncate">{children}</span>
          {allowsSorting && <ArrowUpDown className="ml-2 size-4" />}
        </Group>
        {isResizable && (
          <ColumnResizer className="data-[focus-visible]:ring-ring box-content h-5 w-px translate-x-[8px] cursor-col-resize rounded bg-white/30 bg-clip-content px-[8px] py-1 focus-visible:outline-none data-[resizing]:w-[2px] data-[resizing]:bg-purple-400 data-[resizing]:pl-[7px] data-[focus-visible]:ring-1 data-[focus-visible]:ring-ring" />
        )}
      </div>
    ))}
  </AriaColumn>
)

const TableBody = ({ className, ...props }) => (
  <AriaTableBody
    className={composeRenderProps(className, (className) =>
      cn(
        "-outline-offset-2 data-[empty]:h-24 data-[empty]:text-center data-[focus-visible]:outline-ring [&_tr:last-child]:border-0",
        className
      )
    )}
    {...props}
  />
)

const Row = ({ className, ...props }) => (
  <AriaRow
    className={composeRenderProps(className, (className) =>
      cn(
        "border-b border-white/10 -outline-offset-2 transition-colors data-[hovered]:bg-neutral-800/50 data-[selected]:bg-neutral-800/70 data-[focus-visible]:outline-ring",
        className
      )
    )}
    {...props}
  />
)

const Cell = ({ className, ...props }) => (
  <AriaCell
    className={composeRenderProps(className, (className) =>
      cn(
        "px-3.5 py-3 align-middle text-white text-sm -outline-offset-2 data-[focus-visible]:outline-ring [&:has([role=checkbox])]:pr-0",
        className
      )
    )}
    {...props}
  />
)

export {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  ResizableTableContainer,
}
