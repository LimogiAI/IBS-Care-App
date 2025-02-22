export interface StoolFormOption {
    value: string;
    description: string;
    image: string;
  }
  
  export interface Question {
    id: string;
    text: string;
    options: string[] | StoolFormOption[];
  }
  
  export interface Section {
    section: string;
    questions: Question[];
  }
  