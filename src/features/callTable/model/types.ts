export interface SelectPeriodProps {
  name: string;
  value: string;
}
export interface TypeCall {
  name: string;
  value: string;
}
export interface FilterTypesProps {
types: TypeCall;
setTypes: React.Dispatch<React.SetStateAction<TypeCall>>;
}