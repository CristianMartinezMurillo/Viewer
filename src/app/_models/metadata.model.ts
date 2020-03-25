export interface MetadataModel {
    id: number;
    proceso_id: number;
    cat_dataType_id: number;
    field_name: string;
    value: string;
    catalog_id: number;
    field_name_text: string;
    min_length: number|null;
    max_length: number|null;
    required: boolean;
    unique: boolean;
    auto_increment: number;
    created_at: string;
    updated_at: string;
    isExternal: boolean;
    isInternal: boolean;
    catalogData: Array<CatalogDataModel>
    catDataType: CatDataTypeModel
}

export interface CatalogDataModel {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface CatDataTypeModel {
    id: number;
    name: string;
    field_name: string;
    max_length: number;
}
