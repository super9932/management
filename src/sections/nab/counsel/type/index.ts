export type RegistrationStatus = '진행' | '실패' | '완료';
export type OperationStatus = '대기' | '운영' | '미운영';

export interface DocumentRow {
  id: number;
  code1: string;
  code2: string;
  salePeriodStart: string;
  salePeriodEnd: string;
  documentName: string;
  registrant: string;
  registrationDate: string;
  registrationStatus: RegistrationStatus;
  reflectionDate: string;
  endDate: string;
  operationStatus: OperationStatus;
}
