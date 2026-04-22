"use client";

import React from "react";
import Image from "next/image";
import { DataRow } from "@/types";

interface DataTableProps {
    columns: string[];
    rows: DataRow[];
    onEdit?: (index: number) => void;
    onDelete?: (index: number) => void;
    onSync?: (index: number) => void;
    onImageClick?: (url: string) => void;
    isLoading?: boolean;
}

export default function DataTable({ columns, rows, onEdit, onDelete, onSync, onImageClick, isLoading }: DataTableProps) {
    const hasActions = onEdit || onDelete || onSync;

    const isImage = (value: string) => {
        return typeof value === 'string' && (
            value.startsWith('/') ||
            value.startsWith('http')
        ) && (
                value.match(/\.(jpeg|jpg|gif|png|webp)$/i)
            );
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow-card bg-card border border-border">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="text-center">{col}</th>
                        ))}
                        {hasActions && <th className="text-center w-28">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length + (hasActions ? 1 : 0)} className="text-center py-20">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent shadow-sm"></div>
                                    <span className="text-slate-400 font-medium animate-pulse text-sm">Loading data...</span>
                                </div>
                            </td>
                        </tr>
                    ) : rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (hasActions ? 1 : 0)} className="text-center py-10 text-text-muted">
                                <div className="flex flex-col items-center gap-2">
                                    <i className="bx bx-data text-3xl opacity-20"></i>
                                    <span>No data available</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                                {row.cells.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="text-center whitespace-pre-line">
                                        {typeof cell === 'string' && isImage(cell) ? (
                                            <div
                                                className="relative w-10 h-10 mx-auto rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all active:scale-95 shadow-sm"
                                                onClick={() => onImageClick?.(cell)}
                                            >
                                                <Image
                                                    src={cell}
                                                    alt="Row thumbnail"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            cell
                                        )}
                                    </td>
                                ))}
                                {hasActions && (
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {onEdit && row.editable !== false && (
                                                <button
                                                    onClick={() => onEdit(rowIdx)}
                                                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all active:scale-95"
                                                    title="Edit"
                                                >
                                                    <i className="bx bx-edit-alt text-lg"></i>
                                                </button>
                                            )}
                                            {onSync && row.editable !== false && (
                                                <button
                                                    onClick={() => onSync(rowIdx)}
                                                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                                                    title="Sync"
                                                >
                                                    <i className="bx bx-refresh text-xl"></i>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(rowIdx)}
                                                    className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-all active:scale-95"
                                                    title="Delete"
                                                >
                                                    <i className="bx bx-trash text-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
