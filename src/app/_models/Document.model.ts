export interface DocumentModel {
    id: number;
    filename: string;
    path: string;
    basePath: string;
    subjectRequest_id: number;
    config: string;
    canDownload: boolean;
    canCopyText: boolean;
    createdByUserId: number;
    created_at: string;
    updated_at: string;
}
