// Feedback API types
export interface FeedbackRequest {
  message: string;
  isSatisfied: boolean;
}

export interface FeedbackResponse {
  status: string;
  data: {
    feedback: {
      _id: string;
      userId: string;
      message: string;
      isSatisfied: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        name: string;
        emailID: string;
        plan: string;
      };
    };
  };
}
