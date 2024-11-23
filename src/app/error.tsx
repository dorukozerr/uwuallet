"use client";

const Error = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4">
    <h3 className="text-base font-bold sm:text-lg">Server Error...</h3>
    <h5 className="text-sm sm:text-base">
      Please refresh the page, or visit later.
    </h5>
  </div>
);

export default Error;
