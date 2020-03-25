export interface CatalogOption {
    id: number;
    name: string;
}

export interface Metadata {
    id: number,
    catDataType: Array<any>,
    field_name: string;
    field_name_text: string;
    //catalogData: Array<CatalogOption>,
    isCatalog: boolean;
    required: boolean;
    proceso_id: number;
}

