export interface QuestionnaireResponse {
    /**
     * TODO
     * `any` type should be updated to Identifier, Reference, code...
     */
    identifier: any;
    basedOn: any;
    partOf: any;
    questionnaire: any;
    status: any;
    subject: any;
    encounter: any;
    authored: Date;
    author: any;
    source: any;
    item: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponseItem {
    linkId: string;
    definition?: string;
    text: string;
    answer: any;
}