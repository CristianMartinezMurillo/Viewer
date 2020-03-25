export class OrganizationalUnitModel {
    id: number;
    parent_id: number;
    name: string;
    code: string;
    description: string;
    counter: number;
    level: number;
    company_id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    canReceiveSubjects: boolean;
    children?: Array<OrganizationalUnitModel>;
    hidden?;

}
