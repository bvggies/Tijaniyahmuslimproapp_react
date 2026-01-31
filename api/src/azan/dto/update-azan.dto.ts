export class UpdateAzanDto {
  name?: string;
  muezzin?: string;
  location?: string;
  description?: string;
  audioUrl?: string;
  /** Time in 24h format "HH:mm" */
  playAt?: string;
  isActive?: boolean;
  sortOrder?: number;
}
