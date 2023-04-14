interface User {
  id: number;
  _subtype: string;
  firstName: string;
  lastName: string;
  name?: string;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  owner: User;
}

interface CandidateHistory {
  id: number;
  status: string;
  dateAdded: number;
  modifyingUser: User;
  candidate: Candidate;
}

interface ApiResponse {
  start: number;
  count: number;
  data: CandidateHistory[];
}
