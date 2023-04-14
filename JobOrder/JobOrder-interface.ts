export interface JobOrderData {
  requestId: number;
  jobID: number;
  dateAdded: number;
  facility: ClientCorporation;
  city: string;
  state: string;
  payRate: number;
  lodging: number;
  meals: number;
  hotJob: string;
  clientTier: string;
  vms: string;
  discipline: Categories;
  specialty: string;
  title: string;
  isOpen: boolean;
  publicDescription: string;
  numOpenings: number;
  status: string;
  shift: string;
  hrsPerWeek: string;
  shiftsPerWeek: number;
  grossWeekly: number;
  lodgingWeekly: string;
  mealsWeekly: string;
  startDate: number;
  durationWeeks: number;
  //certRequirements: any[]; // not using this field yet
  billrate: string;
  blendedBillRate: string;
  postedVivian: number;
}

interface Address {
  city: string;
  state: string;
}

interface ClientCorporation {
  id: number;
  name: string;
  address: Address;
}

interface Category {
  id: number;
  name: string;
}

interface Categories {
  total: number;
  data: Category[];
}
