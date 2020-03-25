import { MetadataModel } from "./metadata.model";

export interface ProcessModel {
    id: number;
    organizational_unit_id: number;
    user_id: number;
    process_name: string;
    process_name_text: string;
    created_at: string;
    updated_at: string;
    metadata?: Array<MetadataModel>
    isExternal: boolean;
    isInternal: boolean;
}
