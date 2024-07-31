export interface ISendEmailRequest {
  to: string;
  subject: string;
  text: string;
}

export interface ISendEmailResponse {
  message: string;
}
