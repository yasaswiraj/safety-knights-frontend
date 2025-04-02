export interface QuestionConfig {
  type: 'text' | 'date' | 'radio' | 'multiselect' | 'currency';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value?: any;
}

export interface FormStructure {
  [key: string]: QuestionConfig;
}

export interface FormData {
  [category: string]: FormStructure;
}