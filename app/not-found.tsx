import Image from "next/image";

import BaseButton from "@/components/BaseButton/BaseButton";
import BaseHeading from "@/components/BaseHeading/BaseHeading";

import compassIllustration from "@/assets/illustrations/not-found.svg";

export default function NotFound() {
  return (
    <section className="tw:mx-auto tw:flex tw:max-w-2xl tw:flex-col tw:items-center tw:gap-4 tw:px-4 tw:py-24 tw:text-center">
      <Image src={compassIllustration} alt="" unoptimized className="tw:h-32 tw:w-32" />
      <span className="tw:font-sans tw:text-sm tw:font-bold tw:tracking-widest tw:uppercase tw:text-[#775c3d]">
        404
      </span>
      <BaseHeading level={1} textAlign="center" color="#1a1a1a">
        Page not found
      </BaseHeading>
      <p className="tw:max-w-md tw:text-sm tw:text-[#626262]">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <BaseButton href="/" className="tw:mt-2">
        Back to home
      </BaseButton>
    </section>
  );
}
