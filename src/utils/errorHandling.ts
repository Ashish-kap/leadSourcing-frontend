import { toast } from "sonner";

export const apiExceptionHandling = (error: any) => {
  if (error.response) {
    if (error.response.data.detail) {
      toast.error(`${error.response.data.detail || "something went wrong!"}`);
    } else {
      if (Object.keys(error.response.data).length) {
        Object.keys(error.response.data).map((key) => {
          toast.error(
            `${error.response.data[key][0] || "something went wrong!"}`
          );
        });
      } else {
        toast.error(`${"something went wrong!"}`);
      }
    }
  } else {
    toast.error(`${"something went wrong!"}`);
  }
  return;
};
