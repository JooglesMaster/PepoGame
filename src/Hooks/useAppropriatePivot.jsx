import { useEffect, useState } from "react";
import useMobileFollowCam from './useMobileFollowCam';
import useFollowCam from './useFollowCam';
import useDeviceDetect from './useDeviceDetect';

export default function useAppropriateFollowCam() {
  const { isMobile } = useDeviceDetect();
  const { mobilePivot } = useMobileFollowCam();
  const { desktopPivot } = useFollowCam();
  const [pivot, setPivot] = useState(null);

  useEffect(() => {
    setPivot(isMobile ? mobilePivot : desktopPivot);
  }, [isMobile, mobilePivot, desktopPivot]);

  return { pivot };
}
