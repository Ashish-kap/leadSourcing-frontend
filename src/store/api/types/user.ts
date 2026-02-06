export interface ProfileUpdateRequest {
  designation?: string;
  website?: string;
  howDidYouHearAbout?: string;
  userInfo?: boolean;
}

export interface ProfileUpdateSuccessResponse {
  status: "success";
  message: string;
}
