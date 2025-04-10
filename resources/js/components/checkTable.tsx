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

interface delInterface {
    del: (check_in_date: Date[], check_out_date: Date[]) => void;
}

type reservations = {
    id: string;
    Prazo_i: Date;
    prazo_f: Date;
    nome: string;
};

export function CheckTable(props: reservations & delInterface): React.ReactElement {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pages, setPages] = React.useState<number>(0);
    const [boxSelect_i, setBoxSelect_i] = React.useState<Date[]>([]);
    const [boxSelect_f, setBoxSelect_f] = React.useState<Date[]>([]);


    const data: reservations[] = [
        // {
        //     id: props.id,
        //     Prazo_i: props.Prazo_i,
        //     prazo_f: props.prazo_f,
        //     nome: props.nome,
        // } original
        {
            id: '1',
            Prazo_i: new Date('2025-04-01'),
            prazo_f: new Date('2025-04-10'),
            nome: 'joao',
        },
        {
            id: '2',
            Prazo_i: new Date('2025-11-05'),
            prazo_f: new Date('2025-11-15'),
            nome: 'maria',
        },
        {
            id: '3',
            Prazo_i: new Date('2025-04-03'),
            prazo_f: new Date('2025-04-18'),
            nome: 'carlos',
        },
        {
            id: '4',
            Prazo_i: new Date('2025-12-12'),
            prazo_f: new Date('2025-12-22'),
            nome: 'ana',
        },
        {
            id: '5',
            Prazo_i: new Date('2025-10-20'),
            prazo_f: new Date('2025-10-30'),
            nome: 'fernando',
        },
        {
            id: '6',
            Prazo_i: new Date('2025-11-02'),
            prazo_f: new Date('2025-11-12'),
            nome: 'lucas',
        },
        {
            id: '7',
            Prazo_i: new Date('2025-10-06'),
            prazo_f: new Date('2025-10-16'),
            nome: 'beatriz',
        },
        {
            id: '8',
            Prazo_i: new Date('2025-12-09'),
            prazo_f: new Date('2025-12-19'),
            nome: 'gabriel',
        },
        {
            id: '9',
            Prazo_i: new Date('2025-09-13'),
            prazo_f: new Date('2025-09-23'),
            nome: 'juliana',
        },
        {
            id: '10',
            Prazo_i: new Date('2025-11-21'),
            prazo_f: new Date('2025-11-30'),
            nome: 'roberto',
        },
        {
            id: '11',
            Prazo_i: new Date('2025-10-03'),
            prazo_f: new Date('2025-10-13'),
            nome: 'paula',
        },
        {
            id: '12',
            Prazo_i: new Date('2025-12-07'),
            prazo_f: new Date('2025-12-17'),
            nome: 'ricardo',
        },
        {
            id: '13',
            Prazo_i: new Date('2025-11-10'),
            prazo_f: new Date('2025-11-20'),
            nome: 'mariana',
        },
        {
            id: '14',
            Prazo_i: new Date('2025-09-14'),
            prazo_f: new Date('2025-09-24'),
            nome: 'eduardo',
        },
        {
            id: '15',
            Prazo_i: new Date('2025-12-22'),
            prazo_f: new Date('2026-01-01'),
            nome: 'sofia',
        },
    ];

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
                            table.toggleAllPageRowsSelected(value);

                            const selectedRows = value ? table.getRowModel().rows.map((row) => row.original) : [];
                            setBoxSelect_i(selectedRows.map((row) => row.Prazo_i));
                            setBoxSelect_f(selectedRows.map((row) => row.prazo_f));
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
                                ? [...prev, row.original.Prazo_i]
                                : prev.filter((d) => d.getTime() !== row.original.Prazo_i.getTime());
                            return newValues;
                        });

                        setBoxSelect_f((prev) => {
                            const newValues = value
                                ? [...prev, row.original.prazo_f]
                                : prev.filter((d) => d.getTime() !== row.original.prazo_f.getTime());
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
            header: 'estado',
            cell: ({ row }) => {
                const estado = row.original.Prazo_i <= new Date() && new Date() <= row.original.prazo_f ? 'utilizando' : 'reservado';
                return <div className="capitalize">{estado}</div>;
            },
        },
        {
            accessorKey: 'nome',
            header: ({ column }) => (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    nome
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue('nome')}</div>,
        },
        {
            accessorKey: 'Prazo_i',
            header: () => <div className="text-right">Prazo Inicial</div>,
            cell: ({ row }) => <div className="text-right font-medium">{row.original.Prazo_i.toLocaleDateString()}</div>,
        },
        {
            accessorKey: 'prazo_f',
            header: () => <div className="text-right">Prazo Final</div>,
            cell: ({ row }) => <div className="text-right font-medium">{row.original.prazo_f.toLocaleDateString()}</div>,
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
                    value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nome')?.setFilterValue(event.target.value)}
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
                            props.del(boxSelect_i, boxSelect_f);
                        }}
                    >
                        Deletar
                    </Button>
                </div>
            </div>
        </div>
    );
}
