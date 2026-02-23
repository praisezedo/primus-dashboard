

export type BulkUploadLogs = {
    _id: string;
    status: "SUCCESS" | "FAILED";
    totalRows: number;
    insertedRows: number;
    errorRow?: number;
    errorMessage?: string;
    notifyParents: boolean;
    createdAt: string;
}


