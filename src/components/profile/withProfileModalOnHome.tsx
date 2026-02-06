import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ProfileModal,
  type ProfileFormValues,
} from "@/components/profile/ProfileModal";
import { useGetCurrentUserQuery } from "@/store/api/authApi";

export function withProfileModalOnHome<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  function WithProfileModalOnHome(props: P) {
    const location = useLocation();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const { data: userData } = useGetCurrentUserQuery();

    useEffect(() => {
      if (location.pathname !== "/") return;
      if (userData?.user?.userInfo === true) {
        setShowProfileModal(false);
        return;
      }
      setShowProfileModal(true);
    }, [location.pathname, userData?.user?.userInfo]);

    const initialValues: Partial<ProfileFormValues> | undefined = userData?.user
      ? {
          designation: userData.user.designation ?? "",
          website: userData.user.website ?? "",
          howDidYouHearAbout: userData.user.howDidYouHearAbout ?? "",
          userInfo: userData.user.userInfo ?? false,
        }
      : undefined;

    return (
      <>
        <WrappedComponent {...props} />
        <ProfileModal
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
          initialValues={initialValues}
        />
      </>
    );
  }

  WithProfileModalOnHome.displayName = `WithProfileModalOnHome(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
  })`;

  return WithProfileModalOnHome;
}
