export interface JobSubmissionHistory {
  status: string;
  dateAdded: string;
  jobSubmission: {
    candidate: {
      owner: {
        name: string;
      };
      id: number;
      name: string;
    };
    id: number;
    jobOrder: {
      id: number;
      owner: {
        name: string;
      };
      title: string;
      clientCorporation: {
        id: number;
        name: string;
        customText19: string;
      };
      customText8: string;
      reportTo: string;
    };
  };
  modifyingUser: {
    name: string;
  };
}
