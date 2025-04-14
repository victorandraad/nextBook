import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import axios from 'axios';
import { useEffect, useState } from 'react';

// interface delInterface {
//     del: (check_in_date: Date[], check_out_date: Date[]) => void;
// }

type reservations = {
    id: string;
    check_in_date: Date;
    check_out_date: Date;
    name: string;
};

type room_number = {
    room_number: number;
};

export function CheckTable(props: room_number): React.ReactElement {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pages, setPages] = React.useState<number>(0);
    const [boxSelect_i, setBoxSelect_i] = React.useState<Date[]>([]);
    const [boxSelect_f, setBoxSelect_f] = React.useState<Date[]>([]);
    const [data, setData] = useState<[]>([]);

    const handleDelete = (check_in_date: Date[], check_out_date: Date[]) => {
        console.log('teste', check_in_date, check_out_date, props.room_number);
        check_in_date.forEach((inDate, index) => {
            const outDate = check_out_date[index];
            axios.post('/delete-book', {
                check_in_date: inDate,
                check_out_date: outDate,
                room_number: props.room_number,
            });
        });
    };

    useEffect(() => {
        axios
            .post<[]>('/books', {
                room_number: props.room_number,
            })
            .then((response) => {
                // Mapeia os dados retornados da API para o formato desejado
                // const allRooms = response.data.map(room => room.room_number);
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Erro ao pedir os dados: ', error);
            });
    }, [props.room_number]);

    // const data: reservations[] = [
    //     {
    //         id: props.id,
    //         check_in_date: props.check_in_date,
    //         check_out_date: props.check_out_date,
    //         name: props.name,
    //         room_number: props.room_number,
    //     }
    // ];

    const columns: ColumnDef<reservations>[] = [
        {
            id: 'select',
            header: ({ table }) => {
                const mode = table.getIsSomePageRowsSelected();
                return (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={(event) => {
                            const value = event.target.checked;
                            const currentPageRows = table.getRowModel().rows;

                            // Toggle selection for current page rows
                            currentPageRows.forEach((row) => row.toggleSelected(value));

                            // Update the date arrays
                            if (value) {
                                // Add new dates to existing selections
                                setBoxSelect_i((prev) => [...prev, ...currentPageRows.map((row) => row.original.check_in_date)]);
                                setBoxSelect_f((prev) => [...prev, ...currentPageRows.map((row) => row.original.check_out_date)]);
                            } else {
                                // Remove dates of current page from selections
                                setBoxSelect_i((prev) =>
                                    prev.filter((d) => !currentPageRows.some((row) => row.original.check_in_date.getTime() === d.getTime())),
                                );
                                setBoxSelect_f((prev) =>
                                    prev.filter((d) => !currentPageRows.some((row) => row.original.check_out_date.getTime() === d.getTime())),
                                );
                            }
                        }}
                        aria-label="Select all"
                        className={`peer border-input bg-background ${mode ? 'checked:bg-transparent' : 'checked:bg-primary'} checked:border-primary checked:text-primary-foreground focus-visible:ring-ring/50 focus-visible:border-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20 dark:aria-[invalid=true]:ring-destructive/40 relative size-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border shadow-xs transition-shadow outline-none after:absolute after:top-1/2 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:rotate-[-45deg] after:border-b-2 after:border-l-2 ${mode ? 'border-white' : 'after:border-black'} after:transition-transform after:duration-150 after:ease-in-out after:content-[''] checked:after:scale-100 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50`}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={(event) => {
                        const value = event.target.checked;
                        row.toggleSelected(value);

                        setBoxSelect_i((prev) => {
                            const newValues = value
                                ? [...prev, row.original.check_in_date]
                                : prev.filter((d) => d.getTime() !== row.original.check_in_date.getTime());
                            return newValues;
                        });

                        setBoxSelect_f((prev) => {
                            const newValues = value
                                ? [...prev, row.original.check_out_date]
                                : prev.filter((d) => d.getTime() !== row.original.check_out_date.getTime());
                            return newValues;
                        });
                    }}
                    aria-label="Select row"
                    className="peer border-input bg-background checked:bg-primary checked:border-primary checked:text-primary-foreground focus-visible:ring-ring/50 focus-visible:border-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20 dark:aria-[invalid=true]:ring-destructive/40 relative size-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border shadow-xs transition-shadow outline-none after:absolute after:top-1/2 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:rotate-[-45deg] after:border-b-2 after:border-l-2 after:border-black after:transition-transform after:duration-150 after:ease-in-out after:content-[''] checked:after:scale-100 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const estado = row.original.check_in_date <= new Date() && new Date() <= row.original.check_out_date ? 'Em uso' : 'Reservado';
                return <div className="capitalize">{estado}</div>;
            },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nome
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'check_in_date',
            header: () => <div className="text-right">Data de Entrada</div>,
            cell: ({ row }) => <div className="text-right font-medium">{row.getValue('check_in_date')}</div>,
        },
        {
            accessorKey: 'check_out_date',
            header: () => <div className="text-right">Data de Saída</div>,
            cell: ({ row }) => <div className="text-right font-medium">{row.getValue('check_out_date')}</div>,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: { pageIndex: pages, pageSize: 10 },
        },
    });

    return (
        <div className="flex h-[670px] w-full flex-col justify-between">
            <div className="flex items-center py-4">
                <Input
                    placeholder="filtre por nome..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <Button variant="outline" className="ml-auto">
                            Colunas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full items-center justify-between py-4">
                <div className="text-muted-foreground flex text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
                </div>
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => setPages((prev) => Math.max(prev - 1, 0))} className="cursor-pointer" />
                            </PaginationItem>
                            {Array.from({ length: Math.min(5, Math.ceil(data.length / 10)) }, (_, index) => {
                                const startPage = Math.floor(pages / 5) * 5;
                                const pageIndex = startPage + index;

                                if (pageIndex >= Math.ceil(data.length / 10)) return null;

                                return (
                                    <PaginationItem key={pageIndex}>
                                        <PaginationLink
                                            onClick={() => setPages(pageIndex)}
                                            className={`cursor-pointer ${pages === pageIndex ? 'font-bold text-blue-500' : ''}`}
                                        >
                                            {pageIndex + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                            {data.length / 10 > 5 ? (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : null}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPages((prev) => Math.min(prev + 1, Math.ceil(data.length / 10) - 1))}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                <div className="space-x-2">
                    <Button variant="ghost" className="cursor-pointer">
                        criar
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                            handleDelete(boxSelect_i, boxSelect_f);
                            console.log(boxSelect_i, boxSelect_f);
                        }}
                    >
                        Deletar
                    </Button>
                </div>
            </div>
        </div>
    );
}
