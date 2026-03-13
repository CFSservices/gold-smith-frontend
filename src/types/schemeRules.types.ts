import type { BaseEntity } from "./common.types";
import type { SelectOption } from "./common.types";


export interface schemeImage {
    url: string;
    name: string;
    size: number;
}

export interface schemeRule extends BaseEntity {
    schemeCode: string;
    schemeName: string;
    schemeDescription: string;
    schemeImages: schemeImage[];
    schemeStatus: 'active' | 'inactive';
    destination: string;
    duration: number;
    extentionDays: number;
    minDepositAmount: string;
    maxDepositAmountForGift: string;
    createdBy: string;
    updatedBy: string;
}

export interface SchemeRuleFormState {
    schemeCode: string;
    schemeName: string;
    schemeDescription: string;
    schemeImages: schemeImage[];
    schemeStatus: 'active' | 'inactive';
    destination: string ;
    duration: number;
    extentionDays: number;
    minDepositAmount: string;
    maxDepositAmountForGift: string;
}

export interface SchemeRuleRequest {
    id: string;
    scheme_code?: string;
    scheme_name?: string;
    scheme_description?: string;
    schemeImages?: schemeImage[];
    scheme_status?: 'active' | 'inactive';
    destination?: string;
    scheme_duration?: string;
    grace_period?: number;
    min_deposit_amount?: string;
    gift_eligible_min_amount?: string;
    created_by?: string;
    updated_by?: string;
}