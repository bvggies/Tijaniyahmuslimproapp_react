export class CreateAzanDto {
  name: string;
  muezzin?: string;
  location?: string;
  description?: string;
  audioUrl: string;
  /** Time in 24h format "HH:mm" (e.g. "05:30") */
  playAt: string;
  isActive?: boolean;
  sortOrder?: number;
}
